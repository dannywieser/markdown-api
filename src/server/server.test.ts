import { activity, header1 } from '@/util/logging'

import app from './app'
import { startMessage, startup } from './server'

jest.mock('@/marked/main', () => ({
  lexer: jest.fn(),
}))
jest.mock('@/config', () => ({
  loadConfig: jest.fn(() => ({
    host: 'mdm',
    mode: 'bear',
    port: 80,
    rootDir: '/mock/root',
  })),
}))
jest.mock('@/util/logging')
jest.mock('./app')

describe('main server', () => {
  test('server starts with loaded config', () => {
    startup()
    expect(app.listen).toHaveBeenCalledWith(80, expect.any(Function))
  })

  test('startup message logs correct details', () => {
    startMessage()
    expect(header1).toHaveBeenCalledWith('Markdown Memory')
    expect(activity).toHaveBeenCalledWith('server running: http://mdm:80')
    expect(activity).toHaveBeenCalledWith('root directory: /mock/root')
    expect(activity).toHaveBeenCalledWith('mode: bear')
  })
})
