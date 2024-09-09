// import environment variables
import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import * as http from "http";
import * as mongoose from "mongoose";
import {Server} from "socket.io";
import * as sk from "./sockets/ChatSocketHandler"
import sequelize from "./db/DbConnection";

let app = express();
let server = http.createServer(app);

//-----------------------------------------------------------

// ----- Sync user database -----------

sequelize.sync({alter:false})
    .then(async () => {
        console.log('Database synchronized');

    })
    .catch((error) => {
        console.error('Failed to synchronize user database:', error)
    });


//-----------------------------------------------------------

// Setup socket.io - create server socket - 5000
export const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (for development purposes)
    },
});

sk.start()


//-------------------- Server -------------------------------

server.on('error', (err) => {
    console.error('Server error:', err);
});

//listen server
server.listen(5000, () => {
    console.log(`Server running on http://localhost:${5000}/`);
})

//-----------------------------------------------------------