// db.js

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
 // database: ''+db_name+'',
 database: "db",
 password: '1234',
 port: 5432,
});
    pool.connect()
module.exports = {
  query: (text, params) => pool.query(text, params),
};
