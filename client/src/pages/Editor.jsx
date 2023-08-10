import React, { useContext, useEffect, useRef, useState } from 'react'
import './Editor.css'
import Canvas, { currentCanvas } from '../components/Canvas'
import colors from '../constants/colors';
import { RoomContext } from '../contexts/RoomContext';
import { SocketContext } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import axios from 'axios';
import urls from '../constants/urls';

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

    const navigate = useNavigate();
    const { connectedRoom, drawings } = useContext(RoomContext);
    const { socket } = useContext(SocketContext);

    const options = [
        'Copy Room Link'
    ];

    const ITEM_HEIGHT = 48;

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleExtraMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleExtraMenuClose = (event) => {
        if (event.target.innerText === 'Copy Room Link') {
            const roomLink = `${urls.CLIENT_BASE_URL}/${connectedRoom}`;
            copyToClipboard(roomLink);
        }
        setAnchorEl(null);
    };

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
    const axiosCancelTokenSource = axios.CancelToken.source();
    useEffect(() => {
        let ignore = false;

        const rc = window.localStorage.getItem("p_colab_rcode");
        const cn = window.localStorage.getItem("p_colab_cname");

        if (!rc || !cn) {
            window.alert("You have not joined any room yet!");
            navigate("/");
        }

        const checkIfRoomExists = async () => {
            let url = "";
            url = `${urls.API_BASE_URL}/join?r=${rc}&c=${cn}`;

            try {
                await axios.post(url, { cancelToken: axiosCancelTokenSource.token }).then((response) => {
                    const data = response.data;

                    if (data.status !== "success") {
                        window.alert("Room does not exists or may have expired.");
                        navigate('/');
                    }

                }).catch(err => {
                    const data = err.response.data;
                    if (data.status === "Not found") {
                        console.log(`Error joining room: ${err.message}`);
                        window.alert("Room does not exists or may have expired.");
                        navigate('/');
                    }
                });
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Request canceled:', err.message);
                } else {
                    console.error('Error fetching data:', err);
                }
            }

        }

        if (!ignore) {
            checkIfRoomExists();
        }

        drawingOptions.current = document.querySelector(".draw-options");
        const menuButton = document.getElementById('drawing-options-btn');
        const menuIconSpan = document.getElementById('drawing-options-icon-span');
        const menuIconSVGPath = document.querySelector('path');  // This will select all 'path's, use with caution!!!

        const handleClickOutside = (event) => {
            if (!drawingOptions.current.contains(event.target)
                && event.target !== menuButton
                && event.target !== menuIconSpan
                && event.target !== menuIconSVGPath) {
                drawingOptions.current.style.display = 'none';
            } else if (event.target === menuIconSpan || event.target === menuIconSVGPath) {
                drawingOptions.current.style.display = 'flex';
            }
        };

        const addEventListeners = () => {

            if (window.innerWidth <= 790) {
                document.addEventListener('click', handleClickOutside);
                // document.addEventListener('touchstart', handleClickOutside);
            }

            window.addEventListener("resize", () => {
                if (window.innerWidth <= 790) {
                    document.addEventListener('click', handleClickOutside);
                    // document.addEventListener('touchstart', handleClickOutside);
                }
                else {
                    document.removeEventListener('click', handleClickOutside);
                    // document.removeEventListener('touchstart', handleClickOutside);
                    drawingOptions.current.style.display = 'flex';
                }
            })


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

                input.addEventListener("click", (e) => {
                    if (e.target.checked) {
                        const parentNode = e.target.parentNode;
                        // console.log("clicked a option");
                        removeBgColors();
                        parentNode.style.backgroundColor = "#ccc";
                    }
                });
            });
        }

        if (!ignore) addEventListeners();

        return () => {
            axiosCancelTokenSource.cancel('Component unmounted');
            ignore = true;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && navigator.permissions !== "undefined") {
                const type = "text/plain";
                const blob = new Blob([text], { type });
                const data = [new ClipboardItem({ [type]: blob })];
                navigator.permissions.query({ name: "clipboard-write" }).then((permission) => {
                    if (permission.state === "granted" || permission.state === "prompt") {
                        navigator.clipboard.write(data).then(resolve, reject).catch(reject);
                    }
                    else {
                        reject(new Error("Permission not granted!"));
                    }
                });
            }
            else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                var textarea = document.createElement("textarea");
                textarea.textContent = text;
                textarea.style.position = "fixed";
                textarea.style.width = '2em';
                textarea.style.height = '2em';
                textarea.style.padding = 0;
                textarea.style.border = 'none';
                textarea.style.outline = 'none';
                textarea.style.boxShadow = 'none';
                textarea.style.background = 'transparent';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                try {
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    resolve();
                }
                catch (e) {
                    document.body.removeChild(textarea);
                    reject(e);
                }
            }
            else {
                reject(new Error("None of copying methods are supported by this browser!"));
            }
        });

    }

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

    // const highlightOption = (e) => {
    //     const drawOptionInputs = document.querySelectorAll(".draw-option-input");
    //     // console.log(drawOptionInputs);

    //     const removeBgColors = () => {
    //         drawOptionInputs.forEach((input) => {
    //             input.parentNode.style.backgroundColor = "#fff";
    //         });
    //     }
    //     if (e.target.localName === "div" || e.target.localName === "span") {
    //         const parentNode = e.target.parentNode;
    //         removeBgColors();
    //         parentNode.style.backgroundColor = "#ccc";
    //     }
    // }


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
                // onTouchStart={toggleMenu}
                onClick={toggleMenu}
                className='draw-options-menu no-select'>
                <DrawRoundedIcon
                    id="drawing-options-icon-span"
                    fontSize='large'
                    onClick={toggleMenu}
                    className="material-symbols-rounded"
                />
                {/* <span
                    id='drawing-options-icon-span'
                    // onTouchStart={toggleMenu}
                    onClick={toggleMenu}
                    className="material-symbols-rounded">
                    menu
                </span> */}
            </div>
            <div
                id='drawing-options'
                className='draw-options no-select'>
                <label
                    onClick={() => {
                        setSelectedColor(colors.black);
                        setIsErasing(false);
                    }}
                    // onTouchStart={(e) => {
                    //     setSelectedColor(colors.black);
                    //     setIsErasing(false);

                    //     // highlightOption(e);
                    // }}
                    className='draw-option'>
                    <input className='draw-option-input' type="radio" name="draw-option" value="pen" />
                    <div className='color-select black-color-select'></div>
                </label>
                <label
                    onClick={(e) => {
                        setSelectedColor(colors.green);
                        setIsErasing(false);
                    }}
                    // onTouchStart={(e) => {
                    //     setSelectedColor(colors.green);
                    //     setIsErasing(false);
                    //     // highlightOption(e);
                    // }}
                    className='draw-option'>
                    <input className='draw-option-input' type="radio" name="draw-option" value="color" />
                    <div className='color-select green-color-select'></div>
                </label>
                <label
                    onClick={(e) => {
                        setSelectedColor(colors.pink);
                        setIsErasing(false);
                    }}
                    // onTouchStart={(e) => {
                    //     setSelectedColor(colors.pink);
                    //     setIsErasing(false);
                    //     // highlightOption(e);
                    // }}
                    className='draw-option'>
                    <input className='draw-option-input' type="radio" name="draw-option" value="color" />
                    <div className='color-select pink-color-select'></div>
                </label>
                <label
                    onClick={changeSize}
                    // onTouchStart={changeSize}
                    className='draw-option change-size'>
                    <span>Change Size</span>
                </label>
                <label
                    onClick={() => {
                        setIsErasing(true);
                    }}
                    // onTouchStart={(e) => {
                    //     setIsErasing(true);
                    //     // highlightOption(e);
                    // }}
                    className='draw-option'>
                    <input className='draw-option-input' type="radio" name="draw-option" value="eraser" />
                    <span className="material-symbols-outlined">
                        ink_eraser
                    </span>
                </label>
                <label
                    onClick={clearCanvas}
                    onTouchStart={clearCanvas}
                    className='draw-option'>
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </label>
                <label
                    onClick={(e) => {
                        copyToClipboard(connectedRoom);
                        window.alert("Copied room code.");
                    }}
                    className='draw-option room-code'>
                    {connectedRoom}
                </label>
                <label
                    className='draw-option'>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleExtraMenuClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleExtraMenuClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                        {options.map((option) => (
                            <MenuItem key={option} onClick={handleExtraMenuClose}>
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </label>
            </div>
        </div>
    )
}

export default Editor