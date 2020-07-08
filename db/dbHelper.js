const sqlite3 = require('sqlite3');
const dbPath = './db/spiritz.db';

module.exports = {
    
    getDatabase(mode, callback) 
    {
        if(callback) return new sqlite3.Database(dbPath, mode, callback);
        
        return new sqlite3.Database(dbPath, mode);
    }
}
