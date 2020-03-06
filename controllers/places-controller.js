const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordinatesForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

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

    res.json({ place: place.toObject({ getters: true }) });
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

    let user;
    try {
        user = await User.findById(creator);
    } catch (error) {
        return next(
            new HttpError('Creating place failed', 500)
        );
    }

    if (!user) {
        return next(
            new HttpError('Could not find user for provided id', 404)
        );
    }

    try {
        await createdPlace.save();
    } catch (error) {
        return next(
            new HttpError('Creating place failed', 500)
        );
    }

    res.status(201).json({ place: createdPlace });
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid input, please check your data', 422)
        );
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(
            new HttpError('Something went wrong - Could not find place', 500)
        );
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (error) {
        return next(
            new HttpError('Something went wrong - Could not update place', 500)
        );
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(
            new HttpError('Something went wrong - Could not delete place', 500)
        );
    }

    try {
        await place.remove();
    } catch (error) {
        return next(
            new HttpError('Something went wrong - Could not delete place', 500)
        );
    }

    res.status(200).json({ message: 'Deleted place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;