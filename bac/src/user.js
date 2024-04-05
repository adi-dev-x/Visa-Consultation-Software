const moment = require('moment');
const crypto = require('crypto');
const connection = require('./db');
const NodeCache = require("node-cache");

const cache = new NodeCache();

class User {
    async getQuery(req, res) {
        console.log("reached", req);
        console.log("this is data", req.body.query);

        try {
            const text = req.body.query;
            const rows = await connection.query(text);
            console.log(rows);

            return res.status(201).send({
                'message': rows
            });
        } catch (error) {
            return res.status(400).send({
                'message': error
            });
        }
    }
}

module.exports = {
    User
};
