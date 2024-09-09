import {Sequelize} from "sequelize";
import process from "process";

declare module 'sequelize' {
    interface Options {
        createDatabaseIfNotExist?: boolean;
    }
}

//create db connection and connection pool
let sequelize = new Sequelize(
    process.env.USER_DB_NAME as string, process.env.MAIN_DB_USER as string, process.env.MAIN_DB_PASSWORD as string,{
       dialect:'mysql',
        host:process.env.MAIN_DB_HOST,
        pool:{
            min:1,
            max:parseInt(process.env.DB_POOL_MAX)
        }
    }
);

// sequelize_user.sync({alter:true})
//     .then(() => {
//         console.log('UserModel Database synchronized');
//     })
//     .catch((error) => {
//         console.error('Failed to synchronize user database:', error)
//     });

export default sequelize;