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
        this.all("SELECT TypeID, TypeName FROM SpiritType", (err, rows) => 
        {
          if(err) return res.sendStatus(400).send(err.message);

          res.json(rows);
        })
        .close();
    });
  });
});

router.get('/', function(req, res, next) 
{
  dbHelper.getDatabase(sqlite3.OPEN_READONLY, function (err)
  {
    if(err) return res.sendStatus(500).send(err.message);
    
    this.serialize(function ()
    {
        this.get("SELECT TypeID, TypeName FROM SpiritType WHERE TypeID = (?)", [req.query['id']], (err, typeRecord) => 
        {
          if(err) return res.sendStatus(400).send(err.message);

          this.all("SELECT VariantId, VariantName FROM SpiritVariant WHERE SpiritTypeId = (?)", [typeRecord.TypeID], (err, variantRecords) => {

            if(err) return res.sendStatus(400).send(err.message);

            typeRecord.Variants = variantRecords

            res.json(typeRecord);

          });

          
        })
        .close();
    });
  });
});

module.exports = router;