const express = require('express');

const router = express.Router();

const TEMP_USERS = [
    {
        id: 'u1',
        name: 'Jason Collum',
        image: 'https://wws.jasoncollum.com/img/jason.png',
        places: 1
    }
];

router.get('/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const user = TEMP_USERS.find(u => u.id === userId);
    res.json({ user });
});


module.exports = router;