const mysql=require("mysql2");
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"9595",
    database:"placement_portal"
})
connection.connect((error)=>{
    if(error){
        console.log("connection is failed");
        console.log(error);

    }else{
        console.log("connected to database");
    }
})
module.exports=connection;
