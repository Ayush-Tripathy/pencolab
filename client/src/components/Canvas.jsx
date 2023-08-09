import React, { useContext, useEffect } from 'react'
import './Canvas.css'
import useDraw from '../hooks/useDraw'
import { RoomContext } from '../contexts/RoomContext';
import { SocketContext } from '../contexts/SocketContext';

let currentCanvas = null;

const Canvas = ({ width, height, lineWidth, color, isErasing }) => {

    const { drawings, connectedRoom, checkRoom } = useContext(RoomContext);
    const { socket } = useContext(SocketContext);
    // console.log("canvas: ", lineWidth, color);
    const draw = (ctx, point, prevPoint) => {
        // console.log("sending: ", point, prevPoint, lineWidth, color);
        drawLine(ctx, prevPoint, point, lineWidth, color, isErasing);

        if (!socket.current) return;

        prevPoint = prevPoint ?? point

        drawings.current = [...drawings.current, {
            roomCode: connectedRoom,
            lastX: prevPoint.x,
            lastY: prevPoint.y,
            x: point.x,
            y: point.y,
            color: color,
            lineWidth: lineWidth,
            isErasing: isErasing
        }];

        if (connectedRoom) {
            socket.current.emit("draw", {
                roomCode: connectedRoom,
                lastX: prevPoint.x,
                lastY: prevPoint.y,
                x: point.x,
                y: point.y,
                color: color,
                lineWidth: lineWidth,
                isErasing: isErasing
            })
        }
    }

    const drawLine = (ctx, start, end, width, color, isErasing) => {
        start = start ?? end;
        ctx.beginPath();
        if (isErasing) {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.strokeStyle = color;
            ctx.globalCompositeOperation = 'source-over';
        }
        ctx.lineWidth = width;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineCap = "round";
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    const { setCanvasRef, onMouseDown, getCurrentCanvas } = useDraw(draw);

    useEffect(() => {
        const canvas = getCurrentCanvas();
        const ctx = canvas.getContext('2d');

        if (socket.current) {
            socket.current.on("clearCanvas", () => {
                drawings.current = [];
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });

            socket.current.on("draw", (drawing) => {
                const { lastX, lastY, x, y, color, lineWidth, isErasing } = drawing;
                // console.log(lastX, lastY, x, y);
                const prevPoint = {
                    x: lastX,
                    y: lastY
                };
                const point = {
                    x: x,
                    y: y
                }
                drawLine(ctx, prevPoint, point, lineWidth, color, isErasing);
            })
        }


    }, [drawings, socket, getCurrentCanvas]);

    useEffect(() => {
        const canvas = getCurrentCanvas();
        const ctx = canvas.getContext('2d');

        // console.log(`dddddddd: `, drawings.current);
        if (drawings.current) {
            drawings.current.forEach((drawing) => {
                const { lastX, lastY, x, y, color, lineWidth, isErasing } = drawing;
                // console.log(lastX, lastY, x, y);
                const prevPoint = {
                    x: lastX,
                    y: lastY
                };
                const point = {
                    x: x,
                    y: y
                }
                drawLine(ctx, prevPoint, point, lineWidth, color, isErasing);

            });
        }
    }, [drawings, getCurrentCanvas]);

    useEffect(() => {
        checkRoom();
    }, [checkRoom]);

    return (
        <div className='canvas-div'>
            <canvas
                width={width}
                height={height}
                // onChange={handleChange}
                onMouseDown={onMouseDown}
                onTouchStart={onMouseDown}
                ref={(ref) => {
                    setCanvasRef(ref);
                    currentCanvas = getCurrentCanvas();
                }}
            />
        </div>
    )
}

export { currentCanvas }
export default Canvas