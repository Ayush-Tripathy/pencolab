const Drawings = require("../models/Drawings");
const Rooms = require("../models/Rooms");

const saveRoom = async (code, connectedUsers) => {
    const room = new Rooms({
        code: code,
        connectedUsers: connectedUsers
    });

    let return_object = {
        status: "",
        statusCode: null,
        message: "",
        data: {},
        error: null
    };

    await room.save().then(saved => {
        return_object = {
            status: "success",
            statusCode: 201,
            message: "room created successfully.",
            data: {
                room: saved
            },
            error: null
        }
    }).catch(err => {
        return_object = {
            status: "error",
            statusCode: 502,
            message: "error creating room",
            data: {},
            error: err
        }
    })

    return return_object;
}

const checkAndJoinRoom = async (roomCode, user) => {
    let return_object = {
        status: "",
        statusCode: null,
        message: "",
        data: {},
        error: null
    };

    await Rooms.findOne({ code: roomCode }).then(async (room) => {
        if (room) {

            // await Rooms.updateOne({ code: roomCode }, { $push: { connectedUsers: user } }).catch(err => { });

            await Drawings.find({ roomCode: roomCode }).then((drawings) => {
                return_object = {
                    status: "success",
                    statusCode: 200,
                    message: "Room found.",
                    data: {
                        room: room,
                        drawings: drawings
                    },
                    error: null
                };
            }).catch(err => {
                console.log(err);
                return_object = {
                    status: "error",
                    statusCode: 502,
                    message: "Error while fetching room info.",
                    data: {},
                    error: err
                };
            });
        }
        else {
            return_object = {
                status: "Not found",
                statusCode: 404,
                message: `Room with code ${roomCode} not found.`,
                data: {},
                error: null
            };
        }
    }).catch(err => {
        console.log(err);
        return_object = {
            status: "error",
            statusCode: 502,
            message: "Error while fetching room info.",
            data: {},
            error: err
        };
    });

    return return_object;
}

module.exports = { saveRoom, checkAndJoinRoom };