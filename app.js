const express=require('express');
const path=require('path');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db  = mongoose.connection;

//check connection
db.once('open',function(){
  console.log('Connected to mongodb');
});


//check for db errors
db.on('error',function(err){
    console.log(err);
});

//Init app
const app = express(); 

//Bringing models
let Article = require('./models/article');

//Load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/',function(req,res){
    //Routing to home page
    //res.send('Hello Samrat');
    //Roting to a particular file
    
    Article.find({},function(err,articles){
        if(err){
            console.log(err);
        } else
        {
            res.render('index',{
                title:'Samrat',
                articles:articles
            });
        }
    });
    });
    

//Add route
app.get('/articles/add',function(req,res){
    res.render('add_article',{
        title:'Add article'
    });
})

//Add submit POST request
app.post('/articles/add',function(req,res){
 let article = new Article();
 article.title = req.body.title;
 article.author=req.body.author;
 article.body=req.body.body;

 article.save(function(err){
    if(err){
        console.log(err);
        return;
    } else {
        res.redirect('/');
    }
 });
});

//start server and then Listening on port 3000 and callback function to print something after listen
app.listen(3000,function(){
    console.log('Server strted on port 3000')
})