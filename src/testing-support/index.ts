export function asMock(targetFn: unknown): jest.Mock {
  return targetFn as jest.Mock
}
