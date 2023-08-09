const { saveRoom, checkAndJoinRoom } = require("../services/roomService");
const generateUniqueCode = require("../utils/codeGenerator")

const createRoom = async (req, res) => {

    let return_object = {
        status: "",
        statusCode: null,
        message: "",
        data: {},
        error: null
    };

    let room_admin = req.body.creator;

    try {
        const code = generateUniqueCode();
        const response = await saveRoom(code, [room_admin]);

        return_object = {
            status: response.status,
            statusCode: response.statusCode,
            message: response.message,
            data: response.data,
            error: response.error
        };
    } catch (err) {
        console.log("error: ", err);
        return_object = {
            status: "error",
            statusCode: 500,
            message: "Internal server error.",
            data: {},
            error: err
        };
    }

    return return_object;
}

const joinRoom = async (req, res) => {
    const roomCode = req.query.r;
    const user = req.query.c;

    let return_object = {
        status: "",
        statusCode: null,
        message: "",
        data: {},
        error: null
    };

    try {
        const response = await checkAndJoinRoom(roomCode, user);

        return_object = {
            status: response.status,
            statusCode: response.statusCode,
            message: response.message,
            data: response.data,
            error: response.error
        };
    } catch (err) {
        console.log("error: ", err);
        return_object = {
            status: "error",
            statusCode: 500,
            message: "Internal server error.",
            data: {},
            error: err
        };
    }

    return return_object;
}

module.exports = { createRoom, joinRoom };