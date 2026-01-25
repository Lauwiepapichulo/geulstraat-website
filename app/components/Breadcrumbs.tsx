import Link from 'next/link'
import {ChevronRight, Home} from 'lucide-react'
import {cn} from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({items, className}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("py-4", className)}>
      <ol className="flex items-center space-x-2 text-sm md:text-base">
        {items[0]?.href !== '/' && (
          <li>
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {(index > 0 || items[0]?.href !== '/') && (
              <ChevronRight className="h-4 w-4 text-white/60" aria-hidden="true" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
