const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config()
app.use(express.json())
app.use(cors())

// mongodb


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-euh9qdo-shard-00-00.hbyxuz9.mongodb.net:27017,ac-euh9qdo-shard-00-01.hbyxuz9.mongodb.net:27017,ac-euh9qdo-shard-00-02.hbyxuz9.mongodb.net:27017/?ssl=true&replicaSet=atlas-ny4qda-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyCollection = client.db('toyDB').collection('AddToy')

    // post add a toy
    app.post('/toys', async (req, res) => {
      const newToy = req.body;
      console.log(newToy)
      const result=await toyCollection.insertOne(newToy)
      res.send(result)
    })


    // get method
    app.get('/toys', async(req, res)=>{
      const result=await toyCollection.find().toArray()
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Toy Joy Online is running')
})

app.listen(port, () => {
  console.log(`Toy Joy Online is listening on port ${port}`)
})