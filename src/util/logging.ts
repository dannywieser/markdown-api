const fill = (length: number, char = ' ') => Array(length).fill(char).join('')
export const header1 = (headerText: string) => {
  const line = fill(headerText.length + 2, '-')
  console.info(`${line}\n# ${headerText}\n${line}\n`)
}
export const header2 = (headerText: string) => {
  const line = fill(headerText.length + 2, '-')
  console.info(`${line}\n## ${headerText}\n${line}\n`)
}
export const activity = (activityText: string, indent = 0) =>
  console.info(`${fill(indent, '.')} ${activityText}`)

export const activityWithDetail = (
  activityText: string,
  indent = 0,
  detail: string
) =>
  console.info(
    `${fill(indent, '.')} ${activityText}\n ${fill(indent + 2, '.')} ${detail}`
  )
