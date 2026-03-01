const http = require('http');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yuzlfocqovwhqdpitvxj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1emxmb2Nxb3Z3aHFkcGl0dnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODE3OTgsImV4cCI6MjA4Nzg1Nzc5OH0.zN_GOXI8MI9isqnVRCZvxAmU1ZyXIfWvq-P3SkSh4Vk';

const KNOWLEDGE_BASE = `
=== EPOS TROUBLESHOOTING ===

SYSTEM CRASH / FROZEN SCREEN:
- Force close: Hold power button 10 seconds, then restart
- If touchscreen unresponsive: unplug power, wait 30 seconds, replug
- Check if crash is affecting all terminals or just one
- Single terminal frozen: usually software — try restarting just that unit
- All terminals down: likely network or server issue — check internet first
- After restart, check if transactions from last 15 mins are saved — most modern EPOS auto-saves

EPOS NOT CONNECTING TO KITCHEN/BAR PRINTER:
- Check physical cable connections at both ends first
- Restart the printer (power off, 10 seconds, power on)
- Check EPOS settings → Printer → ensure IP address matches printer's actual IP
- Common mistake: printer IP changes after router restart — set printer to static IP
- Most EPOS printers: hold feed button on startup to print config sheet with current IP
- If wireless printer: check it's on same WiFi network as terminals

EPOS RUNNING SLOWLY:
- Close unused browser tabs if browser-based EPOS
- Check internet speed: fast.com — if below 10Mbps, call your ISP
- Free up disk space: most EPOS need at least 10% free storage to run well
- Check if slowdown is same time daily — could be scheduled updates or backups
- Restart the terminal — often fixes memory leak issues

LOGIN ISSUES:
- Try another staff member's login first to isolate if it's user-specific or system-wide
- Password reset: usually in back office → staff management → reset PIN
- If entire system locked: check with manager for admin override code
- Some systems lock after 5 failed attempts — wait 15 minutes or contact vendor

CARD PAYMENT NOT GOING THROUGH EPOS:
- Check payment terminal is connected (Bluetooth or cable) to EPOS
- Restart both EPOS and payment terminal
- If integrated payments: call your PSP (payment service provider) not EPOS vendor
- Split responsibility: EPOS vendor handles software, PSP handles transactions

=== WIFI / CONNECTIVITY ===

COMPLETE WIFI OUTAGE:
- Check router lights: solid green/blue = working, flashing red = issue
- Restart router: unplug, wait 60 seconds, plug back in — takes 2-3 minutes
- Check if issue is WiFi or broadband: plug laptop directly into router with cable
  - If cable works but WiFi doesn't: WiFi router problem
  - If neither works: broadband issue — call ISP
- Business broadband SLAs: BT Business 0800 800 150, Virgin Business 0345 454 1111

EPOS ON WIFI KEEPS DROPPING:
- EPOS systems should be on wired connection or dedicated VLAN — never shared guest WiFi
- Set EPOS terminals to static IP addresses to prevent reconnection drops
- Check if issue correlates with busy periods — guest WiFi congestion affecting EPOS
- Consider separate router for EPOS systems only — around £80-150 one-off cost
- Channel congestion: use a WiFi analyser app to check if neighbours are on same channel

SLOW INTERNET DURING SERVICE:
- Guest WiFi and EPOS must be on separate networks — configure VLAN or use two routers
- Check your broadband package: most hospitality needs minimum 50Mbps
- Consider 4G/5G backup SIM router (Cradlepoint, Peplink) — pays for itself in avoided downtime

=== PAYMENT TERMINALS ===

TERMINAL OFFLINE / NOT PROCESSING:
- Check for WiFi signal on terminal screen — reconnect if needed
- If terminal has mobile data backup, confirm it switches automatically
- Full restart: hold power button until it powers off completely, wait 10 seconds
- If using ethernet: check cable and switch port
- Contact your PSP (not your EPOS vendor) for transaction issues
  - Worldpay: 0330 333 3967
  - SumUp: support in app or 020 3510 0160
  - Square: support.squareup.com/en/gb
  - Stripe: 0800 041 8604
  - iZettle/Zettle: 020 3455 0690

CONTACTLESS NOT WORKING:
- Ask customer to try chip and PIN instead while you troubleshoot
- Clean the contactless reader with dry cloth — oils and dust cause issues
- Update terminal firmware: usually Settings → Software Update
- Some cards have contactless limits set by the bank — not a terminal issue
- Check contactless limit on your terminal (UK standard is £100)

TERMINAL TAKING TOO LONG TO PROCESS:
- Usually a connectivity issue — check signal strength on terminal
- Peak times: some PSPs have slower processing — call them if persistent
- Check if other terminals are affected — isolates to single unit vs system

=== GENERAL BEST PRACTICE ===

BEFORE SERVICE CHECKLIST:
- Test one full transaction on your quietest terminal
- Check kitchen/bar printers are printing test pages
- Confirm WiFi password hasn't changed overnight
- Check last night's Z-reading is complete so totals start fresh

WHEN SOMETHING GOES WRONG:
- Stay calm — most issues have a fix and your team is watching you
- Manual fallback: keep a paper pad and pen, take card details on phone if needed
- Document the issue: screenshot error messages, note exact time
- Most EPOS vendors have 24/7 support lines — put them in your phone now

VENDOR SUPPORT CONTACTS:
- Lightspeed: 0800 848 6688
- Square for Restaurants: support.squareup.com/en/gb
- Zonal: 0131 311 8000
- EPOS Now: 020 3744 0140
- Tevalis: 01788 511 100
- Vita Mojo: support@vitamojo.com
- Yoello: support@yoello.com
- Nutritics: support@nutritics.com

ESCALATION PATH:
1. Restart the affected device
2. Check internet connection
3. Try vendor's self-service troubleshooting portal
4. Call vendor support (have your account number ready)
5. If no resolution: escalate to account manager
`;

// ─── SUPABASE HELPERS ──────────────────────────────────────────────────────
async function sbFetch(path, opts = {}) {
  const https = require('https');
  const url = new URL(`${SUPABASE_URL}${path}`);
  const body = opts.body ? JSON.stringify(opts.body) : null;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
    ...opts.headers
  };
  return new Promise((res, rej) => {
    const req = https.request({
      hostname: url.hostname, path: url.pathname + url.search,
      method: opts.method || 'GET', headers
    }, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => {
        try { res({ status: r.statusCode, data: JSON.parse(d || '[]') }); }
        catch { res({ status: r.statusCode, data: d }); }
      });
    });
    req.on('error', rej);
    if (body) req.write(body);
    req.end();
  });
}

async function getAnalytics() {
  try {
    const [convsR, ticketsR, docsR] = await Promise.all([
      sbFetch('/rest/v1/conversations?select=messages,created_at&order=created_at.desc&limit=200'),
      sbFetch('/rest/v1/tickets?select=id,email,name,venue,issue,status,created_at&order=created_at.desc&limit=50'),
      sbFetch('/rest/v1/documents?select=id,filename,created_at&order=created_at.desc&limit=100'),
    ]);

    const convs = Array.isArray(convsR.data) ? convsR.data : [];
    const tickets = Array.isArray(ticketsR.data) ? ticketsR.data : [];
    const docs = Array.isArray(docsR.data) ? docsR.data : [];

    const allMessages = [];
    convs.forEach(c => {
      if (c.messages && Array.isArray(c.messages)) {
        c.messages.filter(m => m.role === 'user').forEach(m => allMessages.push(m.content.toLowerCase()));
      }
    });

    const topicKeywords = {
      'EPOS / Till system': ['epos','till','pos','register','touchscreen','terminal crashed','system down'],
      'Payment terminals': ['payment','card','contactless','worldpay','sumup','square','stripe','zettle'],
      'WiFi / Network': ['wifi','wi-fi','internet','network','broadband','connectivity','offline'],
      'Kitchen printers': ['kitchen','printer','kds','order not printing','print'],
      'Login / Access': ['login','log in','password','pin','access','locked out'],
      'Slow performance': ['slow','lagging','freezing','frozen','unresponsive'],
      'Bookings / Reservations': ['booking','reservation','resy','opentable','sevenrooms'],
      'Payroll / HR': ['payroll','hr','rota','deputy','rotaready','workforce'],
    };

    const topicCounts = {};
    Object.keys(topicKeywords).forEach(topic => {
      topicCounts[topic] = 0;
      allMessages.forEach(msg => {
        if (topicKeywords[topic].some(kw => msg.includes(kw))) topicCounts[topic]++;
      });
    });

    const vendors = ['lightspeed','square','zonal','epos now','tevalis','vita mojo','yoello','worldpay','sumup','stripe','zettle','deputy','rotaready','sevenrooms','opentable','resy','nutritics'];
    const vendorCounts = {};
    vendors.forEach(v => { vendorCounts[v] = allMessages.filter(m => m.includes(v)).length; });

    const topTopics = Object.entries(topicCounts).sort((a,b) => b[1]-a[1]).filter(([,c]) => c > 0);
    const topVendors = Object.entries(vendorCounts).sort((a,b) => b[1]-a[1]).filter(([,c]) => c > 0);

    // Deduplicate docs by filename for display
    const uniqueDocs = [...new Map(docs.map(d => [d.filename, d])).values()];

    return {
      totalConvs: convs.length,
      totalMessages: allMessages.length,
      openTickets: tickets.filter(t => t.status === 'open').length,
      totalDocs: uniqueDocs.length,
      topTopics, topVendors,
      recentConvs: convs.slice(0, 10),
      tickets,
      docs: uniqueDocs
    };
  } catch(e) {
    console.error('Analytics error:', e);
    return { error: e.message };
  }
}

// ─── ADMIN PAGE ────────────────────────────────────────────────────────────
const ADMIN_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stacked Chat Admin</title>
<link rel="icon" type="image/png" href="https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/The%20Bench%20by%20Stacked%20(1).png">
<link rel="icon" type="image/svg+xml" href="https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Stacked%20(3).svg">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --cream:#ede8df;--cream-dark:#e0d9ce;
  --orange:#f04e1a;--brown:#3a2e24;--brown-mid:#6b5744;
  --white:#ffffff;--green:#2a9d5c;--red:#d64545;--blue:#2563eb;
  --shadow:0 2px 16px rgba(58,46,36,0.10);
}
body{background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--brown);min-height:100vh}
header{background:var(--white);border-bottom:1px solid var(--cream-dark);padding:16px 32px;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow)}
.header-icon{width:40px;height:40px;object-fit:contain;mix-blend-mode:multiply}
.header-wordmark{height:28px;object-fit:contain;mix-blend-mode:multiply}
.admin-badge{background:var(--orange);color:#fff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase}
.container{max-width:1200px;margin:0 auto;padding:32px 24px}
.tabs{display:flex;gap:4px;background:var(--white);border-radius:14px;padding:4px;box-shadow:var(--shadow);margin-bottom:28px;overflow-x:auto}
.tab{flex:1;min-width:80px;padding:10px 16px;background:none;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:var(--brown-mid);cursor:pointer;white-space:nowrap;transition:all 0.15s}
.tab.active{background:var(--orange);color:#fff;box-shadow:0 2px 8px rgba(240,78,26,0.3)}
.tab-panel{display:none}.tab-panel.active{display:block}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-bottom:28px}
.stat{background:var(--white);border-radius:16px;padding:20px;box-shadow:var(--shadow)}
.stat-num{font-family:'Fraunces',serif;font-size:32px;font-weight:700;color:var(--orange)}
.stat-label{font-size:13px;color:var(--brown-mid);margin-top:4px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
@media(max-width:700px){.grid2{grid-template-columns:1fr}}
.card{background:var(--white);border-radius:16px;padding:24px;box-shadow:var(--shadow)}
.card h3{font-family:'Fraunces',serif;font-size:18px;margin-bottom:16px}
.bar-row{margin-bottom:10px}
.bar-label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}
.bar-track{height:8px;background:var(--cream-dark);border-radius:4px;overflow:hidden}
.bar-fill{height:100%;background:var(--orange);border-radius:4px;transition:width 0.6s ease}
.bar-fill.blue{background:var(--blue)}
.empty{color:var(--brown-mid);font-size:14px;text-align:center;padding:24px 0}
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;padding:8px 12px;font-weight:600;color:var(--brown-mid);font-size:12px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid var(--cream-dark)}
td{padding:10px 12px;border-bottom:1px solid var(--cream-dark);vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--cream)}
.badge{display:inline-block;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600}
.badge.open{background:#fff3cd;color:#856404}
.badge.closed{background:#d1e7dd;color:#0a3622}
.badge.indexed{background:#d1e7dd;color:#0a3622}
.drop-zone{border:2px dashed var(--cream-dark);border-radius:16px;padding:48px 32px;text-align:center;cursor:pointer;transition:all 0.2s}
.drop-zone.dragging,.drop-zone:hover{border-color:var(--orange);background:rgba(240,78,26,0.04)}
.drop-icon{font-size:40px;margin-bottom:12px}
.drop-title{font-family:'Fraunces',serif;font-size:18px;margin-bottom:6px}
.drop-sub{font-size:13px;color:var(--brown-mid)}
#fileInput{display:none}
.upload-list{margin-top:20px;display:flex;flex-direction:column;gap:8px}
.upload-item{background:var(--cream);border-radius:10px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;font-size:13px}
.upload-item .fname{font-weight:500}
.upload-item .fsize{color:var(--brown-mid);font-size:12px}
.progress{height:4px;background:var(--cream-dark);border-radius:2px;margin-top:6px;overflow:hidden}
.progress-bar{height:100%;background:var(--orange);border-radius:2px;width:0;transition:width 0.3s}
.doc-list{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.doc-item{display:flex;align-items:center;justify-content:space-between;background:var(--cream);border-radius:10px;padding:12px 16px}
.doc-info{display:flex;align-items:center;gap:10px}
.doc-icon{width:32px;height:32px;background:var(--orange);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff}
.doc-name{font-size:14px;font-weight:500}
.doc-date{font-size:11px;color:var(--brown-mid)}
.doc-actions{display:flex;gap:8px;align-items:center}
.btn-delete{background:var(--red);color:#fff;border:none;border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:opacity 0.15s}
.btn-delete:hover{opacity:0.85}
.btn-delete:disabled{opacity:0.5;cursor:not-allowed}
.ticket-msg{font-size:13px;color:var(--brown-mid);max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.close-btn{background:var(--green);color:#fff;border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer}
.notify{position:fixed;bottom:24px;right:24px;background:var(--brown);color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:500;transform:translateY(80px);opacity:0;transition:all 0.3s;z-index:99}
.notify.show{transform:translateY(0);opacity:1}
.notify.green{background:var(--green)}
.notify.red{background:var(--red)}
</style>
</head>
<body>
<header>
  <img class="header-icon" src="https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Linkedin-profile%20(1).jpg" alt="">
  <img class="header-wordmark" src="https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Artboard%2025%20(3).png" alt="Stacked">
  <span class="admin-badge">Admin</span>
</header>

<div class="container">
  <div class="tabs">
    <button class="tab active" onclick="showTab('dashboard')">📊 Dashboard</button>
    <button class="tab" onclick="showTab('tickets')">🎫 Tickets</button>
    <button class="tab" onclick="showTab('conversations')">💬 Conversations</button>
    <button class="tab" onclick="showTab('documents')">📄 Knowledge Base</button>
  </div>

  <div class="tab-panel active" id="tab-dashboard">
    <div class="stats" id="statsRow">
      <div class="stat"><div class="stat-num" id="sConvs">—</div><div class="stat-label">Conversations</div></div>
      <div class="stat"><div class="stat-num" id="sMsgs">—</div><div class="stat-label">Messages sent</div></div>
      <div class="stat"><div class="stat-num" id="sTickets">—</div><div class="stat-label">Open tickets</div></div>
      <div class="stat"><div class="stat-num" id="sDocs">—</div><div class="stat-label">Documents indexed</div></div>
    </div>
    <div class="grid2">
      <div class="card"><h3>Top topics</h3><div id="topicsChart"><div class="empty">Loading…</div></div></div>
      <div class="card"><h3>Top products mentioned</h3><div id="vendorsChart"><div class="empty">Loading…</div></div></div>
    </div>
  </div>

  <div class="tab-panel" id="tab-tickets">
    <div class="card"><h3>Support tickets</h3><div id="ticketsTable"><div class="empty">Loading…</div></div></div>
  </div>

  <div class="tab-panel" id="tab-conversations">
    <div class="card"><h3>Recent conversations</h3><div id="convsTable"><div class="empty">Loading…</div></div></div>
  </div>

  <div class="tab-panel" id="tab-documents">
    <div class="card">
      <div class="drop-zone" id="dropZone" onclick="document.getElementById('fileInput').click()" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="dropFiles(event)">
        <div class="drop-icon">📄</div>
        <div class="drop-title">Drop files here to add to the knowledge base</div>
        <div class="drop-sub">Supports TXT, MD — up to 10MB each</div>
      </div>
      <input type="file" id="fileInput" multiple accept=".pdf,.txt,.md" onchange="handleFiles(this.files)">
      <div class="upload-list" id="uploadList"></div>
      <div class="doc-list" id="docList"><div class="empty">Loading documents…</div></div>
    </div>
  </div>
</div>

<div class="notify" id="notify"></div>

<script>
function showTab(id){
  document.querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('active',['dashboard','tickets','conversations','documents'][i]===id));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id==='tab-'+id));
}

function bar(label,count,max,blue=false){
  const pct=max>0?Math.round((count/max)*100):0;
  return '<div class="bar-row"><div class="bar-label"><span>'+label+'</span><span>'+count+'</span></div><div class="bar-track"><div class="bar-fill'+(blue?' blue':'')+'" style="width:'+pct+'%"></div></div></div>';
}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

async function loadAnalytics(){
  try{
    const r=await fetch('/analytics');
    const a=await r.json();
    if(a.error){console.error(a.error);return;}

    document.getElementById('sConvs').textContent=a.totalConvs;
    document.getElementById('sMsgs').textContent=a.totalMessages;
    document.getElementById('sTickets').textContent=a.openTickets;
    document.getElementById('sDocs').textContent=a.totalDocs;

    const tc=document.getElementById('topicsChart');
    if(!a.topTopics.length){tc.innerHTML='<div class="empty">No data yet.</div>';}
    else{const max=a.topTopics[0][1];tc.innerHTML=a.topTopics.map(([t,c])=>bar(t,c,max)).join('');}

    const vc=document.getElementById('vendorsChart');
    if(!a.topVendors.length){vc.innerHTML='<div class="empty">No vendor mentions yet.</div>';}
    else{const max=a.topVendors[0][1];vc.innerHTML=a.topVendors.map(([v,c])=>bar(v.charAt(0).toUpperCase()+v.slice(1),c,max,true)).join('');}

    const tt=document.getElementById('ticketsTable');
    if(!a.tickets.length){tt.innerHTML='<div class="empty">No tickets raised yet.</div>';}
    else{
      tt.innerHTML='<table><thead><tr><th>Name</th><th>Venue</th><th>Issue</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>'+
        a.tickets.map(t=>'<tr><td><strong>'+esc(t.name||'')+'</strong><br><small>'+esc(t.email||'')+'</small></td><td>'+esc(t.venue||'')+'</td><td class="ticket-msg">'+esc(t.issue||'')+'</td><td><span class="badge '+(t.status||'open')+'">'+esc(t.status||'open')+'</span></td><td>'+new Date(t.created_at).toLocaleDateString('en-GB')+'</td><td>'+(t.status==='open'?'<button class="close-btn" onclick="closeTicket('+t.id+')">Close</button>':'')+'</td></tr>').join('')+
      '</tbody></table>';
    }

    const ct=document.getElementById('convsTable');
    if(!a.recentConvs.length){ct.innerHTML='<div class="empty">No conversations yet.</div>';}
    else{
      ct.innerHTML='<table><thead><tr><th>User</th><th>First message</th><th>Date</th></tr></thead><tbody>'+
        a.recentConvs.map(c=>{
          const first=(c.messages||[]).find(m=>m.role==='user');
          return '<tr><td>'+(c.name?esc(c.name):'Unknown')+'<br><small style="color:var(--brown-mid)">'+esc(c.venue||'')+'</small></td><td style="max-width:320px">'+esc((first?.content||'').substring(0,120))+'</td><td>'+new Date(c.created_at).toLocaleDateString('en-GB')+'</td></tr>';
        }).join('')+'</tbody></table>';
    }

    renderDocs(a.docs);
  }catch(e){console.error(e);}
}

function renderDocs(docs){
  const dl=document.getElementById('docList');
  if(!docs||!docs.length){dl.innerHTML='<div class=\"empty\">No documents uploaded yet.</div>';return;}
  dl.innerHTML=docs.map(d=>`
    <div class=\"doc-item\" data-filename=\"${esc(d.filename)}\">
      <div class=\"doc-info\">
        <div class=\"doc-icon\">📄</div>
        <div>
          <div class=\"doc-name\">${esc(d.filename)}</div>
          <div class=\"doc-date\">Uploaded ${new Date(d.created_at).toLocaleDateString('en-GB')}</div>
        </div>
      </div>
      <div class=\"doc-actions\">
        <span class=\"badge indexed\">Indexed</span>
        <button class=\"btn-delete\" onclick=\"deleteDoc(${JSON.stringify(d.filename)}, this)\">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}

async function deleteDoc(filename, btn){
  if(!confirm('Delete "' + filename + '" from the knowledge base?')) return;
  btn.disabled = true;
  btn.textContent = 'Deleting…';
  try {
    const r = await fetch('/documents?filename=' + encodeURIComponent(filename), { method: 'DELETE' });
    const d = await r.json();
    if(d.ok){
      notify('✓ ' + filename + ' deleted', 'green');
      const row = btn.closest('.doc-item');
      if(row) row.remove();
      setTimeout(loadAnalytics, 500);
    } else {
      notify('Delete failed — check Render logs', 'red');
      btn.disabled = false;
      btn.textContent = '🗑 Delete';
    }
  } catch(e) {
    notify('Delete failed: ' + e.message, 'red');
    btn.disabled = false;
    btn.textContent = '🗑 Delete';
  }
}

async function closeTicket(id){
  await fetch('/ticket/'+id+'/close',{method:'POST'});
  notify('Ticket closed','green');
  loadAnalytics();
}

function dragOver(e){e.preventDefault();document.getElementById('dropZone').classList.add('dragging');}
function dragLeave(){document.getElementById('dropZone').classList.remove('dragging');}
function dropFiles(e){e.preventDefault();document.getElementById('dropZone').classList.remove('dragging');handleFiles(e.dataTransfer.files);}

async function handleFiles(files){
  for(const file of files){
    const item=document.createElement('div');
    item.className='upload-item';
    item.innerHTML='<div><div class="fname">'+esc(file.name)+'</div><div class="fsize">'+(file.size/1024).toFixed(0)+' KB</div><div class="progress"><div class="progress-bar" id="pb_'+file.name.replace(/\\W/g,'')+'"></div></div></div><span>⏳</span>';
    document.getElementById('uploadList').appendChild(item);
    try{
      const text=await readFile(file);
      const pb=document.getElementById('pb_'+file.name.replace(/\\W/g,''));
      if(pb)pb.style.width='50%';
      const r=await fetch('/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({filename:file.name,content:text})});
      const d=await r.json();
      if(pb)pb.style.width='100%';
      item.querySelector('span').textContent='✅';
      notify(file.name+' indexed!','green');
      setTimeout(loadAnalytics,1000);
    }catch(e){
      item.querySelector('span').textContent='❌';
      notify('Failed to upload '+file.name,'red');
    }
  }
}

function readFile(file){
  return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsText(file);});
}

function notify(msg,type=''){
  const n=document.getElementById('notify');
  n.textContent=msg;n.className='notify '+type+' show';
  setTimeout(()=>n.className='notify',3500);
}

loadAnalytics();
</script>
</body>
</html>`;

// ─── HTTP SERVER ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (url === '/health') {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({status:'ok'})); return;
  }

  if (url === '/admin' || url === '/admin/') {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(ADMIN_PAGE); return;
  }

  if (url === '/analytics') {
    const data = await getAnalytics();
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(data)); return;
  }

  if (method === 'POST' && url.startsWith('/ticket/') && url.endsWith('/close')) {
    const id = url.split('/')[2];
    await sbFetch(`/rest/v1/tickets?id=eq.${id}`, {method:'PATCH', body:{status:'closed'}});
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({ok:true})); return;
  }

  // ─── DELETE DOCUMENT ───────────────────────────────────────────
  if (method === 'DELETE' && url.startsWith('/documents')) {
    try {
      const params = new URL(url, 'http://localhost');
      const filename = params.searchParams.get('filename');
      console.log(`[DELETE] Attempting to delete: "${filename}"`);
      if (!filename) {
        res.writeHead(400, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ok:false,error:'No filename provided'})); return;
      }
      // Direct HTTPS delete to bypass sbFetch header merging issues
      const https = require('https');
      const sbUrl = new URL(`${SUPABASE_URL}/rest/v1/documents?filename=eq.${encodeURIComponent(filename)}`);
      await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: sbUrl.hostname,
          path: sbUrl.pathname + sbUrl.search,
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          }
        }, (r) => {
          let d = '';
          r.on('data', c => d += c);
          r.on('end', () => {
            console.log(`[DELETE] Supabase status: ${r.statusCode}`, d.substring(0, 200));
            resolve(r.statusCode);
          });
        });
        req.on('error', reject);
        req.end();
      });
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ok:true, deleted: filename}));
    } catch(e) {
      console.error('[DELETE] Error:', e);
      res.writeHead(500, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ok:false, error:e.message}));
    }
    return;
  }

  if (method === 'POST' && url === '/upload') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { filename, content } = JSON.parse(body);
        const chunks = chunkText(content, filename);
        for (const chunk of chunks) {
          await sbFetch('/rest/v1/documents', {method:'POST', body:chunk});
        }
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ok:true, chunks:chunks.length}));
      } catch(e) {
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({error:e.message}));
      }
    });
    return;
  }

  if (method === 'POST' && url === '/chat') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { message, history = [] } = JSON.parse(body);

        let docContext = '';
        try {
          const docsR = await sbFetch('/rest/v1/documents?select=filename,content&limit=200');
          if (Array.isArray(docsR.data) && docsR.data.length > 0) {
            const msgLower = message.toLowerCase();
            const relevant = docsR.data.filter(d =>
              msgLower.split(' ').some(w => w.length > 3 && d.content.toLowerCase().includes(w))
            ).slice(0, 4);
            if (relevant.length > 0) {
              docContext = '\n\n=== FROM KNOWLEDGE BASE ===\n' +
                relevant.map(d => `[${d.filename}]\n${d.content.substring(0, 600)}`).join('\n\n');
            }
          }
        } catch(e) { /* no docs */ }

        const systemPrompt = `You are the Stacked Chat assistant — a friendly, direct AI support bot for hospitality operators in the UK. You specialise in hospitality technology troubleshooting.

Your personality:
- Calm under pressure (operators often message you during a crisis)
- Straight to the point — no waffle
- Friendly but efficient
- Use British English

Always:
- Give numbered steps for troubleshooting
- Mention vendor support numbers when relevant
- Suggest a workaround if the main fix won't work mid-service
- End with "If this hasn't resolved it, hit 'Raise a ticket' below" if the issue seems complex

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}${docContext}`;

        const messages = history.slice(-8).map(m => ({role:m.role,content:m.content}));
        if (!messages.length || messages[messages.length-1].content !== message) {
          messages.push({role:'user',content:message});
        }

        const https = require('https');
        const apiBody = JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages
        });

        const apiRes = await new Promise((resolve, reject) => {
          const r = https.request({
            hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': ANTHROPIC_KEY,
              'anthropic-version': '2023-06-01',
              'Content-Length': Buffer.byteLength(apiBody)
            }
          }, (resp) => {
            let d = '';
            resp.on('data', c => d += c);
            resp.on('end', () => resolve(JSON.parse(d)));
          });
          r.on('error', reject);
          r.write(apiBody);
          r.end();
        });

        const reply = apiRes.content?.[0]?.text || 'Sorry, I could not get a response. Please try again.';
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({response:reply}));

      } catch(e) {
        console.error(e);
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({response:'Server error. Please try again in a moment.'}));
      }
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
});

function chunkText(text, filename) {
  const chunkSize = 1200;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push({filename, content:text.substring(i, i+chunkSize), chunk_index:chunks.length});
  }
  return chunks;
}

server.listen(PORT, () => console.log(`Stacked Chat server running on port ${PORT}`));
