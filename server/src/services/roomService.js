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

module.exports = saveRoom;