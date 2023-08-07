import Axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
// import { SocketContext } from "./SocketContext";

export const RoomContext = React.createContext();

export const RoomProvider = ({ children }) => {
    const [connectedRoom, setConnectedRoom] = useState(null);
    const [creatorName, setCreatorName] = useState("");
    const drawings = useRef([]);
    // const { socket } = useContext(SocketContext);

    useEffect(() => {
        checkRoom();
    }, []);

    const checkRoom = async () => {
        const roomCode = window.localStorage.getItem("p_colab_rcode");
        const cName = window.localStorage.getItem("p_colab_cname");

        await Axios(`http://localhost:5000/d/prev-drawings?r=${roomCode}`, {
            method: "GET"
        }).then((response) => {
            if (response.data.status === "success") {
                // setDrawings(response.data.data.drawings);
                drawings.current = response.data.data.drawings;
            }
        }).catch(err => {
            console.log('error', err);
        })

        setCreatorName(cName);
        setConnectedRoom(roomCode);
    }

    const values = {
        connectedRoom,
        setConnectedRoom,
        creatorName,
        setCreatorName,
        checkRoom,
        drawings
    };

    return <RoomContext.Provider value={values}>{children}</RoomContext.Provider>
}

export const useRoom = () => {
    return useContext(RoomContext);
}