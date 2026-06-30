import { Router } from "express";
import { commentController } from "./comment.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get('/author/:author_id', auth([Role.admin, Role.author, Role.user]), commentController.getAuthorComments)
router.get('/:comment_id', commentController.getSingleComment)
router.post('/', auth([Role.admin, Role.user]), commentController.createComment)
router.patch('/:comment_id', auth([Role.admin, Role.user]), commentController.updateComment)
router.delete('/:comment_id', auth([Role.admin, Role.user]), commentController.deleteComment)
router.patch('/:comment_id/moderate', auth([Role.admin]), commentController.updateModerateComment);

export const commentRouter = router;