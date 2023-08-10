import React, { useContext, useEffect, useState } from 'react'
import './JoinRoom.css';
import { SocketContext } from '../contexts/SocketContext';
import { RoomContext } from '../contexts/RoomContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import urls from '../constants/urls';

const JoinRoom = () => {

    const { roomcode } = useParams();

    const [creatorName, setCreatorName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const { socket } = useContext(SocketContext);
    const { setConnectedRoom, drawings } = useContext(RoomContext);
    const navigate = useNavigate();

    useEffect(() => {
        setRoomCode(roomcode);
    }, [roomcode]);

    const handleJoin = async () => {
        if (!creatorName || creatorName === "") {
            alert("Please enter a valid name!");
            return;
        }
        if (!roomCode) {
            alert("Please enter a room code!");
            return;
        }


        let url = "";
        url = `${urls.API_BASE_URL}/join?r=${roomCode}&c=${creatorName}`

        await axios.post(url).then((response) => {
            const data = response.data;

            if (data.status === "success") {
                socket.current.emit('joinRoom', {
                    name: creatorName,
                    roomCode: roomCode
                });

                drawings.current = data.data.drawings;

                window.localStorage.setItem("p_colab_rcode", roomCode);
                window.localStorage.setItem("p_colab_cname", creatorName);
                setConnectedRoom(roomCode);
                navigate("/canvas");
            }

        }).catch(err => {
            const data = err.response.data;
            if (data.status === "Not found") {
                window.alert("No room found.");
            }
            console.log(`Error joining room: ${err.message}`);
        });
    }

    return (
        <div className='join-room'>
            <input
                className='input-primary'
                type='text'
                value={creatorName}
                onChange={(e) => {
                    setCreatorName(e.target.value);
                }}
                placeholder='Nickname'
            />
            <input
                className='input-primary'
                type='text'
                value={roomCode}
                onChange={(e) => {
                    setRoomCode(e.target.value);
                }}
                placeholder='Room Code'
            />
            <button
                className='btn-secondary'
                onClick={handleJoin}>
                Join
            </button>
        </div>
    )
}

export default JoinRoom