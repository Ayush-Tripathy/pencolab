import { useEffect, useRef } from "react";

export default function useDraw(draw) {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const mouseMoveListenerRef = useRef(null);
    const touchMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);
    const touchUpListenerRef = useRef(null);
    const prevPointRef = useRef(null);

    const ongoingTouches = [];

    function copyTouch({ identifier, clientX, clientY }) {
        return { identifier, x: clientX, y: clientY };
    }


    useEffect(() => {
        function ongoingTouchIndexById(idToFind) {
            for (let i = 0; i < ongoingTouches.length; i++) {
                const id = ongoingTouches[i].identifier;
                if (id === idToFind) {
                    return i;
                }
            }
            return -1;    // not found
        }

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
        const initMoveListener = () => {
            const moveListener = (e) => {
                e.preventDefault();
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
                        prevPointRef.current = prevPointRef.current ?? point;

                        const touches = e.changedTouches;
                        for (let i = 0; i < touches.length; i++) {
                            const idx = ongoingTouchIndexById(touches[i].identifier);
                            if (idx >= 0) {
                                prevPointRef.current = getPointRelCanvas(ongoingTouches[idx].x, ongoingTouches[idx].y);
                                const newPoint = getPointRelCanvas(touches[i].clientX, touches[i].clientY);
                                if (draw) {
                                    draw(ctx, newPoint, prevPointRef.current);
                                }
                                ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
                            }
                        }
                    }
                    else {
                        if (draw) draw(ctx, point, prevPointRef.current);
                        prevPointRef.current = point;
                    }
                    // prevPointRef.current = point;
                }
            }
            mouseMoveListenerRef.current = moveListener;
            touchMoveListenerRef.current = moveListener;
            window.addEventListener("mousemove", moveListener);
            window.addEventListener("touchmove", moveListener, { passive: false });
        }

        const initUpListener = () => {
            const upListener = (e) => {
                isDrawingRef.current = false;
                prevPointRef.current = null;

                if (e.type.startsWith("touch")) {
                    const touches = e.changedTouches;
                    for (let i = 0; i < touches.length; i++) {
                        let idx = ongoingTouchIndexById(touches[i].identifier);
                        if (idx >= 0) {

                            ongoingTouches.splice(idx, 1);  // remove it; we're done
                        }
                    }
                }
            }

            mouseUpListenerRef.current = upListener;
            touchUpListenerRef.current = upListener;
            window.addEventListener("mouseup", upListener);
            window.addEventListener("touchend", upListener)
        }

        initUpListener();
        initMoveListener();

        return () => {
            if (mouseMoveListenerRef.current) {
                window.removeEventListener("mousemove", mouseMoveListenerRef.current);
                window.removeEventListener("touchmove", touchMoveListenerRef.current)
            }
            if (mouseUpListenerRef.current) {
                window.removeEventListener("mouseup", mouseUpListenerRef.current);
                window.removeEventListener("touchend", touchUpListenerRef.current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draw]);

    const setCanvasRef = (ref) => {
        if (!ref) return;
        canvasRef.current = ref;
    }

    const getCurrentCanvas = () => {
        return canvasRef.current;
    }

    const onMouseDown = (e) => {
        if (!canvasRef.current) return null;
        isDrawingRef.current = true

        if (e.type.startsWith("touch")) {
            const touches = e.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                ongoingTouches.push(copyTouch(touches[i]));
            }
        }
    }


    return {
        setCanvasRef,
        onMouseDown,
        getCurrentCanvas
    };
}