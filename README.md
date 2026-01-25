# Buurtplatform - Multi-Generational Neighborhood Platform

A modern, accessible neighborhood platform built with Next.js 15 and Sanity CMS. Designed to serve all ages from high school students to seniors, with a "mother-proof" admin interface.

## 🎯 Features

- **Modern Frontend**: Clean, contemporary design appealing to all ages
- **Accessible**: WCAG AA compliant with good typography and color contrast
- **Senior-Friendly Admin**: Simplified Dutch interface with auto-generated slugs
- **News & Events**: Manage neighborhood news and upcoming events
- **Photo Galleries**: Beautiful lightbox galleries with swipe support
- **Team Profiles**: Showcase board members and volunteers
- **Tally Integration**: Easy event signup forms
- **Analytics**: Cookie-free Vercel Analytics (AVG-compliant)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Sanity account (free at [sanity.io](https://www.sanity.io))

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd buurtplatform
   npm install
   ```

2. **Set up Sanity**:
   - Create a new project at [sanity.io/manage](https://www.sanity.io/manage)
   - Copy your Project ID and Dataset name
   - Create a `.env.local` file (see `.env.local.example`)
   - Add your Sanity credentials:
     ```
     NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
     NEXT_PUBLIC_SANITY_DATASET=production
     ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## 📁 Project Structure

```
buurtplatform/
├── app/                      # Next.js App Router
│   ├── components/          # Reusable React components
│   ├── agenda/              # Events pages
│   ├── fotos/               # Photo galleries
│   ├── nieuws/              # News pages
│   ├── wie-zijn-wij/        # Team page
│   ├── geschiedenis/        # History page
│   └── studio/              # Sanity Studio route
├── studio/                   # Sanity CMS configuration
│   ├── schemaTypes/         # Content schemas (Dutch)
│   ├── structure/           # Custom desk structure
│   └── components/          # Dashboard widgets
├── lib/                      # Utilities
│   └── sanity.client.ts     # Sanity client setup
└── public/                   # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: #2E7D32 (Dark green - community/nature)
- **Accent**: #F57C00 (Vibrant orange - call-to-action)
- **Background**: #FAFAFA (Broken white - easier on eyes)
- **Text**: #111111 (High contrast black)

### Typography
- Base font size: 16px (1rem)
- Responsive scaling for all devices
- System font stack for optimal performance

### Accessibility
- WCAG AA compliant minimum
- 44x44px minimum touch targets
- Clear focus states
- Semantic HTML
- Screen reader friendly

## 📝 Content Management

### Sanity Studio (Admin Interface)

Access the admin at `/studio`. All labels and descriptions are in Dutch.

**Key Features**:
- Automatic slug generation (no manual URL editing needed)
- Simple, task-oriented menu structure
- Media library for photo reuse
- Help widget with video tutorials
- No technical jargon

**Content Types**:
1. **Nieuwsberichten** (News Posts)
2. **Agenda** (Events) - with Tally form integration
3. **Fotoalbums** (Photo Galleries)
4. **Wie zijn wij** (Team Members)
5. **Vaste pagina's** (Static Pages)

### Adding Content

#### News Post
1. Go to "Communicatie" → "Nieuwsberichten"
2. Click "Create" (Aanmaken)
3. Fill in title, date, image, and content
4. Click "Publish" (Publiceren)

#### Event with Signup
1. Go to "Communicatie" → "Agenda"
2. Add event details
3. Paste Tally form link in "Link naar inschrijfformulier"
4. Publish

#### Photo Album
1. Go to "Media" → "Fotoalbums"
2. Add title and date
3. Select cover image
4. Drag and drop multiple photos
5. Reorder by dragging
6. Publish

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token-for-preview
```

### Deployment

#### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

The `/studio` route will automatically work on your production domain.

#### Other Platforms

Ensure:
- Node.js 18+ runtime
- Build command: `npm run build`
- Output directory: `.next`
- Environment variables are set

## 🎯 Key Features Explained

### Auto-filtering Events
Past events are automatically hidden from the main agenda page but accessible in the archive. No manual management needed!

### Lightbox Gallery
Click any photo to open a full-screen lightbox with:
- Zoom functionality
- Swipe navigation (mobile-friendly)
- Keyboard controls
- Smooth transitions

### Tally Forms
Simply paste a Tally form URL in an event's signup link field. A prominent "Schrijf je in" button appears automatically.

### Cookie-free Analytics
Vercel Analytics tracks visitors without cookies, making it AVG/GDPR compliant without annoying cookie banners.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding a New Page

1. Create file in `app/your-page/page.tsx`
2. Add to navigation in `app/components/Navbar.tsx`
3. Create Sanity schema if needed in `studio/schemaTypes/`

## 📚 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **CMS**: Sanity.io
- **Icons**: Lucide React
- **Lightbox**: Yet Another React Lightbox
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## 🤝 Contributing

This is a community project. To contribute:

1. Test changes locally
2. Ensure accessibility standards are met
3. Keep the admin interface simple and in Dutch
4. Maintain the multi-generational design approach

## 📄 License

This project is open source and available for community use.

## 🆘 Support

For help:
1. Check the dashboard "Hulp nodig?" section in `/studio`
2. Contact the technical administrator
3. Refer to this README

## 🎉 Credits

Built with ❤️ for the community, by the community.
