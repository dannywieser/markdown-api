/* istanbul ignore file */

import { Config } from '../config'
import { MarkdownNote } from '../types'

/**
 * This is a helper which will cast a mock function to a jest.Mock to allow usage of the mock functions,
 * while at the same time enforcing the correct types for the function return value.
 *
 * @example
 *  const foo = (fooParam: string): boolean => fooParam === "bar";
 *  asMock(foo).mockReturnValue(true); // works
 *  asMock(foo).mockReturnValue(1); // Argument of type 'number' is not assignable to parameter of type 'boolean'
 */
// we need to disable this because the jest MockedFunction type expects `...args: any[]) => any` as the base type for T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asMock = <T extends (...args: any[]) => any>(mockTarget: T): jest.MockedFunction<T> =>
  mockTarget as jest.MockedFunction<T>

export const mockConfig = (overrides?: Partial<Config>): Config => ({
  apiRoot: '/api',
  bearConfig: {
    dbFile: 'dbfile.sqlite',
    imagePath: 'images/',
    keepBackups: 2,
    openInBearUrl: '/path/in/bear?id=',
    rootPath: '/path/to/bear',
  },
  host: 'localhost',
  imageRoot: '/images',
  mode: 'bear',
  noteWebPath: '/path/to/web',
  port: 80,
  rootDir: '/mock/root',
  ...overrides,
})

export const mockBearNote = (id = 'abc123') => ({
  ZCREATIONDATE: 4,
  ZMODIFICATIONDATE: 5,
  ZTEXT: `${id} text`,
  ZTITLE: `${id} title`,
  ZUNIQUEIDENTIFIER: id,
})

export const mockMarkdownNote = (overrides?: Partial<MarkdownNote>): MarkdownNote => ({
  created: new Date(),
  externalUrl: '/external/path',
  id: 'abc123',
  modified: new Date(),
  primaryKey: 1,
  self: '/path/to/self',
  source: 'bear',
  text: 'note text',
  title: 'note title',
  ...overrides,
})
