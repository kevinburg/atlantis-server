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
  res.send("Hello world!");
});

app.listen(process.env.PORT || 3000);
