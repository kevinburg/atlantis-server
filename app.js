var express = require('express')
, mongo = require('mongodb')
, monk = require('monk');
app = express();

app.use(express.bodyParser());

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

var db = monk(mongoUri);

app.get('/', function(req, res) {
  var users = db.get('users');
  users.find({}, {}, function(e, docs) {
    res.send(docs);
  });
  res.send('Hello world');
});

app.post('/login', function(req, res) {
  var users = db.get('users');
  var query = {id : req.body.id};
  console.log('Login request received for id:', req.body.id);
  users.find(query, {}, function(e, docs) {
    if (docs.length == 0) {
      var object = {id : req.body.id, info : req.body.info};
      users.insert(object, {safe : true}, function(err, records) {
	res.send(object);
      });
    } else {
      res.send({'ok' : 'ok'});
    }
  });
});

app.listen(process.env.PORT || 3000);
