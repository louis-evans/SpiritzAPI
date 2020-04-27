const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  let db = new sqlite3.Database('./db/spiritz.db', sqlite3.OPEN_READONLY, (err) => {

    if(err) {
      res.send('error');
      return;
    }

    res.send('opened DB!');

  });

  db.close(err => {
    if(err) res.send('error closing db');
  })

});

module.exports = router;
