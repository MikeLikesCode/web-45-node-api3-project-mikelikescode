const User = require('../users/users-model');

function logger(req, res, next) {
  const timestamp = new Date.now();
  console.log(req.method);
  console.log(req.url);
  console.log(timestamp);
  next();
}

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id)
  .then(user => {
    if(user){
      req.user = user;
      next()
    }
    else{
      next({ message: 'not found', status: 404 })
    }
  })
  .catch(next)
}

function validateUser(req, res, next) {
  if(!req.body || !req.body.name){
    next({ status:400, message: "missing required name field" })
  }
  else{
    next()
  }
}

function validatePost(req, res, next) {
  if(!req.body || !req.body.text){
    next({ status:400, message: "missing required text field" })
  }
  else{
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser, validatePost}