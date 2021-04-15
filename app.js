const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
 
// Connect to database
mongoose.connect('mongodb://localhost/nodekb', {useNewUrlParser: true});
let db = mongoose.connection;
 
db.once('open', () => {
    console.log('Connected to MongoDB');
});
 
db.on('error', (err) => {
    console.log(err);
});
 
// Init app
const app = express();
 
// Init models
let Article = require('./models/article');

 
// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
 
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
 
// Midlewares ----------------------------------------
 
//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
 
// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
 
// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
 
// Routes ----------------------------------------------
 
// Home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});

//Route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);
 
// Port listening --------------------------------------
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

