const express = require('express')
require("dotenv").config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId


const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sqmxk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


console.log(uri)
async function run() {
    try {
        client.connect()
        // create database
        const database = client.db("Food_Distribution");
        const foodsCollection = database.collection("foods");
        const studentsCollection = database.collection("students");


        // Get Foods Api
        app.get('/foods', async (req, res) => {
            const cursor = foodsCollection.find({})
            const page = req.query.page
            const size = parseInt(req.query.size)
            let foods;
            const count = await cursor.count()
            if (page) {
                foods = await cursor.skip(page * size).limit(size).toArray()
            }
            else {

                foods = await cursor.toArray()
            }

            res.json({
                foods,
                count
            })
        })


        // Add Foods
        app.post('/foods', async (req, res) => {
            const data = req.body
            console.log(req)
            const foods = await foodsCollection.insertOne(data)
            res.json(foods)
        })
        // GET single Foods by id
        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await foodsCollection.findOne(query)
            res.json(result)
        })

        // Update Foods Api
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await foodsCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/foods/:id', async (req, res) => {
            const updateFood = req.body
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: updateFood.name,
                    price: updateFood.price,
                    description: updateFood.description
                }
            }
            const result = await foodsCollection.updateOne(query, updateDoc, options)
            console.log(result);
            res.json(result)
        })

        // ======================== Student =========================

        // Get students data api
        app.get('/students', async (req, res) => {
            const cursor = studentsCollection.find({})

            const page = req.query.page
            const size = parseInt(req.query.size)
            let students;
            const count = await cursor.count()
            if (page) {
                students = await cursor.skip(page * size).limit(size).toArray()
            }
            else {

                students = await cursor.toArray()
            }

            res.json({
                students,
                count
            })


        })


        // Add Student api
        app.post('/students', async (req, res) => {
            const data = req.body
            console.log(req)
            const student = await studentsCollection.insertOne(data)
            res.json(student)
        })
        // GET single student by id
        app.get('/students/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await studentsCollection.findOne(query)
            res.json(result)
        })
        // Delete student
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await studentsCollection.deleteOne(query)
            res.send(result)
        })

        // Update student
        app.put('/students/:id', async (req, res) => {
            const updateFood = req.body
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: updateFood.name,
                    roll: updateFood.roll,
                    classname: updateFood.classname,
                    age: updateFood.age,
                    hall: updateFood.hall,
                    stutus: updateFood.status,
                    shift: updateFood.shift,
                    mealShift: updateFood.mealShift,
                    date: updateFood.date,
                    item: updateFood.item,
                    served: updateFood.served
                }
            }
            const result = await studentsCollection.updateOne(query, updateDoc, options)
            console.log(result);
            res.json(result)
        })

        // Search Student 

        app.get('/search', async (req, res) => {
            const roll = req.query.roll
            const shift = req.query.shift
            const date = new Date(req.query.date).toLocaleDateString()
            const query = { roll: roll, mealShift: shift, date: date }
            console.log(roll, shift, date);
            const cursor = studentsCollection.find(query)
            const result = await cursor.toArray()
            console.log(result)
            res.json(result)

        })
        app.get('/searchStudent', async (req, res) => {
            const roll = req.query.roll
            const query = { roll: roll }
            const cursor = studentsCollection.find(query)
            const result = await cursor.toArray()
            console.log(result)
            res.json(result)

        })






    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})