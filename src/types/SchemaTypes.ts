import mongoose from "mongoose";

export interface ClientInterface extends mongoose.Document{
    userId: string,
    socketId: string,
    isClientActive: boolean,
}

export interface ChatRoomInterface extends mongoose.Document{
    roomId:string
    clientId:string
}

export interface ChatMessageInterface extends mongoose.Document{
    msgId:number
    roomId:string
    userId:string
    owner:string
    content:string
    is_seen_by_admin:boolean
    is_seen_by_client:boolean
    date:Date
}