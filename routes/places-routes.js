const express = require('express');

const router = express.Router();

const TEMP_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famos skyscrapers in the world',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = TEMP_PLACES.find(p => p.id === placeId);

    if (!place) {
        const error = new Error('Could not find place with that id');
        error.code = 404;
        return next(error); // passes error to next middleware in app.js
    }

    res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const place = TEMP_PLACES.find(p => p.creator === userId);

    if (!place) {
        const error = new Error('Could not find place with that user id');
        error.code = 404;
        return next(error); // passes error to next middleware in app.js
    }

    res.json({ place });
});

module.exports = router;