import { mockConfig } from '../testing-support'
import { activity } from '../util/logging'
import { app } from './app'
import { startMessage, startup } from './server'

jest.mock('../marked/main', () => ({
  lexer: jest.fn(),
}))
jest.mock('../util/logging')
jest.mock('./app')
describe('main server', () => {
  test('server starts with loaded config', async () => {
    await startup()

    expect(app.listen).toHaveBeenCalledWith(80, 'hostname', expect.any(Function))
  })

  test('startup message logs correct details', () => {
    const config = mockConfig()

    startMessage(config)

    expect(activity).toHaveBeenCalledWith('server running: http://localhost:80')
    expect(activity).toHaveBeenCalledWith('root directory: /mock/root')
    expect(activity).toHaveBeenCalledWith('mode: bear')
  })
})
