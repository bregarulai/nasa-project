import {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} from "../../models/launches.model.js";
import { getPagination } from "../../services/query.js";

export async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);

  const launches = await getAllLaunches({ skip, limit });

  return res.status(200).json(launches);
}

export async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid launch date." });
  }

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

export async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  const existingLaunch = await existsLaunchWithId(launchId);

  if (!existingLaunch) {
    return res.status(404).json({ error: "Launch not found." });
  }

  const abortedLaunch = await abortLaunchById(launchId);
  if (!abortedLaunch) {
    return res.status(400).json({ error: "Launch not aborted." });
  }
  return res.status(200).json({ ok: true });
}
