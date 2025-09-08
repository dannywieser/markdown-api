const fill = (length: number, char: string) => Array(length).fill(char).join('')
export const header1 = (headerText: string) => console.info(`# ${headerText}`)
export const header2 = (headerText: string) => console.info(`## ${headerText}`)
const prefix = (indent: number) => (indent === 0 ? '>' : fill(indent, '.'))
export const activity = (activityText: string, indent = 0) =>
  console.info(`${prefix(indent)} ${activityText}`)

export const activityWithDetail = (activityText: string, indent: number, detail: string) =>
  console.info(`${prefix(indent)} ${activityText}\n ${fill(indent + 2, '.')} ${detail}`)
