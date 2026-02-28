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
<title>TOT Bot — Knowledge Base Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0f0e0c; --surface: #1a1916; --surface2: #242220;
    --border: #2e2c28; --toast: #f5a623; --text: #f0ede8;
    --text-dim: #8a8680; --text-muted: #4a4844;
    --green: #4caf7d; --red: #e05555;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--bg); color:var(--text); font-family:'DM Mono',monospace; min-height:100vh; padding:24px 16px; }
  h1 { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; margin-bottom:4px; }
  h1 span { color:var(--toast); }
  .subtitle { font-size:12px; color:var(--text-dim); margin-bottom:32px; }
  .card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px; margin-bottom:20px; }
  .card-title { font-size:10px; color:var(--text-muted); letter-spacing:1px; text-transform:uppercase; margin-bottom:16px; }
  .drop-zone {
    border:2px dashed var(--border); border-radius:10px; padding:32px 20px;
    text-align:center; cursor:pointer; transition:all 0.2s;
  }
  .drop-zone.dragover { border-color:var(--toast); background:rgba(245,166,35,0.05); }
  .drop-zone-icon { font-size:32px; margin-bottom:8px; }
  .drop-zone-text { font-size:13px; color:var(--text-dim); }
  .drop-zone-sub { font-size:11px; color:var(--text-muted); margin-top:4px; }
  input[type=file] { display:none; }
  .upload-btn {
    background:var(--toast); color:#000; border:none;
    font-family:'Syne',sans-serif; font-weight:700; font-size:13px;
    padding:10px 20px; border-radius:8px; cursor:pointer;
    margin-top:14px; display:inline-block; transition:all 0.15s;
  }
  .upload-btn:hover { background:#e69510; }
  .upload-btn:disabled { background:var(--border); color:var(--text-muted); cursor:not-allowed; }
  .progress { margin-top:12px; display:none; }
  .progress-bar { height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
  .progress-fill { height:100%; background:var(--toast); border-radius:2px; transition:width 0.3s; width:0%; }
  .progress-text { font-size:11px; color:var(--text-dim); margin-top:6px; }
  .file-list { display:flex; flex-direction:column; gap:8px; }
  .file-item {
    display:flex; align-items:center; justify-content:space-between;
    background:var(--surface2); border:1px solid var(--border);
    border-radius:8px; padding:10px 14px;
  }
  .file-info { display:flex; align-items:center; gap:8px; }
  .file-icon { font-size:16px; }
  .file-name { font-size:12px; color:var(--text); }
  .file-date { font-size:10px; color:var(--text-muted); margin-top:2px; }
  .delete-btn {
    background:none; border:none; color:var(--text-muted);
    cursor:pointer; font-size:16px; padding:4px; transition:color 0.15s;
  }
  .delete-btn:hover { color:var(--red); }
  .empty { font-size:12px; color:var(--text-muted); text-align:center; padding:20px; }
  .toast-msg {
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:var(--surface); border:1px solid var(--border);
    color:var(--text); font-size:12px; padding:10px 20px;
    border-radius:20px; opacity:0; transition:opacity 0.3s;
    pointer-events:none; white-space:nowrap;
  }
  .toast-msg.show { opacity:1; }
  .toast-msg.success { border-color:var(--green); color:var(--green); }
  .toast-msg.error { border-color:var(--red); color:var(--red); }
</style>
</head>
<body>
<h1>🍞 Tech on <span>Toast</span></h1>
<div class="subtitle">Knowledge Base Admin — Upload documents to train the bot</div>

<div class="card">
  <div class="card-title">Upload Documents</div>
  <div class="drop-zone" id="dropZone" onclick="document.getElementById('fileInput').click()">
    <div class="drop-zone-icon">📄</div>
    <div class="drop-zone-text">Drop files here or tap to browse</div>
    <div class="drop-zone-sub">Supports PDF, TXT, MD files</div>
  </div>
  <input type="file" id="fileInput" accept=".pdf,.txt,.md,.doc,.docx" multiple>
  <div style="text-align:center">
    <button class="upload-btn" id="uploadBtn" onclick="uploadFiles()" disabled>Upload</button>
  </div>
  <div class="progress" id="progress">
    <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
    <div class="progress-text" id="progressText">Uploading...</div>
  </div>
</div>

<div class="card">
  <div class="card-title">Uploaded Documents</div>
  <div class="file-list" id="fileList"><div class="empty">Loading...</div></div>
</div>

<div class="toast-msg" id="toastMsg"></div>

<script>
  const API = window.location.origin;
  let selectedFiles = [];

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
      dropZone.querySelector('.drop-zone-sub').textContent = selectedFiles.length + ' file(s) selected';
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
        showToast(file.name + ' uploaded (' + data.chunks + ' chunks)', 'success');
      } catch (err) {
        showToast('Failed: ' + err.message, 'error');
      }
    }

    fill.style.width = '100%';
    progressText.textContent = 'Done!';
    setTimeout(() => { progress.style.display = 'none'; fill.style.width = '0'; }, 2000);

    selectedFiles = [];
    fileInput.value = '';
    dropZone.querySelector('.drop-zone-text').textContent = 'Drop files here or tap to browse';
    dropZone.querySelector('.drop-zone-sub').textContent = 'Supports PDF, TXT, MD files';
    btn.disabled = true;
    loadFiles();
  }

  async function loadFiles() {
    const list = document.getElementById('fileList');
    try {
      const res = await fetch(API + '/files');
      const files = await res.json();
      if (!files.length) {
        list.innerHTML = '<div class="empty">No documents uploaded yet</div>';
        return;
      }
      list.innerHTML = files.map(f => \`
        <div class="file-item">
          <div class="file-info">
            <span class="file-icon">📄</span>
            <div>
              <div class="file-name">\${f.filename}</div>
              <div class="file-date">\${new Date(f.created_at).toLocaleDateString()}</div>
            </div>
          </div>
          <button class="delete-btn" onclick="deleteFile('\${f.filename}')" title="Delete">🗑️</button>
        </div>
      \`).join('');
    } catch {
      list.innerHTML = '<div class="empty">Could not load files</div>';
    }
  }

  async function deleteFile(filename) {
    if (!confirm('Delete ' + filename + '?')) return;
    await fetch(API + '/files/' + encodeURIComponent(filename), { method: 'DELETE' });
    showToast(filename + ' deleted', 'success');
    loadFiles();
  }

  function showToast(msg, type) {
    const el = document.getElementById('toastMsg');
    el.textContent = msg;
    el.className = 'toast-msg show ' + (type || '');
    setTimeout(() => el.className = 'toast-msg', 3000);
  }

  loadFiles();
</script>
</body>
</html>`;

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => console.log(`Toast Bot server running on port ${PORT}`));
