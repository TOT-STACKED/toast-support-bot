const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const KNOWLEDGE_BASE = `
=== EPOS TROUBLESHOOTING ===

EPOS SYSTEM CRASHES / NOT RESPONDING:
- First: Don't panic. A controlled restart resolves ~70% of EPOS issues.
- Step 1: Close all open tabs/bills first if possible to avoid data loss.
- Step 2: Perform a soft restart — go to system settings and choose "Restart" rather than holding the power button.
- Step 3: If unresponsive, hold power for 10 seconds for a hard reset.
- Step 4: On restart, wait 2-3 minutes for all services to load before opening the app.
- Step 5: If the issue persists, check if the EPOS software has a pending update — many crashes are caused by outdated software.
- Common cause: Running too many background apps on the device, or a corrupted session file.
- Prevention: Enable automatic restarts during off-peak hours (e.g., 3am nightly).

EPOS WON'T CONNECT TO NETWORK:
- Check physical ethernet cable if wired — swap the cable first (cables fail more than ports).
- For WiFi-connected EPOS: forget the network and reconnect.
- Check if the router/switch has rebooted and the EPOS needs a fresh DHCP lease — restart the EPOS.
- Confirm the EPOS IP address hasn't changed — many systems need a static IP assigned in your router settings.
- Check if your payment terminal and EPOS are on the same VLAN/subnet.

RECEIPT PRINTER NOT PRINTING:
- Check paper roll — is it loaded the right way? Thermal paper has a shiny side that must face the print head.
- Check the USB or network cable connection.
- Print a test page from the printer's button (usually hold feed button on power-on).
- In EPOS settings, confirm the printer IP or port hasn't changed.
- If networked: ping the printer IP from another device to confirm it's online.
- For USB printers: try a different USB port, or reinstall the printer driver.
- Check paper isn't jammed — open the cover fully and remove all paper before reloading.

EPOS RUNNING SLOWLY:
- Clear the cache: most modern EPOS systems have a "Clear Cache" option in settings.
- Check available storage — if device storage is under 10% free, performance degrades significantly.
- Restart the device during a quiet period.
- Check if there are multiple apps running in the background — close everything except the EPOS app.
- If cloud-based EPOS: check your internet connection speed (you need minimum 10Mbps stable for most systems).

STAFF CAN'T LOGIN TO EPOS:
- Confirm the PIN/code is correct — ask manager to reset in back office.
- Check if the staff member's account is active (not accidentally deactivated).
- If using NFC/fob login: check the fob is paired to the correct staff profile.
- For manager lockout: most systems have a master reset PIN documented in your initial setup email.
- Cloud systems: check if there's an account sync issue — log out and back in on the admin portal.

KITCHEN DISPLAY / PRINTER NOT RECEIVING ORDERS:
- Check the physical connection first (USB/Ethernet to KDS or printer).
- In EPOS back office, verify the order routing rules — confirm the correct menu categories are routed to the kitchen.
- Restart both the EPOS terminal and the KDS/printer.
- Check the KDS app itself — it may have crashed. Force-close and reopen.
- If orders were going through and suddenly stopped: check for a software update that may have reset routing settings.

END OF DAY REPORTS NOT GENERATING:
- Ensure all open tables/tabs are closed before running end of day.
- Check you have the correct manager permissions to run reports.
- If report shows blank data: check the date range is set correctly.
- For cloud EPOS: wait 5 minutes and try again — sometimes a sync delay causes this.
- Export to CSV as a backup if the in-app report is broken.

=== WIFI & CONNECTIVITY ===

WIFI DROPPING ACROSS THE VENUE:
- First: identify whether it's one device or all devices. If all: it's the router/ISP. If one: it's that device.
- Restart the router and all access points (APs) — unplug for 30 seconds, not just restart.
- Check ISP line status — call your provider or check their status page.
- If you have multiple access points, check if they're on the same channel causing interference — use auto-channel selection.
- 2.4GHz vs 5GHz: 2.4GHz travels further but is slower; 5GHz is faster but shorter range. Critical systems (EPOS, payments) should be on 5GHz where possible.
- Check for interference: microwaves, baby monitors, and neighbouring WiFi networks all cause 2.4GHz congestion.
- Ensure your router/AP firmware is up to date.

EPOS/SYSTEMS LOSING WIFI MID-SERVICE:
- This is almost always a DHCP lease issue or channel congestion.
- Assign static IPs to all critical devices (EPOS terminals, KDS, printers) — this prevents them losing their IP address when the lease expires.
- How to set static IP: Go to your router admin panel (usually 192.168.1.1), find DHCP settings, and add a "DHCP reservation" for each device's MAC address.
- Ensure your router's DHCP pool is large enough for all connected devices.
- Consider a dedicated VLAN for POS systems — separates it from guest WiFi traffic.

SLOW INTERNET AFFECTING CLOUD SYSTEMS:
- Run a speed test (speedtest.net) — you need minimum 10Mbps for cloud POS systems, 25Mbps+ recommended for busy venues.
- Check if guest WiFi is on the same connection — bandwidth-hungry guests can kill your system performance.
- Best practice: separate network for business systems vs guest WiFi using a dual-WAN router or VLANs.
- Consider a 4G/5G failover router as backup for when your main connection drops.
- Schedule large updates and backups overnight to avoid daytime bandwidth usage.

=== PAYMENT TERMINAL TROUBLESHOOTING ===

CARD TERMINAL SHOWING OFFLINE:
- Check the SIM card is seated properly (for 4G/cellular terminals).
- For WiFi terminals: reconnect to WiFi in terminal settings.
- For countertop terminals: check the ethernet cable.
- Restart the terminal — hold power for 5 seconds, full restart.
- Check if your payment processor is experiencing an outage — visit their status page.
- Most terminals have a "Connection Test" in the settings menu — run this to diagnose.
- If persistent: contact your acquirer/payment provider helpline.

CARD PAYMENTS DECLINING WHEN THEY SHOULDN'T:
- Ask customer to try a different card — if their card specifically fails, it's a bank issue not yours.
- Check terminal shows correct date/time — a wrong date causes authentication failures.
- Verify your merchant account is active and hasn't been suspended.
- Check the terminal software is up to date — outdated firmware causes decline issues.
- Try a manual card entry (keyed transaction) to rule out chip/contactless issues.

CONTACTLESS NOT WORKING:
- Check contactless limit — standard limit is £100 in UK, but can vary.
- Ask customer to insert card instead — if chip works, the contactless antenna may need a software reset.
- On most terminals: Settings > Contactless > Reset/Enable Contactless.

TERMINAL AND EPOS NOT INTEGRATING:
- Check they're on the same network/subnet.
- Verify the integration is configured with the correct IP address or payment terminal ID.
- In EPOS settings, look for "Payment Integration" or "Card Terminal Settings" — re-enter the terminal details.
- Restart both devices after making any configuration changes.

=== GENERAL BEST PRACTICE ===

BEFORE CALLING SUPPORT:
1. Document the exact error message and when it started.
2. Try a restart — solves 70% of issues.
3. Check if others are affected (one device vs all devices narrows the problem significantly).
4. Check your internet connection.
5. Check the vendor's status page for known outages.

RESILIENCE PLAN:
- Keep a manual backup process for taking orders.
- Save your payment provider's emergency number in your phone.
- Keep a "break glass" document with all system login credentials somewhere secure and offline.
- Have a 4G mobile hotspot as internet backup.
`;

const SYSTEM_PROMPT = `You are the Tech on Toast Operator Support Bot — a knowledgeable, straight-talking assistant for hospitality operators having tech problems.

Your job is to help operators fix their tech issues quickly and clearly, especially during busy service periods. Be direct, practical and reassuring.

Use the following knowledge base to answer questions. If the question isn't covered, use your general knowledge about hospitality tech but say so.

FORMAT RULES:
- Use clear numbered steps for troubleshooting sequences
- Bold key terms using **bold**
- Keep responses focused and actionable
- Add a "Sources:" line at the end citing which knowledge base sections you used
- If it's an emergency (mid-service crisis), lead with the fastest fix first

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;

app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  try {
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
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    res.json({ content: data.content[0].text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Toast Bot server running on port ${PORT}`));
