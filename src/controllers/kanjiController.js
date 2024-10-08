const KanjiModel = require("../models/kanjiModel");

class KanjiController {
  async index(req, res) {
    try {
      const kanjiData = await KanjiModel.getAllKanji();
      res.render("kanji.ejs", { kanjiData });
      // res.send({ kanjiData });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Database error");
    }
  }

  async getCreatePage(req, res) {
    try {
      res.render("createKanji.ejs");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Database error");
    }
  }

  async create(req, res) {
    try {
      const { kanjiCharacter, readingOn, readingKun, meanings } = req.body;
      const results = await KanjiModel.addKanji(
        kanjiCharacter,
        readingOn,
        readingKun,
        meanings
      );
      res.status(201).send({
        message: "Kanji added successfully",
        id: results.insertId,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: "Error inserting kanji" });
    }
  }

  async getUpdatePage(req, res) {
    const id = req.params.id;
    try {
      const kanji = await KanjiModel.getKanjiById(id); // Fetch the Kanji character by ID
      if (!kanji) {
        return res.status(404).send({ message: "Kanji not found" });
      }
      res.render("updateKanji.ejs", { kanji });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Database error");
    }
  }
  async update(req, res) {
    try {
      const id = req.params.id;
      const { kanjiCharacter, readingOn, readingKun, meanings } = req.body;

      if (!id) {
        return res.status(400).send({ message: "Kanji ID is required" });
      }

      const results = await KanjiModel.updateKanji(
        id,
        kanjiCharacter,
        readingOn,
        readingKun,
        meanings
      );

      if (results.affectedRows === 0) {
        return res.status(404).send({ message: "Kanji not found" });
      }

      res.status(200).send({
        message: "Kanji updated successfully",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: "Error updating kanji" });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).send({ message: "Kanji ID is required" });
      }

      const results = await KanjiModel.deleteKanji(id);

      if (results.affectedRows === 0) {
        return res.status(404).send({ message: "Kanji not found" });
      }

      res.status(200).send({
        message: "Kanji deleted successfully",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: "Error deleting kanji" });
    }
  }
}

module.exports = new KanjiController();
