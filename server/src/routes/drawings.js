const { getPrevDrawings } = require("../controllers/drawingController");
const asyncHandler = require("../middlewares/asyncHandler");

const drawingRouter = require("express").Router();

drawingRouter.get("/prev-drawings", asyncHandler(async (req, res, next) => {
    const response = await getPrevDrawings(req, res, next);

    if (response.status === "success") {
        let data = {
            status: 'success',
            statusCode: response.statusCode,
            message: response.message,
            data: response.data,
            error: null
        }
        res.status(response.statusCode).json(data);
    }
    else if (response.status === "error") {
        let data = {
            status: "error",
            statusCode: response.statusCode,
            message: response.message,
            data: response.data,
            error: response.error
        }

        res.status(response.statusCode).json(data);
    }
}));

module.exports = drawingRouter;