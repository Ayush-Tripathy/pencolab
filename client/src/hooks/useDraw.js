import { useEffect, useRef } from "react";

// TODO: Fix touch event

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
                let clientX, clientY;

                if (e.type.startsWith("touch")) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                }
                else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                if (isDrawingRef.current) {
                    const ctx = canvasRef.current.getContext('2d');
                    const point = getPointRelCanvas(clientX, clientY);

                    if (e.type.startsWith("touch")) {

                        // TODO: Fix touch events

                        for (let i = 0; i < e.changedTouches.length; i++) {
                            prevPointRef.current = prevPointRef.current ?? point;

                            const { clientX, clientY } = e.changedTouches[i]
                            const { x, y } = getPointRelCanvas(clientX, clientY);

                            const dx = x - prevPointRef.current.x;
                            const dy = y - prevPointRef.current.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            // window.alert(distance);
                            if (distance > 5) {
                                // window.alert("interpolating");
                                const steps = Math.floor(distance / 5);
                                const xStep = dx / steps;
                                const yStep = dy / steps;


                                for (let j = 0; j < steps; j++) {
                                    const interpolatedX = prevPointRef.current.x + xStep * j;
                                    const interpolatedY = prevPointRef.current.y + yStep * j;

                                    const interpolatedPoint = {
                                        x: interpolatedX,
                                        y: interpolatedY
                                    };

                                    if (draw) draw(ctx, interpolatedPoint, prevPointRef.current);
                                    prevPointRef.current = point;
                                }
                            }
                            else {
                                if (draw) draw(ctx, point, prevPointRef.current);
                                prevPointRef.current = point;
                            }
                        }
                    }
                    else {
                        if (draw) draw(ctx, point, prevPointRef.current);
                        prevPointRef.current = point;
                    }
                    // prevPointRef.current = point;


                    // console.log(point);
                }
            }
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
            window.addEventListener("touchmove", mouseMoveListener);
            // window.addEventListener("touchend", (e) => {
            //     window.alert(e.type);
            // })
        }

        const initMouseUpListener = () => {
            const mouseUpListener = (e) => {
                isDrawingRef.current = false;
                prevPointRef.current = null;
            }

            mouseUpListenerRef.current = mouseUpListener;
            window.addEventListener("mouseup", mouseUpListener);
            window.addEventListener("touchend", mouseUpListener)
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