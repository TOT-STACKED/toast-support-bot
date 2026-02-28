# 🍞 Tech on Toast — Operator Support Bot

## What's in here

- `server.js` — Node.js backend that holds your API key securely
- `index.html` — Frontend that anyone can use (no API key needed)
- `package.json` — Dependencies

---

## Deploy in 10 minutes (Railway — free tier)

### Step 1: Push to GitHub
1. Create a new GitHub repo (private is fine)
2. Upload `server.js` and `package.json` to it

### Step 2: Deploy server on Railway
1. Go to [railway.app](https://railway.app) and sign up (free)
2. Click **New Project → Deploy from GitHub repo**
3. Select your repo
4. Once deployed, go to **Variables** and add:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
5. Railway will give you a URL like `https://toast-bot-xxx.railway.app`

### Step 3: Update the frontend
In `index.html`, find this line and replace with your Railway URL:
```js
const API_URL = ... 'https://YOUR-SERVER-URL.railway.app';
```

### Step 4: Host the frontend
Drag `index.html` to [netlify.com/drop](https://app.netlify.com/drop) — takes 10 seconds, gives you a shareable URL.

---

## Share with colleagues
Send them the Netlify URL. That's it. No API key needed — it's all handled on the server.

---

## Local development
```bash
npm install
ANTHROPIC_API_KEY=sk-ant-your-key node server.js
```
Then open `index.html` in your browser.
