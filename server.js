const http = require('http');
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// ── Supabase helpers ──────────────────────────────────────────────────────────
function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1${path}`);
    const data = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);

    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function searchDocs(query) {
  // Simple text search across all document chunks
  const result = await supabaseRequest('GET',
    `/documents?select=filename,content&content=ilike.*${encodeURIComponent(query.slice(0, 50))}*&limit=5`
  );
  if (result.status === 200 && Array.isArray(result.data)) {
    return result.data;
  }
  // Fallback: get all docs (for small knowledge bases)
  const all = await supabaseRequest('GET', '/documents?select=filename,content&limit=20');
  return all.status === 200 ? all.data : [];
}

async function saveChunks(filename, chunks) {
  const rows = chunks.map((content, i) => ({ filename, content, chunk_index: i }));
  return supabaseRequest('POST', '/documents', rows);
}

async function listFiles() {
  const result = await supabaseRequest('GET',
    '/documents?select=filename,created_at&order=created_at.desc'
  );
  if (result.status !== 200) return [];
  // Deduplicate by filename
  const seen = new Set();
  return result.data.filter(r => {
    if (seen.has(r.filename)) return false;
    seen.add(r.filename);
    return true;
  });
}

async function deleteFile(filename) {
  return supabaseRequest('DELETE', `/documents?filename=eq.${encodeURIComponent(filename)}`);
}

// ── Text chunking ─────────────────────────────────────────────────────────────
function chunkText(text, size = 800, overlap = 100) {
  const clean = text.replace(/\s+/g, ' ').trim();
  const chunks = [];
  let i = 0;
  while (i < clean.length) {
    chunks.push(clean.slice(i, i + size));
    i += size - overlap;
  }
  return chunks.filter(c => c.trim().length > 50);
}

// ── Static knowledge base (fallback) ─────────────────────────────────────────
const BASE_KNOWLEDGE = `
=== EPOS TROUBLESHOOTING ===
EPOS SYSTEM CRASHES: Restart resolves 70% of issues. Close open bills first. Soft restart via settings. Hard reset: hold power 10 seconds. Wait 2-3 mins on restart. Check for pending updates.
EPOS WON'T CONNECT: Check ethernet cable. For WiFi: forget and reconnect. Assign static IP in router settings.
RECEIPT PRINTER NOT PRINTING: Check thermal paper orientation (shiny side to print head). Test print from printer button. Check IP/port in EPOS settings.
EPOS RUNNING SLOWLY: Clear cache in settings. Check storage (need 10%+ free). Close background apps. Need 10Mbps+ for cloud EPOS.
STAFF LOGIN ISSUES: Reset PIN in back office. Check account is active. Manager lockout: check setup email for master PIN.
KDS NOT RECEIVING ORDERS: Check physical connection. Verify routing rules in back office. Restart both EPOS and KDS.

=== WIFI & CONNECTIVITY ===
WIFI DROPPING: Check if one device or all. Restart router (unplug 30 secs). Use 5GHz for critical systems. Check for microwave/interference.
EPOS LOSING WIFI: Assign static IPs to all critical devices via DHCP reservation in router admin.
SLOW INTERNET: Need 10Mbps min for cloud POS. Separate guest WiFi from business network. Consider 4G failover.

=== PAYMENT TERMINALS ===
TERMINAL OFFLINE: Check SIM/WiFi connection. Restart terminal (hold power 5 secs). Run Connection Test in settings.
CARD DECLINES: Try different card. Check terminal date/time. Verify merchant account active.
CONTACTLESS NOT WORKING: Check £100 limit. Settings > Contactless > Reset.
TERMINAL/EPOS NOT INTEGRATING: Same network/subnet required. Check IP config in EPOS payment settings. Restart both.

=== GENERAL ===
BEFORE CALLING SUPPORT: Document error message. Try restart. Check if one device or all. Check internet. Check vendor status page.
RESILIENCE: Keep manual backup process. Save payment provider emergency number. Have 4G hotspot backup.
`;

// ── Anthropic call ────────────────────────────────────────────────────────────
function callAnthropic(messages, systemPrompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(d) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ── Multipart parser ──────────────────────────────────────────────────────────
function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuf = Buffer.from('--' + boundary);
  let start = 0;

  while (start < buffer.length) {
    const boundaryIdx = buffer.indexOf(boundaryBuf, start);
    if (boundaryIdx === -1) break;
    const headerStart = boundaryIdx + boundaryBuf.length + 2;
    const headerEnd = buffer.indexOf('\r\n\r\n', headerStart);
    if (headerEnd === -1) break;
    const headers = buffer.slice(headerStart, headerEnd).toString();
    const dataStart = headerEnd + 4;
    const nextBoundary = buffer.indexOf(boundaryBuf, dataStart);
    if (nextBoundary === -1) break;
    const dataEnd = nextBoundary - 2;
    const data = buffer.slice(dataStart, dataEnd);

    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]+)"/);
    if (nameMatch) {
      parts.push({
        name: nameMatch[1],
        filename: filenameMatch ? filenameMatch[1] : null,
        data
      });
    }
    start = nextBoundary;
  }
  return parts;
}

// ── Simple PDF/text extractor ─────────────────────────────────────────────────
function extractText(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'txt' || ext === 'md') {
    return buffer.toString('utf8');
  }
  if (ext === 'pdf') {
    // Extract readable text from PDF (basic string extraction)
    const str = buffer.toString('latin1');
    const texts = [];
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;
    while ((match = streamRegex.exec(str)) !== null) {
      const chunk = match[1];
      // Extract text between parentheses (PDF text operators)
      const textRegex = /\(([^)]{2,200})\)/g;
      let tm;
      while ((tm = textRegex.exec(chunk)) !== null) {
        const t = tm[1].replace(/\\n/g, ' ').replace(/\\r/g, ' ').replace(/\\\\/g, '\\').trim();
        if (t.length > 3 && /[a-zA-Z]{2,}/.test(t)) texts.push(t);
      }
    }
    return texts.join(' ');
  }
  // For .doc/.docx — extract any readable text
  return buffer.toString('utf8').replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ');
}

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(200, cors);
    res.end();
    return;
  }

  const json = (status, data) => {
    res.writeHead(status, { ...cors, 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  const html = (status, content) => {
    res.writeHead(status, { ...cors, 'Content-Type': 'text/html' });
    res.end(content);
  };

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    return json(200, { status: 'ok' });
  }

  // List uploaded files
  if (req.method === 'GET' && req.url === '/files') {
    const files = await listFiles();
    return json(200, files);
  }

  // Delete a file
  if (req.method === 'DELETE' && req.url.startsWith('/files/')) {
    const filename = decodeURIComponent(req.url.replace('/files/', ''));
    await deleteFile(filename);
    return json(200, { deleted: filename });
  }

  // Chat endpoint
  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { messages } = JSON.parse(body);
        const lastMsg = messages[messages.length - 1]?.content || '';

        // Search uploaded docs
        const docResults = await searchDocs(lastMsg);
        const docContext = docResults.length > 0
          ? '\n\n=== UPLOADED KNOWLEDGE BASE ===\n' + docResults.map(d => `[${d.filename}]: ${d.content}`).join('\n\n')
          : '';

        const systemPrompt = `You are the Tech on Toast Operator Support Bot — a knowledgeable, straight-talking assistant for hospitality operators having tech problems.

Be direct, practical and reassuring. Use the knowledge base below to answer. If you use uploaded documents, mention the filename as the source.

FORMAT: Numbered steps for sequences. Bold key terms with **bold**. End with "Sources: [section names]".

KNOWLEDGE BASE:
${BASE_KNOWLEDGE}${docContext}`;

        const result = await callAnthropic(messages.slice(-10), systemPrompt);
        if (result.status !== 200) return json(result.status, { error: result.data.error?.message });
        json(200, { content: result.data.content[0].text });
      } catch (err) {
        json(500, { error: err.message });
      }
    });
    return;
  }

  // Upload endpoint
  if (req.method === 'POST' && req.url === '/upload') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        const contentType = req.headers['content-type'] || '';
        const boundaryMatch = contentType.match(/boundary=(.+)/);
        if (!boundaryMatch) return json(400, { error: 'No boundary' });

        const parts = parseMultipart(buffer, boundaryMatch[1]);
        const filePart = parts.find(p => p.filename);
        if (!filePart) return json(400, { error: 'No file found' });

        const text = extractText(filePart.data, filePart.filename);
        if (!text || text.trim().length < 50) return json(400, { error: 'Could not extract text from file' });

        const textChunks = chunkText(text);
        await saveChunks(filePart.filename, textChunks);
        json(200, { success: true, filename: filePart.filename, chunks: textChunks.length });
      } catch (err) {
        json(500, { error: err.message });
      }
    });
    return;
  }

  // Admin page
  if (req.method === 'GET' && (req.url === '/admin' || req.url === '/admin/')) {
    return html(200, ADMIN_PAGE);
  }

  res.writeHead(404, cors);
  res.end('Not found');
});

// ── Admin HTML ────────────────────────────────────────────────────────────────
const ADMIN_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stacked Chat — Knowledge Base Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #ede8df; --surface: #f5f0e8; --surface2: #e0d9ce;
    --border: #d4cdc0; --border-dark: #c4bcb0;
    --toast: #f04e1a; --toast-light: rgba(240,78,26,0.08); --toast-dark: #c93e10;
    --text: #1e1a16; --text-dim: #6b5f53; --text-muted: #a8998a;
    --green: #3a7a52; --green-light: #edf5f1;
    --red: #c94040; --red-light: #fef2f2;
    --shadow-sm: 0 1px 4px rgba(30,20,10,0.08);
    --shadow-md: 0 4px 20px rgba(30,20,10,0.1);
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--bg); color:var(--text); font-family:'Outfit',sans-serif; min-height:100vh; }

  /* Header */
  .header {
    background:var(--bg); border-bottom:1.5px solid var(--border);
    padding:16px 24px; display:flex; align-items:center; justify-content:space-between;
    box-shadow:var(--shadow-sm); position:sticky; top:0; z-index:10;
  }
  .logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .logo-icon { width:36px; height:36px; flex-shrink:0; }
  .logo-name { display:flex; flex-direction:column; line-height:1; }
  .logo-title { font-size:18px; font-weight:800; color:var(--toast); letter-spacing:-0.8px; text-transform:uppercase; font-style:italic; }
  .logo-sub { font-size:9px; font-weight:600; color:var(--text-muted); letter-spacing:1.5px; text-transform:uppercase; margin-top:2px; }
  .header-badge {
    background:var(--toast-light); border:1px solid rgba(240,78,26,0.2);
    color:var(--toast-dark); font-size:11px; font-weight:600;
    padding:5px 12px; border-radius:20px; letter-spacing:0.3px;
  }

  /* Page */
  .page { max-width:640px; margin:0 auto; padding:32px 20px 60px; }
  .page-header { margin-bottom:28px; }
  .page-title { font-size:22px; font-weight:700; color:var(--text); letter-spacing:-0.3px; }
  .page-subtitle { font-size:13px; color:var(--text-dim); margin-top:4px; line-height:1.6; }

  /* Stats */
  .stats { display:flex; gap:12px; margin-bottom:28px; }
  .stat { flex:1; background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:14px 16px; box-shadow:var(--shadow-sm); }
  .stat-val { font-size:22px; font-weight:800; color:var(--toast); letter-spacing:-0.5px; }
  .stat-label { font-size:11px; color:var(--text-muted); margin-top:2px; font-weight:500; }

  /* Card */
  .card { background:var(--surface); border:1.5px solid var(--border); border-radius:16px; padding:22px; margin-bottom:16px; box-shadow:var(--shadow-sm); }
  .card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .card-title { font-size:11px; font-weight:600; color:var(--text-muted); letter-spacing:0.8px; text-transform:uppercase; }

  /* Drop zone */
  .drop-zone {
    border:2px dashed var(--border-dark); border-radius:12px; padding:36px 20px;
    text-align:center; cursor:pointer; transition:all 0.2s; background:var(--surface2);
  }
  .drop-zone:hover { border-color:var(--toast); background:var(--toast-light); }
  .drop-zone.dragover { border-color:var(--toast); background:var(--toast-light); transform:scale(1.01); }
  .drop-zone-icon { font-size:36px; margin-bottom:10px; }
  .drop-zone-text { font-size:14px; font-weight:500; color:var(--text-dim); }
  .drop-zone-sub { font-size:12px; color:var(--text-muted); margin-top:4px; }
  input[type=file] { display:none; }

  .upload-btn {
    background:var(--toast); color:white; border:none;
    font-family:'Outfit',sans-serif; font-weight:600; font-size:14px;
    padding:11px 28px; border-radius:10px; cursor:pointer;
    margin-top:16px; display:inline-flex; align-items:center; gap:6px;
    transition:all 0.15s; box-shadow:0 2px 8px rgba(232,136,42,0.3);
  }
  .upload-btn:hover { background:var(--toast-dark); transform:translateY(-1px); }
  .upload-btn:disabled { background:var(--border-dark); color:var(--text-muted); cursor:not-allowed; box-shadow:none; transform:none; }

  /* Progress */
  .progress { margin-top:16px; display:none; }
  .progress-bar { height:5px; background:var(--surface2); border-radius:3px; overflow:hidden; border:1px solid var(--border); }
  .progress-fill { height:100%; background:var(--toast); border-radius:3px; transition:width 0.4s ease; width:0%; }
  .progress-text { font-size:12px; color:var(--text-dim); margin-top:8px; font-weight:500; }

  /* File list */
  .file-list { display:flex; flex-direction:column; gap:8px; }
  .file-item {
    display:flex; align-items:center; justify-content:space-between;
    background:var(--surface2); border:1px solid var(--border);
    border-radius:10px; padding:12px 14px; transition:all 0.15s;
  }
  .file-item:hover { border-color:var(--border-dark); box-shadow:var(--shadow-sm); }
  .file-info { display:flex; align-items:center; gap:10px; }
  .file-icon {
    width:36px; height:36px; background:var(--toast-light);
    border:1px solid rgba(232,136,42,0.2); border-radius:8px;
    display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0;
  }
  .file-name { font-size:13px; font-weight:500; color:var(--text); }
  .file-meta { display:flex; gap:8px; margin-top:2px; }
  .file-date { font-size:11px; color:var(--text-muted); }
  .file-badge {
    font-size:10px; font-weight:600; color:var(--green);
    background:var(--green-light); padding:1px 7px; border-radius:10px; letter-spacing:0.3px;
  }
  .delete-btn {
    background:none; border:1px solid transparent; color:var(--text-muted);
    cursor:pointer; font-size:14px; padding:6px 8px; border-radius:8px;
    transition:all 0.15s; flex-shrink:0;
  }
  .delete-btn:hover { color:var(--red); background:var(--red-light); border-color:rgba(201,64,64,0.2); }

  .empty {
    font-size:13px; color:var(--text-muted); text-align:center;
    padding:32px 20px; font-style:italic;
  }

  /* Toast notification */
  .notif {
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(10px);
    background:var(--surface); border:1px solid var(--border);
    color:var(--text); font-size:13px; font-weight:500; padding:11px 22px;
    border-radius:24px; opacity:0; transition:all 0.3s;
    pointer-events:none; white-space:nowrap;
    box-shadow:var(--shadow-md);
  }
  .notif.show { opacity:1; transform:translateX(-50%) translateY(0); }
  .notif.success { border-color:rgba(45,122,79,0.3); color:var(--green); background:var(--green-light); }
  .notif.error { border-color:rgba(201,64,64,0.3); color:var(--red); background:var(--red-light); }
</style>
</head>
<body>

<div class="header">
  <div class="logo">
    <svg class="logo-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38 22 Q50 15 62 22 Q60 36 50 39 Q40 36 38 22Z" fill="#f04e1a"/>
      <ellipse cx="50" cy="39" rx="12" ry="3.5" fill="#c93e10" opacity="0.4"/>
      <path d="M28 41 Q50 32 72 41 Q69 59 50 63 Q31 59 28 41Z" fill="#f04e1a"/>
      <ellipse cx="50" cy="63" rx="20" ry="5" fill="#c93e10" opacity="0.4"/>
      <path d="M18 66 Q50 54 82 66 Q77 86 50 90 Q23 86 18 66Z" fill="#f04e1a"/>
    </svg>
    <div class="logo-name">
      <div class="logo-title">Stacked</div>
      <div class="logo-sub">Knowledge Base</div>
    </div>
  </div>
  <div class="header-badge">Admin Panel</div>
</div>

<div class="page">
  <div class="page-header">
    <div class="page-title">Knowledge Base</div>
    <div class="page-subtitle">Upload documents to expand what the support bot knows. PDFs, guides, and troubleshooting docs all work.</div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-val" id="docCount">—</div>
      <div class="stat-label">Documents</div>
    </div>
    <div class="stat">
      <div class="stat-val" id="chunkCount">—</div>
      <div class="stat-label">Knowledge chunks</div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">Upload Documents</div>
    </div>
    <div class="drop-zone" id="dropZone" onclick="document.getElementById('fileInput').click()">
      <div class="drop-zone-icon">📄</div>
      <div class="drop-zone-text">Drop files here or click to browse</div>
      <div class="drop-zone-sub">PDF, TXT, MD supported · Multiple files at once</div>
    </div>
    <input type="file" id="fileInput" accept=".pdf,.txt,.md,.doc,.docx" multiple>
    <div style="text-align:center">
      <button class="upload-btn" id="uploadBtn" onclick="uploadFiles()" disabled>
        ↑ Upload to Knowledge Base
      </button>
    </div>
    <div class="progress" id="progress">
      <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
      <div class="progress-text" id="progressText">Uploading...</div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">Uploaded Documents</div>
    </div>
    <div class="file-list" id="fileList"><div class="empty">Loading documents...</div></div>
  </div>
</div>

<div class="notif" id="notif"></div>

<script>
  const API = window.location.origin;
  let selectedFiles = [];
  let allFiles = [];

  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    selectedFiles = [...e.dataTransfer.files];
    updateDropZone();
  });
  fileInput.addEventListener('change', () => {
    selectedFiles = [...fileInput.files];
    updateDropZone();
  });

  function updateDropZone() {
    if (selectedFiles.length > 0) {
      dropZone.querySelector('.drop-zone-text').textContent = selectedFiles.map(f => f.name).join(', ');
      dropZone.querySelector('.drop-zone-sub').textContent = selectedFiles.length + ' file(s) ready to upload';
      document.getElementById('uploadBtn').disabled = false;
    }
  }

  async function uploadFiles() {
    if (!selectedFiles.length) return;
    const btn = document.getElementById('uploadBtn');
    const progress = document.getElementById('progress');
    const fill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    btn.disabled = true;
    progress.style.display = 'block';

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      progressText.textContent = 'Uploading ' + file.name + '...';
      fill.style.width = ((i / selectedFiles.length) * 100) + '%';
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(API + '/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        showNotif(file.name + ' added — ' + data.chunks + ' chunks indexed', 'success');
      } catch (err) {
        showNotif('Upload failed: ' + err.message, 'error');
      }
    }

    fill.style.width = '100%';
    progressText.textContent = 'All done!';
    setTimeout(() => { progress.style.display = 'none'; fill.style.width = '0'; }, 2000);

    selectedFiles = [];
    fileInput.value = '';
    dropZone.querySelector('.drop-zone-text').textContent = 'Drop files here or click to browse';
    dropZone.querySelector('.drop-zone-sub').textContent = 'PDF, TXT, MD supported · Multiple files at once';
    btn.disabled = true;
    loadFiles();
  }

  async function loadFiles() {
    const list = document.getElementById('fileList');
    try {
      const res = await fetch(API + '/files');
      allFiles = await res.json();
      document.getElementById('docCount').textContent = allFiles.length;

      // Get total chunks
      const chunksRes = await fetch(API + '/files?chunks=1');
      // Estimate based on files
      document.getElementById('chunkCount').textContent = allFiles.length > 0 ? allFiles.length * 8 + '+' : '0';

      if (!allFiles.length) {
        list.innerHTML = '<div class="empty">No documents uploaded yet — add your first one above</div>';
        return;
      }
      list.innerHTML = allFiles.map(f => \`
        <div class="file-item">
          <div class="file-info">
            <div class="file-icon">📄</div>
            <div>
              <div class="file-name">\${f.filename}</div>
              <div class="file-meta">
                <span class="file-date">\${new Date(f.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
                <span class="file-badge">INDEXED</span>
              </div>
            </div>
          </div>
          <button class="delete-btn" onclick="deleteFile('\${f.filename}')" title="Remove from knowledge base">🗑️</button>
        </div>
      \`).join('');
    } catch {
      list.innerHTML = '<div class="empty">Could not load documents</div>';
    }
  }

  async function deleteFile(filename) {
    if (!confirm('Remove "' + filename + '" from the knowledge base?')) return;
    await fetch(API + '/files/' + encodeURIComponent(filename), { method: 'DELETE' });
    showNotif(filename + ' removed', 'success');
    loadFiles();
  }

  function showNotif(msg, type) {
    const el = document.getElementById('notif');
    el.textContent = msg;
    el.className = 'notif show ' + (type || '');
    setTimeout(() => el.className = 'notif', 3500);
  }

  loadFiles();
</script>
</body>
</html>`;

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => console.log(`Toast Bot server running on port ${PORT}`));
