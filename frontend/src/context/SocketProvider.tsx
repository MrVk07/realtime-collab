import { createContext, useContext, useMemo } from "react";
import { Socket, io } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = (props: any) => {
    const socket = useMemo(() => io("localhost:5000"), [])
    return (
        <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
    )
}