const createRoom = require("../controllers/roomController");
const asyncHandler = require("../middlewares/asyncHandler");

const homeRouter = require("express").Router();

homeRouter.post('/create', asyncHandler(async (req, res, next) => {
    const response = await createRoom(req, res);
    if (response.status === "success") {
        res.status(response.statusCode).json(response);
    }
    else if (response.status === "error") {
        return next({
            status: 'error',
            statusCode: response.statusCode,
            message: response.message
        }, req, res, next);
    }
}));

module.exports = homeRouter;