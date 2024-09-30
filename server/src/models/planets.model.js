import { parse } from "csv-parse";
import fs from "fs";

import Planet from "./planets.mongo.js";
import { get } from "http";

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

export function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream("data/kepler_data.csv")
      .pipe(
        parse({
          comment: "#",
          columns: true,
          delimiter: ",",
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.error(err);
        reject(err);
      })
      .on("end", async () => {
        const planetsFound = (await getAllPlanents()).length;
        console.log(`There are ${planetsFound} habitable planets.`);
        resolve();
      });
  });
}

export async function getAllPlanents() {
  return await Planet.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function savePlanet(planet) {
  try {
    await Planet.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Error saving planet ${planet.kepler_name}: ${error}`);
  }
}
