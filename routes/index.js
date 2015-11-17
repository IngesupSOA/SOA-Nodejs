var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/new', function(req, res, next) {
  new User ({
    firstname: 'Nick',
    lastname: 'Cerminara',
    username: 'nick',
    email: 'nick.cerminara@gmail.com',
    password: 'password',
    avatar: '',
    address: '5th Main Street Avenue, 35697 NYC, USA',
    phoneNumber: '+45 005 458 223',
    admin: true,
    class: {
      name: 'Expert 1',
      school: 'Ingésup Lyon',
      created_on: Date.now(),
      updated_at: Date.now()
    },
    created_on: Date.now(),
    updated_at: Date.now()
  }).save();

  res.send('User créé');
});


module.exports = router;


//res.send('user created !');
