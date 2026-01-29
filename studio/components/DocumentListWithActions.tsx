'use client'

import {useClient} from 'sanity'
import {Card, Stack, Text, Button, Menu, MenuButton, MenuItem, Flex, Box, Badge} from '@sanity/ui'
import {EllipsisVerticalIcon, ArchiveIcon, TrashIcon, EditIcon, ResetIcon} from '@sanity/icons'
import {useState, useEffect} from 'react'
import imageUrlBuilder from '@sanity/image-url'

interface DocumentListWithActionsProps {
  schemaType: 'post' | 'buurtActie'
  filter?: 'active' | 'archived' | 'all'
  title: string
}

export function DocumentListWithActions({schemaType, filter = 'all', title}: DocumentListWithActionsProps) {
  const client = useClient({apiVersion: '2024-01-01'})
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const builder = imageUrlBuilder(client)

  const fetchDocuments = async () => {
    setLoading(true)
    let query = `*[_type == "${schemaType}"]`
    
    if (filter === 'active') {
      query = `*[_type == "${schemaType}" && isArchived != true]`
    } else if (filter === 'archived') {
      query = `*[_type == "${schemaType}" && isArchived == true]`
    }

    const orderField = schemaType === 'post' ? 'publishedAt' : 'datetime'
    query += ` | order(${orderField} desc) {
      _id,
      _type,
      title,
      isArchived,
      ${schemaType === 'post' ? 'publishedAt, mainImage' : 'datetime, image'},
      slug
    }`

    const docs = await client.fetch(query)
    setDocuments(docs)
    setLoading(false)
  }

  useEffect(() => {
    fetchDocuments()
  }, [filter, schemaType])

  const handleArchive = async (id: string, currentlyArchived: boolean) => {
    await client.patch(id).set({isArchived: !currentlyArchived}).commit()
    fetchDocuments()
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Weet je zeker dat je dit wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
      await client.delete(id)
      fetchDocuments()
    }
  }

  const openDocument = (id: string, type: string) => {
    // Navigate to the document in Sanity Studio
    window.location.href = `/studio/structure/${type === 'post' ? 'post' : 'buurtActie'};${id}`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Geen datum'
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getImageUrl = (doc: any) => {
    const imageField = schemaType === 'post' ? doc.mainImage : doc.image
    if (imageField?.asset) {
      return builder.image(imageField).width(80).height(80).fit('crop').url()
    }
    return null
  }

  if (loading) {
    return (
      <Card padding={4}>
        <Text>Laden...</Text>
      </Card>
    )
  }

  return (
    <Card padding={3} style={{height: '100%', overflow: 'auto'}}>
      <Stack space={2}>
        <Box paddingX={2} paddingY={3}>
          <Text size={2} weight="semibold">{title} ({documents.length})</Text>
        </Box>
        
        {documents.length === 0 ? (
          <Card padding={4} tone="transparent">
            <Text size={1} muted>Geen items gevonden</Text>
          </Card>
        ) : (
          documents.map((doc) => (
            <Card
              key={doc._id}
              padding={2}
              radius={2}
              shadow={1}
              style={{cursor: 'pointer'}}
            >
              <Flex align="center" gap={3}>
                {/* Thumbnail */}
                <Box style={{width: 50, height: 50, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: '#f0f0f0'}}>
                  {getImageUrl(doc) ? (
                    <img 
                      src={getImageUrl(doc) || ''} 
                      alt="" 
                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                  ) : (
                    <Flex align="center" justify="center" style={{height: '100%'}}>
                      <Text size={1} muted>📄</Text>
                    </Flex>
                  )}
                </Box>

                {/* Content */}
                <Box flex={1} onClick={() => openDocument(doc._id, doc._type)} style={{minWidth: 0}}>
                  <Flex align="center" gap={2}>
                    <Text size={1} weight="medium" style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {doc.title || 'Zonder titel'}
                    </Text>
                    {doc.isArchived && (
                      <Badge tone="caution" fontSize={0}>📦</Badge>
                    )}
                  </Flex>
                  <Text size={0} muted>
                    {formatDate(schemaType === 'post' ? doc.publishedAt : doc.datetime)}
                  </Text>
                </Box>

                {/* Actions Menu */}
                <MenuButton
                  button={
                    <Button
                      icon={EllipsisVerticalIcon}
                      mode="bleed"
                      padding={2}
                      tone="default"
                    />
                  }
                  id={`menu-${doc._id}`}
                  menu={
                    <Menu>
                      <MenuItem
                        icon={EditIcon}
                        text="Bewerken"
                        onClick={() => openDocument(doc._id, doc._type)}
                      />
                      <MenuItem
                        icon={doc.isArchived ? ResetIcon : ArchiveIcon}
                        text={doc.isArchived ? 'Herstellen uit archief' : 'Archiveren'}
                        tone={doc.isArchived ? 'positive' : 'caution'}
                        onClick={() => handleArchive(doc._id, doc.isArchived)}
                      />
                      <MenuItem
                        icon={TrashIcon}
                        text="Verwijderen"
                        tone="critical"
                        onClick={() => handleDelete(doc._id)}
                      />
                    </Menu>
                  }
                  popover={{portal: true, placement: 'bottom-end'}}
                />
              </Flex>
            </Card>
          ))
        )}
      </Stack>
    </Card>
  )
}
