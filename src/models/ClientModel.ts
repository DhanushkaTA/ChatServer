import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../db/DbConnection";


export interface ClientAttributes {
    userId: string,
    socketId: string,
    isClientActive: boolean,
}

export interface ClientCreationAttributes
    extends Optional<ClientAttributes, 'userId'>{}

const ClientModel =
    sequelize.define<Model<ClientAttributes, ClientCreationAttributes>>(
        'Client',
        {
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            socketId :{
                type: DataTypes.STRING,
                allowNull: false
            },
            isClientActive:{
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        }
    )

export default ClientModel;