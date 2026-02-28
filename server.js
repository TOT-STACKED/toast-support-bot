const http = require('http');

const KNOWLEDGE_BASE = `
=== EPOS TROUBLESHOOTING ===

EPOS SYSTEM CRASHES / NOT RESPONDING:
- First: Don't panic. A controlled restart resolves ~70% of EPOS issues.
- Step 1: Close all open tabs/bills first if possible to avoid data loss.
- Step 2: Perform a soft restart — go to system settings and choose "Restart" rather than holding the power button.
- Step 3: If unresponsive, hold power for 10 seconds for a hard reset.
- Step 4: On restart, wait 2-3 minutes for all services to load before opening the app.
- Step 5: If the issue persists, check if the EPOS software has a pending update.
- Prevention: Enable automatic restarts during off-peak hours (e.g., 3am nightly).

EPOS WON'T CONNECT TO NETWORK:
- Check physical ethernet cable if wired — swap the cable first.
- For WiFi-connected EPOS: forget the network and reconnect.
- Confirm the EPOS IP address hasn't changed — many systems need a static IP.
- Check if your payment terminal and EPOS are on the same VLAN/subnet.

RECEIPT PRINTER NOT PRINTING:
- Check paper roll — thermal paper has a shiny side that must face the print head.
- Print a test page from the printer's button.
- In EPOS settings, confirm the printer IP or port hasn't changed.
- Check paper isn't jammed — open the cover fully and remove all paper before reloading.

EPOS RUNNING SLOWLY:
- Clear the cache in settings.
- Check available storage — if under 10% free, performance degrades.
- Close all background apps except the EPOS app.
- If cloud-based EPOS: check your internet connection speed (minimum 10Mbps).

STAFF CAN'T LOGIN TO EPOS:
- Confirm the PIN/code is correct — ask manager to reset in back office.
- Check if the staff member's account is active.
- For manager lockout: most systems have a master reset PIN in your setup email.

KITCHEN DISPLAY / PRINTER NOT RECEIVING ORDERS:
- Check the physical connection first.
- In EPOS back office, verify the order routing rules.
- Restart both the EPOS terminal and the KDS/printer.
- Check the KDS app hasn't crashed — force-close and reopen.

=== WIFI & CONNECTIVITY ===

WIFI DROPPING ACROSS THE VENUE:
- Identify whether it's one device or all devices.
- Restart the router and all access points — unplug for 30 seconds.
- Check ISP line status.
- Critical systems should be on 5GHz where possible.
- Check for interference: microwaves, baby monitors cause 2.4GHz congestion.

EPOS LOSING WIFI MID-SERVICE:
- Assign static IPs to all critical devices.
- Add a DHCP reservation for each device's MAC address in your router admin panel.
- Consider a dedicated VLAN for POS systems.

SLOW INTERNET AFFECTING CLOUD SYSTEMS:
- Run a speed test — minimum 10Mbps for cloud POS, 25Mbps+ recommended.
- Separate guest WiFi from your business network.
- Consider a 4G/5G failover router as backup.

=== PAYMENT TERMINAL TROUBLESHOOTING ===

CARD TERMINAL SHOWING OFFLINE:
- Check the SIM card is seated properly (for 4G terminals).
- For WiFi terminals: reconnect to WiFi in terminal settings.
- Restart the terminal — hold power for 5 seconds.
- Check if your payment processor has an outage.
- Run the Connection Test in the settings menu.

CARD PAYMENTS DECLINING:
- Ask customer to try a different card.
- Check terminal shows correct date/time.
- Verify your merchant account is active.
- Try a manual card entry to rule out chip/contactless issues.

CONTACTLESS NOT WORKING:
- Check contactless limit — standard £100 in UK.
- Ask customer to insert card instead.
- On most terminals: Settings > Contactless > Reset/Enable Contactless.

TERMINAL AND EPOS NOT INTEGRATING:
- Check they're on the same network/subnet.
- Verify the correct IP address or payment terminal ID in EPOS settings.
- Restart both devices after any configuration changes.

=== GENERAL BEST PRACTICE ===

BEFORE CALLING SUPPORT:
1. Document the exact error message and when it started.
2. Try a restart — solves 70% of issues.
3. Check if others are affected.
4. Check your internet connection.
5. Check the vendor's status page for known outages.

RESILIENCE PLAN:
- Keep a manual backup process for taking orders.
- Save your payment provider's emergency number in your phone.
- Keep a break-glass document with all system credentials somewhere offline.
- Have a 4G mobile hotspot as internet backup.
`;

const SYSTEM_PROMPT = `You are the Tech on Toast Operator Support Bot — a knowledgeable, straight-talking assistant for hospitality operators having tech problems.

Your job is to help operators fix their tech issues quickly and clearly. Be direct, practical and reassuring. Operators are often stressed when they contact you.

Use the following knowledge base to answer questions. If the question isn't covered, use your general knowledge about hospitality tech but say so.

FORMAT RULES:
- Use clear numbered steps for troubleshooting sequences
- Bold key terms using **bold**
- Keep responses focused and actionable
- Add a "Sources:" line at the end citing which sections you used
- If it's an emergency, lead with the fastest fix first

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;

const server = http.createServer(async (req, res) => {
  // CORS headers on every response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { messages } = JSON.parse(body);

        if (!process.env.ANTHROPIC_API_KEY) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'API key not configured' }));
          return;
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: messages.slice(-10)
          })
        });

        const data = await response.json();

        if (!response.ok) {
          res.writeHead(response.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: data.error?.message || 'API error' }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: data.content[0].text }));

      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Toast Bot server running on port ${PORT}`);
});
