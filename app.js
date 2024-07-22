const express = require('express');
const app = express();

const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const server = http.createServer(app)
const io = socketio(server)

io.on("connection", (socket) => {
    socket.on("send-locaion", (data) => {
        io.emit("reacive-location", { _id: socket.id, ...data })
    })
    socket.on("disconnect",()=>{
        io.emit("user-disconnect", socket.id)
    })
    console.log('New client connected');
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.get('/', (req, res) => {
    res.render('index');
});
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
