const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { connectMongo } = require("./config/db");
const env = require("./config/env");
const homeRouter = require("./routes/home");
const errorHandler = require("./middlewares/errorHandler");
const Drawings = require("./models/Drawings");
const drawingRouter = require("./routes/drawings");


const app = express();

const corsOptions = {
    origin: (origin, cb) => {
        if (!origin) {
            cb(null, true); // send error if you don't want requests without origin.  
        }
        else if (env.ALLOWED_DOMAINS.indexOf(origin) !== -1) {
            cb(null, true);
        }
        else {
            cb(new Error("Not allowed by CORS."));
        }
    }
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/", homeRouter);
app.use("/d", drawingRouter);

app.use("*", (req, res) => {
    res.status(404).json({
        status: "Invalid Route",
        message: `The route "${req.url}" doesn\'t exist.`
    });
});

app.use(errorHandler);

let connectedToDB = false;

const PORT = env.LOCAL_PORT;

console.log("Hello!");

(async () => {
    try {
        connectMongo().then(() => {
            console.log("Connected to MongoDB");
            const server = app.listen(process.env.PORT || PORT, () => {
                console.log(`Server started on port ${process.env.PORT || PORT}`);
            });
            const io = new Server(server);

            io.on("connection", (socket) => {
                console.log(`New user connected with id: ${socket.id}`);

                socket.on("joinRoom", async (room) => {
                    socket.join(room.roomCode);
                    console.log(room);

                    await Drawings.find({ roomCode: room.roomCode }).then((drawings) => {
                        socket.emit("previousDrawings", drawings);
                    }).catch(err => {
                        console.log(err);
                    })
                });

                socket.on("draw", async (data) => {
                    const drawing = data;
                    // console.log(data);
                    const newDrawing = new Drawings({
                        lastX: drawing.lastX,
                        lastY: drawing.lastY,
                        x: drawing.x,
                        y: drawing.y,
                        roomCode: drawing.roomCode,
                        color: drawing.color,
                        lineWidth: drawing.lineWidth,
                        isErasing: drawing.isErasing
                    })

                    await newDrawing.save().then((saved) => {
                        socket.broadcast.to(data.roomCode).emit("draw", saved);
                    }).catch(err => console.log(err));
                });


                socket.on("clearCanvas", async (roomCode) => {
                    console.log("clear: ", roomCode);
                    await Drawings.deleteMany({ roomCode: roomCode })
                        .then(() => {
                            socket.broadcast.to(roomCode).emit("clearCanvas");
                        })
                        .catch(err => console.log(err));
                });



                // Handle user disconnection
                socket.on('disconnect', () => {
                    console.log('User disconnected:', socket.id);
                });
            });

            connectedToDB = true;
        }).catch((err) => {
            connectedToDB = false;
            console.error("Can't connect to Database.");
            console.error(err);
        });

    } catch (error) {
        console.log(error);
    }
})();

module.exports = connectedToDB;