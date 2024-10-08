class SideController {
  // Use export instead of module.exports
  index(req, res) {
    res.render("home.ejs");
  }
}

module.exports = new SideController();
