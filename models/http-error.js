class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // Add a 'message' property to instance
        this.code = errorCode; // Add a 'code' property to instance
    }
}

module.exports = HttpError;