module.exports = (app) => {

    mysql = require('mysql'),
        path = require('path'),
        bcrypt = require('bcrypt'),
        fs = require('fs'),
        ejs = require('ejs'),
        multer = require('multer'),
        sqlFile = require('../config/Mysql/mysql'),
        jwt_File = require('../config/JWT')

    // ========================================== Change Profile Image ==========================================
    //Multer For user profile storage at the /public/ userprofileImage
    /**
     * Multer will be used from here it will store the picture /public/userprofileImage
     * It will  only store the path in the database not the image
     * path of the image will store as per the user contact number plus with a hash of 'ITZ SOLUTION'
     * MULTER CANNOT BE WRITTEN IN ANOTHER JS FILE BECAUSE IT DOES NOT SUPPORT
     */


    const multerStorage = multer.diskStorage(
        {
            destination: './public/userprofileImage/',
            filename: (req, file, cb) => {
                cb(null, file.fieldname + path.extname(file.originalname))
            }
        })
    const fileUpload_Specs = multer(
        {
            storage: multerStorage,
            limits: { fileSize: 3000000 },
            fileFilter: (req, file, cb) => {
                checkFileType(file, cb)
            }
        }).any()


    function checkFileType(file, cb) {

        const types = /jpeg|jpg|png|gif/
        const extnames = types.test(path.extname(file.originalname).toLowerCase())
        const mimetype = types.test(file.mimetype)
        console.log(extnames, mimetype);

        if (extnames && mimetype)
            return cb(null, true)
        else
            cb('Wrong File Type')
    }

    /**
     * This method is little bit tricky
     * lets start
     * there is file upload using the multer
     * then it will store in the public/userprofilepic folder
     * then by using the fs module of the node js
     * the profile pic name will be changed according to the user
     * the scheme for the path change is user Country + current date time
     * this scheme will help to prevent the duplication
     * then at last storing the path of the picture to the database
     */
    app.post('/userProfilePicture', (req, res) => {
        var userPic_Path = ''
        var temp = ''
        fileUpload_Specs(req, res, (error) => {
            if (error)
                res.render('user_chnageProfile_Picture', { message: error, userProfile_Pic: 'undefined', user: req.user.username })
            else {
                userPic_Path = req.files[0].destination + req.user.country + Date.now() + path.extname(req.files[0].originalname)
                console.log(req.files[0], 'Image Uploaded', userPic_Path)

                temp = userPic_Path.split('public')
                fs.renameSync(req.files[0].path, userPic_Path)
                console.log(temp[1]);

                //Database starts here

                connection_With_mySQL()
                console.log('Data Base Connected in Profile Picture Path Change.')

                connection.query('update user set profile_img_path = ? where email = ? ', [temp[1], req.user.email], (error, sqlResponse) => {
                    if (error)
                        console.log('Error occur at the Profile Picture Path Change Token Database')
                    else {
                        console.log(sqlResponse)
                        console.log('Successfully add Profile Pic in the Database')
                    }
                })
                res.render('user_chnageProfile_Picture', { userProfile_Pic: temp[1], message: 'Profile Picture Changed Successfully', user: req.user.username })
            }
        })


    })




    // ========================================== User Change Password ==========================================
    /**
     * User Update password post method
     * User will enter the new password and then by connecting the database
     * and then HASHED password by using BCRYPT will be stored here
     *
     * */


    app.post('/userChangePassword_POSTmethod', (req, res) => {

        bcrypt.compare(req.body.old_password, req.user.password, (error, data) => {
            console.log(data, req.user.password)
            if (data) {

                if (req.body.new_password.length < 8) {
                    res.render('user_changePassword', { message: `Password is weak`, user: req.user.username })
                }
                if (req.body.new_password === req.body.confirm_password) {

                    connection_With_mySQL()
                    console.log('Data Base Connected in Change User Password')
                    var hash = bcrypt.hashSync(req.body.new_password, 10)
                    connection.query(`update user set password = ?  where email = ? `, [hash, req.user.email], (error, sqlResponse) => {
                        if (error)
                            console.log('Error occur at the Password Change')
                        else {
                            console.log(sqlResponse)
                            console.log(hash)
                            console.log('Successfully Changed the password in the Database')
                            res.render('user_changePassword', {
                                message: `Password is Changed`,
                                userProfile_Pic: req.user.profile_img_path, user: req.user.username
                            })
                        }
                    })
                }
                else {
                    res.render('user_changePassword', {
                        message: `Confirm Password doesn't match`,
                        userProfile_Pic: req.user.profile_img_path, user: req.user.username
                    })
                }
            }
            else {
                res.render('user_changePassword', {
                    message: `Old Password doesn't match`,
                    userProfile_Pic: req.user.profile_img_path, user: req.user.username
                })
            }
        })


    })

    app.post('/helpdesk_POSTmethod', (req, res) => {

        /***
         * here is the ejs render file module to get the file
         * so the user wants to contact the admin template
         * now then adding the user name, message subject and plus the message
         * and email is sent by using the  method built in the JWT.js file
         *  this is the one email which is being used all over but
         * you can made another one like 'helpdesk@abstract.com'
         * just to prevent mis management
         */
        ejs.renderFile('views/emailTemplates/help_desk_mesaage_email.ejs', {
            user_name: req.body.helpdesk_username, message_subject: req.body.helpdesk_subject,
            user_message: req.body.helpdesk_message, user_email: req.body.helpdesk_email
        }, (error, file) => {
            if (error)
                console.log(error)

            else {
                console.log(file)
                jwt_File.nodemailer_Option.from = `"${req.body.helpdesk_username}" <${req.body.helpdesk_email}>`
                jwt_File.sendmail_Config(file, process.env.AdminEmail, 'User Help Desk')
            }
        })
        res.render('user_helpdesk', {
            userProfile_Pic: req.user.profile_img_path, messagestatus: `Thank you!
    Your message has been successfully sent. We will contact you very soon!` , user: req.user.username
        })
    })




    // ========================================== Update User Profile Information ==========================================

    app.post('/updateUser_Priofile', (req, res) => {
        var temp = req.body.countryCode.split('%%')
        var countryName = temp[0]
        console.log(countryNumber)

        var countryNumber = temp[1] + '##' + req.body.number
        console.log(countryNumber)
        connection_With_mySQL()
        console.log('Data Base Connected in Update User Profile Information.')

        connection.query('update user set fullname = ?, country = ?, phoneNumber = ?  where email = ? ',
            [req.body.name, countryName, countryNumber, 'a@a'], (error, sqlResponse) => {
                if (error)
                    console.log('Error occur at the Update User Profile Information Database')
                else {
                    console.log(sqlResponse)
                    console.log('Successfully Update the Profile of User "a@a" in the Database')
                }
            })
        const extention = req.user.phoneNumber.split('##')


        res.render('user_profile', {
            username: req.user.username, name: req.user.fullname, user_email: req.user.email, user_Country: req.user.country,
            user_city: req.user.city, user_phoneExtention: extention[0], user_phoneNumber: extention[1],
            userProfile_Pic: req.user.profile_img_path, user: req.user.username, message: 'Profile Successfully Updated'
        })
    })




    // ========================================== JSON WEB TOKEN ============================================
    /**Json web token is sent from the signup in the config/JWT.js file and now it is being verified here
     * then after the verification boolean will be to the database that user is verified then he/she will be allowed to get access
     * to the web
     */

    app.get('/verifyToken', jwt_File.verifyToken, (req, res) => {
        jwt_File.jwt.verify(req.token, process.env.privateKey, (error, data) => {
            if (error)
                console.log('Error at verifying token')
            else {
                console.log('Data Base Connected in Verify Token')
                connection.query('update user set email_veri = 1 where email = ? ', [data.userEmail], (error, sqlResponse) => {
                    if (error)
                        console.log('Error occur at the Email Verification Token Database')
                    else {
                        console.log(sqlResponse)
                        console.log('Successfully Verified token in the Database')
                        res.render('successEmail_Verify', { name: data.Fullname, user: req.user.username })
                    }
                })
            }


        })
    })


    app.post('/createCall_Center_Ajax', (req, res) => {
        connection_With_mySQL()
        connection.query(`Insert into call_center_requests values (?,?,?,?,?,?,?)`,
            [req.body.callCenterName, req.body.no_Of_Seat, req.body.nameofCompaing,
            req.body.nameOfCountry, req.body.inbound_outbound_select,
            req.body.callback_Dialing_YES_checkBox, req.body.numberOf_Callback]
            , (error, response) => {
                if (error)
                    console.log(error)
                else {
                    console.log(response)
                    res.send({ userProfile_Pic: req.user.profile_img_path, user: req.user.username })
                }
            })
        // rendering the file and setting the use full information into the file and then sending the email
        ejs.renderFile('views/emailTemplates/request_A_Call_Center.ejs', {
            callCenterName: req.body.callCenterName, no_Of_Seat: req.body.no_Of_Seat, nameofCompaing: req.body.nameofCompaing,
            nameOfCountry: req.body.nameOfCountry, inbound_outbound_select: req.body.inbound_outbound_select,
            checkBox: req.body.callback_Dialing_YES_checkBox, numberOf_Callback: req.body.numberOf_Callback,
            contactNumber : req.body.contactNumber,address : req.body.address
        }, (error, file) => {
            if (error)
                console.log(error)

            else {
                jwt_File.nodemailer_Option.from = `"New Call Center" <${req.session.passport.user}>`
                jwt_File.sendmail_Config(file, process.env.AdminEmail, 'Create A New Call Center')
            }
        })


    })


    app.get('/123', (req, res) => {
        res.render('request_A_Call_Center', {
            user_name: 'Sassad', user_email: 'email', message_subject:
                'subject', user_message: 'message', checkBox: 1
        })
    })


    function connection_With_mySQL() {
        connection = mysql.createConnection(sqlFile.connection)
        query = 'Use ' + sqlFile.databasename
        connection.query(query)
    }









}