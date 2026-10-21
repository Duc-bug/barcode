import {
  handleIncidentsGet,
  handleIncidentsPatch,
  handleIncidentsDelete,
} from "@/lib/controllers/incidents.controller";

export const GET = handleIncidentsGet;
export const PATCH = handleIncidentsPatch;
export const DELETE = handleIncidentsDelete;
