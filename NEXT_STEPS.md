# 🚀 Ready to Launch!

Your Buurtplatform is built and ready. Follow these steps:

## Step 1: Create Sanity Project (YOU NEED TO DO THIS)

**This is the only manual step required:**

1. **Open this link:** [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. **Sign up** or log in (free account)
3. Click **"Create project"**
4. Choose these settings:
   - **Name:** Buurtplatform (or your neighborhood name)
   - **Plan:** Free
   - **Dataset:** production
5. **COPY YOUR PROJECT ID** - it looks like: `abc123xyz`

## Step 2: Configure Your Project

Once you have your Project ID:

1. Create a file named `.env.local` in the `buurtplatform` folder
2. Copy this into it:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=paste-your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

3. Replace `paste-your-project-id-here` with your actual Project ID

## Step 3: Start the Server

Open terminal in the `buurtplatform` folder and run:

```bash
npm run dev
```

## Step 4: Test Your Site

1. **Frontend:** http://localhost:3000
2. **Admin Studio:** http://localhost:3000/studio

## What to Expect

- **Frontend will be empty** - that's normal! You haven't added content yet
- **Studio login** - Use your Sanity account credentials
- **Dutch interface** - Everything in the Studio is in Dutch
- **Welcome screen** - You'll see "Welkom mama, wat wil je vandaag doen?"

## Step 5: Add Your First Content

In the Studio:

1. **News Post:**
   - Communicatie → Nieuwsberichten → "+" button
   - Add title, date, image, and text
   - Click "Publiceren"

2. **Event:**
   - Communicatie → Agenda → "+" button
   - Add event details
   - Click "Publiceren"

3. **Photo Album:**
   - Media → Fotoalbums → "+" button
   - Drag and drop photos
   - Click "Publiceren"

## Need Help?

- Check `SETUP.md` for detailed instructions
- Check `ADMIN_GUIDE.md` for how to use the CMS
- All documentation is in Dutch for admins

## 🎉 You're Almost There!

Just create that Sanity project and you're ready to go!
