import inquirer from 'inquirer'

export async function promptForConfig() {
  const answers = await inquirer.prompt([
    {
      default: '~/bear-markdown-api',
      message: 'Where should backups and cached files be stored?',
      name: 'rootDir',
      type: 'input',
    },
  ])
  return answers
}
