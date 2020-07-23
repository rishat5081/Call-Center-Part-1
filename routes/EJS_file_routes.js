const express = require('express'),
    router = express.Router(),
    mysql = require('mysql'),
    sqlFile = require('../config/Mysql/mysql')

var user_logged_In = (req, res, next) => {
    console.log('The IP address of connected user is :: ', req.connection.remoteAddress)
    if (req.isAuthenticated()) {
        res.locals.user = req.session.passport.user
        next()
    }
    else
        res.redirect('/login-form')
}
var not_logged_in = (req, res, next) => {
    console.log('The IP address of connected user is :: ', req.connection.remoteAddress)
    if (req.session.passport) {
        console.log(req.session.passport.user)
        res.locals.user = req.session.passport.user
        next()
    }
    else {
        console.log('User is not Logged in')
        res.locals.user = 'not logged in'
        next()
    }
}
// ========================================== Home Pages and the Web ========================================== 

router.get('/', not_logged_in, (req, res, next) => {
    connection = mysql.createConnection(sqlFile.connection)
    query = 'Use ' + sqlFile.databasename
    connection.query(query)
    console.log('Data Base Connected in Home Pages For Rates.')

    connection.query(`SELECT Prefix,Route_VOIP,New_Rate FROM rate_list where 
    Route_VOIP IN("North American Region","Canada 204 Manitoba","Pakistan Fixed","India Fixed",
    "Canada 807 Ontario","United States - OnNet - AK - 907","Pakistan Mobile","India Mobile") `, (error, sqlResponse) => {
        if (error)
            console.log('Error occur at the Fetching Rates From Database Response')
        else {
            //console.log(sqlResponse);

            res.render('index', {
                sqlResponse: sqlResponse
            })
        }
    })
})

router.get('/aboutus', not_logged_in, (req, res, next) => {
    res.render('aboutus')
})
router.get('/contactus', not_logged_in, (req, res, next) => {
    res.render('contactus')
})
router.get('/login-form', not_logged_in, (req, res, next) => {

    res.render('login-form')
})
router.get('/signup', not_logged_in, (req, res, next) => {
    res.render('signup')
})

router.get('/logout', not_logged_in, (req, res) => {
    console.log(req.session.passport.user + ' Logged Out')
    req.session.destroy()
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    req.logOut();
    res.redirect('/login-form')

})
router.get('/forgetPassword', not_logged_in, (req, res, next) => {
    res.render('forgetPassword')
})
// ========================================== DID Tab on Navigation Bar ========================================== 

// ========================================== DID Page ========================================== 

router.get('/seeAllRates', not_logged_in, (req, res, next) => {
    res.render('seeAllRates', { flagPath: '' })
})

router.get('/did', not_logged_in, (req, res) => {
    connection = mysql.createConnection(sqlFile.connection)
    query = 'Use ' + sqlFile.databasename
    connection.query(query)
    console.log('Data Base Connected For DID Page.')
    connection.query("select did_countryName from  did_rates", (error, response) => {
        if (error)
            console.log("Error at the country flag Sql::: ", error)
        else
            res.render('DID', { countryName_sqlResponse: response, sqlResponse: null, USsqlResponse: null })

    })
})

router.get('/didPackages', not_logged_in, (req, res) => {

    connection = mysql.createConnection(sqlFile.connection)
    query = 'Use ' + sqlFile.databasename
    connection.query(query)
    console.log('Data Base Connected in DID Packages.')
    connection.query("select All_country_name from  all_countries_of_world", (error, response) => {
        if (error)
            console.log("Error at the country flag Sql::: ", error)
        else
            res.render('did_Packages', { sqlResponse: response })
    })

})


router.get('/did/didPurchase/:countryName/:cityName', not_logged_in, (req, res) => {
    console.log(req.params.countryName)
    console.log(req.params.cityName)
    res.render('didPurchase', { sqlResponse: null, cityName: req.params.cityName, countryName: req.params.countryName })

})

// ========================================== Solutions Tab on Navigation Bar ========================================== 

// ========================================== Wholesaler Solutions  Page ==========================================


router.get('/wholeSale_Solution', not_logged_in, (req, res, next) => {
    connection = mysql.createConnection(sqlFile.connection)
    query = 'Use ' + sqlFile.databasename
    connection.query(query)
    console.log('Data Base Connected in DID Packages.')
    connection.query("select All_country_name from  all_countries_of_world", (error, response) => {
        if (error)
            console.log("Error at the country flag Sql::: ", error)
        else

            res.render('WholeSale_Solution', { sqlResponse: response })
    })
    //res.render('WholeSale_Solution')
})




// ========================================== Call Centre Solutions  Page ==========================================



router.get('/callCentre_Solution', not_logged_in, (req, res, next) => {
    connection = mysql.createConnection(sqlFile.connection)
    query = 'Use ' + sqlFile.databasename
    connection.query(query)
    console.log('Data Base Connected in DID Packages.')
    connection.query(`select All_country_name from  all_countries_of_world where All_country_name = 'United States of America' or All_country_name = 'United Kingdom' or
                        All_country_name = 'Australia' or All_country_name = 'New Zealand' or All_country_name = 'Canada'    `, (error, response) => {
        if (error)
            console.log("Error at the country flag Sql::: ", error)
        else

            res.render('callCenter_Solution', { sqlResponse: response })
    })
    //res.render('WholeSale_Solution')
})



























// ========================================== User Profile Routes ========================================== 

router.get('/user_Dashboard', user_logged_In, (req, res, next) => {
    console.log(req.session.passport.user + '  is Logged in')
    res.render('user_Dashboard', { userProfile_Pic: req.user.profile_img_path })
})
router.get('/user_profile', user_logged_In, (req, res, next) => {
    console.log(req.user.phoneNumber)
    const extention = req.user.phoneNumber.split('##')
    console.log(extention[1])
    res.render('user_profile', {
        username: req.user.username, name: req.user.fullname, user_email: req.user.email, user_Country: req.user.country,
        user_city: req.user.city, user_phoneExtention: extention[0], user_phoneNumber: extention[1],
        userProfile_Pic: req.user.profile_img_path
    })


})

router.get('/user_extenstion', user_logged_In, (req, res, next) => {
    res.render('user_extenstion', { userProfile_Pic: req.user.profile_img_path, user_extention: req.user.id })
})



router.get('/user_usage', user_logged_In, (req, res, next) => {

    connection = mysql.createConnection(sqlFile.connection)
    query = 'Use ' + sqlFile.databasename
    connection.query(query)
    console.log('Data Base Connected in User Log History.')

    connection.query(`SELECT L.* FROM logs L LEFT OUTER JOIN user R ON R.id = L.log_fk WHERE L.log_fk = ?`, [req.user.id], (error, sqlResponse) => {
        if (error)
            console.log('Error occur at the User Logs History Database Response')
        else {
            res.render('user_usage', {
                user_vallet_amount: req.user.credit,
                userProfile_Pic: req.user.profile_img_path,
                sqlResponse
            })
        }
    })
})


router.get('/user_vallet', user_logged_In, (req, res, next) => {
    res.render('user_vallet', { user_vallet_amount: req.user.user_vallet_amount, userProfile_Pic: req.user.profile_img_path })
})

router.get('/user_helpdesk', user_logged_In, (req, res, next) => {
    res.render('user_helpdesk', { userProfile_Pic: req.user.profile_img_path })
})

router.get('/user_changePassword', user_logged_In, (req, res, next) => {
    res.render('user_changePassword', { userProfile_Pic: req.user.profile_img_path })
})

router.get('/user_chnageProfile_Picture', user_logged_In, (req, res, next) => {
    res.render('user_chnageProfile_Picture', { userProfile_Pic: req.user.profile_img_path })
})


router.get('/verify', (req, res, next) => {
    res.render('pleaseVerifyEmail')
})


module.exports = router, user_logged_In