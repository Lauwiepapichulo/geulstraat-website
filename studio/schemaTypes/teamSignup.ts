import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export default defineType({
  name: 'teamSignup',
  title: 'Teamaanmeldingen',
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
      title: 'Bericht',
      type: 'text',
      rows: 3,
      readOnly: true,
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'string',
      options: {
        list: [
          {title: 'Green Team', value: 'green-team'},
          {title: 'Clean Team', value: 'clean-team'},
          {title: 'Happy Team', value: 'happy-team'},
        ],
      },
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'signedUpAt',
      title: 'Aangemeld op',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      team: 'team',
      signedUpAt: 'signedUpAt',
    },
    prepare(selection) {
      const {name, email, team, signedUpAt} = selection
      const teamNames: Record<string, string> = {
        'green-team': 'Green Team',
        'clean-team': 'Clean Team',
        'happy-team': 'Happy Team',
      }
      const dateStr = signedUpAt
        ? new Date(signedUpAt).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        : ''
      return {
        title: name,
        subtitle: `${email} • ${teamNames[team] || team} • ${dateStr}`,
      }
    },
  },
  orderings: [
    {
      title: 'Datum (nieuwste eerst)',
      name: 'signedUpAtDesc',
      by: [{field: 'signedUpAt', direction: 'desc'}],
    },
    {
      title: 'Naam (A-Z)',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
