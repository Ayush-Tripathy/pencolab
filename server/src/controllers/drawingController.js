const { getDrawings } = require("../services/drawingService");

const getPrevDrawings = async (req, res, next) => {
    let return_object = {
        status: "",
        statusCode: null,
        message: "",
        data: {},
        error: null
    }

    const roomCode = req.query.r;

    const response = await getDrawings(roomCode);

    if (response.status === "success") {
        return_object = {
            status: 'success',
            statusCode: response.statusCode,
            message: response.message,
            data: response.data,
            error: null
        }
    }
    else if (response.status === "error") {
        return_object = {
            status: "error",
            statusCode: response.statusCode,
            message: response.message,
            data: response.data,
            error: response.error
        }
    }

    return return_object;

}

module.exports = { getPrevDrawings };