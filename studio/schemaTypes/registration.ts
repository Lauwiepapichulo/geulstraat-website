import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export default defineType({
  name: 'registration',
  title: 'Inschrijvingen',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
      readOnly: true,
    }),
    defineField({
      name: 'phone',
      title: 'Telefoon',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'message',
      title: 'Opmerking',
      type: 'text',
      rows: 3,
      readOnly: true,
    }),
    defineField({
      name: 'buurtActie',
      title: 'Buurt actie',
      type: 'reference',
      to: [{type: 'buurtActie'}],
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'registeredAt',
      title: 'Ingeschreven op',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      actieTitle: 'buurtActie.title',
      registeredAt: 'registeredAt',
    },
    prepare(selection) {
      const {name, email, actieTitle, registeredAt} = selection
      const dateStr = registeredAt 
        ? new Date(registeredAt).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        : ''
      return {
        title: name,
        subtitle: `${email} • ${actieTitle || 'Geen actie'} • ${dateStr}`,
      }
    },
  },
  orderings: [
    {
      title: 'Datum (nieuwste eerst)',
      name: 'registeredAtDesc',
      by: [{field: 'registeredAt', direction: 'desc'}],
    },
  ],
})
