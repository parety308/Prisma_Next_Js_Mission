import { Router } from "express";
import { postController } from "./post.controller";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";

const router = Router();
router.get('/', postController.getAllPosts)
router.get('/stats', auth([Role.admin]), postController.getPostStats)
router.get('/my-posts', auth([Role.admin, Role.author, Role.user]), postController.getMyPosts)
router.get('/:post_id', postController.getSinglePost)
router.post('/', auth([Role.admin, Role.author, Role.user]), postController.createPost)
router.patch('/:post_id', auth([Role.admin, Role.author, Role.user]), postController.updatePost)
router.delete('/:post_id', postController.deletePost)

export const PostRouter = router;