import fs from 'fs'
import inquirer from 'inquirer'
import os from 'os'
import path from 'path'

import { asMock } from '../testing-support'
import { expandPath } from '../util'
import { loadConfig } from './loadConfig'

jest.mock('fs')
jest.mock('inquirer')
jest.mock('../util')

const CONFIG_FILENAME = '.markdown-api.json'
const configPath = path.join(os.homedir(), CONFIG_FILENAME)

beforeEach(() => {
  asMock(expandPath).mockReturnValue('/expanded/path')
})

describe('loadConfig', () => {
  test('creates config if not present and prompts user: bear mode', async () => {
    asMock(fs.existsSync).mockReturnValue(false)
    asMock(inquirer.prompt).mockResolvedValue({
      fileDirectory: undefined,
      mode: 'bear',
      rootDir: '~/test-root',
    })
    const writeFileSyncMock = fs.writeFileSync as jest.Mock

    const config = await loadConfig()

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      configPath,
      expect.any(String),
      expect.objectContaining({ mode: 0o600 })
    )
    expect(config.rootDir).toContain('/expanded/path')
    expect(config.mode).toBe('bear')
    expect(config.bearConfig).toBeDefined()
    expect(config.fileConfig).not.toBeDefined()
  })

  test('creates config if not present and prompts user: obsidian mode', async () => {
    asMock(fs.existsSync).mockReturnValue(false)
    asMock(inquirer.prompt).mockResolvedValue({
      fileDirectory: undefined,
      mode: 'obsidian',
      rootDir: '~/test-root',
    })
    const writeFileSyncMock = fs.writeFileSync as jest.Mock

    const config = await loadConfig()

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      configPath,
      expect.any(String),
      expect.objectContaining({ mode: 0o600 })
    )
    expect(config.rootDir).toContain('/expanded/path')
    expect(config.mode).toBe('obsidian')
    expect(config.bearConfig).not.toBeDefined()
    expect(config.fileConfig).toBeDefined()
  })

  test('loads config if present', async () => {
    asMock(fs.existsSync).mockReturnValue(true)
    const fakeConfig = { mode: 'obsidian', rootDir: '/existing' }
    asMock(fs.readFileSync).mockReturnValue(JSON.stringify(fakeConfig))

    const config = await loadConfig()

    expect(config).toEqual(fakeConfig)
  })
})
