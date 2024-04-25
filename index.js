const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// middlewares:
app.use(cors());
app.use(express.json());

// mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j7c4zww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      //   await client.connect();

      // Create Database and Collection
      const database = client.db("potteriaDB");
      const usersCollection = database.collection("users");
      const itemsCollection = database.collection("items");

      // User Related APIs

      // POST API to create a user
      app.post("/users", async (req, res) => {
         const user = req.body;
         console.log(user);
         const result = await usersCollection.insertOne(user);
         res.send(result);
      });

      // Items Related APIs

      // GET API to view all items
      app.get("/items", async (req, res) => {
         const cursor = itemsCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      });

      // GET API to view a single item
      app.get("/items/:id", async (req, res) => {
         const searchId = req.params.id;
         const query = { _id: new ObjectId(searchId) };
         const result = await itemsCollection.findOne(query);
         res.send(result);
      });

      // GET API to view all items according to email filter
      app.get("/items/users/:email", async (req, res) => {
         const searchEmail = req.params.email;
         const query = { user_email: searchEmail };
         const cursor = itemsCollection.find(query);
         const result = await cursor.toArray();
         res.send(result);
      });

      // POST API to create an item
      app.post("/items", async (req, res) => {
         const item = req.body;
         console.log(item);
         const result = await itemsCollection.insertOne(item);
         res.send(result);
      });

      // DELETE API to delete an item
      app.delete("/items/:id", async (req, res) => {
         const deleteId = req.params.id;
         const query = { _id: new ObjectId(deleteId) };
         const result = await itemsCollection.deleteOne(query);
         res.send(result);
      });

      // Send a ping to confirm a successful connection
      //   await client.db("admin").command({ ping: 1 });
      console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
      );
   } finally {
      // Ensures that the client will close when you finish/error
      //   await client.close();
   }
}
run().catch(console.dir);

// test route
app.get("/", (req, res) => {
   res.send(`Potteria Server running at port: ${port}`);
});

app.listen(port, () => {
   console.log(`Potteria Server running at port: ${port}`);
});
