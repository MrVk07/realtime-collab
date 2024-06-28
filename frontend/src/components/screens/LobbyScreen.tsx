import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../../context/SocketProvider';
import { useNavigate } from 'react-router-dom';

const LobbyScreen = () => {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmitForm = useCallback((e: any) => {
        e.preventDefault();
        if (!socket) return;
        socket.emit("join-room", { username, roomId })
    }, [socket, username, roomId])

    const handleJoinRoom = useCallback(({ username, roomId }: { username: string, roomId: string }) => {
        console.log(username, roomId);
        navigate(`/room/${roomId}`);
    }, [navigate])


    useEffect(() => {
        socket?.on("join-room", (data: any) => {
            console.log(data)
            handleJoinRoom(data);
        })

        return () => {
            socket?.off("join-room", handleJoinRoom)

        }
    }, [socket, handleJoinRoom])




    return (
        <div className='bg-red-700'>
            <h1>Lobby Screen</h1>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor="username">UserName</label>
                <input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <label htmlFor="roomid">Room ID</label>
                <input type='text' id='roomid' value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                <br />
                <button>Join</button>
            </form>


        </div>
    )
}

export default LobbyScreen