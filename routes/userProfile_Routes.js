const express = require('express'),
    router = express.Router(),
    mysql = require('mysql'),
    sqlFile = require('../config/Mysql/mysql'),
    middleWares_Fucntions = require('./EJS_file_routes')

// ========================================== User Profile Routes ========================================== 

router.get('/user_Dashboard', middleWares_Fucntions.user_logged_In, (req, res, next) => {
    console.log(req.session.passport.user + '  is Logged in')
    res.render('user_Dashboard', { userProfile_Pic: req.user.profile_img_path })
})
router.get('/user_profile', middleWares_Fucntions.user_logged_In, (req, res, next) => {
    console.log(req.user.phoneNumber)
    const extention = req.user.phoneNumber.split('##')
    console.log(extention[1])
    res.render('user_profile', {
        username: req.user.username, name: req.user.fullname, user_email: req.user.email, user_Country: req.user.country,
        user_city: req.user.city, user_phoneExtention: extention[0], user_phoneNumber: extention[1],
        userProfile_Pic: req.user.profile_img_path
    })
})
router.get('/user_extenstion', middleWares_Fucntions.user_logged_In, (req, res, next) => {
    res.render('user_extenstion', { userProfile_Pic: req.user.profile_img_path, user_extention: req.user.id })
})

router.get('/user_usage', middleWares_Fucntions.user_logged_In, (req, res, next) => {

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


router.get('/user_vallet', middleWares_Fucntions.user_logged_In, (req, res, next) => {
    res.render('user_vallet', { user_vallet_amount: req.user.user_vallet_amount, userProfile_Pic: req.user.profile_img_path })
})

router.get('/user_helpdesk', middleWares_Fucntions.user_logged_In, (req, res, next) => {
    res.render('user_helpdesk', { userProfile_Pic: req.user.profile_img_path })
})

router.get('/user_changePassword', middleWares_Fucntions.user_logged_In, (req, res, next) => {
    res.render('user_changePassword', { userProfile_Pic: req.user.profile_img_path })
})

router.get('/user_chnageProfile_Picture', middleWares_Fucntions.user_logged_In, (req, res, next) => {
    res.render('user_chnageProfile_Picture', { userProfile_Pic: req.user.profile_img_path })
})

router.get('/userphone_Contact', middleWares_Fucntions.user_logged_In, (req, res) => {
    res.render('userContact', { userProfile_Pic: req.user.profile_img_path })
})

router.get('/verify', (req, res, next) => {
    res.render('pleaseVerifyEmail')
})

router.get('/createCall_Center', middleWares_Fucntions.user_logged_In, (req, res, next) => {
    res.render('create_callCenter', { userProfile_Pic: req.user.profile_img_path })
})


module.exports = router