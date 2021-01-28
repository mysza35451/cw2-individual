var express = require("express");
const router= express.Router();
var app = express();
app.use(express.json());
app.use("/", express.static(__dirname + "/"));

const https = require('https');
const { MongoClient } = require("mongodb");

const url = "mongodb+srv://mm3299:Password123@cluster0.lkvin.mongodb.net/cw2individual?retryWrites=true&w=majority";

const client = new MongoClient(url);
const dbName = "cw2individual";

const body_parser = require("body-parser");

beginConnection();


let arrayOfClasses = [];
app.post("/api/lessons", async(request, response) => {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    // Use the collection
    console.log("search options " + request.body);
  const col = db.collection("Lessons");      
  // Find one document
  const myDoc = await col.find({}).toArray();
  // Print to the console
  console.log(myDoc);
response.json(myDoc);
   
   } catch (err) {
    console.log(err.stack);
}

  
});
             
router.post("/lessons",async(req,res)=>{
        await client.connect();
         console.log("Connected correctly to server");
         // Use the collection "people"
        
  res.send(myDoc)
})

//start the server
app.listen(process.env.PORT || 5000) //heroku automatically assigns a port, 5000 alone will cause an timeout

console.log("Server running at: http://localhost:5000");

async function loadLessons(){
  const client=await mongodb.MongoClient.connect(url, { useNewUrlParser: true })

  return client.db(dbName).collection("Lessons")
}

async function beginConnection() {


   
}