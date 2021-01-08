// Require plugins
const express = require('express'); 
const path = require('path');
const morgan = require('morgan');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./app/config/database');

//Passport Config
require('./app/middlewares/passport')(passport);

//Connecting to Database
const mongoose = require('mongoose');
mongoose.connect(config.database);
mongoose.Promise = global.Promise;

// Port for using as Environment 
const port = process.env.PORT || 8080;

// Getting Routes Path
const home = require('./app/routes/home');
const users = require('./app/routes/users');
const consumerDashboard = require('./app/routes/consumer/dashboard');
const publisherDashboard = require('./app/routes/publisher/dashboard');
const publisherProducts = require('./app/routes/publisher/products');
const adminDashboard = require('./app/routes/admin/dashboard');
const adminProducts = require('./app/routes/admin/products')

// Making Express as App
const app = express();

// Setting up the view engines 
app.set('views', path.join(__dirname, 'app/views'));
//app.use(expressLayouts);
app.set('view engine', 'ejs');


//Using Logger
//Using Express part
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/public',express.static('public'));
app.use('/uploads',express.static('uploads'));
app.use(cookieParser());

//Using apps for cors
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested, Content-Type,Accept,Authorization');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
//app.use(cors());

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore(
        { mongooseConnection: mongoose.connection}
    ),
    cookie: {maxAge: 180 * 60 * 1000}
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect-Flash
app.use(flash());

//Global Vars
app.use((req,res,next)=>{
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.warning_msg = req.flash('warning_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });



// Applying Routes
app.use('/',home);
app.use('/user',users);
app.use('/dashboard' ,consumerDashboard);
//app.use('/publisher/dashboard', publisherDashboard);
//app.use('/publisher/products',publisherProducts);
app.use('/admin/dashboard', adminDashboard);
app.use('/admin/products', adminProducts);


//Making Error Handling
app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message
        }
    });
});

module.exports = app

app.listen(port);