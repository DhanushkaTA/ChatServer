import {io} from "../server";
import Client from "../models/ClientModel";
import ChatRoomModel from "../models/ChatRoomModel";
import ClientModel from "../models/ClientModel";
import MessageModel from "../models/MessageModel";
import sequelize from "../db/DbConnection";
import {Model} from "sequelize";


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

export const chatHistoryByUserId = async (roomId:string) => {

    let msg_list = await MessageModel.findAll({
        where: {
            roomId:roomId
        }
    });

    const list:any[] = []

    if(msg_list.length > 0){
        msg_list.map(value => {

            list.push({
                owner: value.dataValues.owner,
                content: value.dataValues.content
            })

        })

    }
    return list;

}

export const getAdminUnReadCountByRoomId = async (roomId:string) => {

    let list:(Model<any,any>)[] = await MessageModel.findAll({
        attributes:[
            [sequelize.fn('COUNT', sequelize.col('is_seen_by_admin')), 'unreadCount']
        ],
        where:{
            roomId:roomId,
            owner:'user',
            is_seen_by_admin:false
        }
    });

    // newVar.map(value => {
    //     console.log(value.dataValues)
    // })

    console.log("\x1b[35m Admin unread mag in chat room "+roomId+" : "+list[0]?.dataValues?.unreadCount+" \x1b[0m")

    return list[0]?.dataValues?.unreadCount

}


export const getAllChatsForAdmin = async () => {

    // const newVar = await MessageModel.findAll({
    //     attributes: [
    //         'roomId',
    //         'userId',
    //         'content',
    //         'date'
    //     ],
    //     where: {
    //         date: sequelize.literal(`date = (SELECT MAX(date) FROM Messages WHERE roomId = Message.roomId)`)
    //     },
    //     order: [['date', 'DESC']]
    // });
    //
    // // console.log(newVar)
    //
    // newVar.map(value => {
    //     console.log(value.dataValues)
    // })

    const newVar = await MessageModel.findAll({
        attributes: [
            'roomId',
            'userId',
            'content',
            'date',
            [sequelize.fn('COUNT', sequelize.col('is_seen_by_admin')), 'unreadCount']
        ],
        where: {
            date: sequelize.literal(
                `(SELECT MAX(date) FROM Messages WHERE roomId = Message.roomId)`
            ),
            is_seen_by_admin: false
        },
        group: ['roomId'],
        // group: ['roomId', 'userId', 'content', 'date'],
        order: [['date', 'DESC']]
    });

    newVar.map(value => {
        console.log(value.dataValues)
    })



    return newVar;

}

export const markMessagesAsSeen = async (roomId:string,userType:string) => {

    console.log(roomId)

    if(userType==='admin'){
        //seen by admin
        let row = await MessageModel.update({
            is_seen_by_admin:true
        },{
            where:{
                roomId:roomId,
                // owner:'user',
                is_seen_by_admin:false
            }
        });

        console.log("\x1b[43m updated row count : "+row[0]+"\x1b[0m")
    }else if(userType==='user'){
        //seen by user
        let row = await MessageModel.update({
            is_seen_by_client:true
        },{
            where:{
                roomId:roomId,
                // owner:'admin',
                is_seen_by_client:false
            }
        });

        console.log("\x1b[43m cupdated row count : "+row[0]+"\x1b[0m")
    }


    return true

}