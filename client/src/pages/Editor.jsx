import React, { useEffect, useState } from 'react'
import './Editor.css'
import Canvas, { currentCanvas } from '../components/Canvas'
import colors from '../constants/colors';

const Editor = () => {

    let canvasWidth = window.innerWidth - 20;
    let canvasHeight = window.innerHeight - 20;
    const sizes = {
        1: 5,
        2: 8,
        3: 12,
        4: 16
    };

    console.log({ canvasWidth, canvasHeight });

    const [isErasing, setIsErasing] = useState(false);
    const [selectedColor, setSelectedColor] = useState(colors.black);
    const [currentSize, setCurrentSize] = useState({
        lineWidth: sizes[3],
        idx: 3
    });

    useEffect(() => {
        const options = document.querySelectorAll(".color-select");

        options.forEach((option) => {
            if (option.classList.contains("color-select")) {
                option.style.width = (currentSize.lineWidth + 3) + "px";
                option.style.height = (currentSize.lineWidth + 3) + "px";
            }
        });
    }, [currentSize]);


    useEffect(() => {
        let ignore = false;

        const addEventListeners = () => {
            const drawOptionInputs = document.querySelectorAll(".draw-option-input");
            console.log(drawOptionInputs);

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

    const clearCanvas = () => {
        const canvas = currentCanvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const changeSize = () => {
        console.log(currentSize);
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

            <div className='draw-options no-select'>
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
            </div>
        </div>
    )
}

export default Editor