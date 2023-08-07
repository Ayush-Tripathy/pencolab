import React, { useContext, useEffect, useRef, useState } from 'react'
import './Editor.css'
import Canvas, { currentCanvas } from '../components/Canvas'
import colors from '../constants/colors';
import { RoomContext } from '../contexts/RoomContext';
import { SocketContext } from '../contexts/SocketContext';

const Editor = () => {

    let canvasWidth = window.innerWidth - 20;
    let canvasHeight = window.innerHeight - 20;
    const sizes = {
        1: 5,
        2: 8,
        3: 12,
        4: 16
    };

    // console.log({ canvasWidth, canvasHeight });

    const [isErasing, setIsErasing] = useState(false);
    const [selectedColor, setSelectedColor] = useState(colors.black);
    const [currentSize, setCurrentSize] = useState({
        lineWidth: sizes[3],
        idx: 3
    });

    const { connectedRoom, drawings } = useContext(RoomContext);
    const { socket } = useContext(SocketContext);

    // console.log("croom: ", socket.current)
    // console.log("rrr: ", connectedRoom);
    // console.log("d:", drawings.current.length);

    useEffect(() => {
        const options = document.querySelectorAll(".color-select");

        options.forEach((option) => {
            if (option.classList.contains("color-select")) {
                option.style.width = (currentSize.lineWidth + 3) + "px";
                option.style.height = (currentSize.lineWidth + 3) + "px";
            }
        });
    }, [currentSize]);

    const drawingOptions = useRef(null);
    useEffect(() => {
        let ignore = false;
        drawingOptions.current = document.querySelector(".draw-options");
        const menuButton = document.getElementById('drawing-options-btn');
        const menuIconSpan = document.getElementById('drawing-options-icon-span');

        const handleClickOutside = (event) => {

            if (!drawingOptions.current.contains(event.target) && event.target !== menuButton && event.target !== menuIconSpan) {
                drawingOptions.current.style.display = 'none';
            } else if (event.target === menuIconSpan) {
                drawingOptions.current.style.display = 'flex';
            }
        };

        if (window.innerWidth <= 600) {
            console.log("yes");
            document.addEventListener('click', handleClickOutside);
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth <= 600) {
                document.addEventListener('click', handleClickOutside);
            }
            else {
                document.removeEventListener('click', handleClickOutside);
                drawingOptions.current.style.display = 'flex';
            }
        })

        const addEventListeners = () => {
            const drawOptionInputs = document.querySelectorAll(".draw-option-input");
            // console.log(drawOptionInputs);

            const removeBgColors = () => {
                drawOptionInputs.forEach((input) => {
                    input.parentNode.style.backgroundColor = "#fff";
                });
            }

            removeBgColors();
            drawOptionInputs[0].checked = true;
            drawOptionInputs[0].parentNode.style.backgroundColor = "#ccc";
            setIsErasing(false);
            setSelectedColor("#000");

            drawOptionInputs.forEach((input) => {
                input.addEventListener("change", (e) => {
                    if (e.target.checked) {
                        const parentNode = e.target.parentNode;

                        removeBgColors();
                        parentNode.style.backgroundColor = "#ccc";
                    }
                });
            });
        }

        if (!ignore) addEventListeners();

        return () => { ignore = true; }
    }, []);

    const toggleMenu = (e) => {
        // console.log(e.target);
        if (!drawingOptions.current) return;
        // console.log(drawingOptions.current);
        drawingOptions.current.style.display = drawingOptions.current.style.display === 'flex' ? 'none' : 'flex';
    };


    const clearCanvas = () => {
        const canvas = currentCanvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (socket.current) {
            socket.current.emit("clearCanvas", connectedRoom);
            drawings.current = [];
        }
    };

    const changeSize = () => {
        // console.log(currentSize);
        setCurrentSize((prev) => {
            if (sizes.hasOwnProperty(prev.idx + 1)) {
                return {
                    lineWidth: sizes[prev.idx + 1],
                    idx: prev.idx + 1
                };
            }
            return {
                lineWidth: sizes[1],
                idx: 1
            };
        });
    }


    return (
        <div className='editor'>
            <Canvas
                width={canvasWidth}
                height={canvasHeight}
                lineWidth={currentSize.lineWidth}
                color={selectedColor}
                isErasing={isErasing}
            />

            <div
                id='drawing-options-btn'
                onClick={toggleMenu}
                className='draw-options-menu no-select'>
                <span
                    id='drawing-options-icon-span'
                    onClick={toggleMenu}
                    className="material-symbols-rounded">
                    menu
                </span>
            </div>
            <div
                id='drawing-options'
                className='draw-options no-select'>
                <label
                    onClick={() => {
                        setSelectedColor(colors.black);
                        setIsErasing(false);
                    }}
                    className='draw-option'>
                    <input className='draw-option-input' type="radio" name="draw-option" value="pen" />
                    <div className='color-select black-color-select'></div>
                    {/* <span className="material-symbols-outlined">
                        stylus
                    </span> */}
                </label>
                <label
                    onClick={(e) => {
                        setSelectedColor(colors.green);
                        setIsErasing(false);
                    }}
                    className='draw-option'>
                    <input className='draw-option-input' type="radio" name="draw-option" value="color" />
                    <div className='color-select green-color-select'></div>
                </label>
                <label
                    onClick={(e) => {
                        setSelectedColor(colors.pink);
                        setIsErasing(false);
                    }}
                    className='draw-option'>
                    <input className='draw-option-input' type="radio" name="draw-option" value="color" />
                    <div className='color-select pink-color-select'></div>
                </label>
                <label
                    onClick={changeSize}
                    className='draw-option change-size'>
                    <span>Change Size</span>
                </label>
                <label
                    onClick={() => {
                        setIsErasing(true);
                    }}
                    className='draw-option'>
                    <input className='draw-option-input' type="radio" name="draw-option" value="eraser" />
                    <span className="material-symbols-outlined">
                        ink_eraser
                    </span>
                </label>
                <label
                    onClick={clearCanvas}
                    className='draw-option'>
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </label>
                <label className='draw-option'>
                    {connectedRoom}
                </label>
            </div>
        </div>
    )
}

export default Editor