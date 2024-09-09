import { Socket } from 'socket.io';
import {io} from "../server";
import Client from "../models/ClientModel";
import * as ClientService from "../services/ChatService"

export const start = () => {



    // Handle socket connections for chat
    io.on('connection', (socket) => {

        console.log('New client connected');

        // Initialize chat handler for each connection
        chatSocketHandler(socket);

        // Listen for client to send its ID and join a chat room
        socket.on('register_client', async (userId) => {

            try {
                // Store or update the client ID and socket ID
                await ClientService.storeWhenConnectClientData(userId, socket.id)

                console.log(`Client registered with ID: ${userId} and Socket ID: ${socket.id}`);

                //----------------------------------------------

                // Create a room for each client and admin
                const roomId = `room_${userId}`;

                console.log("user room is : "+roomId)

                await ClientService.storeChatRoomDetails(userId, roomId)

                // Each client joins their own room
                // io.emit('join_room',roomId)
                socket.join(roomId);

            } catch (err) {
                console.error('💥  Error updating client data:', err);
            }
        });

        //---------------------------------------------------------------------

        // Handle sending a message from a client to their room (admin can see this)
        // socket.on('send_message', async ({ userId, message }) => {
        //
        //     // if we can search database and get user chat room id
        //     const roomId = `room_${userId}`;
        //
        //     io.to(roomId).emit('receive_message', { userId, message });
        //
        //     console.log(`Message sent to room for User ID ${userId}: ${message}`);
        // });


        //---------------------------------------------------------------------

        socket.on('disconnect', async () => {

            try {

                await ClientService.handleClientDisconnect(socket.id);

                console.log(`Client with Socket ID ${socket.id} disconnected.`);
            } catch (err) {
                console.error('💥  Error updating client disconnection:', err);
            }

        });
    });


}





const chatSocketHandler = (socket: Socket) => {

    socket.on('send_message', async ({ roomId, message, userId }) => {

        try {

            // let lastMsg = message[message.length - 1].content
            let lastMsg = message.content

            //Save msg in db
            await ClientService.saveMessage(roomId,userId,'user',lastMsg,false,true)

            const rooms = Array.from(socket.rooms); // Convert Set to Array
            console.log(rooms) // Return the rooms to the admin

            // Broadcast the message to the specified room
            socket.to(roomId).emit('receive_message', { userId:userId, owner:"user", message:lastMsg });

            // Notify the admin of a new message (global notification)
            socket.to('admin_room').emit('admin_new_message', { roomId, owner:"user", userId, message:lastMsg });

        }catch (error){
            console.error('💥  Error client msg data:', error);
        }
    });


    //---------------------------------------------------------

    // Handle user join room
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    //---------------------------------------------------------

    socket.on('admin_send_message', async ({roomId,userId,message}) => {

        try {

            // let lastMsg = message[message.length - 1].content
            let lastMsg = message.content

            const rooms = Array.from(socket.rooms); // Convert Set to Array
            console.log(rooms) // Return the rooms to the admin

            //Save msg in db
            await ClientService.saveMessage(roomId,userId,'admin',lastMsg,true,false)

            // socket.join(roomId);
            console.log("admin sent msg : "+message)

            // Broadcast the message to the specified room
            socket.to(roomId).emit('receive_message', { userId, owner:"admin", message:lastMsg });

            console.log(`Admin send msg to room : ${roomId}`);

        }catch (error){
            console.error('💥  Error admin msg data:', error);
        }


    });

    //--------------------------------------------------------

    // Handle user leave room
    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
    });

    // this will trigger right after admin connects to the server
    // Handle when the admin joins the special admin room to receive notifications
    socket.on('admin_join_notifications', () => {
        console.log('Admin joined notification channel');
        socket.join('admin_room'); // Admin joins a special room to receive notifications
    });

    // Handle admin joining a specific room to monitor
    socket.on('admin_join_room', (roomId) => {
        console.log(`Admin joined room: ${roomId}`);
        socket.join(roomId); // Admin joins the specific room
    });

    // Handle admin leaving a specific room
    socket.on('admin_leave_room', (roomId) => {
        console.log(`Admin left room: ${roomId}`);
        socket.leave(roomId); // Admin leaves the specific room
    });
};