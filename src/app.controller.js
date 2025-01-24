import connectionDB from "./DB/connectionDB.js";
import messagesRouter from "./modules/messages/messages.controller.js";
import usersRouter from "./modules/users/users.controller.js";
import { asyncHandler, globalErrorHandler } from "./utils/error/index.js";
import cors from "cors"
const bootstrap = async (app, express) => {

    app.use(cors());
    
    app.use(express.json());

    app.use("/users", usersRouter)
    app.use("/messages", messagesRouter)

    connectionDB();
    app.get('/', (_, res) => res.send('Saraha App!'))


    app.use("*", asyncHandler(async (req, res, next) => {
        throw new Error("Not Found Page 404");
    }));

    app.use(globalErrorHandler);

}

export default bootstrap