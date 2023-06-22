const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;


// app.use(
//   cors({
//   origin: "",
//   methods: "GET,POST,PATCH,PUT,DELETE",
//   "Access-Control-Allow-Origin": "",
//   "Access-Control-Allow-Headers": "*",
//   })
//   );
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-6zwfy6k-shard-00-00.7ekmhn7.mongodb.net:27017,ac-6zwfy6k-shard-00-01.7ekmhn7.mongodb.net:27017,ac-6zwfy6k-shard-00-02.7ekmhn7.mongodb.net:27017/?ssl=true&replicaSet=atlas-5j3qmy-shard-0&authSource=admin&retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,

});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // console.log('before');
    client.connect((error) => {
      if (error) {
          console.error(error);
          return;
      }
  });
  // await client.connect();
// console.log('after');
    const carToyCollection = client.db("CarToy").collection("allToy");

    app.get("/postToy", async (req, res) => {
      const cursor = carToyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/simpleToys", async (req, res) => {
     let query ={}
     console.log(req.query);
      if(req.query?.email){
        query ={email:req.query.email}
      }   
      const result = await carToyCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/postToy", async (req, res) => {
      const postToy = req.body;
      console.log(postToy);
      const result = await carToyCollection.insertOne(postToy);
      res.send(result);
    });

    app.get("/singleToy/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {
          categoryName: 1,
          photo: 1,
          ToyName: 1,
          SellerName: 1,
          email: 1,
          price: 1,
          rating: 1,
          quantity: 1,
          description: 1,
        },
      };
      const result = await carToyCollection.findOne(query, options);
      res.send(result);
    });

    app.delete('/myToys/:id',async(req,res)=>{
      const id =req.params.id
      const query ={_id: new ObjectId(id)}
      const result =await carToyCollection.deleteOne(query)
      res.send(result)

    })
    
    app.get('/myToys/:id',async(req,res)=>{
      const id =req.params.id
    
      const query={_id: new ObjectId(id)}
   
     const result= await carToyCollection.updateOne(query)
     res.send(result)
      
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`assignment is running ${port}`);
});
