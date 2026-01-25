import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {cloudinarySchemaPlugin, cloudinaryAssetSourcePlugin} from 'sanity-plugin-cloudinary'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = 'vs1rb6mu'
const dataset = 'production'

export default defineConfig({
  name: 'geulstraat',
  title: 'Geulstraat website admin',
  
  projectId,
  dataset,
  
  basePath: '/studio',
  
  plugins: [
    structureTool({structure}),
    visionTool(),
    media(),
    cloudinarySchemaPlugin(),
    cloudinaryAssetSourcePlugin(),
  ],
  
  schema: {
    types: schemaTypes,
  },
})
