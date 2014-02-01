var express = require('express')
, mongo = require('mongodb')
, monk = require('monk');
app = express();

var http = require('http');

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
//  http.request("https://apis.scottylabs.org/v1/directory/andrewid/rparen?app_id=4dc26847-3962-47a6-aa50-dcd650e900b1&app_secret_key=_gH91EeosouyjtswFjR3SsmmCJkOWF93Lxb2LO1qdieZTpUqToYxGX4k", function(res1) {
  //  res.send(res1)
//}).end(); 
});

/*
app.get('/try/:id1/:id2', function(req, res) {
  var users = db.get('users');
  var string = 'hi';
  var person = req.params.id1;
  //res.send(person);
  for (var param in req.params) {
  users.find({'id' : req.params.id1}, {}, function(e, docs) {
    console.log('in loop');
    if (docs.length == 0) {
    //res.send('Error. Cannot find id.');
    string += 'Error cant find id';
    }
    else{
    //string = docs[0]['info'];
    string += docs[0]['info'];
    //res.send(ans)
    }
    });
  }
  res.send(string);  
});
*/

//GOOD WOO
app.get('/logincheck/:id', function(req, res) {
  var users = db.get('users');
  var query = {'id' : req.params.id};
  //the above id is the id linked with their fb account 
  console.log('Login request received for id:', req.params.id);
  users.find(query, {}, function(e, docs) {
    if (docs.length == 0) {
      //need to redirect to a demographic page where they'll enter more info
      //var object = {id : req.body.id, info : req.body.info};
      //users.insert(object, {safe : true}, function(err, records) {
	//res.send(object);
      res.send({'result' : '0'});
      }
    else {
      res.send({'result' : '1'});
    }
  });
});


app.get('/adduser/:id', function(req, res) {
    //need to get user inf from request
    //everything is in req.body.id
    //i want to loop through everything in req.body and add in object to put in mongo
    //but get stuff from andrew directory as well
  var users = db.get('users');
  var query = {'id': req.params.id};
  var key = '';
  var value = '';
/*  var new_user = {'id' : req.body.id,
                  'fname' : req.body.fname,
                  'lname' : req.body.lname,
                  'info' : req.body.info
                 };
*/
  //now also add stuff to new_user from direcory
/*  var options = {
    host: 'https://apis.scottylabs.org',
    path: '/v1/directory/andrewid/rparen?app_id=4dc26847-3962-47a6-aa50-dcd650e900b1&app_secret_key=_gH91EeosouyjtswFjR3SsmmCJkOWF93Lxb2LO1qdieZTpUqToYxGX4k'
    };
  callback = function(response) {
    var str='hai';
    res.send(response);
    console.log(str);
  }; 

  http.request(options, callback).end();
*/
  http.get("http://apis.scottylabs.org/v1/directory/andrewid/rparen?app_id=4dc26847-3962-47a6-aa50-dcd650e900b1&app_secret_key=_gH91EeosouyjtswFjR3SsmmCJkOWF93Lxb2LO1qdieZTpUqToYxGX4k", function(res1) {
   res.send('sadf');
}).on('error', function(e) {
   res.send('hai');
});
 
  //then add new_user to mongo
  //users.insert(new_user, {safe : trust}, function (err, records) {
  //res.send(new_user)
  //});
});


//GOOD WOO
app.get('/getinfo/:id', function(req, res) {
  //get info for a certain user and send back in an object
  var users = db.get('users');
  //quotes around 'id'?
  var query = {'id': req.params.id};
  users.find(query, {}, function(e, docs) {
    if (docs.length == 0) {
    res.send('Error in finding user');
    }   
    else {
    //now want to take all that info and send it back
    user1 = docs[0]
    res.send(user1)
    }
});
});


app.post('/compare/:id1/:id2', function(req,res) {
  var users = db.get('users');
  var query1 = {'id': req.params.id1};
  var query2 = {'id': req.params.id2};


});

app.listen(process.env.PORT || 3000);
