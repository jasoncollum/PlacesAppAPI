const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let TEMP_PLACES = [
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

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = TEMP_PLACES.filter(p => p.creator === userId);

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find places with that user id', 404));
    } // passes error to next middleware

    res.json({ places });
};

const createPlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input, please check your data', 422);
    }

    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    TEMP_PLACES.push(createdPlace);

    res.status(201).json({ place: createdPlace }); // Standard code sent when successfully created something new
}

const updatePlace = (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.pid;

    // *** use the spread operator to create a copy of the object to be updated ***
    const updatedPlace = { ...TEMP_PLACES.find(p => p.id === placeId) };
    const placeIndex = TEMP_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    TEMP_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    TEMP_PLACES = TEMP_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({ message: 'Deleted place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;