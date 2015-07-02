
'use strict';

var express = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    sessions = require('./routes/sessions'),
    app = express();

app.use(bodyParser());          // pull information from html in POST
app.use(methodOverride());      // simulate DELETE and PUT

app.use(express.static('../cast-mobile/www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/sessions', sessions.findAll);
app.get('/sessions/:id', sessions.findById);

// stub data for employee profile
/**
	Main application routes
*/

// var errors = require('./components/errors');
var jwt = require('jwt-simple');
// var moment = require('moment');

var fakeUser = {
  id: 1,
  username: 'bob@gmail.com',
  password: 'password',
  firstName: 'Bob',
  lastName: 'Jones',
  employeeId: '12345',
  address1: '123 Elm St',
  address2: 'Suite A',
  city: 'Safety Harbor',
  state: 'FL',
  zip: '12345',
  mobile: '123-123-1234',
  home: '123-123-1234',
  travelRadius: '10',
  email: 'bob@gmail.com',
  available: true,
  profilePhoto: 'http://placehold.it/262x262'
}




  app.set('jwtTokenSecret', 'shhhhhhared-secret');



  app.route('/api/auth')
  	.post(function(req,res) {
  		var expires = moment().add(7,'days').valueOf();
  		var token = jwt.encode({
  			iss: req.email,
  			exp: expires
  		}, app.get('jwtTokenSecret'));
  		res.json({
  			token: token,
  			expires: expires,
  		})
  	});

  app.route('/employees')
    .get(function(req,res) {
      console.log(fakeUser);
      res.json(fakeUser);
    });

  // All undefined asset or api routes should return a 404
  //app.route('/:url(auth|components|app|bower_components|assets)/*')
   //.get(errors[404]);
   //.console.log('404 route');

  // All other routes should redirect to the index.html
  // app.route('/*')
  //   .get(function(req, res) {
  //   	res.sendfile(app.get('/');
  //   });


// Expose app
exports = module.exports = app;

app.set('port', process.env.PORT || 5000);

// start server
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
