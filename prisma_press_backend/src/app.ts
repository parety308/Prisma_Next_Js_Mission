import express, { type Application, type Request, type Response } from "express";
import cookiPerser from "cookie-parser";
import cors from "cors"
import { config } from "./config";
import { userRouter } from "./module/user/user.route";
import { authRouter } from "./module/auth/auth.route";
import { PostRouter } from "./module/post/post.route";
import { commentRouter } from "./module/comment/comment.route";

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

app.use('/api/users', userRouter);
app.use("/api/auth", authRouter);
app.use('/api/posts', PostRouter);
app.use('/api/comments', commentRouter);

export default app;