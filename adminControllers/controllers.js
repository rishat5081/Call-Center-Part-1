module.exports = (app) => {
    mysql = require('mysql'),
        sqlFile = require('../config/Mysql/mysql')



    app.post('/admin', (req, res) => {
        // this how you will differentiate between save and delete button all you have to assign button values and then you will check them here
        console.log(req.body.delete);
        console.log(req.body.save);



    })


    app.post('/cms_page_content_form',(req,res)=>
    {
        console.log(req.body.cms_page_content)
    })


    


}
