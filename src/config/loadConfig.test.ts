import inquirer from 'inquirer'

import { asMock } from '../testing-support'
import { createFile, expandPath, fileExists, readJSONFile } from '../util'
import { loadConfig } from './loadConfig'

jest.mock('inquirer')
jest.mock('../util')

beforeEach(() => {
  asMock(expandPath).mockImplementation((path: string) => `/expanded/${path}`)
})

describe('loadConfig', () => {
  test('creates config if not present and prompts user: bear mode', async () => {
    asMock(fileExists).mockReturnValue(false)
    asMock(inquirer.prompt).mockResolvedValue({
      fileDirectory: undefined,
      mode: 'bear',
      rootDir: '~/test-root',
    })

    const config = await loadConfig()

    expect(createFile).toHaveBeenCalledWith('/expanded/~/.markdown-api.json', expect.any(Object))
    expect(config.rootDir).toContain('/expanded/~/test-root')
    expect(config.mode).toBe('bear')
    expect(config.bearConfig).toBeDefined()
    expect(config.fileConfig).not.toBeDefined()
  })

  test('creates config if not present and prompts user: obsidian mode', async () => {
    asMock(fileExists).mockReturnValue(false)
    asMock(inquirer.prompt).mockResolvedValue({
      fileDirectory: undefined,
      mode: 'obsidian',
      rootDir: '~/test-root',
    })

    const config = await loadConfig()

    expect(createFile).toHaveBeenCalledWith('/expanded/~/.markdown-api.json', expect.any(Object))
    expect(config.rootDir).toContain('/expanded/~/test-root')
    expect(config.mode).toBe('obsidian')
    expect(config.bearConfig).not.toBeDefined()
    expect(config.fileConfig).toBeDefined()
  })

  test('loads config if present', async () => {
    asMock(fileExists).mockReturnValue(true)
    const fakeConfig = { mode: 'obsidian', rootDir: '/existing' }
    asMock(readJSONFile).mockReturnValue(fakeConfig)

    const config = await loadConfig()

    expect(config).toEqual(fakeConfig)
  })
})
