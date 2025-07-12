// import dotenv from 'dotenv';
// dotenv.config();
import app from "./config/app.config";
// import { initSequelize } from './config/db.config';


// start app and db connection
async function run() {
    try {
        // const sequelize = initSequelize();
        // await sequelize.authenticate();
        // await sequelize.sync();

        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
        app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
}
run();