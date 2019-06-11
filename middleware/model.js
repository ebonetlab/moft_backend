const db = require('./database');
let dateformat = require('dateformat'),
fs = require('fs');

let postgresql = {
  
     listUsers : ()=>{
        return new Promise((resolve, reject) => {
            let query  = `select * from users order by first_name DESC`;
            console.log('Executed List User function ');
            db.exec(query,  function(response){
                 //List all USers from moft_db & moft_user table
                // let question = `The Users in moft_db are!!`;
                //postgresql.consolePrinter(response,1,question);
                (response) ? resolve(response):reject(false);
            });             
       
   
        })      
 
    },
    findUser : (token)=>{
        console.log('Executed findUser function ' + token);
        return new Promise((resolve, reject) => {
            let query  = `select * from users  where token like  '%${token}%'`;
            db.exec(query,  function(response){
                 //List all USers from moft_db & moft_user table
                // let question = `The Users in moft_db are!!`;
                //postgresql.consolePrinter(response,1,question);
                (response) ? resolve(response):reject(false);
            });             
       
   
        })      
 
    },
    createUser : (user)=>{
        return new Promise((resolve, reject) => {
         //Create an User @ moft_user table
         console.log('Executed createUser function ' + user)
            let query = `Insert into users (first_name,last_name,email, profile_path, token) 
            VALUES('${user.user.ofa}','${user.user.wea}','${user.user.U3}','${user.user.Paa}','${user.auth.id_token}')`;
            db.exec(query,  function(response){
           //let question = `The User ${user.first_name} ${iser.last_name} has been created  moft_db!!`;
                //postgresql.consolePrinter(response,1,question);
                (response) ? resolve(response):reject(false);
            }); 
        })     
    },
    updateUser : (token)=>{

        /*let query = `Update 
        users
         set 
         first_name = '${user.user.ofa}', 
         last_name = '${user.user.wea}',
          profile_path = '${user.user.Paa}', 
          token = '${user.auth.id_token}'
          where email = '${user.user.U3}' `;*/

        return new Promise((resolve, reject) => {
        let query = `Update 
        users
         set 
         token = '${token}'
          where token = '${token}' `;
          console.log('Executed UpdatedUser function ');
          db.exec(query,  function(response){
            //let question = `The User ${user.first_name} ${user.last_name} has been updated  moft_db!!`;
                 //postgresql.consolePrinter(response,1,question);
                 (response) ? resolve(response):reject(false);
             }); 
            })     
        
    },
    deletetUser : (email)=>{
                  let query =`Delete * from users where email='${email}'`;
                  console.log('Executed UpdatedUser function ' + email);
                  db.exec(query,  function(response){
                    let question = `The Users with the id  ${id} has been removed!!`;
                         //postgresql.consolePrinter(response,1,question);
                         (response) ? resolve(response):reject(false);
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