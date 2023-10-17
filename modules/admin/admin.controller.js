const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { validateRequest } = require('./../../middileware/validation');
const adminService = require('../admin/admin.service');


router.post('/admin/login', authenticateSchema, authenticate);
router.post('/admin', registerSchema, registerAdmin);


module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    adminService.authenticate(req.body)
        .then(data => res.json({ message: "Success", data }))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        phoneNo: Joi.string().required()

    });
    validateRequest(req, next, schema);
}

async function registerAdmin(req, res, next) {
    try {
        const data = await adminService.register(req.body);
        res.json({ message: "Success", data });
    } catch (error) {
        next(error);
    }
}
