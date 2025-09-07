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
    {
      choices: ['bear', 'obsidian'],
      default: 'bear',
      message: 'What app do you use to create your notes?',
      name: 'mode',
      type: 'list',
    },
    {
      message: 'What directory is your Obsidian Vault saved in?',
      name: 'fileDirectory',
      type: 'input',
      when: (answers) => answers.mode === 'obsidian',
    },
  ])
  return answers
}
