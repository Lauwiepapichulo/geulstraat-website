import {useDocumentOperation} from 'sanity'
import {ArchiveIcon, UndoIcon} from '@sanity/icons'

// Archiveer actie - zet isArchived op true
export function ArchiveAction(props: any) {
  const {id, type, draft, published, onComplete} = props
  const {patch, publish} = useDocumentOperation(id, type)
  
  const doc = draft || published
  const isArchived = doc?.isArchived === true

  // Toon alleen voor documenten die archiveerbaar zijn
  if (!doc) return null

  if (isArchived) {
    // Document is al gearchiveerd - toon "Herstellen" actie
    return {
      label: 'Terughalen',
      title: 'Terughalen uit archief',
      icon: UndoIcon,
      tone: 'positive',
      shortcut: 'Ctrl+Shift+R',
      onHandle: async () => {
        patch.execute([{set: {isArchived: false}}])
        
        // Auto-publish na patch
        setTimeout(() => {
          publish.execute()
          onComplete()
        }, 100)
      },
    }
  }

  // Document is actief - toon "Archiveren" actie
  return {
    label: 'Archiveren',
    title: 'Verplaats naar archief',
    icon: ArchiveIcon,
    tone: 'caution',
    shortcut: 'Ctrl+Shift+A',
    onHandle: async () => {
      patch.execute([{set: {isArchived: true}}])
      
      // Auto-publish na patch
      setTimeout(() => {
        publish.execute()
        onComplete()
      }, 100)
    },
  }
}
