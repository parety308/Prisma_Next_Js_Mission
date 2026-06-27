import express, { type Application, type Request, type Response } from "express";
import cookiPerser from "cookie-parser";
import cors from "cors"
import { config } from "./config";
import { userRouter } from "./module/user/user.route";
import { authRouter } from "./module/auth/auth.route";

const app: Application = express();


//middleware
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiPerser())
app.get('/', async (req: Request, res: Response) => {
    res.send('Prisma Press Server in Running !')
});

app.use('/api', userRouter);
app.use("/api/auth",authRouter)

export default app;