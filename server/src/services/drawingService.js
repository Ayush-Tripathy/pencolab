const Drawings = require("../models/Drawings");

const getDrawings = async (roomCode) => {
    let return_object = {
        status: "",
        statusCode: null,
        message: "",
        data: {},
        error: null
    };

    await Drawings.find({ roomCode: roomCode }).then((drawings) => {
        return_object = {
            status: 'success',
            statusCode: 201,
            message: "Successfully fetched drawings",
            data: {
                drawings: drawings
            },
            error: null
        };
    }).catch(err => {
        console.log(err);
        return_object = {
            status: 'error',
            statusCode: err?.statusCode || 503,
            message: "Error while fetching drawings.",
            data: {},
            error: err?._message || "Internal Server Error."
        };
    });

    return return_object;

}

module.exports = { getDrawings };