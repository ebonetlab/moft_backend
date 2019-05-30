const fs = require('fs-extra');
const {Pool} = require('pg');
const config = require('../config/config.json');
let connexion = (process.platform == 'win32')  ?
 config.remote_home : 
 config.config.local;
const pool = new Pool(connexion);
let dateformat = require('dateformat');

let postgresql = {
    listUsers : ()=>{
        pool.connect((err, client, release) => {
            if (err) {
                return console.error(`Error conecting to ${connexion.database}`, err.stack)
            }
            //List all USers from moft_db & moft_user table
                let question = `The Users in moft_db are!!`;
            client.query(`select *
                          from users
                          order by first_name DESC;`,
                (err, result) => {
                    release();
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }

                    console.log(result.rows);
                    postgresql.consolePrinter(result.rows,1,question);
                });
        });
    },
    createUser : (user)=>{
        pool.connect((err, client, release) => {
            if (err) {
                return console.error(`Error conecting to ${connexion.database}`, err.stack)
            }
            //Create an User @ moft_user table
             
            client.query(`Insert into users (first_name,last_name,email, profile_path, token) 
            VALUES('${user.first_name}','${user.last_name}','${user.email}','${user.profile_path}','${user.token}')`,
                (err, result) => {
                    release();
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }
                    let question = `The User ${user.first_name} ${iser.last_name} has been created  moft_db!!`;
                    console.log(result.rows);
                    postgresql.consolePrinter(result.rows,1,question);
                });
        });
    },
    updateUser : (id)=>{
        pool.connect((err, client, release) => {
            if (err) {
                return console.error(`Error conecting to ${connexion.database}`, err.stack)
            }
            client.query(`Update 
                           users
                            set 
                            first_name = '${user.first_name}', 
                            last_name = '${user.last_name}' ,
                            email = '${user.email}',
                             profile_path = '${user.profile_path}', 
                             token = '${user.token}'
                             where id = ${id} ;`,
                (err, result) => {
                    release();
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }
                    let question = `The User ${user.first_name} ${iser.last_name} has been updated  moft_db!!`;
                     console.log(result.rows);
                    postgresql.consolePrinter(result.rows,1,question);
                });
        });
    },
    deletetUser : (id)=>{
        pool.connect((err, client, release) => {
            if (err) {
                return console.error(`Error conecting to ${connexion.database}`, err.stack)
            }
           
            client.query(`Delete *
                          from users where id='${id}'`,
                (err, result) => {
                    release();
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }
                    let question = `The Users with the id  ${id} has been removed!!`;
                    // console.log(result.rows);
                    postgresql.consolePrinter(result.rows,1,question);
                });
        });
    },
    consolePrinter: (rows, valor,question)=>{
        console.log(`${question} \n`);
        postgresql.log("./logs/output.txt", ` ${question}`);
        for(let current of rows){
            console.log(` • ${current['first_name']} ${current['last_name']} - ${current.email} users`);
            postgresql.log("./logs/output.txt", ` •  ${current['first_name']} ${current['last_name']} - ${current.email} users `);
        }
        postgresql.log("./logs/output.txt", ` \n`);
    },
    consoleBoard: (dayErrors, total)=>{
        console.log(`On which days did more than 1% of requests lead to errors ? `);
        postgresql.log("./logs/output.txt", `On which days did more than 1% of requests lead to errors ? `);
        let i =0;
        for(let current of dayErrors){
            let percent = ( parseInt(current.errors) / parseInt(total[i]['requests'])) * 100;
            if(percent >   1 )
            {
                console.log(` • ${dateformat(current.day, 'mmmm d, yyyy')} - ${percent.toFixed(1)} % errors`);
                postgresql.log("./logs/output.txt", ` • ${dateformat(current.day, 'mmmm d, yyyy')} - ${percent.toFixed(1)} % errors`);
            }
            i++;
        }
        console.log('\n');
        postgresql.log("./logs/output.txt", ` \n`);
    },
    log : (filename,info)=>{
        fs.appendFile(filename, `${info} \r\n` , err => {
            (err) ? console.log(err) :'';// => null
        });
    }
};

module.exports = postgresql;