const express = require('express');
const { MongoClient } = require('mongodb');
// ObjectId is imported that is how it is at database
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
// cors and json
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibvkx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelSylhet');
        const servicesCollection = database.collection('services')

        // adding GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        // GET a single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hitting specific service', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)

            const result = await servicesCollection.insertOne(service);
            console.log(result);

            res.json(result)

        })

        // DELETE API operation
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Sylhet Travel');
});

app.get('/hello', (req, res) => {
    res.send('hello heroku! updated here.')
})

app.listen(port, () => {
    console.log('running Travel Sylhet on port', port);
})