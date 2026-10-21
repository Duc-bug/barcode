import {
  handleSchedulesGet,
  handleSchedulesPost,
  handleSchedulesDelete,
} from "@/lib/controllers/schedules.controller";

export const GET = handleSchedulesGet;
export const POST = handleSchedulesPost;
export const DELETE = handleSchedulesDelete;
