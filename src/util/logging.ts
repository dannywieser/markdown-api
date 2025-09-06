const fill = (length: number, char: string) => Array(length).fill(char).join('')
export const header1 = (headerText: string) => {
  const line = fill(headerText.length + 2, '-')
  console.info(`${line}\n# ${headerText}\n${line}\n`)
}
export const header2 = (headerText: string) => {
  const line = fill(headerText.length + 2, '-')
  console.info(`${line}\n## ${headerText}\n${line}\n`)
}
const prefix = (indent: number) => (indent === 0 ? '>' : fill(indent, '.'))
export const activity = (activityText: string, indent = 0) =>
  console.info(`${prefix(indent)} ${activityText}`)

export const activityWithDetail = (activityText: string, indent: number, detail: string) =>
  console.info(`${prefix(indent)} ${activityText}\n ${fill(indent + 2, '.')} ${detail}`)
