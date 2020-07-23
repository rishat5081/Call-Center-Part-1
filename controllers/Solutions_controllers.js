module.exports = (app) => {
    mysql = require('mysql'),
        sqlFile = require('../config/Mysql/mysql')

    // -------------------------------------------- Whole Sale Solution Pages Ajax Call ------------------------------------------------
    app.get('/wholesale_Rate/:countryName', (req, res) => {
        var countryName = " "
        if (req.params.countryName === "United States of America")
            countryName = "United States"
        else
            countryName = req.params.countryName

        connection = mysql.createConnection(sqlFile.connection)
        query = 'Use ' + sqlFile.databasename
        connection.query(query)
        console.log('Data Base Connected for Whole Sale Solutions Ajax Call')
        connection.query(`select Route_VOIP, New_Rate*1000 as total from  rate_list where Route_VOIP like '${countryName + '%'}' `, (error, response) => {
            if (error)
                console.log("Error at the country flag Sql::: ", error)
            else
                res.send({ sqlResponse: response, user: req.session.passport })
        })

    })



    // ----------------------------------- Call Center Solution Pages Ajax Call ------------------------------------------------



    app.get('/callCenter_Rate/:countryName', (req, res) => {
        var countryName = " "
        if (req.params.countryName === "United States of America")
            countryName = "United States"
        else
            countryName = req.params.countryName


        connection = mysql.createConnection(sqlFile.connection)
        query = 'Use ' + sqlFile.databasename
        connection.query(query)
        console.log('Data Base Connected for the Call Center Solution Ajax Call')
        connection.query(`select Route_VOIP, New_Rate*1000 as total from  rate_list where Route_VOIP like '${countryName + '%'}' `, (error, response) => {
            if (error)
                console.log("Error at the country flag Sql::: ", error)
            else
                res.send({ sqlResponse: response, user: req.session.passport })
        })

    })





























}

