/**
 * Created by OHBABY on 2016-11-13.
 */

var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
   host: '202.30.23.51',
   port:3306,
   user:'sap16t9',
    password:'sap16t9!',
    database: 'SOCIAL_APP_PROJECT_9'
});

module.exports = pool;