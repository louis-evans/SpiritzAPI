const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();
const dbHelper = require('../db/dbHelper');

router.get('/all', function(req, res, next) 
{
  dbHelper.getDatabase(sqlite3.OPEN_READONLY, function (err)
  {
    if(err) return res.sendStatus(500).send(err.message);
    
    this.serialize(() => 
    {
        this.all("SELECT CountryId, CountryName FROM Country", (err, rows) => 
        {
          if(err) return res.sendStatus(400).send(err.message);

          res.json(rows);
        })
        .close();
    });
  });
});

router.post('/add', function(req, res, next) 
{
  dbHelper.getDatabase(sqlite3.OPEN_READWRITE, function (err)
  {
    if(err) return res.sendStatus(500).send(err.message);

    this.run(`INSERT INTO Country(CountryName) VALUES(?)`, [req.body.name], function (err)
    {
      if (err) return res.sendStatus(400).send(err.message);

      res.json({
        CountryId: this.lastID,
        CountryName: req.body.name
      });
    })
    .close();
  });
});

router.delete('/', function(req, res, next)
{
    dbHelper.getDatabase(sqlite3.OPEN_READWRITE, function (err)
    {
      if(err) return res.sendStatus(500).send(err.message);

      this.run(`DELETE FROM Country WHERE CountryId = (?)`, [req.query['id']], function (err)
      {
        if (err) return res.sendStatus(400).send(err.message);
          
        res.sendStatus(200);
      })
      .close();
    });
});

module.exports = router;
