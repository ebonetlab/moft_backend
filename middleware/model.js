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
    getdate: function () {
        var date = new Date();
        var d = date.getFullYear()+"-"+((date.getMonth() < 10) ? "0"+date.getMonth() : date.getMonth())+"-"+((date.getDate() < 10) ? "0"+date.getDate() : date.getDate())+" "+date.getHours()+":"+date.getMinutes()+":"+((date.getSeconds()<10) ? "0"+date.getSeconds() : date.getSeconds());
        return d;
    },
    updateLastLogin :(email)=>{
        console.log('Executed updateLastLogin function for ' + email);
        return new Promise((resolve, reject) => {
            let query  = `Update users set updated_at = '${postgresql.getdate()}' from users  where email =  '${email}'`;
            db.exec(query,  function(response){
 
                (response) ? resolve(response):reject(false);
            });             
       
   
        })  

    }
     ,
    findUser : (payload)=>{
        console.log('Executed findUser function ' + payload.name);
        return new Promise((resolve, reject) => {
            let query  = `select * from users  where email =  '${payload.email}'`;
            db.exec(query,  function(response){
 
                (response) ? resolve(response):reject(false);
            });             
       
   
        })      
 
    },
    createUser : (user)=>{
        return new Promise((resolve, reject) => {
         //Create an User @ moft_user table
         console.log('Executed createUser function ' + user)
            let query = `Insert into users (first_name,last_name,email, profile_path, gtoken) 
            VALUES('${user.user.ofa}','${user.user.wea}','${user.user.U3}','${user.user.Paa}','${user.auth.id_token}')`;
            db.exec(query,  function(response){
   
                (response) ? resolve(response):reject(false);
            }); 
        })     
    },
    createSingleUser : (user)=>{
        return new Promise((resolve, reject) => {
         //Create an User @ moft_user table
         console.log('Executed create Single User function ' + user)
            let query = `Insert into users (first_name,last_name,email, single_token) 
            VALUES('${user.first_name}','${user.last_name}','${user.email}','${user.single_token}')`;
            db.exec(query,  function(response){
   
                (response) ? resolve(response):reject(false);
            }); 
        })     
    },
    createLog: (action)=>{
        return new Promise((resolve, reject) => {
            //Create a log entry @ moft_logs table
   db.exec(`INSERT INTO logs(action) VALUES ('${action})')`, null, function (r) {
        console.info(r);
        (response) ? resolve(response):reject(false);
    }); 
})  
      
 
},
   updateUser : (user)=>{
        return new Promise((resolve, reject) => {
        let query = `Update 
        users
         set 
         gtoken = '${user.token}'
          where email = '${user.email}' `;
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