const express = require('express');
const app = express();
const port = 3005;
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://admin123:admin123@ds131942.mlab.com:31942/easy-event';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

let db;
MongoClient.connect(url, { useNewUrlParser: true }, function(err, database) {
  if(err) throw err;
  db = database.db("easy-event");
  console.log("Database OK");
});

app.get('/events', (req, res) => {
  db.collection("events").find().toArray()
  .then(result => {
    res.json(result)
  })
  .catch(err => {res.json({message: err})})
})

app.post('/events', (req, res) => {
  db.collection("users").find({ _id: ObjectId(req.body.user_id) }).toArray()
  .then(result_1 => {
    const query = { user_id: ObjectId(result_1[0]._id) };

    db.collection("events").find(query).toArray()
    .then(result_2 => {
      res.json(result_2)
    })
    .catch(err => {res.json({message: err})})
  })
  .catch(err => {res.json({message: err})})
});

app.put('/events', (req, res) => {
  db.collection("events").find({
    user_id: ObjectId(req.body.user_id),
    name: {$regex: '^(?i)' + req.body.key_word} 
  }).toArray()
  .then(result => {
    if (result.length === 0) {
      res.json({message: "not OK"});
    }
    else {
      res.json({message: "OK", result: result});
    }
  })
  .catch(err => {res.json({message: err})})
});

app.post('/users', (req, res) => {
  db.collection("users").find({ name: req.body.name }).toArray()
  .then(result => {
    if (result.length == 0) {
      res.json({message: "not OK"})
    }
    else {
      if (result[0].password == req.body.password) {
        res.json({message: "OK", user_id: result[0]._id})
      }
      else {
        res.json({message: "not OK"})
      }
    }
  })
  .catch(err => {res.json({message: err})})
});

app.post('/QR', (req, res) => {
  const req_id = req.body.QRcode;
  const currentDate = new Date();
  const DYM = currentDate.getDate() + '/' + (currentDate.getMonth()+1) + '/' + currentDate.getFullYear() + ', ';
  const time = currentDate.toLocaleTimeString(currentDate);

  db.collection("guests").find({
    _id: ObjectId(req_id) 
  }).toArray()
  .then(result_1 => {
    if (result_1.length == 0) {
      res.json({ message: 'No guest ID in database.' })
    }
    else if (result_1[0].eventID != req.body.event_id) {
      res.json({ message: 'No guest ID in database.' })
    }
    else if (result_1[0].check_in.checked == false) {
      db.collection("guests").updateOne({ 
        _id: ObjectId(req_id) 
      }, { 
        $set: { "check_in.timestamp": DYM + time, "check_in.checked": true } 
      })
      .then(result_2 => {
        res.json({ message: 'Done.', time: DYM + time, name: result_1[0].name })
      })
    }
    else {
      res.json({ message: 'Guest ID already checked.' })
    }
  })
});

app.listen(port, () => console.log("Example app listening on port", port));

