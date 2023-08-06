import { useEffect, useRef } from "react";

export default function useDraw(draw) {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const mouseMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);
    const prevPointRef = useRef(null);

    useEffect(() => {
        const getPointRelCanvas = (clientX, clientY) => {
            if (!canvasRef.current) return null;

            const canvasRect = canvasRef.current.getBoundingClientRect();

            return (
                {
                    x: clientX - canvasRect.left,
                    y: clientY - canvasRect.top
                }
            );
        }

        // Init listeners for drawing on the canvas element
        const initMouseMoveListener = () => {
            const mouseMoveListener = (e) => {
                if (isDrawingRef.current) {
                    const point = getPointRelCanvas(e.clientX, e.clientY);
                    const ctx = canvasRef.current.getContext('2d');

                    if (draw) draw(ctx, point, prevPointRef.current);
                    prevPointRef.current = point;

                    console.log(point);
                }
            }
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
        }

        const initMouseUpListener = () => {
            const mouseUpListener = (e) => {
                isDrawingRef.current = false;
                prevPointRef.current = null;
            }

            mouseUpListenerRef.current = mouseUpListener;
            window.addEventListener("mouseup", mouseUpListener);
        }

        initMouseUpListener();
        initMouseMoveListener();

        return () => {
            if (mouseMoveListenerRef.current) {
                window.removeEventListener("mousemove", mouseMoveListenerRef.current);
            }
            if (mouseUpListenerRef.current) {
                window.removeEventListener("mouseup", mouseUpListenerRef.current);
            }
        }
    }, [draw]);

    const setCanvasRef = (ref) => {
        if (!ref) return;
        canvasRef.current = ref;
    }

    const getCurrentCanvas = () => {
        return canvasRef.current;
    }

    const onMouseDown = () => {
        if (!canvasRef.current) return null;
        isDrawingRef.current = true
    }


    return {
        setCanvasRef,
        onMouseDown,
        getCurrentCanvas
    };
}