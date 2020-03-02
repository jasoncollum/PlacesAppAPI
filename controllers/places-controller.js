const HttpError = require('../models/http-error');

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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = TEMP_PLACES.find(p => p.id === placeId);

    if (!place) {
        return next(new HttpError('Could not find place with that id', 404));
    } // passes error to next middleware

    res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const place = TEMP_PLACES.find(p => p.creator === userId);

    if (!place) {
        return next(new HttpError('Could not find place with that user id', 404));
    } // passes error to next middleware

    res.json({ place });
};

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    TEMP_PLACES.push(createdPlace);

    res.status(201).json({ place: createdPlace }); // Standard code sent when successfully created something new
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;