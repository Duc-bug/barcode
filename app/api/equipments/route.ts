import {
  handleEquipmentsGet,
  handleEquipmentsPost,
  handleEquipmentsPatch,
  handleEquipmentsDelete,
} from "@/lib/controllers/equipments.controller";

export const GET = handleEquipmentsGet;
export const POST = handleEquipmentsPost;
export const PATCH = handleEquipmentsPatch;
export const DELETE = handleEquipmentsDelete;
