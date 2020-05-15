const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();
const dbHelper = require('../db/dbHelper');

router.get('/all', function(req, res) 
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

router.get('/', function(req, res) 
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

router.post('/', function(req, res) 
{
  if(req.body.TypeID === null)
  {
    createSpiritType(req.body, (err, newId) => 
    {
      if(err) return res.status(400).send(err.message);

      return res.status(200).send(String(newId));
    });
  }
  else
  {
    updateSpiritType(req.body, (err, id) => 
    {
      if(err) return res.status(400).send(err.message);

      console.log('update done', id)
      return res.status(200).send(String(id));
    });
  }
});

router.delete('/', function(req, res) 
{ 
  dbHelper.getDatabase(sqlite3.OPEN_READWRITE, function (err)
  {
    const db = this;

    db.serialize(() => 
    {
      const statement = db.prepare('DELETE FROM SpiritType WHERE TypeID = ?');

      statement.run([req.query['id']], (err) =>
      {
        if(err)
        {
          res.status(400).send(err.message);
          return;
        }

        res.sendStatus(200);
      });

      statement.finalize();
    });

    db.close();
  });
});

function createSpiritType(newRecord, cb)
{
  dbHelper.getDatabase(sqlite3.OPEN_READWRITE, function (err)
  {
    if(err)
    {
      cb(err);
      return;
    }
    
    const db = this;

    db.serialize(() => 
    {
      db.run('INSERT INTO SpiritType (TypeName) VALUES (?)', [newRecord.TypeName], function (err)
      {
        if(err)
        {
          cb(err);
          return;
        }
  
        const newTypeID = this.lastID;

        if(newRecord.Variants.length)
        {
          const statement = db.prepare('INSERT INTO SpiritVariant (VariantName, SpiritTypeId) VALUES (?, ?)');

          for (let i = 0; i < newRecord.Variants.length; i++) 
          {
            const variant = newRecord.Variants[i];
            statement.run([variant.VariantName, newTypeID]);
          }

          statement.finalize();
        }
        
        cb(null, newTypeID);        
      });
    });    

    db.close();
  });
}

function updateSpiritType(record, cb) 
{
  dbHelper.getDatabase(sqlite3.OPEN_READWRITE, function (err)
  {
    if(err)
    {
      cb(err);
      return;
    }

    const db = this;

    db.serialize(() =>
    {
      db.run('UPDATE SpiritType SET TypeName = ? WHERE TypeID = ?', [record.TypeName, record.TypeID], function(err) 
      {
        if(err)
        {
          cb(err);
          return;
        }

        //TODO Update/Add/Delete any SpiritVariant records 

        cb(null, record.TypeID);
      });
    });
    
    db.close();
  });
}

module.exports = router;