import { displayToast } from "@/utils/toast"
import * as SQLite from "expo-sqlite"

export default class DataBaseHandler {
  db: SQLite.SQLiteDatabase
  
  constructor(db: SQLite.SQLiteDatabase) {
    try{
     this.db = db
     this.db.execSync(`
      CREATE TABLE IF NOT EXISTS words (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      words TEXT UNIQUE NOT NULL,
      timesUsed INTEGER DEFAULT 0
     );
    `)
    // this.db.execSync('drop table words')
      displayToast('Sucesso ao iniciar o banco de dados')
    } catch (error) {
      displayToast(String(error))
      console.error(error)
    }
  }


  insertWordIntoDb(word: string) {
    try {
      this.db.execSync(`
        INSERT INTO words (words, timesUsed)
        VALUES ('${word}', 1)
      `)
      displayToast('Palavra inserida no banco de dados')
    } catch {
      this.db.execSync(`
        UPDATE words
        SET timesUsed = timesUsed + 1
        WHERE words = '${word}'
      `)
      displayToast('Palavra atualizada no banco de dados')
    }
  }

  getSimilarWords(word: string): Array<string> {
    try {
      console.debug(word)
      const query = `
        SELECT words FROM words
        WHERE words LIKE '%${word}%'`
      const similarWords = this.db.getEachSync(query)
      var words = new Array<string>
      for (var w of similarWords) {
        // TODO fix this comparison but keep TypeScript safe
        if (typeof(w) == "object" && w != null && 'words' in w && typeof(w.words) == 'string'){
          words.push(w.words)
        }
      }
      return words
    } catch (error) {
      console.error(error)
      displayToast('Houve um erro recuperando as palavras')
    }
    return ['']
  }
}