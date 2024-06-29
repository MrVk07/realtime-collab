import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../../context/SocketProvider'
import ReactPlayer from 'react-player';
import peer from '../../service/peer';

const RoomScreen = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<String | null>(null);
  const [myStream, setMyStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const handleUserJoined = useCallback(({ username, id }: { username: string, id: string }) => {
    console.log("userjoined", username, id);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true, video: true
    })
    setMyStream(stream);
    const offer = await peer.getOffer();
    socket?.emit("user-call", { to: remoteSocketId, offer });

  }, [remoteSocketId, socket])

  const handleIncomingCall = useCallback(async ({ from, offer }: { from: string, offer: RTCSessionDescriptionInit }) => {
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true, video: true
    })
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket?.emit("accepted-call", { to: from, ans });
  }, [socket]);

  const sendStreams = useCallback(() => {
    if (!myStream) return;
    for (const track of myStream?.getTracks()) {
      peer.peer?.addTrack(track, myStream)
    }
  }, [myStream])

  const handleAcceptedCall = useCallback(async ({ from, ans }: { from: string, ans: RTCSessionDescriptionInit }) => {
    await peer.setLocalDescription(ans);
    sendStreams();
  }, [sendStreams]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket?.emit("peer-nego-needed", { offer, to: remoteSocketId })
  }, [remoteSocketId, socket])

  useEffect(() => {
    peer.peer?.addEventListener('negotiationneeded', handleNegoNeeded);
    return () => {
      peer.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
    }
  }, [handleNegoNeeded])

  const handleNegoNeedIncoming = useCallback(async ({ from, offer }: { from: string, offer: RTCSessionDescriptionInit }) => {
    const ans = await peer.getAnswer(offer);
    socket?.emit("peer-nego-done", { to: from, ans });

  }, [socket]);

  const handleNegoNeedFinal = useCallback(async ({ ans }: { ans: RTCSessionDescriptionInit }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer?.addEventListener("track", async (ev) => {
      const [stream] = ev.streams;
      console.log("GOT TRACKS!!!!")
      setRemoteStream(stream);
    })
  }, [])

  useEffect(() => {
    socket?.on("user-joined", handleUserJoined)
    socket?.on("incoming-call", handleIncomingCall)
    socket?.on("accepted-call", handleAcceptedCall)
    socket?.on("peer-nego-needed", handleNegoNeedIncoming)
    socket?.on("peer-nego-final", handleNegoNeedFinal);

    return () => {
      socket?.off("user-joined", handleUserJoined)
      socket?.off("incoming-call", handleIncomingCall)
      socket?.off("accepted-call", handleIncomingCall)
      socket?.off("peer-nego-needed", handleNegoNeedIncoming)
      socket?.off("peer-nego-final", handleNegoNeedFinal);
    }
  }, [socket, handleUserJoined, handleIncomingCall, handleAcceptedCall, handleNegoNeedIncoming, handleNegoNeedFinal])

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Room Screen</h1>
      <h4 className="mb-4">{remoteSocketId ? 'Remote Socket Id: ' + remoteSocketId : 'No One in the room'}</h4>
      {myStream && <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded" onClick={handleCallUser}>CALL</button>}
      {myStream && <ReactPlayer playing muted height="300px" width="300px" url={myStream} />}
      <h4 className="mt-4">Remote Stream</h4>
      {remoteStream && <ReactPlayer playing muted height="300px" width="300px" url={remoteStream} />}
    </div>
  )
}

export default RoomScreen
