import {useDocumentOperation} from 'sanity'
import {useEffect, useState} from 'react'

// Helper functie om slug te genereren
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 96)
}

export function AutoSlugPublishAction(props: any) {
  const {id, type, draft, published, onComplete} = props
  const {patch, publish} = useDocumentOperation(id, type)
  const [isPublishing, setIsPublishing] = useState(false)

  // Alleen voor document types die een slug en title hebben
  const doc = draft || published
  const hasTitle = doc?.title
  const hasSlug = doc?.slug?.current

  useEffect(() => {
    if (isPublishing && !draft) {
      setIsPublishing(false)
    }
  }, [draft, isPublishing])

  // Standaard publish gedrag als slug al bestaat of geen title
  if (hasSlug || !hasTitle) {
    return null // Gebruik default publish action
  }

  return {
    label: isPublishing ? 'Publiceren...' : 'Publiceren',
    disabled: !hasTitle || publish.disabled,
    onHandle: async () => {
      setIsPublishing(true)

      // Genereer slug uit title als die nog niet bestaat
      if (!hasSlug && hasTitle) {
        patch.execute([
          {
            set: {
              slug: {
                _type: 'slug',
                current: slugify(doc.title),
              },
            },
          },
        ])
      }

      // Wacht even tot de patch is verwerkt
      setTimeout(() => {
        publish.execute()
        onComplete()
      }, 100)
    },
  }
}
