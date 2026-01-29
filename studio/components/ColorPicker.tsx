import {useCallback} from 'react'
import {set, unset} from 'sanity'
import {Box, Flex, Text, Tooltip, Card} from '@sanity/ui'

// Kleurenpalet met visuele weergave
const colors = [
  // Wit en grijs tinten
  {value: 'white', label: 'Wit', color: '#ffffff', border: true},
  {value: 'gray', label: 'Lichtgrijs', color: '#FAFBFC', border: true},
  {value: 'darkgray', label: 'Grijs', color: '#e2e8f0'},
  {value: 'slate', label: 'Donkergrijs', color: '#94a3b8'},
  
  // Blauw tinten
  {value: 'blue-lightest', label: 'IJsblauw', color: '#f0f9ff'},
  {value: 'blue-soft', label: 'Zachtblauw', color: '#bae6fd'},
  {value: 'blue-medium', label: 'Blauw', color: '#38bdf8'},
  {value: 'blue-dark', label: 'Donkerblauw', color: '#1E3A5F'},
  {value: 'navy', label: 'Navy', color: '#1e3a8a'},
  
  // Groen tinten
  {value: 'green-lightest', label: 'Mintgroen', color: '#ecfdf5'},
  {value: 'green-soft', label: 'Zachtgroen', color: '#a7f3d0'},
  {value: 'green-medium', label: 'Groen', color: '#34d399'},
  {value: 'green-dark', label: 'Donkergroen', color: '#065f46'},
  {value: 'teal', label: 'Teal', color: '#14b8a6'},
  
  // Warm tinten
  {value: 'beige', label: 'Beige', color: '#fef3c7'},
  {value: 'sand', label: 'Zand', color: '#fde68a'},
  {value: 'cream', label: 'Crème', color: '#fffbeb'},
  {value: 'terracotta', label: 'Terracotta', color: '#fed7aa'},
  {value: 'peach', label: 'Perzik', color: '#fecaca'},
  
  // Roze/Paars tinten
  {value: 'pink-soft', label: 'Zachtroze', color: '#fce7f3'},
  {value: 'pink', label: 'Roze', color: '#f9a8d4'},
  {value: 'purple-soft', label: 'Lavendel', color: '#e9d5ff'},
  {value: 'purple', label: 'Paars', color: '#a78bfa'},
  
  // Donkere tinten
  {value: 'dark', label: 'Donker', color: '#1e293b'},
  {value: 'black', label: 'Zwart', color: '#0f172a'},
]

export function ColorPicker(props: any) {
  const {value, onChange, renderDefault} = props

  const handleSelect = useCallback(
    (colorValue: string) => {
      onChange(colorValue === value ? unset() : set(colorValue))
    },
    [onChange, value]
  )

  return (
    <Box>
      <Text size={1} weight="semibold" style={{marginBottom: '12px', display: 'block'}}>
        Achtergrondkleur
      </Text>
      
      <Flex wrap="wrap" gap={2}>
        {colors.map((color) => (
          <Tooltip
            key={color.value}
            content={
              <Box padding={2}>
                <Text size={1}>{color.label}</Text>
              </Box>
            }
            placement="top"
          >
            <button
              type="button"
              onClick={() => handleSelect(color.value)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: color.color,
                border: value === color.value 
                  ? '3px solid #2563eb' 
                  : color.border 
                    ? '1px solid #e2e8f0' 
                    : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: value === color.value 
                  ? '0 0 0 2px white, 0 0 0 4px #2563eb' 
                  : '0 1px 3px rgba(0,0,0,0.1)',
                transform: value === color.value ? 'scale(1.1)' : 'scale(1)',
              }}
              title={color.label}
            />
          </Tooltip>
        ))}
      </Flex>
      
      {value && (
        <Text size={1} muted style={{marginTop: '8px'}}>
          Geselecteerd: {colors.find(c => c.value === value)?.label || value}
        </Text>
      )}
    </Box>
  )
}
