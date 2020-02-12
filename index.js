const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool, Client } = require('pg');
const socket = require('socket.io');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));
require('dotenv').config();

app.use(cors());

require('./routes/userRoutes')(app);
require('./routes/messagesRoutes')(app);
require('./routes/postsRoutes')(app);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })

}



const port = process.env.PORT || 3001;

let server = app.listen(port, () => console.log(`listening on port ${port}`))

let io = socket(server);

io.on('connection', (socket) => {
    console.log('made socket connection');

    socket.on('message', (data) => {
        io.sockets.emit('message', data)
    })

    socket.on('disconnect', () => {
        console.log('client disconnect...', socket.id)
    })
}) 