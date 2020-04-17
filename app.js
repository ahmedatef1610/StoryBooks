const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {
    allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')


const passport = require('passport');
require('./config/passport')(passport);

const keys = require('./config/keys');

const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

const {
    stripTags,
    truncate,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs');
/********************************************/
const app = express();
/********************************************/
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.engine('hbs', exphbs({
    helpers: {
        truncate,
        stripTags,
        formatDate,
        select,
        editIcon
    },
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'hbs');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(cookieParser());



app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    res.locals.date = new Date().getFullYear();
    res.locals.isAuth = req.isAuthenticated();
    next();
})
/********************************************/
///////////////////  1
// Index Route
app.use('/', index);
///////////////////  2
// Use Route
app.use('/auth', auth);
///////////////////  3
// Story Route
app.use('/stories', stories);

/********************************************/
const port = process.env.PORT || 8080;
mongoose.connect(keys.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("mongoDB Connected....");
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });