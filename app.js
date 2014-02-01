var express = require('express')
, mongo = require('mongodb')
, monk = require('monk')
, request = require('superagent');
app = express();

var https = require('https');


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
      res.send([{'result' : '0'}]);
      }
    else {
      res.send([{'result' : '1'}]);
    }
  });
});


app.post('/adduser/:id', function(req, res) {
    //need to get user inf from request
    //everything is in req.body.id
    //i want to loop through everything in req.body and add in object to put in mongo
    //but get stuff from andrew directory as well
  var users = db.get('users');
  var query = {'id': req.params.id};
  var key = '';
  var value = '';
  var new_user = {'id' : req.body.id,
                  'fname' : req.body.fname,
                  'lname' : req.body.lname,
                  'hairColor' : req.body.hairColor,
		  'height' : req.body.height,
                  'andrew' : req.body.andrew,
                  'likes' : req.body.likes
                 };

  //now also add stuff to new_user from direcory
  request.get("https://apis.scottylabs.org/v1/directory/andrewid/"+ req.body.andrew +"?app_id=4dc26847-3962-47a6-aa50-dcd650e900b1&app_secret_key=_gH91EeosouyjtswFjR3SsmmCJkOWF93Lxb2LO1qdieZTpUqToYxGX4k", function(response1) {
  //res.send(response1.body);
  var p = response1.body;
  var year = p.person.student_class;
  var d  = p.person.department;
  new_user['year'] = year;
  new_user['dept'] = d;
  res.send(new_user);
  users.insert(new_user, {safe : true}, function (err, records) {
	res.send(new_user);
	});
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
    res.send([user1])
    }
});

});


app.get('/compare/:id1/:id2', function(req,res) {
  var users = db.get('users');
  var query1 = {'id': req.params.id1};
  var query2 = {'id': req.params.id2};
  //get big list of likes for each user
  //the above id is the id linked with their fb account 

  var user1 = users.find(query1)
  var list1 = JSON.parse(user1[0]['likes']);
  var user2 = users.find(query2)
  var list2 = JSON.parse(user2[0]['likes']);
  var simlikes = []
  // now i have like two lists... iterate over
  for (var item1 in list1) {
    for (var item2 in list2) {
      if (item1['name'] == item2['name'] && item1['category'] == item2['category']) {
      simlikes.push(item1);
      };
    };
  };
  res.send(simlikes) 
});
 //then either i can do something with simlikes arr or kevin can... like i just 
// give him top 5 elems maybe. or os side decides on how many from their side?
  
  //also want to compare year and major if they are there
/*  var maj = user1[0][dept]
  var maj2 = user2[0][dept]
  var year1 = user1[0][year]
  var year2 = user2[0][year]  
*/
  //then do stuff to compare year and major? or display no matter what?  

/*
  users.find(query1, {}, function(e, docs) {
    if (docs.length == 0) {
      //need to redirect to a demographic page where they'll enter more info
      //var object = {id : req.body.id, info : req.body.info};
      //users.insert(object, {safe : true}, function(err, records) {
	//res.send(object);
      res.send([{'result' : '0'}]);
      }
    else {
      res.send([{'result' : '1'}]);
    }
  });


});
*/
app.listen(process.env.PORT || 3000);
