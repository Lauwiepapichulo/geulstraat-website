import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {media} from 'sanity-plugin-media'
import {cloudinarySchemaPlugin, cloudinaryAssetSourcePlugin} from 'sanity-plugin-cloudinary'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {AutoSlugPublishAction} from './actions/autoSlugPublish'
import {ArchiveAction} from './actions/archiveAction'
import {DocumentActionsToolbar} from './components/DocumentActionsToolbar'
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
    // Custom document actions
    actions: (prev, context) => {
      // Document types that use our custom toolbar (hide default actions)
      const customToolbarTypes = ['post', 'buurtActie']
      // Document types that should auto-generate slugs
      const slugTypes = ['post', 'buurtActie', 'gallery']
      
      let actions = prev
      
      // For types with custom toolbar, remove most default actions
      // Keep only the ones we can't replicate (like history, etc)
      if (customToolbarTypes.includes(context.schemaType)) {
        // Filter out all standard actions - we have these in our toolbar
        actions = actions.filter((action: any) => {
          const actionsToRemove = ['publish', 'unpublish', 'delete', 'duplicate', 'discardChanges']
          return !actionsToRemove.includes(action.action)
        })
        return actions
      }
      
      // For other types, keep auto-slug functionality
      if (slugTypes.includes(context.schemaType)) {
        actions = actions.map((action) => {
          if (action.action === 'publish') {
            return (props: any) => {
              const customAction = AutoSlugPublishAction(props)
              if (customAction) {
                return customAction
              }
              return action(props)
            }
          }
          return action
        })
      }
      
      return actions
    },
  },
})
