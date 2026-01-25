# Buurtplatform Setup Guide

This guide will help you get the Buurtplatform up and running.

## Step 1: Install Dependencies

```bash
cd buurtplatform
npm install
```

## Step 2: Create a Sanity Project

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Click "Create project"
3. Choose a name (e.g., "Buurtplatform")
4. Select the free plan
5. Choose "production" as your dataset name
6. Copy your **Project ID** (you'll need this next)

## Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Sanity credentials:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc123def  # Your project ID from step 2
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

3. Save the file

## Step 4: Update Sanity Config

Edit `studio/sanity.config.ts` and verify the project ID is being read from environment variables (it should be by default).

## Step 5: Start the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

## Step 6: Access Sanity Studio

1. Open [http://localhost:3000/studio](http://localhost:3000/studio)
2. Sign in with your Sanity account
3. You'll see the "Welkom" dashboard

## Step 7: Add Your First Content

### Create a News Post

1. In the studio, click "Communicatie" → "Nieuwsberichten"
2. Click the "+" button or "Create" (Aanmaken)
3. Fill in:
   - **Titel**: "Welkom op het Buurtplatform!"
   - **Publicatiedatum**: Today's date
   - **Hoofdfoto**: Upload a photo
   - **Korte samenvatting**: "We zijn blij om dit nieuwe platform te lanceren"
   - **Inhoud**: Write your welcome message
4. Click "Publish" (Publiceren)
5. Go to [http://localhost:3000](http://localhost:3000) to see your post!

### Create an Event

1. Click "Communicatie" → "Agenda"
2. Click "Create"
3. Fill in event details
4. If you want signup, create a form at [Tally.so](https://tally.so) and paste the link
5. Publish

### Create a Photo Album

1. Click "Media" → "Fotoalbums"
2. Click "Create"
3. Add title, date, and cover image
4. Drag and drop multiple photos into the "Foto's" field
5. Reorder by dragging
6. Publish

### Add Team Members

1. Click "Informatie" → "Wie zijn wij"
2. Add board members with photos and bios
3. Toggle "Toon telefoonnummer" if you want to show phone numbers

## Step 8: Customize Content

### Add a Hero Image

1. Replace `/public/hero-image.jpg` with your own neighborhood photo
2. Recommended size: 1920x1080px or larger
3. The image will automatically be optimized by Next.js

### Edit the History Page

1. In Sanity Studio, go to "Informatie" → "Vaste pagina's"
2. Create a new page with slug "geschiedenis"
3. Add content about your neighborhood's history
4. Publish

## Step 9: Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
6. Click "Deploy"

Your site will be live at `your-project.vercel.app`!

## Step 10: Configure Sanity CORS

After deploying, you need to allow your production domain to access Sanity:

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to "API" → "CORS Origins"
4. Click "Add CORS origin"
5. Add your Vercel URL: `https://your-project.vercel.app`
6. Check "Allow credentials"
7. Save

Now your production site can fetch data from Sanity!

## Troubleshooting

### "Project ID not found"
- Make sure `.env.local` exists and has the correct project ID
- Restart the dev server after changing environment variables

### Images not loading
- Check that the Sanity CDN hostname is in `next.config.ts`
- Verify images are published in Sanity Studio

### Studio not loading
- Clear browser cache
- Check that `/studio` route exists in `app/studio/[[...tool]]/page.tsx`

### Build errors
- Run `npm run build` locally to test
- Check for TypeScript errors with `npm run lint`

## Need Help?

- Check the main [README.md](./README.md)
- Visit [Sanity Documentation](https://www.sanity.io/docs)
- Visit [Next.js Documentation](https://nextjs.org/docs)

## Next Steps

1. Customize colors in `app/globals.css`
2. Add your neighborhood name to the navbar
3. Create content in Sanity Studio
4. Share the site with your community!
5. Train admins using the dashboard help widget

Enjoy your new neighborhood platform! 🏘️
