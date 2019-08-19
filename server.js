console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

// serve files from the public directory
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
// E.g. for option 2) above this will be:
const url = 'mongodb://localhost:27017/';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, database) => {
    db = database.db("Save");
    // start the express web server listening on 8080
    app.listen(8080, () => {
        console.log('listening on 8080');
    });
});

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// add a document to the DB collection recording the click event
app.post('/save', (req, res) => {
    var row = req.body.row;
    var column = req.body.column;
    var name = req.body.name;
    var currentHP = req.body.currentHP;
    var maxHP = req.body.maxHP;
    var maxExperience = req.body.maxExperience;
    var experience = req.body.experience;
    var currentLevel = req.body.currentLevel;

    db.listCollections().toArray(function(err, items) {
        if (err) throw err;

        if (items.length == 0) {
            db.createCollection("Character", function(err, res) {
                if (err) throw err;
            });
            db.collection("Character").insertOne({
                time: new Date().toLocaleDateString("en-US"),
                row: row,
                column: column,
                name: name,
                currentHP: currentHP,
                maxHP: maxHP,
                maxExperience: maxExperience,
                experience: experience,
                currentLevel: currentLevel
            });
        } else {
            db.collection("Character").insertOne({
                time: new Date().toLocaleDateString("en-US"),
                row: row,
                column: column,
                name: name,
                currentHP: currentHP,
                maxHP: maxHP,
                maxExperience: maxExperience,
                experience: experience,
                currentLevel: currentLevel
            });
        }
    });

});

// get the click data from the database
app.get('/save', (req, res) => {
    db.collection('Character').find().toArray((err, result) => {
        res.send(result);
    });
});