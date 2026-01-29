import {Box, Card, Text, Stack, Flex} from '@sanity/ui'
import imageUrlBuilder from '@sanity/image-url'
import {client} from '../lib/sanity.client'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

interface PreviewSize {
  label: string
  width: number
  height: number
  description: string
}

const previewSizes: PreviewSize[] = [
  {label: 'Desktop Banner', width: 1200, height: 400, description: '3:1 - Header'},
  {label: 'Mobiel', width: 400, height: 300, description: '4:3 - Mobiel'},
  {label: 'Kaart', width: 400, height: 260, description: 'Thumbnail'},
]

export function BannerPreview(props: any) {
  const {renderDefault, value} = props
  
  // Render de standaard image input
  const defaultInput = renderDefault(props)
  
  // Als er geen afbeelding is, toon alleen de standaard input
  if (!value || !value?.asset) {
    return defaultInput
  }

  return (
    <Stack space={4}>
      {defaultInput}
      
      <Card padding={4} radius={2} style={{backgroundColor: '#f8fafc', border: '1px solid #e2e8f0'}}>
        <Stack space={4}>
          <Text size={2} weight="semibold">
            Preview: zo ziet de foto eruit op de website
          </Text>
          
          <Flex gap={4} wrap="wrap">
            {previewSizes.map((size) => (
              <Box key={size.label}>
                <Stack space={2}>
                  <Text size={1} weight="medium">{size.label}</Text>
                  <Text size={0} muted>{size.description}</Text>
                  <div 
                    style={{
                      width: size.width / 3,
                      height: size.height / 3,
                      overflow: 'hidden',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#fff',
                    }}
                  >
                    <img
                      src={urlFor(value)
                        .width(size.width)
                        .height(size.height)
                        .fit('crop')
                        .auto('format')
                        .url()}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </Stack>
              </Box>
            ))}
          </Flex>
          
          <Text size={1} muted>
            Tip: Klik op de foto en versleep de hotspot (cirkel) naar het belangrijkste deel
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}
