import {useDocumentOperation, useEditState, useFormValue} from 'sanity'
import {Button, Card, Flex, Text, Box, Dialog} from '@sanity/ui'
import {PublishIcon, ResetIcon, CopyIcon, TrashIcon, ArchiveIcon, UndoIcon, WarningOutlineIcon} from '@sanity/icons'
import {useCallback, useState} from 'react'

export function ActionsField(props: any) {
  const {schemaType} = props
  const documentId = useFormValue(['_id']) as string
  const documentType = useFormValue(['_type']) as string
  const isArchived = useFormValue(['isArchived']) as boolean
  
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Get clean document ID (remove drafts. prefix)
  const cleanId = documentId?.replace('drafts.', '') || ''
  
  const ops = useDocumentOperation(cleanId, documentType || schemaType?.name)
  const editState = useEditState(cleanId, documentType || schemaType?.name)
  
  const {publish, discardChanges, duplicate, del, patch} = ops
  const hasDraft = !!editState?.draft
  const isNew = !editState?.published && !editState?.draft

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

  const handleDeleteClick = useCallback(() => {
    if (del.disabled) return
    setShowDeleteConfirm(true)
  }, [del])

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false)
    setIsProcessing('delete')
    del.execute()
  }, [del])

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false)
  }, [])

  const handleArchive = useCallback(async () => {
    setIsProcessing('archive')
    patch.execute([{set: {isArchived: !isArchived}}])
    setTimeout(() => {
      if (!publish.disabled) {
        publish.execute()
      }
      setIsProcessing(null)
    }, 200)
  }, [patch, publish, isArchived])

  if (!cleanId || isNew) {
    return null
  }

  const buttonStyle = {
    justifyContent: 'center',
  }

  return (
    <div style={{marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0'}}>
      {isArchived && (
        <Card padding={3} radius={2} tone="caution" style={{marginBottom: '1rem'}}>
          <Text size={1} weight="medium">📦 Dit item is gearchiveerd en wordt niet op de website getoond</Text>
        </Card>
      )}
      
      <Flex align="center" gap={2} wrap="wrap">
        <Button
          icon={PublishIcon}
          text="Publiceren"
          tone="positive"
          mode={hasDraft ? 'default' : 'ghost'}
          disabled={publish.disabled || isProcessing === 'publish'}
          onClick={handlePublish}
          fontSize={1}
          padding={3}
          style={buttonStyle}
        />
        <Button
          icon={ResetIcon}
          text="Ongedaan"
          tone="default"
          mode="ghost"
          disabled={discardChanges.disabled || isProcessing === 'discard'}
          onClick={handleDiscard}
          fontSize={1}
          padding={3}
          style={buttonStyle}
        />
        <Button
          icon={CopyIcon}
          text="Dupliceren"
          tone="default"
          mode="ghost"
          disabled={duplicate.disabled || isProcessing === 'duplicate'}
          onClick={handleDuplicate}
          fontSize={1}
          padding={3}
          style={buttonStyle}
        />
        <Button
          icon={isArchived ? UndoIcon : ArchiveIcon}
          text={isArchived ? 'Terughalen' : 'Archiveren'}
          tone={isArchived ? 'positive' : 'caution'}
          mode="ghost"
          disabled={isProcessing === 'archive'}
          onClick={handleArchive}
          fontSize={1}
          padding={3}
          style={buttonStyle}
        />

        {/* Delete */}
        <Button
          icon={TrashIcon}
          text="Verwijderen"
          tone="critical"
          mode="ghost"
          disabled={del.disabled || isProcessing === 'delete'}
          onClick={handleDeleteClick}
          fontSize={1}
          padding={3}
          style={buttonStyle}
        />
      </Flex>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <Dialog
          id="delete-confirm-dialog"
          header="Verwijderen bevestigen"
          onClose={handleDeleteCancel}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Flex direction="column" gap={4}>
              <Card tone="critical" padding={3} radius={2}>
                <Flex align="center" gap={3}>
                  <Text size={2}>
                    <WarningOutlineIcon />
                  </Text>
                  <Text size={2} weight="bold">
                    Let op! Dit kan niet ongedaan worden gemaakt.
                  </Text>
                </Flex>
              </Card>
              <Text size={2}>
                Weet je zeker dat je dit item permanent wilt verwijderen?
              </Text>
              <Flex gap={3} justify="flex-end">
                <Button
                  text="Annuleren"
                  mode="ghost"
                  onClick={handleDeleteCancel}
                  padding={3}
                />
                <Button
                  text="Ja, verwijderen"
                  tone="critical"
                  icon={TrashIcon}
                  onClick={handleDeleteConfirm}
                  padding={3}
                />
              </Flex>
            </Flex>
          </Box>
        </Dialog>
      )}
    </div>
  )
}
