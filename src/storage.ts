import fs from "fs";
import path from "path";
import { Device } from "./types/device";

const dataFilePath = path.resolve(process.cwd(), "data.json");

export const initDataFile = (): void => {
  if (fs.existsSync(dataFilePath)) {
    console.log("data.json already exists.");
  } else {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
    console.log("data.json has been created.");
  }
};

export const readData = (): Device[] => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(data);
};

export const writeData = (data: Device[]): void => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};
