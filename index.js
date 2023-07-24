const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()


// middle wars
app.use(cors());
app.use(express.json());




// //////////////////MongoBD\\\\\\\\\\\\\\\\\\\


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwz0znz.mongodb.net/?retryWrites=true&w=majority`;

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
        const usersCollection = client.db('ambition').collection("users");
        const collageInfo = client.db('ambition').collection("collegeinfo");
        const Enrolls = client.db('ambition').collection("enrolls");

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email }
            const result = await usersCollection.findOne(filter)
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });



        app.patch('/enrolluser/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const options = { upsert: true };
            const update = req.body;
            const add = {
                $set: {
                    name: update.name,
                    email: update.email,
                    photoURL: update.photoURL,
                    date: update.date,
                    picture: update.picture,
                    subject: update.subject,
                    address: update.address,
                    collegeName: update.collegeName,
                    image: update.image,
                    ratings: update.ratings,
                    research: update.research,
                    admissionDates: update.admissionDates,
                    process: update.process,
                    events: update.events,
                    works: update.works,
                    researchHistory: update.researchHistory,
                    sports: update.sports
                }
            };
        
            try {
                const result = await usersCollection.updateOne(filter, add, options);
                res.json({ success: true, message: 'Enrollment added successfully.' });
            } catch (error) {
                console.error('Error while updating enrollment:', error);
                res.status(500).json({ success: false, message: 'An error occurred while updating enrollment.' });
            }
        });
        

    
        app.get('/collages', async (req, res) => {
            const result = await collageInfo.find().toArray()
            res.send(result);
        })

        app.get('/collages/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await collageInfo.findOne(filter);
            res.send(result);
        });

        app.get('/admission/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await collageInfo.findOne(filter);
            res.send(result);
        });

        app.post('/enroll', async (req, res) => {
            const enroll = req.body;
            // const query = { email: enroll.email }
            // const existingUser = await Enrolls.findOne(query)
            // if (existingUser) {
            //     return res.send({ message: 'user already exists' })
            // }
            const result = await Enrolls.insertOne(enroll)
            res.send(result)
        })


        app.get('/enroll/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email }
            const result = await Enrolls.findOne(filter);
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
    res.send('Enroll Ease is ON')
})

app.listen(port, () => {
    console.log(`Enroll Ease is  on Port ${port}`);
})