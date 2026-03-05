const http = require('http');
// ─── TENANT PAGES ──────────────────────────────────────────────────────────
const BOXPARK_CHAT = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, viewport-fit=cover\">\n<title>Boxpark Tech Support</title>\n<link rel=\"icon\" href=\"https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/The%20Bench%20by%20Stacked%20(1).png\">\n<link href=\"https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap\" rel=\"stylesheet\">\n<style>\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n:root{\n  --brand:#E31E26;--brand-light:#ff4a50;\n  --bg:#111111;--card:#1e1e1e;--border:#2e2e2e;\n  --text:#ffffff;--text-mid:#888888;\n  --green:#2a9d5c;--red:#d64545;\n  --shadow:0 2px 16px rgba(0,0,0,0.5);\n}\nhtml,body{height:100%;height:100dvh;background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--text);overflow:hidden}\n#gate{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:100;padding:24px}\n#gate.hidden{display:none}\n.gate-card{background:var(--card);border-radius:24px;padding:40px 32px;width:100%;max-width:420px;box-shadow:var(--shadow);text-align:center;border:1px solid var(--border)}\n.gate-logo{height:56px;max-width:180px;object-fit:contain;margin-bottom:16px}\n.gate-sub{font-size:13px;color:var(--text-mid);margin-bottom:20px;letter-spacing:0.02em}\n.gate-card h2{font-family:'Fraunces',serif;font-size:22px;margin-bottom:6px}\n.gate-card p{font-size:14px;color:var(--text-mid);margin-bottom:20px;line-height:1.5}\n.gate-input{width:100%;padding:12px 16px;border:1.5px solid var(--border);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--text);background:rgba(255,255,255,0.05);margin-bottom:10px;outline:none;transition:border-color 0.2s}\n.gate-input:focus{border-color:var(--brand)}\n.gate-input::placeholder{color:var(--text-mid)}\n.gate-btn{width:100%;padding:14px;background:var(--brand);color:#fff;border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;cursor:pointer;transition:background 0.2s}\n.gate-btn:hover{background:var(--brand-light)}\n.gate-error{font-size:13px;color:var(--red);margin-top:-6px;margin-bottom:8px;display:none}\n#app{display:flex;flex-direction:column;height:100%;height:100dvh}\nheader{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:var(--card);border-bottom:1px solid var(--border);flex-shrink:0}\n.header-logo{height:30px;object-fit:contain}\n.header-actions{display:flex;gap:8px;align-items:center}\n.user-chip{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);border-radius:20px;padding:6px 12px 6px 8px;font-size:13px;font-weight:500;border:1px solid var(--border)}\n.user-chip .dot{width:8px;height:8px;border-radius:50%;background:var(--green)}\n.icon-btn{background:none;border:none;cursor:pointer;padding:8px;border-radius:10px;color:var(--text-mid);font-size:18px}\n.icon-btn:hover{background:var(--border)}\nmain{flex:1;overflow:hidden;display:flex;flex-direction:column;min-height:0}\n#messages{flex:1;overflow-y:auto;padding:20px 16px 8px;display:flex;flex-direction:column;gap:16px;scroll-behavior:smooth}\n.welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:32px 16px;gap:12px;text-align:center}\n.welcome-logo{height:60px;max-width:180px;object-fit:contain;margin-bottom:4px}\n.welcome h2{font-family:'Fraunces',serif;font-size:24px;font-weight:700;line-height:1.2}\n.welcome p{font-size:14px;color:var(--text-mid);margin-bottom:8px}\n.quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:360px}\n.quick-btn{background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:14px 12px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--text);cursor:pointer;text-align:left;transition:border-color 0.2s;line-height:1.3}\n.quick-btn:hover{border-color:var(--brand)}\n.quick-btn .emoji{font-size:18px;display:block;margin-bottom:4px}\n.msg{display:flex;align-items:flex-start;gap:10px}\n.msg.user{flex-direction:row-reverse}\n.msg-avatar{width:32px;height:32px;border-radius:50%;flex-shrink:0;background:var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;overflow:hidden}\n.msg-avatar img{width:100%;height:100%;object-fit:contain}\n.msg-bubble{background:var(--card);border-radius:18px 18px 18px 4px;padding:12px 16px;font-size:15px;line-height:1.55;max-width:calc(100% - 80px);border:1px solid var(--border);white-space:pre-wrap}\n.msg.user .msg-bubble{background:var(--brand);color:#fff;border-radius:18px 18px 4px 18px;border:none}\n.ticket-row{display:flex;justify-content:center;margin-top:-4px}\n.ticket-btn{background:var(--card);border:1.5px solid var(--border);border-radius:20px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--text-mid);cursor:pointer;transition:border-color 0.2s}\n.ticket-btn:hover{border-color:var(--brand);color:var(--brand)}\n.typing-bubble{display:flex;align-items:flex-start;gap:10px}\n.dots{display:flex;gap:4px;align-items:center;background:var(--card);border-radius:18px;padding:12px 16px;border:1px solid var(--border)}\n.dot-anim{width:8px;height:8px;border-radius:50%;background:var(--text-mid);animation:bounce 1.2s infinite}\n.dot-anim:nth-child(2){animation-delay:0.2s}.dot-anim:nth-child(3){animation-delay:0.4s}\n@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}\n.input-bar{padding:12px 16px;padding-bottom:calc(12px + env(safe-area-inset-bottom));background:var(--card);border-top:1px solid var(--border);flex-shrink:0;display:flex;gap:10px;align-items:flex-end}\n#input{flex:1;padding:12px 16px;background:rgba(255,255,255,0.05);border:1.5px solid var(--border);border-radius:20px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--text);resize:none;outline:none;max-height:120px;line-height:1.4;transition:border-color 0.2s}\n#input:focus{border-color:var(--brand)}\n#input::placeholder{color:var(--text-mid)}\n#send{width:44px;height:44px;border-radius:50%;background:var(--brand);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}\n#send:hover{background:var(--brand-light)}\n#send svg{width:18px;height:18px;fill:#fff}\n#send:disabled{opacity:0.5;cursor:default}\n.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:50;opacity:0;pointer-events:none;transition:opacity 0.25s}\n.drawer-overlay.open{opacity:1;pointer-events:all}\n.drawer{position:fixed;bottom:0;left:0;right:0;background:var(--card);border-radius:24px 24px 0 0;z-index:51;max-height:70vh;transform:translateY(100%);transition:transform 0.3s cubic-bezier(0.32,0.72,0,1);display:flex;flex-direction:column;border-top:1px solid var(--border)}\n.drawer.open{transform:translateY(0)}\n.drawer-handle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:12px auto 0}\n.drawer-header{padding:16px 20px 12px;font-family:'Fraunces',serif;font-size:18px;font-weight:700;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}\n.drawer-close{background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-mid);padding:4px}\n.drawer-body{overflow-y:auto;padding:16px 20px;flex:1}\n.history-item{padding:14px 0;border-bottom:1px solid var(--border);cursor:pointer}\n.history-item:last-child{border-bottom:none}\n.history-date{font-size:11px;color:var(--text-mid);margin-bottom:4px}\n.history-preview{font-size:14px;font-weight:500}\n.history-item:hover .history-preview{color:var(--brand)}\n.history-count{font-size:12px;color:var(--text-mid);margin-top:2px}\n.empty-hist{text-align:center;padding:32px 0;color:var(--text-mid);font-size:14px}\n.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:200;display:flex;align-items:flex-end;opacity:0;pointer-events:none;transition:opacity 0.2s}\n.modal-overlay.open{opacity:1;pointer-events:all}\n.modal{background:var(--card);border-radius:24px 24px 0 0;padding:24px 24px calc(24px + env(safe-area-inset-bottom));width:100%;transform:translateY(100%);transition:transform 0.3s cubic-bezier(0.32,0.72,0,1);border-top:1px solid var(--border)}\n.modal-overlay.open .modal{transform:translateY(0)}\n.modal h3{font-family:'Fraunces',serif;font-size:20px;margin-bottom:6px}\n.modal p{font-size:14px;color:var(--text-mid);margin-bottom:20px}\n.modal textarea{width:100%;border:1.5px solid var(--border);border-radius:12px;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);background:rgba(255,255,255,0.05);resize:none;height:100px;outline:none;margin-bottom:14px}\n.modal-actions{display:flex;gap:10px}\n.modal-cancel{flex:1;padding:13px;background:rgba(255,255,255,0.07);border:1px solid var(--border);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;color:var(--text)}\n.modal-submit{flex:2;padding:13px;background:var(--brand);border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;color:#fff}\n.toast{position:fixed;bottom:calc(80px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%) translateY(20px);background:var(--card);color:var(--text);border-radius:20px;padding:10px 20px;font-size:14px;font-weight:500;opacity:0;transition:all 0.3s;z-index:300;white-space:nowrap;border:1px solid var(--border)}\n.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}\n.toast.green{background:var(--green);border:none}\n#messages::-webkit-scrollbar{width:4px}\n#messages::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}\n</style>\n</head>\n<body>\n\n<div id=\"gate\">\n  <div class=\"gate-card\">\n    <img class=\"gate-logo\" src=\"https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Stacked%20(3).svg\" alt=\"Boxpark\" style=\"filter:brightness(0) invert(1)\">\n    <p class=\"gate-sub\">Vendor tech support, powered by Stacked</p>\n    <h2>Welcome \u2014 let's get you sorted</h2>\n    <p>Drop your details below and we'll have you chatting in seconds.</p>\n    <input class=\"gate-input\" type=\"text\" id=\"gateName\" placeholder=\"Your name\" autocomplete=\"given-name\">\n    <input class=\"gate-input\" type=\"text\" id=\"gateUnit\" placeholder=\"Unit / stall name\" autocomplete=\"organization\">\n    <input class=\"gate-input\" type=\"email\" id=\"gateEmail\" placeholder=\"Email address\" autocomplete=\"email\">\n    <div class=\"gate-error\" id=\"gateError\">Please fill in all fields with a valid email.</div>\n    <button class=\"gate-btn\" onclick=\"submitGate()\">Start chatting &rarr;</button>\n  </div>\n</div>\n\n<div id=\"app\">\n  <header>\n    <img class=\"header-logo\" src=\"https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Stacked%20(3).svg\" alt=\"Boxpark\" style=\"filter:brightness(0) invert(1)\">\n    <div class=\"header-actions\">\n      <div class=\"user-chip\"><div class=\"dot\"></div><span id=\"userLabel\">You</span></div>\n      <button class=\"icon-btn\" onclick=\"openHistory()\" title=\"Chat history\">\n        <svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 8v4l3 3M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z\"/></svg>\n      </button>\n    </div>\n  </header>\n  <main>\n    <div id=\"messages\">\n      <div class=\"welcome\" id=\"welcome\">\n        <img class=\"welcome-logo\" src=\"https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Stacked%20(3).svg\" alt=\"Boxpark\" style=\"filter:brightness(0) invert(1)\">\n        <h2>Got a tech problem?<br>Let's fix it.</h2>\n        <p>Ask anything about your tech at Boxpark &mdash; EPOS, payments, WiFi and more.</p>\n        <div class=\"quick-grid\">\n          <button class=\"quick-btn\" onclick=\"quickSend('My card reader is offline')\"><span class=\"emoji\">\ud83d\udcb3</span>Card reader offline</button>\n          <button class=\"quick-btn\" onclick=\"quickSend('My EPOS has crashed mid-service')\"><span class=\"emoji\">\ud83d\udcbb</span>EPOS crashed</button>\n          <button class=\"quick-btn\" onclick=\"quickSend('WiFi is down at my unit')\"><span class=\"emoji\">\ud83d\udcf6</span>WiFi issues</button>\n          <button class=\"quick-btn\" onclick=\"quickSend('My receipt printer is not working')\"><span class=\"emoji\">\ud83d\udda8\ufe0f</span>Printer not working</button>\n        </div>\n      </div>\n    </div>\n  </main>\n  <div class=\"input-bar\">\n    <textarea id=\"input\" placeholder=\"Describe your tech issue&#8230;\" rows=\"1\" onkeydown=\"handleKey(event)\" oninput=\"autoResize(this)\"></textarea>\n    <button id=\"send\" onclick=\"sendMessage()\"><svg viewBox=\"0 0 24 24\"><path d=\"M2 21l21-9L2 3v7l15 2-15 2z\"/></svg></button>\n  </div>\n</div>\n\n<div class=\"drawer-overlay\" id=\"histOverlay\" onclick=\"closeHistory()\"></div>\n<div class=\"drawer\" id=\"histDrawer\">\n  <div class=\"drawer-handle\"></div>\n  <div class=\"drawer-header\"><span>Chat history</span><button class=\"drawer-close\" onclick=\"closeHistory()\">&times;</button></div>\n  <div class=\"drawer-body\" id=\"histBody\"><div class=\"empty-hist\">No previous chats yet.</div></div>\n</div>\n\n<div class=\"modal-overlay\" id=\"ticketOverlay\">\n  <div class=\"modal\">\n    <h3>Raise a support ticket</h3>\n    <p>We'll look into this and get back to you. Add any extra detail below.</p>\n    <textarea id=\"ticketNote\" placeholder=\"Any extra context&#8230;\"></textarea>\n    <div class=\"modal-actions\">\n      <button class=\"modal-cancel\" onclick=\"closeTicketModal()\">Cancel</button>\n      <button class=\"modal-submit\" onclick=\"submitTicket()\">Submit ticket</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"toast\" id=\"toast\"></div>\n\n<script>\nconst TENANT = 'boxpark';\nconst SUPABASE_URL = 'https://yuzlfocqovwhqdpitvxj.supabase.co';\nconst SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1emxmb2Nxb3Z3aHFkcGl0dnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODE3OTgsImV4cCI6MjA4Nzg1Nzc5OH0.zN_GOXI8MI9isqnVRCZvxAmU1ZyXIfWvq-P3SkSh4Vk';\nconst ICON_URL = 'https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/The%20Bench%20by%20Stacked%20(1).png';\nlet user=null, msgs=[], convId=null;\n\nwindow.addEventListener('DOMContentLoaded', () => {\n  const saved = localStorage.getItem('user_boxpark');\n  if (saved) { user = JSON.parse(saved); showApp(); }\n});\n\nasync function submitGate() {\n  const name = document.getElementById('gateName').value.trim();\n  const venue = document.getElementById('gateUnit').value.trim();\n  const email = document.getElementById('gateEmail').value.trim();\n  const err = document.getElementById('gateError');\n  if (!name || !venue || !email || !/\\S+@\\S+\\.\\S+/.test(email)) { err.style.display='block'; return; }\n  err.style.display = 'none';\n  user = {name, venue, email};\n  localStorage.setItem('user_boxpark', JSON.stringify(user));\n  try { await sbPost('leads', {name, venue, email, tenant: TENANT}); } catch(e) {}\n  showApp();\n}\n\nfunction showApp() {\n  document.getElementById('gate').classList.add('hidden');\n  document.getElementById('userLabel').textContent = user.name.split(' ')[0];\n  loadHistory();\n}\n\nasync function sbPost(table, data) {\n  return fetch(SUPABASE_URL + '/rest/v1/' + table, {\n    method: 'POST',\n    headers: {'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Prefer':'return=representation'},\n    body: JSON.stringify(data)\n  }).then(r => r.json());\n}\n\nfunction handleKey(e) { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }\nfunction autoResize(el) { el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,120)+'px'; }\nfunction quickSend(text) { document.getElementById('input').value=text; sendMessage(); }\n\nasync function sendMessage() {\n  const input = document.getElementById('input');\n  const text = input.value.trim();\n  if (!text) return;\n  const w = document.getElementById('welcome'); if (w) w.remove();\n  input.value = ''; input.style.height = 'auto';\n  document.getElementById('send').disabled = true;\n  addMsg('user', text);\n  msgs.push({role:'user', content:text});\n  const typing = addTyping();\n  try {\n    const res = await fetch('/boxpark/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:text, history:msgs.slice(-10)})});\n    const data = await res.json();\n    const reply = data.response || \"Sorry, I couldn't get a response. Please try again.\";\n    typing.remove();\n    addMsg('assistant', reply, true);\n    msgs.push({role:'assistant', content:reply});\n    await saveConv();\n  } catch(e) {\n    typing.remove();\n    addMsg('assistant', \"I'm having trouble connecting. Please try again in a moment.\", true);\n  }\n  document.getElementById('send').disabled = false;\n  input.focus();\n}\n\nfunction addMsg(role, content, showTicket=false) {\n  const container = document.getElementById('messages');\n  const wrap = document.createElement('div'); wrap.className = 'msg ' + role;\n  const av = document.createElement('div'); av.className = 'msg-avatar';\n  if (role === 'assistant') {\n    const img = document.createElement('img'); img.src = ICON_URL; img.alt = 'S'; av.appendChild(img);\n  } else {\n    av.textContent = (user?.name||'You')[0].toUpperCase();\n    av.style.cssText = 'background:var(--brand);color:#fff';\n  }\n  const bubble = document.createElement('div'); bubble.className = 'msg-bubble'; bubble.textContent = content;\n  wrap.appendChild(av); wrap.appendChild(bubble); container.appendChild(wrap);\n  if (role === 'assistant' && showTicket) {\n    const tr = document.createElement('div'); tr.className = 'ticket-row';\n    tr.innerHTML = '<button class=\"ticket-btn\" onclick=\"openTicketModal()\">\ud83c\udfab This didn\\'t solve my issue \u2014 raise a ticket</button>';\n    container.appendChild(tr);\n  }\n  container.scrollTop = container.scrollHeight;\n  return wrap;\n}\n\nfunction addTyping() {\n  const container = document.getElementById('messages');\n  const wrap = document.createElement('div'); wrap.className = 'typing-bubble';\n  const av = document.createElement('div'); av.className = 'msg-avatar';\n  const img = document.createElement('img'); img.src = ICON_URL; av.appendChild(img);\n  const dots = document.createElement('div'); dots.className = 'dots';\n  dots.innerHTML = '<div class=\"dot-anim\"></div><div class=\"dot-anim\"></div><div class=\"dot-anim\"></div>';\n  wrap.appendChild(av); wrap.appendChild(dots); container.appendChild(wrap);\n  container.scrollTop = container.scrollHeight;\n  return wrap;\n}\n\nasync function saveConv() {\n  if (!user || !msgs.length) return;\n  try {\n    const preview = (msgs.find(m => m.role==='user')?.content||'').substring(0,80);\n    const data = {email:user.email, name:user.name, venue:user.venue, messages:msgs, preview, tenant:TENANT, updated_at:new Date().toISOString()};\n    if (convId) {\n      await fetch(SUPABASE_URL+'/rest/v1/conversations?id=eq.'+convId, {method:'PATCH', headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}, body:JSON.stringify({messages:msgs, updated_at:new Date().toISOString()})});\n    } else {\n      const rows = await sbPost('conversations', data);\n      if (rows && rows[0]) convId = rows[0].id;\n    }\n  } catch(e) {}\n}\n\nasync function loadHistory() {\n  if (!user) return;\n  try {\n    const r = await fetch(SUPABASE_URL+'/rest/v1/conversations?email=eq.'+encodeURIComponent(user.email)+'&tenant=eq.boxpark&order=updated_at.desc&limit=20', {headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}});\n    const rows = await r.json();\n    const body = document.getElementById('histBody');\n    if (!rows || !rows.length) { body.innerHTML='<div class=\"empty-hist\">No previous chats yet.</div>'; return; }\n    body.innerHTML = '';\n    rows.forEach(row => {\n      const d = new Date(row.updated_at||row.created_at);\n      const dateStr = d.toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'});\n      const count = (row.messages||[]).filter(m => m.role==='user').length;\n      const item = document.createElement('div'); item.className='history-item';\n      item.innerHTML = '<div class=\"history-date\">'+dateStr+'</div><div class=\"history-preview\">'+esc(row.preview||'Chat session')+'</div><div class=\"history-count\">'+count+' message'+(count!==1?'s':'')+'</div>';\n      item.onclick = () => loadConv(row);\n      body.appendChild(item);\n    });\n  } catch(e) {}\n}\n\nfunction loadConv(row) {\n  closeHistory();\n  document.getElementById('messages').innerHTML = '';\n  convId = row.id; msgs = row.messages||[];\n  msgs.forEach((m,i) => addMsg(m.role, m.content, m.role==='assistant'&&i===msgs.length-1));\n}\n\nfunction esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }\nfunction openHistory() { loadHistory(); document.getElementById('histOverlay').classList.add('open'); document.getElementById('histDrawer').classList.add('open'); }\nfunction closeHistory() { document.getElementById('histOverlay').classList.remove('open'); document.getElementById('histDrawer').classList.remove('open'); }\nfunction openTicketModal() { document.getElementById('ticketNote').value=''; document.getElementById('ticketOverlay').classList.add('open'); }\nfunction closeTicketModal() { document.getElementById('ticketOverlay').classList.remove('open'); }\n\nasync function submitTicket() {\n  const note = document.getElementById('ticketNote').value.trim();\n  const issue = 'Last question: '+(msgs.filter(m=>m.role==='user').slice(-1)[0]?.content||'')+(note?'\\n\\nExtra detail: '+note:'');\n  try {\n    await sbPost('tickets', {email:user.email, name:user.name, venue:user.venue, issue, conversation:msgs, status:'open', tenant:TENANT});\n    closeTicketModal();\n    showToast('\u2713 Ticket raised \u2014 we\\'ll be in touch!', 'green');\n  } catch(e) { closeTicketModal(); showToast('Something went wrong, please try again.'); }\n}\n\nfunction showToast(msg, type='') {\n  const t = document.getElementById('toast');\n  t.textContent = msg; t.className = 'toast '+type+' show';\n  setTimeout(() => { t.className = 'toast'; }, 3500);\n}\n</script>\n</body>\n</html>";
const BOXPARK_ADMIN = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>Boxpark Admin</title>\n<link rel=\"icon\" href=\"https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/The%20Bench%20by%20Stacked%20(1).png\">\n<link href=\"https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap\" rel=\"stylesheet\">\n<style>\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n:root{\n  --brand:#E31E26;--brand-light:#ff4a50;\n  --bg:#111111;--card:#1e1e1e;--border:#2e2e2e;\n  --text:#ffffff;--text-mid:#888888;\n  --green:#2a9d5c;--red:#d64545;--blue:#3b82f6;\n  --shadow:0 2px 16px rgba(0,0,0,0.5);\n}\nbody{background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--text);min-height:100vh}\nheader{background:var(--card);border-bottom:1px solid var(--border);padding:16px 32px;display:flex;align-items:center;gap:12px}\n.header-logo{height:30px;object-fit:contain;filter:brightness(0) invert(1)}\n.admin-badge{background:var(--brand);color:#fff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase}\n.container{max-width:1200px;margin:0 auto;padding:32px 24px}\n.tabs{display:flex;gap:4px;background:var(--card);border-radius:14px;padding:4px;margin-bottom:28px;overflow-x:auto;border:1px solid var(--border)}\n.tab{flex:1;min-width:80px;padding:10px 16px;background:none;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:var(--text-mid);cursor:pointer;white-space:nowrap;transition:all 0.15s}\n.tab.active{background:var(--brand);color:#fff}\n.tab-panel{display:none}.tab-panel.active{display:block}\n.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-bottom:28px}\n.stat{background:var(--card);border-radius:16px;padding:20px;border:1px solid var(--border)}\n.stat-num{font-family:'Fraunces',serif;font-size:32px;font-weight:700;color:var(--brand)}\n.stat-label{font-size:13px;color:var(--text-mid);margin-top:4px}\n.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}\n@media(max-width:700px){.grid2{grid-template-columns:1fr}}\n.card{background:var(--card);border-radius:16px;padding:24px;border:1px solid var(--border)}\n.card h3{font-family:'Fraunces',serif;font-size:18px;margin-bottom:16px}\n.bar-row{margin-bottom:10px}\n.bar-label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}\n.bar-track{height:8px;background:var(--border);border-radius:4px;overflow:hidden}\n.bar-fill{height:100%;background:var(--brand);border-radius:4px;transition:width 0.6s ease}\n.bar-fill.blue{background:var(--blue)}\n.empty{color:var(--text-mid);font-size:14px;text-align:center;padding:24px 0}\ntable{width:100%;border-collapse:collapse;font-size:14px}\nth{text-align:left;padding:8px 12px;font-weight:600;color:var(--text-mid);font-size:12px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid var(--border)}\ntd{padding:10px 12px;border-bottom:1px solid var(--border);vertical-align:top}\ntr:last-child td{border-bottom:none}\ntr:hover td{background:rgba(255,255,255,0.02)}\n.badge{display:inline-block;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600}\n.badge.open{background:rgba(227,30,38,0.2);color:#ff6b70}\n.badge.closed{background:rgba(42,157,92,0.2);color:#4ade80}\n.badge.indexed{background:rgba(42,157,92,0.2);color:#4ade80}\n.drop-zone{border:2px dashed var(--border);border-radius:16px;padding:48px 32px;text-align:center;cursor:pointer;transition:all 0.2s}\n.drop-zone:hover,.drop-zone.dragging{border-color:var(--brand);background:rgba(227,30,38,0.05)}\n.drop-icon{font-size:40px;margin-bottom:12px}\n.drop-title{font-family:'Fraunces',serif;font-size:18px;margin-bottom:6px}\n.drop-sub{font-size:13px;color:var(--text-mid)}\n#fileInput{display:none}\n.doc-list{display:flex;flex-direction:column;gap:8px;margin-top:16px}\n.doc-item{display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);border-radius:10px;padding:12px 16px;border:1px solid var(--border)}\n.doc-info{display:flex;align-items:center;gap:10px}\n.doc-icon{width:32px;height:32px;background:var(--brand);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px}\n.doc-name{font-size:14px;font-weight:500}\n.doc-date{font-size:11px;color:var(--text-mid)}\n.doc-actions{display:flex;gap:8px;align-items:center}\n.btn-delete{background:var(--red);color:#fff;border:none;border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:opacity 0.15s}\n.btn-delete:hover{opacity:0.85}\n.btn-delete:disabled{opacity:0.5;cursor:not-allowed}\n.upload-list{margin-top:20px;display:flex;flex-direction:column;gap:8px}\n.upload-item{background:rgba(255,255,255,0.03);border-radius:10px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;font-size:13px;border:1px solid var(--border)}\n.progress{height:4px;background:var(--border);border-radius:2px;margin-top:6px;overflow:hidden}\n.progress-bar{height:100%;background:var(--brand);border-radius:2px;width:0;transition:width 0.3s}\n.ticket-msg{font-size:13px;color:var(--text-mid);max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.close-btn{background:var(--green);color:#fff;border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer}\n.notify{position:fixed;bottom:24px;right:24px;background:var(--card);color:var(--text);padding:12px 20px;border-radius:12px;font-size:14px;font-weight:500;transform:translateY(80px);opacity:0;transition:all 0.3s;z-index:99;border:1px solid var(--border)}\n.notify.show{transform:translateY(0);opacity:1}\n.notify.green{background:var(--green);border:none}\n.notify.red{background:var(--red);border:none}\n</style>\n</head>\n<body>\n<header>\n  <img class=\"header-logo\" src=\"https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Stacked%20(3).svg\" alt=\"Stacked\">\n  <span class=\"admin-badge\">Boxpark Admin</span>\n</header>\n<div class=\"container\">\n  <div class=\"tabs\">\n    <button class=\"tab active\" onclick=\"showTab('dashboard')\">&#x1F4CA; Dashboard</button>\n    <button class=\"tab\" onclick=\"showTab('tickets')\">&#x1F3AB; Tickets</button>\n    <button class=\"tab\" onclick=\"showTab('conversations')\">&#x1F4AC; Conversations</button>\n    <button class=\"tab\" onclick=\"showTab('documents')\">&#x1F4C4; Knowledge Base</button>\n  </div>\n  <div class=\"tab-panel active\" id=\"tab-dashboard\">\n    <div class=\"stats\">\n      <div class=\"stat\"><div class=\"stat-num\" id=\"sConvs\">&mdash;</div><div class=\"stat-label\">Conversations</div></div>\n      <div class=\"stat\"><div class=\"stat-num\" id=\"sMsgs\">&mdash;</div><div class=\"stat-label\">Messages sent</div></div>\n      <div class=\"stat\"><div class=\"stat-num\" id=\"sTickets\">&mdash;</div><div class=\"stat-label\">Open tickets</div></div>\n      <div class=\"stat\"><div class=\"stat-num\" id=\"sDocs\">&mdash;</div><div class=\"stat-label\">Documents indexed</div></div>\n    </div>\n    <div class=\"grid2\">\n      <div class=\"card\"><h3>Top topics</h3><div id=\"topicsChart\"><div class=\"empty\">Loading&hellip;</div></div></div>\n      <div class=\"card\"><h3>Top products mentioned</h3><div id=\"vendorsChart\"><div class=\"empty\">Loading&hellip;</div></div></div>\n    </div>\n  </div>\n  <div class=\"tab-panel\" id=\"tab-tickets\"><div class=\"card\"><h3>Support tickets</h3><div id=\"ticketsTable\"><div class=\"empty\">Loading&hellip;</div></div></div></div>\n  <div class=\"tab-panel\" id=\"tab-conversations\"><div class=\"card\"><h3>Recent conversations</h3><div id=\"convsTable\"><div class=\"empty\">Loading&hellip;</div></div></div></div>\n  <div class=\"tab-panel\" id=\"tab-documents\">\n    <div class=\"card\">\n      <div class=\"drop-zone\" id=\"dropZone\" onclick=\"document.getElementById('fileInput').click()\" ondragover=\"dragOver(event)\" ondragleave=\"dragLeave(event)\" ondrop=\"dropFiles(event)\">\n        <div class=\"drop-icon\">&#x1F4C4;</div>\n        <div class=\"drop-title\">Drop files to add to Boxpark's knowledge base</div>\n        <div class=\"drop-sub\">Supports TXT, MD &mdash; up to 10MB each</div>\n      </div>\n      <input type=\"file\" id=\"fileInput\" multiple accept=\".txt,.md\" onchange=\"handleFiles(this.files)\">\n      <div class=\"upload-list\" id=\"uploadList\"></div>\n      <div class=\"doc-list\" id=\"docList\"><div class=\"empty\">Loading documents&hellip;</div></div>\n    </div>\n  </div>\n</div>\n<div class=\"notify\" id=\"notify\"></div>\n<script>\nconst TENANT = 'boxpark';\nfunction showTab(id) {\n  document.querySelectorAll('.tab').forEach((t,i) => t.classList.toggle('active', ['dashboard','tickets','conversations','documents'][i]===id));\n  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id==='tab-'+id));\n}\nfunction bar(label,count,max,blue=false) {\n  const pct = max>0 ? Math.round((count/max)*100) : 0;\n  return '<div class=\"bar-row\"><div class=\"bar-label\"><span>'+label+'</span><span>'+count+'</span></div><div class=\"bar-track\"><div class=\"bar-fill'+(blue?' blue':'')+'\" style=\"width:'+pct+'%\"></div></div></div>';\n}\nfunction esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }\nasync function loadAnalytics() {\n  try {\n    const r = await fetch('/boxpark/analytics');\n    const a = await r.json();\n    if (a.error) { console.error(a.error); return; }\n    document.getElementById('sConvs').textContent = a.totalConvs;\n    document.getElementById('sMsgs').textContent = a.totalMessages;\n    document.getElementById('sTickets').textContent = a.openTickets;\n    document.getElementById('sDocs').textContent = a.totalDocs;\n    const tc = document.getElementById('topicsChart');\n    if (!a.topTopics.length) { tc.innerHTML='<div class=\"empty\">No data yet.</div>'; }\n    else { const max=a.topTopics[0][1]; tc.innerHTML=a.topTopics.map(([t,c])=>bar(t,c,max)).join(''); }\n    const vc = document.getElementById('vendorsChart');\n    if (!a.topVendors.length) { vc.innerHTML='<div class=\"empty\">No vendor mentions yet.</div>'; }\n    else { const max=a.topVendors[0][1]; vc.innerHTML=a.topVendors.map(([v,c])=>bar(v.charAt(0).toUpperCase()+v.slice(1),c,max,true)).join(''); }\n    const tt = document.getElementById('ticketsTable');\n    if (!a.tickets.length) { tt.innerHTML='<div class=\"empty\">No tickets yet.</div>'; }\n    else { tt.innerHTML='<table><thead><tr><th>Name</th><th>Unit</th><th>Issue</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>'+a.tickets.map(t=>'<tr><td><strong>'+esc(t.name||'')+'</strong><br><small>'+esc(t.email||'')+'</small></td><td>'+esc(t.venue||'')+'</td><td class=\"ticket-msg\">'+esc(t.issue||'')+'</td><td><span class=\"badge '+(t.status||'open')+'\">'+esc(t.status||'open')+'</span></td><td>'+new Date(t.created_at).toLocaleDateString('en-GB')+'</td><td>'+(t.status==='open'?'<button class=\"close-btn\" onclick=\"closeTicket('+t.id+')\">Close</button>':'')+'</td></tr>').join('')+'</tbody></table>'; }\n    const ct = document.getElementById('convsTable');\n    if (!a.recentConvs.length) { ct.innerHTML='<div class=\"empty\">No conversations yet.</div>'; }\n    else { ct.innerHTML='<table><thead><tr><th>User</th><th>First message</th><th>Date</th></tr></thead><tbody>'+a.recentConvs.map(c=>{const first=(c.messages||[]).find(m=>m.role==='user');return '<tr><td>'+(c.name?esc(c.name):'Unknown')+'<br><small style=\"color:var(--text-mid)\">'+esc(c.venue||'')+'</small></td><td style=\"max-width:320px\">'+esc((first?.content||'').substring(0,120))+'</td><td>'+new Date(c.created_at).toLocaleDateString('en-GB')+'</td></tr>';}).join('')+'</tbody></table>'; }\n    renderDocs(a.docs);\n  } catch(e) { console.error(e); }\n}\nfunction renderDocs(docs) {\n  const dl = document.getElementById('docList');\n  if (!docs||!docs.length) { dl.innerHTML='<div class=\"empty\">No documents uploaded yet.</div>'; return; }\n  dl.innerHTML = docs.map(function(d) {\n    var fn=esc(d.filename), date=new Date(d.created_at).toLocaleDateString('en-GB'), jsonFn=JSON.stringify(d.filename);\n    return '<div class=\"doc-item\" data-filename=\"'+fn+'\"><div class=\"doc-info\"><div class=\"doc-icon\">&#x1F4C4;</div><div><div class=\"doc-name\">'+fn+'</div><div class=\"doc-date\">Uploaded '+date+'</div></div></div><div class=\"doc-actions\"><span class=\"badge indexed\">Indexed</span><button class=\"btn-delete\" onclick=\"deleteDoc('+jsonFn+', this)\">&#x1F5D1; Delete</button></div></div>';\n  }).join('');\n}\nasync function deleteDoc(filename, btn) {\n  if (!confirm('Delete \"'+filename+'\" from the knowledge base?')) return;\n  btn.disabled=true; btn.textContent='Deleting\\u2026';\n  try {\n    const r = await fetch('/boxpark/documents?filename='+encodeURIComponent(filename), {method:'DELETE'});\n    const d = await r.json();\n    if (d.ok) { notify('\\u2713 '+filename+' deleted','green'); btn.closest('.doc-item').remove(); setTimeout(loadAnalytics,500); }\n    else { notify('Delete failed \\u2014 check Render logs','red'); btn.disabled=false; btn.textContent='\\u1F5D1 Delete'; }\n  } catch(e) { notify('Delete failed: '+e.message,'red'); btn.disabled=false; btn.textContent='\\u1F5D1 Delete'; }\n}\nasync function closeTicket(id) {\n  await fetch('/boxpark/ticket/'+id+'/close', {method:'POST'});\n  notify('Ticket closed','green'); loadAnalytics();\n}\nfunction dragOver(e){e.preventDefault();document.getElementById('dropZone').classList.add('dragging');}\nfunction dragLeave(){document.getElementById('dropZone').classList.remove('dragging');}\nfunction dropFiles(e){e.preventDefault();document.getElementById('dropZone').classList.remove('dragging');handleFiles(e.dataTransfer.files);}\nasync function handleFiles(files) {\n  for (const file of files) {\n    const item = document.createElement('div'); item.className='upload-item';\n    item.innerHTML='<div><div class=\"fname\">'+esc(file.name)+'</div><div class=\"fsize\">'+(file.size/1024).toFixed(0)+' KB</div><div class=\"progress\"><div class=\"progress-bar\" id=\"pb_'+file.name.replace(/\\W/g,'')+'\"></div></div></div><span>\\u23f3</span>';\n    document.getElementById('uploadList').appendChild(item);\n    try {\n      const text = await new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsText(file);});\n      const pb = document.getElementById('pb_'+file.name.replace(/\\W/g,''));\n      if(pb) pb.style.width='50%';\n      const r = await fetch('/boxpark/upload', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({filename:file.name, content:text})});\n      await r.json();\n      if(pb) pb.style.width='100%';\n      item.querySelector('span').textContent='\\u2705';\n      notify(file.name+' indexed!','green');\n      setTimeout(loadAnalytics,1000);\n    } catch(e) { item.querySelector('span').textContent='\\u274c'; notify('Failed: '+file.name,'red'); }\n  }\n}\nfunction notify(msg, type='') {\n  const n = document.getElementById('notify');\n  n.textContent=msg; n.className='notify '+type+' show';\n  setTimeout(()=>n.className='notify', 3500);\n}\nloadAnalytics();\n</script>\n</body>\n</html>";
const MASTER_ADMIN = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>Stacked \u2014 Master Admin</title>\n<link rel=\"icon\" href=\"https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Stacked%20(3).svg\">\n<link href=\"https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap\" rel=\"stylesheet\">\n<style>\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n:root{\n  --cream:#ede8df;--cream-dark:#e0d9ce;\n  --orange:#f04e1a;--brown:#3a2e24;--brown-mid:#6b5744;\n  --white:#ffffff;--green:#2a9d5c;--red:#d64545;--blue:#2563eb;\n  --shadow:0 2px 16px rgba(58,46,36,0.10);\n  --shadow-lg:0 8px 32px rgba(58,46,36,0.15);\n}\nbody{background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--brown);min-height:100vh}\nheader{background:var(--white);border-bottom:1px solid var(--cream-dark);padding:16px 32px;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow)}\n.header-wordmark{height:28px;object-fit:contain}\n.admin-badge{background:var(--orange);color:#fff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase}\n.master-badge{background:var(--brown);color:#fff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase}\n.container{max-width:1300px;margin:0 auto;padding:32px 24px}\n.page-title{font-family:'Fraunces',serif;font-size:28px;font-weight:700;margin-bottom:6px}\n.page-sub{font-size:14px;color:var(--brown-mid);margin-bottom:32px}\n/* \u2500\u2500 MASTER STATS \u2500\u2500 */\n.master-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:36px}\n.stat{background:var(--white);border-radius:16px;padding:20px;box-shadow:var(--shadow)}\n.stat-num{font-family:'Fraunces',serif;font-size:36px;font-weight:700;color:var(--orange)}\n.stat-label{font-size:13px;color:var(--brown-mid);margin-top:4px}\n/* \u2500\u2500 CLIENT CARDS \u2500\u2500 */\n.clients-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px;margin-bottom:36px}\n.client-card{background:var(--white);border-radius:20px;box-shadow:var(--shadow);overflow:hidden;transition:box-shadow 0.2s}\n.client-card:hover{box-shadow:var(--shadow-lg)}\n.client-header{padding:20px 24px 16px;border-bottom:1px solid var(--cream-dark);display:flex;align-items:center;justify-content:space-between}\n.client-name-row{display:flex;align-items:center;gap:10px}\n.client-dot{width:10px;height:10px;border-radius:50%;background:var(--green);flex-shrink:0}\n.client-dot.loading{background:var(--cream-dark)}\n.client-name{font-family:'Fraunces',serif;font-size:18px;font-weight:700}\n.client-slug{font-size:12px;color:var(--brown-mid);font-family:monospace;background:var(--cream);padding:2px 8px;border-radius:6px}\n.client-links{display:flex;gap:8px}\n.link-btn{font-size:12px;font-weight:600;padding:5px 12px;border-radius:8px;text-decoration:none;transition:opacity 0.15s;display:flex;align-items:center;gap:4px}\n.link-btn:hover{opacity:0.8}\n.link-btn.chat{background:var(--cream);color:var(--brown)}\n.link-btn.admin{background:var(--orange);color:#fff}\n.client-body{padding:20px 24px}\n.client-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px}\n.mini-stat{text-align:center}\n.mini-num{font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:var(--orange)}\n.mini-label{font-size:11px;color:var(--brown-mid);margin-top:2px}\n.client-divider{height:1px;background:var(--cream-dark);margin-bottom:16px}\n.recent-title{font-size:12px;font-weight:600;color:var(--brown-mid);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px}\n.recent-item{font-size:13px;padding:6px 0;border-bottom:1px solid var(--cream);display:flex;justify-content:space-between;align-items:flex-start;gap:8px}\n.recent-item:last-child{border-bottom:none}\n.recent-msg{color:var(--brown);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.recent-time{color:var(--brown-mid);font-size:11px;flex-shrink:0}\n.badge{display:inline-block;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600}\n.badge.open{background:#fff3cd;color:#856404}\n.badge.closed{background:#d1e7dd;color:#0a3622}\n.empty-card{color:var(--brown-mid);font-size:13px;text-align:center;padding:16px 0}\n/* \u2500\u2500 STACKED CLIENT (default) \u2500\u2500 */\n.client-card.stacked .client-header{background:var(--cream)}\n.client-card.stacked .mini-num{color:var(--orange)}\n/* \u2500\u2500 BOXPARK CLIENT \u2500\u2500 */\n.client-card.boxpark .client-header{background:#1e1e1e}\n.client-card.boxpark .client-name{color:#ffffff}\n.client-card.boxpark .client-slug{background:#2e2e2e;color:#aaa}\n.client-card.boxpark .client-dot{background:#E31E26}\n.client-card.boxpark .link-btn.admin{background:#E31E26}\n.client-card.boxpark .mini-num{color:#E31E26}\n/* \u2500\u2500 RECENT TICKETS TABLE \u2500\u2500 */\n.section-title{font-family:'Fraunces',serif;font-size:22px;margin-bottom:16px}\n.card{background:var(--white);border-radius:16px;padding:24px;box-shadow:var(--shadow);margin-bottom:24px}\ntable{width:100%;border-collapse:collapse;font-size:14px}\nth{text-align:left;padding:8px 12px;font-weight:600;color:var(--brown-mid);font-size:12px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid var(--cream-dark)}\ntd{padding:10px 12px;border-bottom:1px solid var(--cream-dark);vertical-align:top}\ntr:last-child td{border-bottom:none}\ntr:hover td{background:var(--cream)}\n.tenant-pill{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:var(--cream-dark);color:var(--brown)}\n.tenant-pill.boxpark{background:#1e1e1e;color:#fff}\n.loading-shimmer{background:linear-gradient(90deg,var(--cream) 25%,var(--cream-dark) 50%,var(--cream) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:6px;height:20px;width:80%}\n@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}\n</style>\n</head>\n<body>\n\n<header>\n  <img class=\"header-wordmark\" src=\"https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Stacked%20(3).svg\" alt=\"Stacked\">\n  <span class=\"admin-badge\">Admin</span>\n  <span class=\"master-badge\">&#x2605; Master</span>\n</header>\n\n<div class=\"container\">\n  <div class=\"page-title\">All clients</div>\n  <div class=\"page-sub\">Across all tenants \u2014 live data</div>\n\n  <!-- MASTER TOTALS -->\n  <div class=\"master-stats\">\n    <div class=\"stat\"><div class=\"stat-num\" id=\"totalConvs\"><div class=\"loading-shimmer\"></div></div><div class=\"stat-label\">Total conversations</div></div>\n    <div class=\"stat\"><div class=\"stat-num\" id=\"totalMsgs\"><div class=\"loading-shimmer\"></div></div><div class=\"stat-label\">Total messages</div></div>\n    <div class=\"stat\"><div class=\"stat-num\" id=\"totalTickets\"><div class=\"loading-shimmer\"></div></div><div class=\"stat-label\">Open tickets</div></div>\n    <div class=\"stat\"><div class=\"stat-num\" id=\"totalClients\">2</div><div class=\"stat-label\">Active clients</div></div>\n  </div>\n\n  <!-- CLIENT CARDS -->\n  <div class=\"clients-grid\" id=\"clientsGrid\">\n\n    <!-- STACKED (default) -->\n    <div class=\"client-card stacked\">\n      <div class=\"client-header\">\n        <div class=\"client-name-row\">\n          <div class=\"client-dot loading\" id=\"dot-stacked\"></div>\n          <div class=\"client-name\">Stacked Chat</div>\n          <span class=\"client-slug\">/</span>\n        </div>\n        <div class=\"client-links\">\n          <a class=\"link-btn chat\" href=\"/\" target=\"_blank\">&#x1F4AC; Chat</a>\n          <a class=\"link-btn admin\" href=\"/admin\" target=\"_blank\">&#x2699;&#xFE0F; Admin</a>\n        </div>\n      </div>\n      <div class=\"client-body\">\n        <div class=\"client-stats\">\n          <div class=\"mini-stat\"><div class=\"mini-num\" id=\"s-convs-stacked\">&mdash;</div><div class=\"mini-label\">Conversations</div></div>\n          <div class=\"mini-stat\"><div class=\"mini-num\" id=\"s-tickets-stacked\">&mdash;</div><div class=\"mini-label\">Open tickets</div></div>\n          <div class=\"mini-stat\"><div class=\"mini-num\" id=\"s-docs-stacked\">&mdash;</div><div class=\"mini-label\">Docs indexed</div></div>\n        </div>\n        <div class=\"client-divider\"></div>\n        <div class=\"recent-title\">Recent conversations</div>\n        <div id=\"recent-stacked\"><div class=\"empty-card\">Loading&hellip;</div></div>\n      </div>\n    </div>\n\n    <!-- BOXPARK -->\n    <div class=\"client-card boxpark\">\n      <div class=\"client-header\">\n        <div class=\"client-name-row\">\n          <div class=\"client-dot loading\" id=\"dot-boxpark\"></div>\n          <div class=\"client-name\">Boxpark</div>\n          <span class=\"client-slug\">/boxpark</span>\n        </div>\n        <div class=\"client-links\">\n          <a class=\"link-btn chat\" href=\"/boxpark\" target=\"_blank\" style=\"background:#2e2e2e;color:#fff\">&#x1F4AC; Chat</a>\n          <a class=\"link-btn admin\" href=\"/boxpark/admin\" target=\"_blank\">&#x2699;&#xFE0F; Admin</a>\n        </div>\n      </div>\n      <div class=\"client-body\">\n        <div class=\"client-stats\">\n          <div class=\"mini-stat\"><div class=\"mini-num\" id=\"s-convs-boxpark\">&mdash;</div><div class=\"mini-label\">Conversations</div></div>\n          <div class=\"mini-stat\"><div class=\"mini-num\" id=\"s-tickets-boxpark\">&mdash;</div><div class=\"mini-label\">Open tickets</div></div>\n          <div class=\"mini-stat\"><div class=\"mini-num\" id=\"s-docs-boxpark\">&mdash;</div><div class=\"mini-label\">Docs indexed</div></div>\n        </div>\n        <div class=\"client-divider\"></div>\n        <div class=\"recent-title\" style=\"color:#888\">Recent conversations</div>\n        <div id=\"recent-boxpark\"><div class=\"empty-card\" style=\"color:#666\">Loading&hellip;</div></div>\n      </div>\n    </div>\n\n  </div>\n\n  <!-- ALL OPEN TICKETS -->\n  <div class=\"section-title\">All open tickets</div>\n  <div class=\"card\">\n    <div id=\"allTickets\"><div class=\"empty-card\">Loading&hellip;</div></div>\n  </div>\n\n</div>\n\n<script>\nfunction esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}\n\nconst CLIENTS = [\n  {slug:'stacked', label:'Stacked Chat', analyticsUrl:'/analytics'},\n  {slug:'boxpark', label:'Boxpark',      analyticsUrl:'/boxpark/analytics'},\n];\n\nlet allData = {};\n\nasync function loadAll(){\n  const results = await Promise.all(CLIENTS.map(c => fetch(c.analyticsUrl).then(r=>r.json()).then(d=>({slug:c.slug,data:d})).catch(e=>({slug:c.slug,data:{error:e.message}}))));\n\n  let totalConvs=0, totalMsgs=0, totalTickets=0;\n  const allTickets = [];\n\n  results.forEach(({slug, data}) => {\n    if (data.error) { document.getElementById('dot-'+slug).style.background='var(--red)'; return; }\n    allData[slug] = data;\n    document.getElementById('dot-'+slug).classList.remove('loading');\n\n    document.getElementById('s-convs-'+slug).textContent = data.totalConvs || 0;\n    document.getElementById('s-tickets-'+slug).textContent = data.openTickets || 0;\n    document.getElementById('s-docs-'+slug).textContent = data.totalDocs || 0;\n\n    totalConvs += data.totalConvs || 0;\n    totalMsgs  += data.totalMessages || 0;\n    totalTickets += data.openTickets || 0;\n\n    // Recent convs\n    const recentEl = document.getElementById('recent-'+slug);\n    const convs = (data.recentConvs||[]).slice(0,4);\n    if (!convs.length) { recentEl.innerHTML='<div class=\"empty-card\">No conversations yet.</div>'; }\n    else {\n      recentEl.innerHTML = convs.map(c => {\n        const first = (c.messages||[]).find(m=>m.role==='user');\n        const d = new Date(c.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'});\n        return '<div class=\"recent-item\"><span class=\"recent-msg\">'+esc((first?.content||'').substring(0,55))+'</span><span class=\"recent-time\">'+d+'</span></div>';\n      }).join('');\n    }\n\n    // Collect open tickets\n    (data.tickets||[]).filter(t=>t.status==='open').forEach(t => allTickets.push({...t, _client:slug}));\n  });\n\n  document.getElementById('totalConvs').textContent = totalConvs;\n  document.getElementById('totalMsgs').textContent = totalMsgs;\n  document.getElementById('totalTickets').textContent = totalTickets;\n\n  // All open tickets table\n  const tt = document.getElementById('allTickets');\n  if (!allTickets.length) { tt.innerHTML='<div class=\"empty-card\">No open tickets across any client. &#x1F389;</div>'; }\n  else {\n    allTickets.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));\n    tt.innerHTML='<table><thead><tr><th>Client</th><th>Name</th><th>Venue</th><th>Issue</th><th>Date</th></tr></thead><tbody>'\n      + allTickets.map(t =>\n        '<tr>'\n        +'<td><span class=\"tenant-pill '+t._client+'\">'+esc(t._client)+'</span></td>'\n        +'<td><strong>'+esc(t.name||'')+'</strong><br><small>'+esc(t.email||'')+'</small></td>'\n        +'<td>'+esc(t.venue||'')+'</td>'\n        +'<td style=\"max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap\">'+esc(t.issue||'')+'</td>'\n        +'<td>'+new Date(t.created_at).toLocaleDateString('en-GB')+'</td>'\n        +'</tr>'\n      ).join('')\n      +'</tbody></table>';\n  }\n}\n\nloadAll();\n// Auto-refresh every 60 seconds\nsetInterval(loadAll, 60000);\n</script>\n</body>\n</html>";

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

async function getTenantAnalytics(tenant) {
  try {
    const enc = encodeURIComponent(tenant);
    const [convsR, ticketsR, docsR] = await Promise.all([
      sbFetch('/rest/v1/conversations?select=messages,created_at&tenant=eq.' + enc + '&order=created_at.desc&limit=200'),
      sbFetch('/rest/v1/tickets?select=id,email,name,venue,issue,status,created_at&tenant=eq.' + enc + '&order=created_at.desc&limit=50'),
      sbFetch('/rest/v1/documents?select=id,filename,created_at&tenant=eq.' + enc + '&order=created_at.desc&limit=100'),
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
    };
    const topicCounts = {};
    Object.keys(topicKeywords).forEach(topic => {
      topicCounts[topic] = 0;
      allMessages.forEach(msg => { if (topicKeywords[topic].some(kw => msg.includes(kw))) topicCounts[topic]++; });
    });
    const vendors = ['lightspeed','square','zonal','epos now','tevalis','worldpay','sumup','stripe','zettle','deputy','sevenrooms','opentable'];
    const vendorCounts = {};
    vendors.forEach(v => { vendorCounts[v] = allMessages.filter(m => m.includes(v)).length; });
    const topTopics = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).filter(([,c])=>c>0);
    const topVendors = Object.entries(vendorCounts).sort((a,b)=>b[1]-a[1]).filter(([,c])=>c>0);
    const uniqueDocs = [...new Map(docs.map(d=>[d.filename,d])).values()];
    return { totalConvs:convs.length, totalMessages:allMessages.length, openTickets:tickets.filter(t=>t.status==='open').length, totalDocs:uniqueDocs.length, topTopics, topVendors, recentConvs:convs.slice(0,10), tickets, docs:uniqueDocs };
  } catch(e) { return { error: e.message }; }
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
  <img class="header-icon" src="https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/The%20Bench%20by%20Stacked%20(1).png" alt="">
  <img class="header-wordmark" src="https://raw.githubusercontent.com/TOT-STACKED/toast-support-bot/main/assets/Stacked%20(3).svg" alt="Stacked">
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
    <div class="card" style="margin-bottom:20px">
      <h3>Add from URL</h3>
      <p style="font-size:13px;color:var(--brown-mid);margin-bottom:16px">Paste any webpage — vendor help docs, Notion pages, your own site. We'll fetch and index the content automatically.</p>
      <div style="display:flex;gap:10px;align-items:flex-start">
        <input type="text" id="urlInput" placeholder="https://support.tevalis.com/article/..." style="flex:1;padding:12px 16px;border:1.5px solid var(--cream-dark);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--brown);background:var(--cream);outline:none" onkeydown="if(event.key==='Enter')ingestUrl()">
        <button onclick="ingestUrl()" id="ingestBtn" style="padding:12px 20px;background:var(--orange);color:#fff;border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap">+ Add URL</button>
      </div>
      <div id="urlStatus" style="margin-top:10px;font-size:13px;display:none"></div>
    </div>
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
  dl.innerHTML=docs.map(function(d){
    var fn=esc(d.filename);
    var date=new Date(d.created_at).toLocaleDateString('en-GB');
    var jsonFn=JSON.stringify(d.filename);
    return '<div class=\"doc-item\" data-filename=\"'+fn+'\">'
      +'<div class=\"doc-info\">'
      +'<div class=\"doc-icon\">📄</div>'
      +'<div><div class=\"doc-name\">'+fn+'</div>'
      +'<div class=\"doc-date\">Uploaded '+date+'</div></div>'
      +'</div>'
      +'<div class=\"doc-actions\">'
      +'<span class=\"badge indexed\">Indexed</span>'
      +'<button class=\"btn-delete\" onclick=\"deleteDoc('+jsonFn+', this)\">🗑 Delete</button>'
      +'</div></div>';
  }).join('');
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

async function ingestUrl(){
  const input=document.getElementById('urlInput');
  const btn=document.getElementById('ingestBtn');
  const status=document.getElementById('urlStatus');
  const url=input.value.trim();
  if(!url||!url.startsWith('http')){status.style.display='block';status.style.color='var(--red)';status.textContent='Please enter a valid URL starting with http:// or https://';return;}
  btn.disabled=true;btn.textContent='Fetching…';
  status.style.display='block';status.style.color='var(--brown-mid)';status.textContent='Fetching and indexing '+url+'…';
  try{
    const r=await fetch('/ingest-url',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});
    const d=await r.json();
    if(d.ok){
      status.style.color='var(--green)';
      status.textContent='✓ Indexed '+d.chunks+' chunks from '+d.title+'';
      input.value='';
      notify('✓ URL indexed!','green');
      setTimeout(loadAnalytics,1000);
    } else {
      status.style.color='var(--red)';
      status.textContent='Failed: '+d.error;
    }
  }catch(e){
    status.style.color='var(--red)';
    status.textContent='Error: '+e.message;
  }
  btn.disabled=false;btn.textContent='+ Add URL';
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

  if (url === '/master' || url === '/master/') {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(MASTER_ADMIN); return;
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
      const statusCode = await new Promise((resolve, reject) => {
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
            console.log(`[DELETE] Supabase status: ${r.statusCode} body: ${d.substring(0, 200)}`);
            resolve(r.statusCode);
          });
        });
        req.on('error', reject);
        req.end();
      });
      // 204 = deleted OK, 200 = also OK
      if (statusCode === 204 || statusCode === 200) {
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ok:true, deleted: filename}));
      } else {
        console.error('[DELETE] Supabase rejected with status:', statusCode);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ok:false, error:'Supabase returned ' + statusCode + ' - check RLS policies'}));
      }
    } catch(e) {
      console.error('[DELETE] Error:', e);
      res.writeHead(500, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ok:false, error:e.message}));
    }
    return;
  }

  if (method === 'POST' && url === '/ingest-url') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { url: targetUrl } = JSON.parse(body);
        if (!targetUrl || !targetUrl.startsWith('http')) {
          res.writeHead(400, {'Content-Type':'application/json'});
          res.end(JSON.stringify({ok:false, error:'Invalid URL'})); return;
        }
        console.log('[INGEST] Fetching:', targetUrl);

        // Fetch the page
        const https = require('https');
        const http2 = require('http');
        const urlObj = new URL(targetUrl);
        const client = urlObj.protocol === 'https:' ? https : http2;

        const rawHtml = await new Promise((resolve, reject) => {
          const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; StackedBot/1.0)',
              'Accept': 'text/html,application/xhtml+xml',
            }
          };
          const r = client.request(options, (resp) => {
            // Follow redirects
            if (resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location) {
              resolve(new Promise((res2, rej2) => {
                const redirectUrl = new URL(resp.headers.location, targetUrl);
                const c2 = redirectUrl.protocol === 'https:' ? https : http2;
                c2.get(redirectUrl.href, {headers:{'User-Agent':'Mozilla/5.0 (compatible; StackedBot/1.0)'}}, (r2) => {
                  let d=''; r2.on('data', c=>d+=c); r2.on('end', ()=>res2(d));
                }).on('error', rej2);
              }));
              return;
            }
            if (resp.statusCode !== 200) { reject(new Error('HTTP ' + resp.statusCode)); return; }
            let d = '';
            resp.on('data', c => d += c);
            resp.on('end', () => resolve(d));
          });
          r.on('error', reject);
          r.end();
        });

        // Strip HTML to clean text
        const text = stripHtml(rawHtml);
        const title = extractTitle(rawHtml) || urlObj.hostname + urlObj.pathname;

        if (text.length < 100) {
          res.writeHead(200, {'Content-Type':'application/json'});
          res.end(JSON.stringify({ok:false, error:'Page returned too little content — it may require login or JavaScript'})); return;
        }

        console.log('[INGEST] Extracted', text.length, 'chars from:', title);

        // Store as chunks using URL as filename
        const filename = title.substring(0, 80) + ' [' + urlObj.hostname + ']';
        const chunks = chunkText(text, filename);
        for (const chunk of chunks) {
          await sbFetch('/rest/v1/documents', {method:'POST', body:chunk});
        }

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ok:true, chunks:chunks.length, title, filename}));
      } catch(e) {
        console.error('[INGEST] Error:', e.message);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ok:false, error:e.message}));
      }
    });
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

  // ─── BOXPARK TENANT ROUTES ────────────────────────────────────────
  if (url === '/boxpark' || url === '/boxpark/') {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(BOXPARK_CHAT); return;
  }

  if (url === '/boxpark/admin' || url === '/boxpark/admin/') {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(BOXPARK_ADMIN); return;
  }

  if (url === '/boxpark/analytics') {
    const data = await getTenantAnalytics('boxpark');
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(data)); return;
  }

  if (method === 'POST' && url === '/boxpark/chat') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { message, history = [] } = JSON.parse(body);
        let docContext = '';
        try {
          const docsR = await sbFetch('/rest/v1/documents?select=filename,content&tenant=eq.boxpark&limit=200');
          if (Array.isArray(docsR.data) && docsR.data.length > 0) {
            const msgLower = message.toLowerCase();
            const relevant = docsR.data.filter(d => msgLower.split(' ').some(w => w.length > 3 && d.content.toLowerCase().includes(w))).slice(0, 4);
            if (relevant.length > 0) {
              docContext = '\n\n=== FROM BOXPARK KNOWLEDGE BASE ===\n' + relevant.map(d => '[' + d.filename + ']\n' + d.content.substring(0, 600)).join('\n\n');
            }
          }
        } catch(e) {}
        const systemPrompt = 'You are the Boxpark tech support assistant — a direct, no-nonsense AI support bot for Boxpark vendors across Shoreditch, Croydon, Wembley, and Liverpool Street.\n\nYour personality:\n- Street smart and efficient — vendors are busy, keep it short\n- Calm during service rushes\n- British English only\n\nBoxpark context:\n- Vendors share infrastructure across multiple Boxpark sites\n- Common setups: Square, SumUp, iZettle for payments; various EPOS systems\n- WiFi is site-managed — escalate connectivity issues to Boxpark ops team\n- Boxpark ops: ops@boxpark.co.uk / 020 3409 4850\n\nAlways:\n- Give numbered steps for troubleshooting\n- Mention vendor support numbers when relevant\n- Suggest a manual fallback if the fix will not work mid-service\n- End with "Hit Raise a ticket below if this has not sorted it" for complex issues' + (docContext ? '\n\nKNOWLEDGE BASE:' + docContext : '');
        const messages = history.slice(-8).map(m => ({role:m.role, content:m.content}));
        if (!messages.length || messages[messages.length-1].content !== message) messages.push({role:'user', content:message});
        const https = require('https');
        const apiBody = JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1000, system:systemPrompt, messages});
        const apiRes = await new Promise((resolve, reject) => {
          const r = https.request({hostname:'api.anthropic.com', path:'/v1/messages', method:'POST', headers:{'Content-Type':'application/json','x-api-key':ANTHROPIC_KEY,'anthropic-version':'2023-06-01','Content-Length':Buffer.byteLength(apiBody)}}, (resp) => {
            let d = ''; resp.on('data', c => d += c); resp.on('end', () => resolve(JSON.parse(d)));
          });
          r.on('error', reject); r.write(apiBody); r.end();
        });
        const reply = apiRes.content?.[0]?.text || 'Sorry, I could not get a response. Please try again.';
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({response:reply}));
      } catch(e) {
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({response:'Server error. Please try again in a moment.'}));
      }
    });
    return;
  }

  if (method === 'POST' && url === '/boxpark/upload') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { filename, content } = JSON.parse(body);
        const chunks = chunkText(content, filename).map(c => ({...c, tenant:'boxpark'}));
        for (const chunk of chunks) await sbFetch('/rest/v1/documents', {method:'POST', body:chunk});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ok:true, chunks:chunks.length}));
      } catch(e) {
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({error:e.message}));
      }
    });
    return;
  }

  if (method === 'DELETE' && url.startsWith('/boxpark/documents')) {
    try {
      const params = new URL(url, 'http://localhost');
      const filename = params.searchParams.get('filename');
      if (!filename) { res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'No filename'})); return; }
      const https = require('https');
      const sbUrl = new URL(SUPABASE_URL + '/rest/v1/documents?filename=eq.' + encodeURIComponent(filename) + '&tenant=eq.boxpark');
      const statusCode = await new Promise((resolve, reject) => {
        const req2 = https.request({hostname:sbUrl.hostname, path:sbUrl.pathname+sbUrl.search, method:'DELETE', headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json','Prefer':'return=minimal'}}, (r) => {
          let d=''; r.on('data', c => d+=c); r.on('end', () => { console.log('[BOXPARK DELETE] status:', r.statusCode, d.substring(0,100)); resolve(r.statusCode); });
        });
        req2.on('error', reject); req2.end();
      });
      if (statusCode === 204 || statusCode === 200) {
        res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:true, deleted:filename}));
      } else {
        res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false, error:'Supabase returned '+statusCode}));
      }
    } catch(e) { res.writeHead(500, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:e.message})); }
    return;
  }

  if (method === 'POST' && url.startsWith('/boxpark/ticket/') && url.endsWith('/close')) {
    const id = url.split('/')[3];
    await sbFetch('/rest/v1/tickets?id=eq.' + id, {method:'PATCH', body:{status:'closed'}});
    res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:true})); return;
  }

  res.writeHead(404); res.end('Not found');
});

function stripHtml(html) {
  // Remove scripts, styles, nav, footer, header tags and their contents
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ' ')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, ' ')
    // Convert block elements to newlines for readability
    .replace(/<\/?(p|div|h[1-6]|li|tr|br|section|article)[^>]*>/gi, '\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, ' ')
    // Decode common HTML entities
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, ' ')
    // Collapse whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim().replace(/[^a-zA-Z0-9 \-_.,]/g, ' ').replace(/\s+/g,' ').trim() : null;
}

function chunkText(text, filename) {
  const chunkSize = 1200;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push({filename, content:text.substring(i, i+chunkSize), chunk_index:chunks.length});
  }
  return chunks;
}

server.listen(PORT, () => console.log(`Stacked Chat server running on port ${PORT}`));
