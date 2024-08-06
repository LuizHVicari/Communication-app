import { enablePromise, openDatabase, SQLiteDatabase } from "react-native-sqlite-storage"

export const getDBConnection = async () => {
  return await openDatabase({
    name: 'noVerbalApp.db',
    location: 'default'
  })
 }

export const createWordsTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS words (
    word TEXT UNIQUE NOT NULL,
    timesUsed INT NOT NULL DEFAULT 0
  );`

  await db.executeSql(query)
}

export const getSimilarWords = async (db: SQLiteDatabase, word: string) => {
  const words: Array<String> = []
  const query = `
    SELECT word FROM words 
      WHERE word LIKE %${word.toUpperCase()}%
      ORDER BY timesUsed DESC;`
  const queryResults = await db.executeSql(query)
  queryResults.forEach(result => {
    words.push(String(result).toUpperCase())
  })
  return words
}

export const insertWordIntoDB = async (db: SQLiteDatabase, word: string) => {
  const query = `INSERT INTO words (word, itemsUsed) values ${word.toUpperCase()}`
  try {
    await db.executeSql(query)
  } catch {
    const query = `
      UPDATE words 
        SET timesUsed = timesUsed + 1
        WHERE word = ${word}`
    await db.executeSql(query)
  }
}


enablePromise(true)