// import environment variables
import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import * as http from "http";
import cors from 'cors';
import * as mongoose from "mongoose";
import {Server} from "socket.io";
import * as sk from "./sockets/ChatSocketHandler"
import sequelize from "./db/DbConnection";
import * as ChatService from "./services/ChatService"
import {CustomResponse} from "./utils/CustomResponse";

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

app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);


// Setup socket.io - create server socket - 5000
export const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (for development purposes)
    },
});

sk.start()

//----------------------- API CALLS------------------------------------

app.get('/api/v1/chatHistory/:userId', async function (
    req:express.Request,
    res:express.Response,
    next:express.NextFunction
){

    try {

        let list = await ChatService.chatHistoryByUserId(req.params.userId);

        res.status(200).send(
            new CustomResponse(
                200,
                "Get all",
                list
            )
        )

    }catch (error){
        console.error('💥  Error on get chat history on : '+req.params.userId, error);
    }

})

app.get('/user/test',
    function (
        req:express.Request,
        res:express.Response,
        next:express.NextFunction
    ) {

        res.status(200).send('UserModel Service test method invoked 🎉🎉')

    })

//-------------------- Server -------------------------------

server.on('error', (err) => {
    console.error('Server error:', err);
});

//listen server
server.listen(6000, () => {
    console.log(`Server running on http://localhost:${6000}/`);
})

//-----------------------------------------------------------