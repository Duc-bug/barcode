import {
  handleUsersGet,
  handleUsersPost,
  handleUsersDelete,
} from "@/lib/controllers/users.controller";

export const GET = handleUsersGet;
export const POST = handleUsersPost;
export const DELETE = handleUsersDelete;
