import React from 'react'
import './Canvas.css'
import useDraw from '../hooks/useDraw'

let currentCanvas = null;

const Canvas = ({ width, height, lineWidth, color, isErasing }) => {
    const draw = (ctx, point, prevPoint) => {
        drawLine(ctx, prevPoint, point, lineWidth, color);
    }

    const drawLine = (ctx, start, end, width, color) => {
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

        // ctx.fillstyle = color;
        // ctx.beginPath();
        // ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
        // ctx.fill();
    }

    const { setCanvasRef, onMouseDown, getCurrentCanvas } = useDraw(draw);

    return (
        <div className='canvas-div'>
            <canvas
                width={width}
                height={height}
                onMouseDown={onMouseDown}
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