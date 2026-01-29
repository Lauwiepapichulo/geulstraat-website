import {Button, Flex} from '@sanity/ui'
import {ArrowLeftIcon} from '@sanity/icons'
import {useCallback} from 'react'

export function BackButton() {
  const handleBack = useCallback(() => {
    window.history.back()
  }, [])

  return (
    <Flex style={{marginBottom: '1rem'}}>
      <Button
        icon={ArrowLeftIcon}
        text="Terug naar overzicht"
        tone="default"
        mode="bleed"
        onClick={handleBack}
        fontSize={1}
        padding={3}
      />
    </Flex>
  )
}
