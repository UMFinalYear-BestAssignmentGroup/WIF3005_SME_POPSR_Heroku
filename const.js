
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];

config.user = "golvnlrmhxiiwq";
config.password = "f8ad7f58b2d3854b51d3f259a05231f4530797c8c748c4f3781d83439eb901a1";
config.database = "dacn6qdp67rb2q";

module.exports = {
    CONST_page_limit: 10,
    dbPool: config
};