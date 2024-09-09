import {io} from "../server";
import Client from "../models/ClientModel";
import ChatRoomModel from "../models/ChatRoomModel";
import ClientModel from "../models/ClientModel";
import MessageModel from "../models/MessageModel";


export const storeWhenConnectClientData = async (userId:string, socketId:string) => {

    let user_by_id = await ClientModel.findByPk(userId);

    if (user_by_id){
        await ClientModel.update({
            socketId: socketId,
            isClientActive:true
        },{
            where: {
                userId:userId
            }
        })
    }else {
        await ClientModel.create({
            userId: userId,
            socketId: socketId,
            isClientActive:true
        })
    }



    return true;
}


export const handleClientDisconnect = async (socketId:string) => {

    // let user_by_id = await ClientModel.findOne({
    //     where:{
    //         socketId:socketId
    //     }
    // });
    //
    // if (user_by_id){
    //     await ClientModel.update({
    //         isClientActive:false
    //     },{
    //         where: {
    //             socketId:socketId
    //         }
    //     })
    // }

    let row = await ClientModel.update({
        isClientActive:false
    },{
        where: {
            socketId:socketId
        }
    });

    console.log('Update client as disconnect : '+row[0])

    return true;

}


export const storeChatRoomDetails = async (userId:string,roomId:string) => {

    let room_by_id = await ChatRoomModel.findByPk(roomId);

    if (room_by_id){
        console.log("is room id already saved : ",room_by_id.dataValues)
    }



    if (!room_by_id){
        console.log("save new room with id : "+roomId+" for new user "+userId)
        await ChatRoomModel.create({
            roomId:roomId,
            userId:userId
        })
    }

    return true;

}


export const saveMessage = async (
    roomId:string,
    userId:string,
    owner:string,
    content:string,
    is_seen_by_admin:boolean,
    is_seen_by_client:boolean,
) => {

    const current_date = new Date();

    await MessageModel.create({
        roomId:roomId,
        userId:userId,
        owner:owner,
        content:content,
        is_seen_by_admin:is_seen_by_admin,
        is_seen_by_client:is_seen_by_client,
        date:current_date
    })

    return true;

}