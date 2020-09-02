const express = require('express'),
    app = express(),
    flash = require('express-flash'),
    session = require('express-session'),
    passport = require('passport'),
    bodyparser = require('body-parser'),
    connect_flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan')
require('dotenv').config()


//setting the ejs file and making the express to use the view folder for the content
// app.set('views', path.join(__dirname, 'views'))
app.set('views', [__dirname + '/views', __dirname + '/views/Web_Pages',
__dirname + '/views/User_Profile_Pages',
__dirname + '/views/Web_Pages/did_Pages',
__dirname + '/views/Admin_Portal_Pages',
__dirname + '/views/emailTemplates',
__dirname + '/views/Web_Pages/solution_Pages']);




app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(cookieParser())

//using morgan to log out the server responses
app.use(morgan('dev')) //, { stream: { write: msg => info(msg) } }));

app.use(bodyparser.json())
app.use(session({
    saveUninitialized: true,
    secret: 'VOIP',
    cookie: { secure: false },
    resave: true
}))


app.use(flash())
app.use(connect_flash())
app.use(passport.initialize())
app.use(passport.session())


//express for the css and bootstrap files
app.use(express.static(__dirname + '/public'));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


/**
 * Getting the routes pages to render the different pages on the web all pages are in the file /routes/EJS_file_routes
 */
const routesOf_WebPages = require('./routes/EJS_file_routes')
const routesOf_User_Profile = require('./routes/userProfile_Routes')
// using the routes of the home page and all the user profile pages
app.use('/', routesOf_WebPages.router)
app.use('/', routesOf_User_Profile)
/*
getting the routes and controllers for the admin 
*/
const admin_Routes = require('./routes/admin_routes')
const admin_Controllers = require('./adminControllers/controllers')
// using the admin routes and all the pages 
app.use('/admin', admin_Routes)

// using the admin controller from the file 
admin_Controllers(app)
/**
 * getting the passport file to get the passport configuration to signup and login for the local strategy
 */
const user_passport_config = require('./config/passport')
const admin_passport_config = require('./adminConfig/adminPassport')
//did and search rate pages routing 
const didpages_Controller = require('./controllers/did_Controllers')

//user profile management routes
const user_profile_Controller = require('./controllers/user_Profile_Controllers')

//solutions controllers for solution tab
const solution_controller = require('./controllers/Solutions_controllers')

//did page routes
// rate search routes 
didpages_Controller(app)
//user profile controllers
user_profile_Controller(app)

//solutions controllers for solution tab in the navigation bar like wholesale and call centre 
solution_controller(app)

/**
 * admin User login pages 
 * by using the passport JS
 */

app.post('/admin_login_form', admin_passport_config.authenticate('local-login',
    {
        successRedirect: '/admin/',
        failureRedirect: '/admin/',
        failureFlash: true
    })
);

/**
 * Normal User log in and sign up 
 */

app.post('/login-form', user_passport_config.authenticate('local-login',
    {
        successRedirect: '/user_Dashboard',
        failureRedirect: '/login-form',
        failureFlash: true
    })
);
app.post('/signup', user_passport_config.authenticate('local-signup',
    {
        successRedirect: '/verify',
        failureRedirect: '/signup',
        failureFlash: true
    }))

app.listen(process.env.port, () => {
    console.log(`Server listen to ${process.env.port}`);

})
// connection = mysql.createConnection(sqlFile.connection)
// query = 'Use ' + sqlFile.databasename
// connection.query(query)
// console.log('Data Base Connected in DID Packages.')
// connection.query("select admin_voip.admin_user.admin_id*New_Rate as 'NEWWWWW', New_Rate*1000 as 'total' from  rate_list where Route_VOIP like 'Pakistan%'", (error, response) => {
//     if (error)
//         console.log("Error at the country flag Sql::: ", error)
//     else
//      console.log(2)
// })



