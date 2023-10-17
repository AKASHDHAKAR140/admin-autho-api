const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { validateRequest } = require('./../../middileware/validation');
const subAdminService = require('./subadmin.service');
const authorize = require('./../../middileware/admin');
//const authenticateToken = require("../../middileware/tokenVerified")


router.post('/subAdmin/login', authenticateSchema, authenticate);
router.post('/subAdmin', authorize(), registerSchema, registerSubAdmin);


module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    subAdminService.authenticate(req.body)
        .then(data => res.json({ message: "Success", data }))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        AdminId: Joi.number().required(),
    });
    validateRequest(req, next, schema);
}

async function registerSubAdmin(req, res, next) {
    try {
        const data = await subAdminService.register(req.body);
        res.json({ message: "Success", data });
    } catch (error) {
        next(error);
    }
}