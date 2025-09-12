import { mockConfig } from './mocks'

jest.mock('../config', () => ({
  loadConfig: jest.fn(() => mockConfig()),
}))
