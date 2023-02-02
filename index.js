const express = require("express");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const { query } = require("express");
const port = process.env.PORT || 5000;

// middle wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2o6q0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Database connection successful.");
    const database = client.db("test-react");

    const sectorCollection = database.collection('sectors');
    const userProfileCollection = database.collection('user-profile');

    // Get all sectors
    app.get("/sectors", async (req, res) => {
      const cursor = sectorCollection.find({});
      const sectors = await cursor.toArray();
      return res.json(sectors);
    });

    // Save user to the database
    app.post('/user-profile', async (req, res) => {
      const user = req.body;
      const result = await userProfileCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // Get a user
    app.get("/users/:profileId", async (req, res) => {
      
      const profileId = req.params?.profileId;
      console.log(profileId)
      const query = { _id: ObjectId(profileId) };
      const userProfile = await userProfileCollection.findOne(query);
      res.json(userProfile);
    })


    // Update an order
    // app.put('/orders/:orderId', async (req, res) => {
    //   const orderId = req.params?.orderId;
    //   const query = { _id: ObjectId(orderId) };
    //   const cursor = await ordersCollection.findOne(query);
    //   let message = "";
    //   if (cursor.status === 'shipped') {
    //     message = "Already shipped!!!";
    //   }
    //   else {
    //     const options = { $set: { status: 'shipped' } }
    //     const cursor2 = await ordersCollection.updateOne(query, options);
    //     message = "Product shipped."
    //   }

    //   res.json({ message: message });

    // });


  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the Server!!!");
});

app.listen(port, () => {
  console.log("Server listening at port ", port);
});
