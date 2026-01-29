import {useDocumentOperation, useEditState} from 'sanity'
import {Button, Card, Flex, Text} from '@sanity/ui'
import {PublishIcon, ResetIcon, CopyIcon, TrashIcon, ArchiveIcon, UndoIcon} from '@sanity/icons'
import {useCallback, useState} from 'react'

interface Props {
  documentId: string
  schemaType: string
}

export function DocumentActionsToolbar({documentId, schemaType}: Props) {
  const {draft, published} = useEditState(documentId, schemaType)
  const {publish, discardChanges, duplicate, del, patch} = useDocumentOperation(documentId, schemaType)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const doc = draft || published
  const isArchived = doc?.isArchived === true
  const hasDraft = !!draft
  const isNew = !published && !draft

  const handlePublish = useCallback(async () => {
    if (publish.disabled) return
    setIsProcessing('publish')
    publish.execute()
    setTimeout(() => setIsProcessing(null), 500)
  }, [publish])

  const handleDiscard = useCallback(async () => {
    if (discardChanges.disabled) return
    setIsProcessing('discard')
    discardChanges.execute()
    setTimeout(() => setIsProcessing(null), 500)
  }, [discardChanges])

  const handleDuplicate = useCallback(async () => {
    if (duplicate.disabled) return
    setIsProcessing('duplicate')
    duplicate.execute()
    setTimeout(() => setIsProcessing(null), 500)
  }, [duplicate])

  const handleDelete = useCallback(async () => {
    if (del.disabled) return
    if (!window.confirm('Weet je zeker dat je dit wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
      return
    }
    setIsProcessing('delete')
    del.execute()
    setTimeout(() => setIsProcessing(null), 500)
  }, [del])

  const handleArchive = useCallback(async () => {
    setIsProcessing('archive')
    patch.execute([{set: {isArchived: !isArchived}}])
    // Auto-publish after archive
    setTimeout(() => {
      publish.execute()
      setIsProcessing(null)
    }, 200)
  }, [patch, publish, isArchived])

  // Only show for archivable types
  const showArchive = schemaType === 'post' || schemaType === 'buurtActie'

  if (isNew) return null

  return (
    <Card padding={3} marginBottom={4} radius={2} shadow={1} tone="transparent">
      <Flex align="center" gap={2} wrap="wrap">
        <Text size={1} weight="semibold" style={{marginRight: 8}}>
          Acties:
        </Text>
        
        {/* Publish */}
        <Button
          icon={PublishIcon}
          text="Publiceren"
          tone="positive"
          mode={hasDraft ? 'default' : 'ghost'}
          disabled={publish.disabled || isProcessing === 'publish'}
          onClick={handlePublish}
          fontSize={1}
          padding={2}
        />

        {/* Discard Changes */}
        <Button
          icon={ResetIcon}
          text="Wijzigingen ongedaan maken"
          tone="caution"
          mode="ghost"
          disabled={discardChanges.disabled || isProcessing === 'discard'}
          onClick={handleDiscard}
          fontSize={1}
          padding={2}
        />

        {/* Duplicate */}
        <Button
          icon={CopyIcon}
          text="Dupliceren"
          mode="ghost"
          disabled={duplicate.disabled || isProcessing === 'duplicate'}
          onClick={handleDuplicate}
          fontSize={1}
          padding={2}
        />

        {/* Archive (only for posts and buurtActies) */}
        {showArchive && (
          <Button
            icon={isArchived ? UndoIcon : ArchiveIcon}
            text={isArchived ? 'Terughalen' : 'Archiveren'}
            tone={isArchived ? 'positive' : 'caution'}
            mode="ghost"
            disabled={isProcessing === 'archive'}
            onClick={handleArchive}
            fontSize={1}
            padding={2}
          />
        )}

        {/* Delete */}
        <Button
          icon={TrashIcon}
          text="Verwijderen"
          tone="critical"
          mode="ghost"
          disabled={del.disabled || isProcessing === 'delete'}
          onClick={handleDelete}
          fontSize={1}
          padding={2}
        />
      </Flex>
    </Card>
  )
}
