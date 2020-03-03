const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');

const TEMP_USERS = [
    {
        id: 'u1',
        name: 'Jason Collum',
        email: 'test@test.com',
        password: 'password'
    }
];

const getUsers = (req, res, next) => {
    res.json({ users: TEMP_USERS });
};

const signup = (req, res, next) => {
    const { name, email, password } = req.body;
    const emailTaken = TEMP_USERS.find(u => u.email === email);

    if (emailTaken) {
        return next(new HttpError('This email is already being used', 422));
    }

    createdUser = {
        id: uuid(),
        name,
        email,
        password
    };

    TEMP_USERS.push(createdUser);
    res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    const identifiedUser = TEMP_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        return next(new HttpError('Could not identify user, tincorrect credentials', 401));
    }

    res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;