export function DateStructure(dateForStructure: string) {
  const date = new Date(dateForStructure)
  const formattedDate = date.toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  })
  const newData = formattedDate.split('/').reverse().join('-')

  return newData
}
