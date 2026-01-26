import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {media} from 'sanity-plugin-media'
import {cloudinarySchemaPlugin, cloudinaryAssetSourcePlugin} from 'sanity-plugin-cloudinary'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import './sanity.css'

const projectId = 'vs1rb6mu'
const dataset = 'production'

export default defineConfig({
  name: 'geulstraat',
  title: 'De Geulstraat',
  
  projectId,
  dataset,
  
  basePath: '/studio',
  
  plugins: [
    structureTool({structure}),
    media(),
    cloudinarySchemaPlugin(),
    cloudinaryAssetSourcePlugin(),
  ],
  
  schema: {
    types: schemaTypes,
  },

  // Custom studio branding
  studio: {
    components: {
      // Custom logo could be added here
    },
  },

  // Theme customization - using Geulstraat brand colors
  theme: {
    colors: {
      brand: {
        primary: '#1E3A5F', // Deep blue - main brand color
        secondary: '#3B82A0', // Lighter blue accent
      },
    },
  },

  // Better form options
  form: {
    image: {
      directUploads: true,
    },
  },

  // Document actions customization
  document: {
    // Simplify the publish action text
    productionUrl: async (prev, context) => {
      return prev
    },
  },
})
