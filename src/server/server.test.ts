import { asMock, mockConfig } from '../testing-support'
import { activity, expandPath } from '../util'
import { app } from './app'
import { startMessage, startup } from './server'

jest.mock('../marked/main', () => ({
  lexer: jest.fn(),
}))
jest.mock('../util')
jest.mock('./app', () => ({
  app: {
    listen: jest.fn().mockReturnValue({ on: jest.fn() }),
    use: jest.fn(),
  },
}))

describe('main server', () => {
  beforeEach(() => {
    asMock(expandPath).mockImplementation((path: string) => `expanded/${path}`)
  })

  test('server starts with loaded config', async () => {
    await startup()

    expect(app.listen).toHaveBeenCalledWith(80, 'localhost', expect.any(Function))
  })

  test('startup message logs correct details', () => {
    const config = mockConfig()

    startMessage(config, '/path/to/images')

    expect(activity).toHaveBeenCalledWith('server running: http://localhost:80')
    expect(activity).toHaveBeenCalledWith('root directory: ~/.root-dir')
    expect(activity).toHaveBeenCalledWith('image directory: /path/to/images')
  })
})
