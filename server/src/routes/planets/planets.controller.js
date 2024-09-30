import { getAllPlanents } from "../../models/planets.model.js";

export async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanents());
}
