const express = require('express'),
    router = express.Router(),
    mysql = require('mysql'),
    sqlFile = require('../config/Mysql/mysql')

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


//login page 
router.get('/', not_logged_in, (req, res) => {
    res.render('loginAdmin')
})

// home page 
router.get('/home', not_logged_in, (req, res) => {
    res.render('home')
})
router.get('/admin_manage', not_logged_in, (req, res) => {
    // req.flash('success','SuccessFully')
    res.render('admin_manage')
})

router.get('/admin_type_manage', not_logged_in, (req, res) => {
    // req.flash('success')
    res.render('admin_type_manage')
})
router.get('/permission_manage', not_logged_in, (req, res) => {
    res.render('permission_manage')
})
router.get('/type_of_permission', not_logged_in, (req, res) => {
    res.render('type_of_permission')
})
router.get('/packages', not_logged_in, (req, res) => {
    res.render('packages')
})
router.get('/admin_did_Packages', not_logged_in, (req, res) => {
    res.render('admin_did_Packages')
})
router.get('/did_RatesList', not_logged_in, (req, res) => {
    res.render('did_RatesList')
})
router.get('/SEO_manage', not_logged_in, (req, res) => {
    res.render('SEO_manage')
})
router.get('/blog_manage', not_logged_in, (req, res) => {
    res.render('blog_manage')
})
router.get('/news_feed_manage', not_logged_in, (req, res) => {
    res.render('news_feed_manage')
})
router.get('/CMS_manage', not_logged_in, (req, res) => {

    //req.flash('success', 'SuccessFully Added')
    res.render('CMS_manage')
})
router.get('/faq_manage', not_logged_in, (req, res) => {
    res.render('faq_manage')
})
router.get('/setting', not_logged_in, (req, res) => {
    res.render('setting')
})


module.exports = router