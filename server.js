var express = require("express");

const { MongoClient } = require("mongodb");

const url = "mongodb+srv://mm3299:Password123@cluster0.lkvin.mongodb.net/cw2individual?retryWrites=true&w=majority";

const client = new MongoClient(url);
const dbName = "cw2individual";

             
async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);
         // Use the collection "people"
         const col = db.collection("Lessons");
         // Construct a document                                                                                                                                                              
         let personDocument = {
            
                
                "img": "./IMG/history.png",
                "subject": "History",
                "location": "London",
                "price": 100,
                "spaces": 5
              
         }
         // Insert a single document, wait for promise so we can read it back
         const p = await col.insertOne(personDocument);
         // Find one document
         const myDoc = await col.findOne();
         // Print to the console
         console.log(myDoc);
        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}
//Status codes defined in external file
//use the application off of express.
var app = express();
app.use(express.json());
//define the route for "/"
app.get("/", function (request, response) {
  //show this file when the "/" is requested
  response.sendFile(__dirname + "/index.html");
});
app.use("/", express.static(__dirname + "/"));


// routes

// app.get("/api", (request, response) => {
//   response.json(returnSearch);
// });
// app.post("/api", (request, response) => {
//   console.log(request.body);
//   let search = request.body.searchValue;
//   con.query(
//     "SELECT * FROM games WHERE productName LIKE '%" + search + "%'",
//     function (err, result) {
//       if (err) throw err;
//       else {
//         response.json(result);
//       }
//     }
//   );
// });
//start the server
run().catch(console.dir);
app.listen(8080);

console.log("Server running at: http://localhost:8080");
