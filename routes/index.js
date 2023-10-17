var router = require('express').Router();

router.use( require('../modules/admin/admin.controller'));

router.use( require('../modules/subAdmin/subAdmin.controller'));

module.exports = router;    