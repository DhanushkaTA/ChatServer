import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../db/DbConnection";

export interface ChatRoomAttributes {
    roomId:string
    userId:string
}

export interface ChatRoomCreationAttributes
    extends Optional<ChatRoomAttributes, 'roomId'>{}

const ChatRoomModel =
    sequelize.define<Model<ChatRoomAttributes, ChatRoomCreationAttributes>>(
        'ChatRoom',
        {
            roomId: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            userId :{
                type: DataTypes.STRING,
                allowNull: false
            }
        }
    )

export default ChatRoomModel;