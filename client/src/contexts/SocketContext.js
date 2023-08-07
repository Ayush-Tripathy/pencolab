import React, { createContext, useContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { RoomContext } from './RoomContext';

export const SocketContext = createContext();

const useSocketInstance = () => {
    const socket = useRef(null);
    const { drawings } = useContext(RoomContext);

    useEffect(() => {
        let url = "";
        if (window.location.origin === "http://localhost:3000") {
            url = "http://localhost:5000"
        }
        else {
            url = "http://192.168.0.108:5000"
        }
        const socketInstance = io.connect(url, { transports: ["websocket", "polling"] });
        // setSocket(socketInstance);
        socket.current = socketInstance;


        socket.current.on("draw", (drawing) => {
            drawings.current = [...drawings.current, drawing];
            // console.log(drawings.current.length);
        })


        return () => {
            socketInstance.disconnect();
        };
    }, [drawings]);

    return socket;
};

export function SocketProvider({ children, roomCode, creatorName }) {
    const socket = useSocketInstance();

    if (socket.current) {
        socket.current.emit('joinRoom', {
            name: creatorName,
            roomCode: roomCode
        });
    }

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
    return useContext(SocketContext);
}
