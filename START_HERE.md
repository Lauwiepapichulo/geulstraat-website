# 🚀 START HERE - Buurtplatform

## ✅ What's Ready

Your Buurtplatform is **fully built** and ready to use! All code is in place.

## 📋 Before You Start

You need **ONE thing** from Sanity.io:

### Get Your Sanity Project ID

1. Go to: **https://www.sanity.io/manage**
2. Sign up (free) or log in
3. Click **"Create project"**
4. Settings:
   - Name: "Buurtplatform" (or your choice)
   - Plan: **Free**
   - Dataset: **production**
5. **COPY THE PROJECT ID** (looks like: `abc123xyz`)

## 🔧 Setup (2 minutes)

### Step 1: Create Environment File

Create a file named `.env.local` in this folder with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=paste-your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

Replace `paste-your-project-id-here` with your actual Project ID from above.

### Step 2: Start the Server

Open terminal in this folder and run:

```bash
npm run dev
```

Wait for "Ready in X seconds" message.

## 🎉 Access Your Site

- **Frontend**: http://localhost:3000
- **Admin (Studio)**: http://localhost:3000/studio

## 👉 First Steps

1. Go to http://localhost:3000/studio
2. Log in with your Sanity account
3. You'll see "Welkom mama, wat wil je vandaag doen?" (Dutch interface)
4. Click **"Communicatie"** → **"Nieuwsberichten"**
5. Click the **"+"** button
6. Add your first news post
7. Click **"Publiceren"**
8. Go to http://localhost:3000 to see it!

## 📚 Need Help?

- **SETUP.md** - Detailed setup guide
- **ADMIN_GUIDE.md** - How to use the CMS (in Dutch)
- **README.md** - Full documentation

## ⚠️ Common Issues

**"Module not found" errors?**
- Run: `npm install --legacy-peer-deps`

**Port 3000 already in use?**
- Run: `npm run dev -- -p 3001` (uses port 3001 instead)

**Can't access /studio?**
- Make sure you created the `.env.local` file
- Restart the dev server after creating it

## 🎯 You're Almost There!

Just get that Sanity Project ID and you're ready to go! 🚀

---

Questions? Check the documentation files or let me know!
