import inquirer from 'inquirer'

export async function promptForConfig() {
  const answers = await inquirer.prompt([
    {
      default: '~/markdown-api',
      message:
        'Markdown API needs a directory where it will store cached versions of files for serving - please input a location for this directory:',
      name: 'rootDir',
      type: 'input',
    },
  ])
  return answers
}
