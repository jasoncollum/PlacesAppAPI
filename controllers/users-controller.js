const { validationResult } = require('express-validator');

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

    let existing;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        return next(
            new HttpError('Sign up failed', 500)
        );
    }

    if (existing) {
        return next(new HttpError('Email already in use - Please login', 422));
    }

    createdUser = new User({
        name,
        email,
        image: 'http://curbcollege.org/wp-content/uploads/2012/09/Sorted-Noise-Jason.jpeg',
        password,
        places: []
    });

    try {
        await createdUser.save();
    } catch (error) {
        return next(
            new HttpError('Sign up failed', 500)
        );
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

    if (!identifiedUser || identifiedUser.password !== password) {
        return next(
            new HttpError('Could not identify user, incorrect credentials', 401)
        );
    }

    res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;