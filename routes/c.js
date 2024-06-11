const express = require('express')
const router = express.Router()
const app = express()
const path = require("path")



// define the home page route
router.get("/", (req, res) => {
    res.render("notes/C-notes/c.hbs")
})
// define the about route
router.get('/syntax-of-c', (req, res) => {
  res.render("notes/C-notes/Syntaxofc.hbs")
})
router.get('/comments-in-c', (req, res) => {
  res.render("notes/C-notes/Commentsinc.hbs")
})



module.exports = router