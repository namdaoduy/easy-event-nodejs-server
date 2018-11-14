const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://admin123:admin123@ds131942.mlab.com:31942/easy-event';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/users', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, async function (err, db) {
    if (err) {
      res.status(400);
      res.json({ message: 'Unable to connect to the mongoDB server. Error:', err });
    } else {
      var projectI = db.db("easy-event");

      //await this to return a promise
      let result_from_users = await projectI.collection("users").find({ name: req.body.name }).toArray();
      console.log(req.body);
      if (result_from_users.length == 0) {
        res.json({message: "not OK"})
      }
      else {
        if (result_from_users[0].password == req.body.password) {
          res.json({message: "OK", user_id: result_from_users[0]._id})
        }
        else {
          res.json({message: "not OK"})
        }
      }

      db.close();
    }
  });
});

app.post('/events', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, async function (err, db) {
    if (err) {
      res.status(400);
      res.json({ message: 'Unable to connect to the mongoDB server. Error:', err });
    } else {
      var projectI = db.db("easy-event");

      //await this to return a promise
      let result_users = await projectI.collection("users").find({ _id: ObjectId(req.body.user_id) }).toArray();

      var query = { user_id: ObjectId(result_users[0]._id) };

      //print the result
      let result = await projectI.collection("events").find(query).toArray();
      console.log(result[0].time.begin_date);
      res.json(result)

      db.close();
    }
  });
});

app.put('/events', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, async function (err, db) {
    if (err) {
      res.status(400);
      res.json({ message: 'Unable to connect to the mongoDB server. Error:', err });
    } else {
      var projectI = db.db("easy-event");

      let result = await projectI.collection("events").find({ user_id: ObjectId(req.body.user_id) ,name: {$regex: '^(?i)' + req.body.key_word} }).toArray();
      console.log(req.body.key_word)
      console.log(result)

      if (result.length === 0) {
        res.json({message: "not OK"});
      }
      else {
        res.json({message: "OK", result: result});
      }

      db.close();
    }
  });
});

app.post('/QR', (req, res) => {
  if (req.method == 'POST') {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, db) {
      if (err) {
        res.status(400);
        res.json({ message: 'Unable to connect to the mongoDB server. Error:', err });
      } else {
        var projectI = db.db("easy-event");
        var req_id = req.body.QRcode;
        var currentDate = new Date()
        var DYM = currentDate.getDate() + '/' + (currentDate.getMonth()+1) + '/' + currentDate.getFullYear() + ', ';
        var time = currentDate.toLocaleTimeString(currentDate);

        let result_from_id = await projectI.collection("guests").find({ _id: ObjectId(req_id) }).toArray();

        if (result_from_id.length == 0) {
          res.json({ message: 'No guest ID in database.' })
        }
        else {
          if (result_from_id[0].eventID != req.body.event_id) {
            res.json({ message: 'No guest ID in database.' })
          }
          else {
            if (result_from_id[0].check_in.checked == false) {
              await projectI.collection("guests").updateOne({ _id: ObjectId(req_id) }, { $set: { "check_in.timestamp": DYM + time, "check_in.checked": true } })
              // await projectI.collection("guests").updateOne({ _id: ObjectId(req_id) }, { $set: { "check_in.timestamp": DYM + time } })
              res.json({ message: 'Done.', time: DYM + time, name: result_from_id[0].name })
            }
            else {
              res.json({ message: 'Guest ID already checked.' })
            }
          }
        }
      }
    });
  }
});

app.listen(port, () => console.log("Example app listening on port", port));

