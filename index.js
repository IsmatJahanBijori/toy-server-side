const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config()
app.use(express.json())
app.use(cors())

// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // await client.connect();
    const toyCollection = client.db('toyDB').collection('AddToy')

    // post add a toy
    app.post('/toys', async (req, res) => {
      const newToy = req.body;
      // bhul hole bad dibo
      body.createdAt = new Price()
      console.log(newToy)
      const result = await toyCollection.insertOne(newToy)
      res.send(result)
    })

    // sorting
    // bhul hole bad dibo start
    const indexKeys = { price: 1 }
    const indexOption = { name: "Price" }
    const result = await toyCollection.createIndex(indexKeys, indexOption)
    // bhul hole bad dibo end,47 no  niche theke sort o bad dibo
    // get method
    app.get('/toys', async (req, res) => {
      const result = await toyCollection.find().toArray()
      res.send(result)
    })



    // search text
    app.get('/getToysByName/:text', async (req, res) => {
      const searchName = req.params.text;
      const result = await toyCollection.find({
        $or: [{ toyName: { $regex: searchName, $options: "i" } }]
      }).sort({price:1, createdAt: -1 }).limit(20).toArray()
      res.send(result)
    })




    // get method by id
    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const filter = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(filter)
      res.send(result)
    })

    // to find a specific persons shop info we need to use query params
    app.get('/myToys', async (req, res) => {
      // const email=req.query.email;
      // console.log(email)
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
        console.log(query)
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result)
    })



    // mytoys get
    app.get('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const filter = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(filter)
      res.send(result)
    })
    // myToys update

    app.put('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedToys = req.body;
      const myToys = {
        $set: {
          price: updatedToys.price,
          quantity: updatedToys.quantity,
          description: updatedToys.description,

        }
      }
      const result = await toyCollection.updateOne(filter, myToys, options)
      res.send(result)
    })

    // delete toys
    app.delete('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(filter)
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