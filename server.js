const express = require('express');

const {connectToDb, getDb} = require('./db');
const { ObjectId } = require('mongodb');

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
////////////////////////////////////////////////////////////////////////////////////// Блок атомобилей ////////////////////////////////////////////////////////////////////////////////////////
//Получение записей////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/carss', (req, res) => {
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

app.get('/carlist', (req, res) => { //Возвращает только список автомобилей, без вложенных
    const cars = [];

    db
    .collection('Cars')
    .find()
    .project({"model_name" : 1, "brand-name":1})
    .forEach((car) => cars.push(car))
        .then(()=>{
            res
                .status(200)
                .json(cars);
        })
})

app.get('/partlist/:id', (req, res) => { //Возращает список запчастей на автомобили

    db
    .collection('Cars')
    .find({ "_id" : new ObjectId(req.params.id)})
    .project({"parts" : 1})
    .toArray()
    .then((doc)=>{
        const parts = doc.map(doc => doc.parts);
            res
                .status(200)
                .json(parts);
        })
})

app.get('/stock/:id', (req, res) => { //Возвращает список автомобилей данной марки в наличии

    db
    .collection('Cars')
    .find({ "_id" : new ObjectId(req.params.id)})
    .toArray()
    .then((docs)=>{
        const stocklist = docs.map(doc => ({ model_name: doc.model_name, brand_name: doc.brand_name, stock: doc.stock }));
        res.status(200).json(stocklist);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.message });
    });
})
//Получение записей////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////// Блок атомобилей ////////////////////////////////////////////////////////////////////////////////////////