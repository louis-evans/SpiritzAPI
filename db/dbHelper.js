const sqlite3 = require('sqlite3');

module.exports = {
    
    getDatabase(mode, callback) 
    {
        if(callback) return new sqlite3.Database('./db/spiritz.db', mode, callback);
        
        return new sqlite3.Database('./db/spiritz.db', mode);
    }
}