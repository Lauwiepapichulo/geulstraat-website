import {ComponentType} from 'react'
import {DocumentActionsToolbar} from './DocumentActionsToolbar'

// Wrapper component that adds our custom toolbar above the document form
export function withDocumentActionsToolbar(WrappedComponent: ComponentType<any>) {
  return function DocumentFormWithToolbar(props: any) {
    const {documentId, schemaType} = props

    // Only show toolbar for certain document types
    const showToolbar = schemaType === 'post' || schemaType === 'buurtActie'

    return (
      <>
        {showToolbar && documentId && (
          <DocumentActionsToolbar documentId={documentId} schemaType={schemaType} />
        )}
        <WrappedComponent {...props} />
      </>
    )
  }
}
