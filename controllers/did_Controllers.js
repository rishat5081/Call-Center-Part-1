module.exports = (app) => {
    mysql = require('mysql'),
        sqlFile = require('../config/Mysql/mysql')

    // ========================================== Main Home Page ==========================================

    // ========================================== Call Rates from Main Home Page ==========================================

    // ========================================== Will redirect to see All rates page ==========================================

    // ========================================== View Details Buttons ==========================================

    app.post('/seeAllrate_mainPage', (req, res) => {
        var button_temp = req.body.countryRates, button_temp1 = ''


        connection = mysql.createConnection(sqlFile.connection)
        query = 'Use ' + sqlFile.databasename
        connection.query(query)
        console.log('Data Base Connected in View Details Through View .')
        connection.query(`select route_VOIP,New_Rate from rate_list where route_VOIP like '${button_temp + '%'}'`, (error, sqlResponse) => {



            if (error)
                console.log("There is error in view rate details Database fetching")
            else {
                if (button_temp === 'America') {
                    button_temp1 = 'United States of America'
                    res.render('seeAllRates', { flagPath: button_temp1, sqlResponse: sqlResponse, user: req.session.passport })
                }
                else
                    res.render('seeAllRates', { flagPath: button_temp, sqlResponse: sqlResponse, user: req.session.passport })
            }
        })
        ////connection.end()
    })

    // ========================================== See All Rates ==========================================

    // ========================================== Search Bar Post Method ==========================================

    app.post('/seeRates_BySearchBar', (req, res) => {

        console.log(req.body.browser)
        if (req.body.browser === 'United States of America')
            req.body.browser = 'America'
        connection = mysql.createConnection(sqlFile.connection)
        query = 'Use ' + sqlFile.databasename
        connection.query(query)
        console.log('Data Base Connected in View Details Through Input Search Bar.')
        connection.query(`select route_VOIP,New_Rate from rate_list where route_VOIP like '${req.body.browser + '%'}'`, (error, sqlResponse) => {
            console.log(sqlResponse);
            if (error)
                console.log("There is error in view rate details Database fetching")
            else {
                var button_temp1 = ''
                if (req.body.browser === 'America') {
                    button_temp1 = 'United States of America'

                    res.send({ flagPath: button_temp1, user: req.session.passport, sqlResponse: sqlResponse })
                }
                else
                    res.send({ flagPath: req.body.browser, user: req.session.passport, sqlResponse: sqlResponse })
            }
        })
    })

    // ========================================== DID Page ==========================================
    // ========================================== Modal for getting All countires cities except US ==========================================
    // ========================================== Modal Post Method ==========================================

    app.get('/countryDID_Rate/:countryName', (req, res) => {

        console.log(req.params.countryName)
        connection = mysql.createConnection(sqlFile.connection)
        query = 'Use ' + sqlFile.databasename
        connection.query(query)
        console.log(`Data Base Connected To get DID rates for the Specific Country :: ${req.params.countryName}`)

        // there is if statement for the US and all the other countries because
        // US have states then cities but other all countries donot have states in the database
        // so data is sent to the client as per there request
        if (req.params.countryName === 'United States of America') {
            connection.query(`SELECT rate.did_countryName, rate.did_only_NRC, rate.did_only_MRC, rate.did_capacity_NRC,rate.did_capacity_MRC, US_states.citiesName , list.Prefix

                       FROM did_united_states_cities US_states, did_rates rate, rate_list list

                       where list.Route_VOIP = 'North American Region' AND rate.did_countryName like '${req.params.countryName}%'

                       GROUP BY US_states.citiesName HAVING COUNT(US_states.citiesName) > 1`,

                (error, sqlResponse) => {
                    if (error)
                        console.log(`There is error in did rates of the country :: ${req.params.countryName} `)
                    else {
                        console.log(sqlResponse)
                        res.send({ sqlResponse: sqlResponse, countryFlagName: req.body.did_Modal, user: req.session.passport })
                    }
                })
        }
        else {
            connection.query(`SELECT rate.did_countryName, rate.did_only_NRC, rate.did_only_MRC,rate.did_capacity_NRC,rate.did_capacity_MRC,
                        city.citiesName , list.Prefix

                       FROM did_cities_coverage city, did_rates rate , rate_list list

                       where rate.did_countryName like '${req.params.countryName}%' AND city.countryName LIKE '${req.params.countryName}%'
                       AND list.Route_VOIP like '${req.params.countryName} Fixed'`, (error, sqlResponse) => {
                if (error)
                    console.log(`There is error in did rates of the country :: ${req.params.countryName} `)
                else {
                    if (sqlResponse.length === 0) {
                        res.send({ sqlResponse: null, countryFlagName: req.body.did_Modal, user: req.session.passport })
                    } else {

                        res.send({ sqlResponse: sqlResponse, countryFlagName: req.body.did_Modal, user: req.session.passport })

                    }
                }
            })
        }


    })
    // ========================================== Modal Post Method ==========================================
    // ========================================== Modal for getting cities of US ==========================================

    app.get('/get_US_cities/:stateName', (req, res) => {
        connection = mysql.createConnection(sqlFile.connection)
        query = 'Use ' + sqlFile.databasename
        connection.query(query)
        connection.query(`SELECT us_cities.*, list.Prefix FROM did_united_states_cities us_cities , rate_list list  
        
                         where list.Route_VOIP = 'North American Region' AND us_cities.citiesName = '${req.params.stateName}'`, (error, sqlResponse) => {
            if (error)
                console.log(`There is error in did rates of the country :: ${req.params.stateName} `)
            else {
                console.log(sqlResponse)
                res.send({
                    USsqlResponse: sqlResponse, user: req.session.passport
                })
            }
        })
    })
}


