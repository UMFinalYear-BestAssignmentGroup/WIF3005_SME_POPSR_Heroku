var express = require('express');
var router = express.Router();
var perf = require('../controller/performance');

let {isLoggedIn, auth_no_t1, auth_no_t1_t2} = require('../middleware/authenticate');

//for t2 & t3 ONLY
router.get('/get_overall', perf.get_performance_overall);

module.exports = router;