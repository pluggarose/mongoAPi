const express = require('express');

const {connectToDb, getDb} = require('./db');

let db;

const PORT = 3000;

const app = express();

connectToDb((err) =>{
    if (!err){
        app.listen(PORT, (err) =>{
            err ? console.log(err) : console.log('Listening port ${PORT}');
        });
        db = getDb();
    } else {
        console.log('DB con err:', err);
    }

});

app.get('/cars', (req, res) => {
    const cars = [];

    db
        .collection('Cars')
        .find()
        .forEach((car) => cars.push(car))
        .then(()=>{
            res
                .status(200)
                .json(cars);
        })
})

app.get('/carlist', (req, res) => {
    
})