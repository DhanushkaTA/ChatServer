import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../db/DbConnection";


export interface MessageAttributes {
    msgId:number
    roomId:string
    userId:string
    owner:string
    content:string
    is_seen_by_admin:boolean
    is_seen_by_client:boolean
    date:Date
}

export interface MessageCreationAttributes
    extends Optional<MessageAttributes, 'msgId'>{}

const MessageModel =
    sequelize.define<Model<MessageAttributes, MessageCreationAttributes>>(
        'Message',
        {
            msgId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            roomId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            owner: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false
            },
            is_seen_by_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            is_seen_by_client: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }
    )

export default MessageModel;