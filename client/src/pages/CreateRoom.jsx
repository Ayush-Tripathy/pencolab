import React, { useContext, useEffect, useState } from 'react';
import './CreateRoom.css';
import Axios from "axios";
import { SocketContext } from '../contexts/SocketContext';
import { RoomContext } from '../contexts/RoomContext';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {

    const [creatorName, setCreatorName] = useState("");
    const { socket } = useContext(SocketContext);
    const { setConnectedRoom, drawings } = useContext(RoomContext);
    const navigate = useNavigate();
    // console.log("croom_cr: ", socket)

    // console.log("CR render");
    useEffect(() => {
        if (socket.current) {
            socket.current.on("previousDrawings", (drawings) => {
                // console.log(drawings);
                drawings.current = drawings;

            });
        }
    }, [socket, drawings]);

    const handleCreation = async () => {
        if (!creatorName || creatorName === "") {
            alert("Please enter a valid name!");
            return;
        }

        await Axios("http://localhost:5000/create", {
            method: "POST",
            data: {
                creator: creatorName
            }
        }).then(async (response) => {
            const data = response.data;
            const roomCode = data.data.room.code;
            console.log(roomCode);

            // const socket = await connectSocket();

            socket.current.emit('joinRoom', {
                name: creatorName,
                roomCode: roomCode
            });
            // window.alert(roomCode);
            if (window.localStorage.getItem("p_colab_rcode")) {
                window.localStorage.removeItem("p_colab_rcode");
            }
            window.localStorage.setItem("p_colab_rcode", roomCode);
            window.localStorage.setItem("p_colab_cname", creatorName);
            drawings.current = [];
            setConnectedRoom(roomCode);
            navigate("/canvas");
            // window.location.href = "/canvas";
        }).catch(err => {
            window.alert(err);
        });

    }

    return (
        <div className='create-room'>
            <input
                className='input-primary'
                type="text"
                placeholder='Nickname'
                value={creatorName}
                onChange={(e) => {
                    setCreatorName(e.target.value);
                }}
            />

            <button
                className='btn-primary'
                onClick={() => {
                    handleCreation();
                }}>
                Create
            </button>
        </div>
    )
}

export default CreateRoom