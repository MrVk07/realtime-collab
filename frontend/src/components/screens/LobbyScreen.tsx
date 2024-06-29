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
        <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
            <h1 className='text-3xl font-bold mb-8'>Lobby Screen</h1>
            <form onSubmit={handleSubmitForm} className='bg-white p-6 rounded shadow-md w-80'>
                <div className='mb-4'>
                    <label htmlFor="username" className='block text-sm font-medium text-gray-700'>Username</label>
                    <input
                        type='text'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="roomid" className='block text-sm font-medium text-gray-700'>Room ID</label>
                    <input
                        type='text'
                        id='roomid'
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className='mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                    />
                </div>
                <button type='submit' className='w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600'>Join</button>
            </form>
        </div>
    )
}

export default LobbyScreen
