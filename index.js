const express = require('express')
require ('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hxdwxas.mongodb.net/?retryWrites=true&w=majority`;


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
    const database = client.db("allCoffeeDB")
    const coffeeCollection = database.collection("allCoffee")
    app.get('/allCoffee' , async(req , res)=>{
       const cursor = coffeeCollection.find()
       const allCoffee = await cursor.toArray()
       res.send(allCoffee)
    })
    app.get('/coffee/:id' , async(req , res)=>{
       const id = req.params.id
       const query = {_id:new ObjectId(id)}
       const coffee = await coffeeCollection.findOne(query)
       res.send(coffee)
    })
    app.post('/allCoffee' , async(req , res)=>{
        const coffee = req.body
        console.log(coffee)
        const result = await coffeeCollection.insertOne(coffee)
        res.send(result)
    })
    app.put('/allCoffee/:id' , async(req , res)=>{
      const coffee = req.body
       const id = req.params.id
       const filter = {_id: new ObjectId(id)}
       const options = { upsert: true };
       const updatedCoffee = {
        $set:{
          name:coffee.name,
          photo:coffee.photo,
          chef:coffee.chef,
          price:coffee.price

        }
       }
       const result = await coffeeCollection.updateOne(filter , updatedCoffee , options)
       res.send(result)

    })
    app.delete('/allCoffee/:id' , async(req , res)=>{
       const id = req.params.id
       const query = {_id : new ObjectId(id)}
       const result = await coffeeCollection.deleteOne(query)
       res.send(result)
    })
    app.delete('/allCoffee' , async(req , res)=>{
       const result = await coffeeCollection.deleteMany()
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


app.get('/' , (req ,res) => {
    res.send("The server has stated now")
})
app.listen(port , () =>{
    console.log(`The server is running on port ${port}`)
})
