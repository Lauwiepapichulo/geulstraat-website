import type { Metadata } from "next";
import { Inter, Merriweather, Nunito } from 'next/font/google'
import "./globals.css";
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import { Analytics } from '@vercel/analytics/react'
import {client} from '@/lib/sanity.client'
import imageUrlBuilder from '@sanity/image-url'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-playful',
  display: 'swap',
})

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  description,
  logo {
    asset-> {
      _id,
      url
    },
    alt
  }
}`

const navigationQuery = `*[_type == "navigation"][0] {
  title,
  items[] {
    _key,
    title,
    linkType,
    page-> {
      slug {
        current
      }
    },
    externalUrl,
    customSlug,
    children[] {
      _key,
      title,
      linkType,
      page-> {
        slug {
          current
        }
      },
      externalUrl,
      customSlug,
      children[] {
        _key,
        title,
        linkType,
        page-> {
          slug {
            current
          }
        },
        externalUrl,
        customSlug
      }
    }
  }
}`

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await client.fetch(siteSettingsQuery).catch(() => null)
  
  return {
    title: siteSettings?.title || "Buurtplatform - Blijf op de hoogte",
    description: siteSettings?.description || "Het digitale platform voor onze buurt. Nieuws, buurt acties en meer.",
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, navigation] = await Promise.all([
    client.fetch(siteSettingsQuery).catch(() => null),
    client.fetch(navigationQuery).catch(() => null),
  ])
  
  const logoUrl = siteSettings?.logo?.asset?.url 
    ? urlFor(siteSettings.logo).width(120).height(120).url()
    : undefined

  // Check if navigation has items
  const hasNavigation = navigation?.items && navigation.items.length > 0

  return (
    <html lang="nl" className={`${inter.variable} ${merriweather.variable} ${nunito.variable}`}>
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <Navbar 
          logoUrl={logoUrl}
          siteName={siteSettings?.title || "De Geulstraat"}
        />
        <div className="flex-1 flex">
          {hasNavigation && <Sidebar navigation={navigation} />}
          <main className="flex-1">{children}</main>
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
