import http from "http";

import app from "./app.js";
import { loadPlanetsData } from "./models/planets.model.js";
import { loadLaunchData } from "./models/launches.model.js";
import { mongoConnect } from "./services/mongo.js";
import "./loadEnv.js";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
