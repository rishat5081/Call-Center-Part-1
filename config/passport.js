// ========================================== Modules attributes ========================================== 
const passport = require('passport'),
    mysql = require('mysql'),
    bcrypt = require('bcrypt'),
    LocalStrategy = require('passport-local').Strategy,
    db_connection = require('./Mysql/mysql'),
    RememberMeStrategy = require('passport-remember-me').Strategy,
    config_JWT = require('./JWT')

// ========================================== Connecting to the Database ========================================== 
connection = mysql.createConnection(db_connection.connection)
query = 'Use ' + db_connection.databasename
connection.query(query)

// ========================================================= Passport JS  ==================================================================

/**
 * Passport js serilization and deserilization of the user to get in the session 
 * it helps the user to use the web without getting out of the session
 * these both methods are very important without them you can't authenticate  
 */

passport.serializeUser(function (user, done) {
    done(null, user.email)
});

passport.deserializeUser(function (email, done) {
    console.log(email)
    connection.query('select * from user where email = ?', [email], (error, rows) => {
        if (error)
            console.log("Deserial Error" + error)
        else {
            done(null, rows[0])
        }
    })


})

// ========================================== login form ========================================== 


passport.use('local-login', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, authenticate_login))

function authenticate_login(req, email, password, done) {
    console.log('passport')
    connection.query('select * from user where email = ?', [email], (error, rows) => {

        if (error)
            return done(null, false, { message: 'there is an error at passport :: 34' })
        if (!rows.length)
            return done(null, false, { message: 'No username found' })
        if (rows[0].email_veri === 0)
            return done(null, false, { message: 'Please Verify Email' })

        bcrypt.compare(password, rows[0].password, (error, res) => {
            if (res)
                return done(null, rows[0])
            else
                return done(null, false, { message: 'Incorrect Password' })

        })


    })


}


// ========================================== Sign Up form ========================================== 


passport.use('local-signup', new LocalStrategy({

    usernameField: 'reg_email',
    passwordField: 'reg_password',
    passReqToCallback: true
}, authenticate_signup))


function authenticate_signup(req, email, password, done) {

    var temp = req.body.countryCode.split('%%')
    var countryName = temp[0]


    var countryNumber = temp[1] + '##' + req.body.number
    console.log(countryNumber);

    connection.query('select * from user where email = ? ', [email], (error, rows) => {


        if (error)
            return done(null, false, { message: 'there is an errror in Signup DB' })

        if (rows.length) {
            if (rows[0].username === req.body.username)
                return done(null, false, { message: 'username already exists' })
            if (rows[0].email === email)
                return done(null, false, { message: 'Email already exists' })
            if (rows[0].phoneNumber === req.body.number)
                return done(null, false, { message: 'Phone Number  already exists' })
        }
        if (temp[1] === ' ')
            return done(null, false, { message: 'Please Select Country' })
        if (password.length < 8)
            return done(null, false, { message: 'Password Length is weak try again' })
        if (password !== req.body.confirm_password)
            return done(null, false, { message: 'Password does not match try again' })


        else {
            console.log(password)

            const hashPassword = bcrypt.hashSync(password, 10)
            connection.query(`INSERT INTO user(username,fullname,email, 
                password,phoneNumber,country,city) 
            VALUES (?,?,?,?,?,?,?)`, [req.body.username, req.body.name, email, hashPassword, countryNumber, countryName, req.body.signup_city], (error, rows) => {
                if (error) {
                    console.log(error)
                    return done(null, false, { message: 'There is an error inserting the data in DB ', error })
                } else {
                    console.log('Successfully added a new user')

                    config_JWT.generateToken_And_SendMail(user = { Fullname: req.body.name, userEmail: email })
                    return done(null, {
                        username: req.body.username,
                        email: email, name: req.body.name
                    })
                }
            })
        }
    })
}





module.exports = passport