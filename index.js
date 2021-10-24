const express = require('express');
const { MongoClient } = require('mongodb');

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();


const port = 5000;
//middleware middle

app.use(cors());
app.use(express.json());






const uri = "mongodb+srv://mydbuser1:@cluster0.5bgr9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("shopping-cart");
      const userCollection = database.collection("products");
      // create a document to insert
      /*  const doc = {
        name: "Laptop",
        price: "22000",
        quantity: "1",
      }
      const result = await userCollection.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`); */

      //  get api for read, show or find 
      app.get('/products', async (req, res) => {
        const cursor = userCollection.find({});
        const product = await cursor.toArray();
        res.send(product);
    });
    // dynamic api for update products
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await userCollection.findOne(query);
      console.log('load user with id: ', id);
      res.send(product);
  })

    // post api for add or insert
      app.post('/products', async (req, res) => {
        const newProduct = req.body;
        const result = await userCollection.insertOne(newProduct);
        console.log('hitting products', req.body);
        console.log('got new products', result);
        res.send(result);
      })
      // for delete products
      app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        console.log('deleting user with id ', result);
        res.json(result);
      })

      // update
      app.put('/products/:id', async (req, res) => {
          const id = req.params.id;
          const updatedProduct = req.body;
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
                name: updatedProduct.name,
                price: updatedProduct.price,
                quantity: updatedProduct.quantity
            },
        };
        const result = await userCollection.updateOne(filter, updateDoc, options)
        console.log('updating', id)
        res.json(result)
      })
     



    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('running')
})
app.listen(port, () =>{
    console.log('listening on port', port)
});