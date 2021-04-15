const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const expressValidator = require('express-validator');
// User models
let User = require('../models/user');

// Register form

router.get('/register',function(req,res){
    res.render('register');
});

//Register process
router.post('/register',function(req,res){
    const name=req.body.name;
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const password2=req.body.password2;

    req.checkBody('name','Name is rquired').nonEmpty();
    req.checkBody('email','Email is rquired').nonEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','username is rquired').nonEmpty();
    req.checkBody('password','password is rquired').nonEmpty();
    req.checkBody('password2','passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors)
    {
      res.render('register',{
          errors:errors
      });
    }else{
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(newUser.password,salt,function(err,hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        req.flash('success','You are registered .. login now');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});


router.get('/login',function(req,res){
    res.render('login');
})

module.exports = router;