const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordinatesForAddress = require('../util/location');
const Place = require('../models/place');

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

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(
            new HttpError('Something went wrong - Could not find place', 500)
        );
    }

    if (!place) {
        return next(new HttpError('Could not find place with that id', 404));
    }

    res.json({ place: place.toObject({ getters: true }) }); // getter adds id property to current object
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (error) {
        return next(
            new HttpError('Fetching places failed', 500)
        );
    }

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find places with that user id', 404));
    }

    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid input, please check your data', 422)
        );
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordinatesForAddress(address);
    } catch (error) {
        return next(error);
    }


    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'http://upload.wikimedia.org/wikipedia/commons/d/df/NYC_Empire_State_Building.jpg',
        creator
    });

    try {
        await createdPlace.save();
    } catch (error) {
        return next(
            new HttpError('Creating place failed', 500)
        );
    }

    res.status(201).json({ place: createdPlace }); // Standard code sent when successfully created something new
}

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input, please check your data', 422);
    }

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
    if (!TEMP_PLACES.find(p => p.id === placeId)) {
        throw new HttpError('Could not find place with that id', 404);
    }

    TEMP_PLACES = TEMP_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({ message: 'Deleted place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;