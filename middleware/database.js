const fs = require('fs-extra');
const {Pool} = require('pg');
const config = require('../config/config.json');
const logging = require('./logging.js');
let connexion = (process.platform == 'win32')  ? config.local : config.production;
const pool = new Pool(connexion);
var db = module.exports = {
    exec: function (query, callback) {
        pool.connect((err, client, release) => {
            if (err) {
                console.log(query);
                logging.write("./logs/database_error.log", err);
                db.error(query, err);
                if (connexion) {connexion.destroy();}
                console.error(`Error conecting to ${connexion.database}`, err.stack)
                callback(false, err);

            }
        
            client.query(query,(err, result) => {
                   
                    if (err) {
                        release();
                        return console.error('Error executing query', err.stack)
                    }
                    return (result) ? callback(result, err) : db.error(err,q);   
                });
        });
    },

    error: function (req, err) {
        logging.write("../logs/database_error.log", req);
        logging.write("../logs/database_error.log", JSON.stringify(err));
        throw err;
    }
}


