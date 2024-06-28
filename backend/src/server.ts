import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const usernameToIdMap = new Map();
const IdToUsername = new Map();

io.on('connection', (socket) => {
    console.log("Socket Connected ", socket.id);
    socket.on("join-room", (data) => {
        usernameToIdMap.set(data.username, data.roomId);
        IdToUsername.set(data.roomId, data.username);
        io.to(socket.id).emit("join-room", data);
    })
})


server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
