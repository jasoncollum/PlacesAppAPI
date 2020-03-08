const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (error) {
        return next(
            new HttpError('Fetching users failed', 500)
        )
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid input, please check your data', 422)
        );
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        return next(
            new HttpError('Sign up failed', 500)
        );
    }

    if (existingUser) {
        return next(new HttpError('Email already in use - Please login', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(
            new HttpError('Could not create user, Please try again', 500)
        );
    }

    createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });

    try {
        await createdUser.save();
    } catch (error) {
        return next(
            new HttpError('Sign up failed', 500)
        );
    }

    let token;
    try {
        token = jwt.sign({
            userId: createdUser.id,
            email: createdUser.email
        },
            'supersecret',
            { expiresIn: '1h' }
        );
    } catch (error) {
        return next(
            new HttpError('Sign up failed', 500)
        );
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        token
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ email: email });
    } catch (error) {
        return next(
            new HttpError('Something went wrong', 500)
        );
    }

    if (!identifiedUser) {
        return next(
            new HttpError('Could not identify user, incorrect credentials', 401)
        );
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, identifiedUser.password);
    } catch (error) {
        return next(
            new HttpError('Could not log you in, please check your credentials and try again', 500)
        );
    }

    if (!isValidPassword) {
        return next(
            new HttpError('Invalid credentials, could not log you in', 401)
        );
    }

    res.json({ message: 'Logged in!', user: identifiedUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;