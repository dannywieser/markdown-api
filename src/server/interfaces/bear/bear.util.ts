import { Database } from 'sqlite'

import { noteByTitle } from './database'

/**"
 * Bear wiki-style links to other notes are saved in the format "[[Note Title]]".
 * The marked js lexer doesn't process these because it really can't link this to the right spot.
 * This function will:
 *     - locate all wikilinks via a regex
 *     - find the **first** matching note via a title lookup
 *     - replace the wikilink "[[title]]" with a normal link "[title](/note/id)" in the note's raw text
 */
export default async function handleWikiLinks(rawNote: string, db: Database) {
  const wikilinkRegex = /\[\[(.+?)\]\]/g
  const matches = rawNote.matchAll(wikilinkRegex)

  for (const match of matches) {
    const wikiLinkText = match[1]
    const fullMatch = match[0]
    const matchedNote = wikiLinkText ? await noteByTitle(wikiLinkText, db) : undefined
    if (matchedNote) {
      const regularLink = `[${wikiLinkText}](/note/${matchedNote?.ZUNIQUEIDENTIFIER})`
      rawNote = rawNote.replace(fullMatch, regularLink)
    }
  }
  return rawNote
}
