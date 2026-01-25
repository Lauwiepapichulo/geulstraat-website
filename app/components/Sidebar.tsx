'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'
import {ChevronRight, ChevronDown, Menu, X} from 'lucide-react'
import {motion, AnimatePresence} from 'framer-motion'

interface NavItem {
  _key: string
  title: string
  linkType: 'page' | 'external' | 'none'
  page?: {
    slug?: {
      current: string
    }
  }
  externalUrl?: string
  customSlug?: string
  children?: NavItem[]
}

interface SidebarProps {
  navigation: {
    title: string
    items: NavItem[]
  } | null
}

function getItemUrl(item: NavItem): string | null {
  if (item.linkType === 'none') return null
  if (item.linkType === 'external') return item.externalUrl || null
  if (item.customSlug) return item.customSlug
  if (item.page?.slug?.current) return `/${item.page.slug.current}`
  return null
}

function NavItemComponent({ 
  item, 
  depth = 0,
  pathname 
}: { 
  item: NavItem
  depth?: number
  pathname: string
}) {
  const [isOpen, setIsOpen] = useState(true)
  const hasChildren = item.children && item.children.length > 0
  const url = getItemUrl(item)
  const isActive = url ? pathname === url || pathname.startsWith(url + '/') : false
  const isExternal = item.linkType === 'external'

  const paddingLeft = depth * 16 + 16

  const content = (
    <div
      className={`
        flex items-center justify-between py-2 px-4 rounded-lg transition-colors cursor-pointer
        ${isActive 
          ? 'bg-emerald-50 text-emerald-700 font-medium' 
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={() => hasChildren && setIsOpen(!isOpen)}
    >
      <span className="flex items-center gap-2 text-sm">
        {item.title}
        {isExternal && (
          <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </span>
      {hasChildren && (
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </motion.div>
      )}
    </div>
  )

  return (
    <div>
      {url ? (
        <Link 
          href={url}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {content}
        </Link>
      ) : (
        content
      )}
      
      {hasChildren && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-l-2 border-slate-200 ml-6">
                {item.children!.map((child) => (
                  <NavItemComponent
                    key={child._key}
                    item={child}
                    depth={depth + 1}
                    pathname={pathname}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default function Sidebar({ navigation }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!navigation || !navigation.items || navigation.items.length === 0) {
    return null
  }

  const sidebarContent = (
    <nav className="py-4">
      <div className="space-y-1">
        {navigation.items.map((item) => (
          <NavItemComponent
            key={item._key}
            item={item}
            pathname={pathname}
          />
        ))}
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
        aria-label={mobileOpen ? 'Sluit navigatie' : 'Open navigatie'}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl overflow-y-auto"
            >
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">{navigation.title}</h2>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 bg-white overflow-y-auto sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
            {navigation.title}
          </h2>
        </div>
        {sidebarContent}
      </aside>
    </>
  )
}
