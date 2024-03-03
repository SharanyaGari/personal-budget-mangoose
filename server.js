const express = require('express');
const mongoose = require("mongoose");
const dataModel = require("./modules/data_schema")
const url = "mongodb://localhost:27017/mongoosedb";
const bodyParser = require('body-parser');  
// const urlencodedParser = bodyParser.urlencoded({ extended: false }) 
const jsonParser = bodyParser.json({ extended: false })

const app = express();
const port = 3000;

app.use('/', express.static('public')); 

app.get('/hello', (req, res) => {
    res.send('Hi World');
});

app.get('/budget', (req, res) => {
    console.log("fetching budget...")
    mongoose.connect(url)
        .then(() => {
            console.log("Connected to Database")
            dataModel.find({})
                     .then((data) => {
                        console.log(data)
                        res.json(data);
                        mongoose.connection.close()
                        
                     })
                     .catch((connectionError) => {
                        console.log(connectionError)
                   })
            // let newData = new dataModel({title: "Dance", budget: 110, color: "#ff6384"})
            //     dataModel.insertMany(newData)
            //             .then((data) => {
            //             console.log(data)
            //             mongoose.connection.close()
            //             })
            //             .catch((connectionError) => {
            //             console.log(connectionError)
            //         })

        })
        .catch((connectionError) => {
            console.log(connectionError)
        })
    
});

app.post('/budget',jsonParser, (req, res) => {
    console.log("posting budget...")
    mongoose.connect(url)
        .then(() => {
            const newData = new dataModel(req.body)
            //console.log("Inserting data: ", req.body)
            dataModel.insertMany(newData)
                .then((data) => {
                    console.log("successfully inserted data")
                    res.sendStatus(200);
                    mongoose.connection.close()
                })
                .catch((error) => {
                    res.json({
                        "errorCode": 500,
                        "message": error.writeErrors[0].err.errmsg
                    });
                    console.log(error)
                })
        })
    .catch((connectionError) => {
        console.log(connectionError)
    })
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});