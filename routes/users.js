var models = require('../models');
var express = require('express');
var router = express.Router();
var auth = require('../helpers/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  models.User.findAll().then( users => {
    res.json({
      success: true,
      data: {
        users: users
      }
    })
  }).catch(err => {
    res.json({
      success: true,
      data: {
        message: err
    }}, 400);
  });
});

router.get('/:id', function(req, res, next) {
  models.User.findById(req.params['id']).then( user => {
    if (!user) {
      return res.json({
        success: false,
        data: {
          message: "No user found with this ID"
        }
      })
    }
    auth.checkPassword(user.id, '1').then(check => {
      console.log(check);
    }).catch(err => {
      console.log(err);
    });

    res.json({
      success: true,
      data: {
        user: user
      }
    }, 400);
  }).catch( err => {
    res.json({
      success: false,
      data: {
        message: 'DB Error',
        reason: err
      }
    }, 400);
  });
});

router.post('/', function(req, res, next) {
  models.User.create(req.body['user']).then(user => {
    res.status(201).json({
      success: true,
      data: {
        user: user
      }
    });
  }).catch(err => {
    res.json({
      success: false,
      data: {
        message: "User could not be created",
        reason: err["errors"].map(e => e['message'].replace('User.', ''))
        // err
      }
    }, 400);
  });
});

router.delete('/:id', function(req, res, next) {
  models.User.findById(req.params['id']).then((user) => {
    if (!user) {
      return res.json({
        success: false,
        data: {
          message: "No user found with this id"
        }
      }, 404);
    }
    user.destroy().then(() => {
      res.json({
        success: true,
        data: {
          message: "User deleted"
        }
      });
    }).catch(err => {
      res.json
    });
  }).catch(err => {
    res.status(400);
    res.json({
      success: false,
      data: {
        message: "No user found with this id"
      }
    });
  });
})

router.patch('/:id', function(req, res, next) {
  models.User.findById(req.params['id']).then(user => {
    if (!user) {
      return res.json({
        success: false,
        data: {
          message: "No user found with this ID"
        }
      }, 404);
    }

    user.update(req.body['user']).then(user => {
      res.json({
        success: true,
        data: {
          user: user
        }
      })
    }).catch(err => {
      res.json({
        success: false,
        data: {
          message: "Database Error"
        }
      })
    })
  }).catch(err => {
    res.json({
      success: false,
      data: {
        message: "Database Error"
      }
    })
  })
})

module.exports = router;
