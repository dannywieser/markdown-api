import { MarkdownNoteFile } from '../../types'
import { makeBearImagesExtension } from './bearImages'

const image1 = {
  directory: 'dir1',
  file: 'CleanShot 2025-05-05 at 11.16.44@2x.png',
  path: '/images/dir1/CleanShot 2025-05-05 at 11.16.44@2x.png',
}
const image2 = {
  directory: 'dir2',
  file: 'other.png',
  path: '/images/dir2/other.png',
}
const images: MarkdownNoteFile[] = [image1, image2]

describe('makeBearImagesExtension', () => {
  const extension = makeBearImagesExtension(images)
  // The typing for TokenizerExtension is quite picky so I'm just ignoring for the scope of testing.
  const tokenizer = extension.tokenizer as unknown as (src: string) => unknown

  test('matches a valid image link and returns the correct token', () => {
    const src = '![](CleanShot%202025-05-05%20at%2011.16.44@2x.png)'
    const token = tokenizer(src)
    expect(token).toEqual({
      href: encodeURI(image1.path),
      raw: src,
      type: 'image',
    })
  })

  it('returns undefined if the image link is not at the start', () => {
    const src = 'foo ![](CleanShot%202025-05-05%20at%2011.16.44@2x.png)'
    const token = tokenizer(src)
    expect(token).toBeUndefined()
  })

  it('returns a token with href "invalid" if the file is not found', () => {
    const src = '![](notfound.png)'
    const token = tokenizer(src)
    expect(token).toEqual({
      href: 'invalid',
      raw: src,
      type: 'image',
    })
  })

  it('returns undefined if the string does not match the image pattern', () => {
    const src = 'no image here'
    const token = tokenizer(src)
    expect(token).toBeUndefined()
  })

  it('decodes the filename before matching', () => {
    const src = '![](other.png)'
    const token = tokenizer(src)
    expect(token).toEqual({
      href: encodeURI(image2.path),
      raw: src,
      type: 'image',
    })
  })
})
