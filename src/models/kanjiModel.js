const connection = require("../config/database");

class KanjiModel {
  static async getAllKanji() {
    const query = "SELECT * FROM kanji_characters";
    try {
      const [results] = await connection.execute(query);
      return results;
    } catch (error) {
      throw new Error("Database query error");
    }
  }
  static async getKanjiById(id) {
    const query = "SELECT * FROM kanji_characters WHERE id = ?";
    try {
      const [results] = await connection.execute(query, [id]);
      return results[0];
    } catch (error) {
      throw new Error("Error fetching kanji by ID");
    }
  }

  static async addKanji(kanjiCharacter, readingOn, readingKun, meanings) {
    const query = `INSERT INTO kanji_characters (kanji_character, readings_on, readings_kun, meaning) VALUES (?,?,?,?)`;
    try {
      const [results] = await connection.execute(query, [
        kanjiCharacter,
        readingOn,
        readingKun,
        meanings,
      ]);
      return results;
    } catch (error) {
      throw new Error("Error inserting kanji");
    }
  }

  static async updateKanji(
    id,
    kanjiCharacter,
    readingOn,
    readingKun,
    meanings
  ) {
    const query = `UPDATE kanji_characters SET kanji_character = ?, readings_on = ?, readings_kun = ?, meaning = ? WHERE id = ?`;
    try {
      const [results] = await connection.execute(query, [
        kanjiCharacter,
        readingOn,
        readingKun,
        meanings,
        id,
      ]);
      return results;
    } catch (error) {
      throw new Error("Error updating kanji");
    }
  }

  static async deleteKanji(id) {
    const query = `DELETE FROM kanji_characters WHERE id = ?`;
    try {
      const [results] = await connection.execute(query, [id]);
      return results;
    } catch (error) {
      throw new Error("Error deleting kanji");
    }
  }
}

module.exports = KanjiModel;
