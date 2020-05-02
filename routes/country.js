const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();

router.get('/all', function(req, res, next) {

  const db = new sqlite3.Database('./db/spiritz.db', sqlite3.OPEN_READONLY, (err) => {

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

router.delete('/', function(req, res, next){
    console.log(req.query['id']);
    res.send('OK');
})

module.exports = router;
