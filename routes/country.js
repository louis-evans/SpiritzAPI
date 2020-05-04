const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();

const getDatabase = (mode, callback) => {
  return new sqlite3.Database('./db/spiritz.db', mode, callback);
};

router.get('/all', function(req, res, next) {

  const db = getDatabase(sqlite3.OPEN_READONLY, (err) => {

    if(err) 
    {
      res.send('error');
      return;
    }

    db.serialize(() => 
    {
        db.all("SELECT CountryId, CountryName FROM Country", (err, rows) => 
        {
            res.json(rows);
        })
        .close(err => 
        {
            if(err) console.error('Error closing Db!', err.message);
        });
    });
  });
});

router.post('/add', function(req, res, next) 
{
  const db = getDatabase(sqlite3.OPEN_READWRITE, (err) => {

    db.run(`INSERT INTO Country(CountryName) VALUES(?)`, [req.body.name], function (err)
    {
      if (err) 
      {
        res.sendStatus(400);
        return;
      }

      res.json({
        CountryId: this.lastID,
        CountryName: req.body.name
      });

    });
  });
});

router.delete('/', function(req, res, next){

    const db = getDatabase(sqlite3.OPEN_READWRITE, (err) => {

      db.run(`DELETE FROM Country WHERE CountryId = (?)`, [req.query['id']], function (err)
      {
        if (err) 
        {
          res.sendStatus(400);
          return;
        }
  
        res.send('OK');
      });
    });
})

module.exports = router;
