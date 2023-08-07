import React, { useContext, useState } from 'react'
import './JoinRoom.css';
import { SocketContext } from '../contexts/SocketContext';
import { RoomContext } from '../contexts/RoomContext';
import { useNavigate } from 'react-router-dom';

// TODO: Add api endpoint to check if room exists

const JoinRoom = () => {
    const [creatorName, setCreatorName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const { socket } = useContext(SocketContext);
    const { setConnectedRoom } = useContext(RoomContext);
    const navigate = useNavigate();

    const handleJoin = () => {
        if (!creatorName || creatorName === "") {
            alert("Please enter a valid name!");
            return;
        }
        if (!roomCode) {
            alert("Please enter a room code!");
            return;
        }

        // TODO: Add api endpoint to check if room exists

        socket.current.emit('joinRoom', {
            name: creatorName,
            roomCode: roomCode
        });

        window.localStorage.setItem("p_colab_rcode", roomCode);
        window.localStorage.setItem("p_colab_cname", creatorName);
        setConnectedRoom(roomCode);
        navigate("/canvas");
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