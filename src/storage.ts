import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { Device } from './types';
import { Encryption } from './utils/encryption';

const configDir = path.join(os.homedir(), '.fauthy');
const dataFilePath = path.join(configDir, 'data.enc');

let encryptor: Encryption;

const getEncryptor = async () => {
  if (!encryptor) {
    encryptor = await Encryption.getInstance();
  }
  return encryptor;
};

export const initDataFile = async (): Promise<void> => {
  try {
    await fs.mkdir(configDir, { recursive: true });
    const encryptor = await Encryption.getInstance();

    const exists = await fs
      .access(dataFilePath)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      const encryptedData = encryptor.encrypt(JSON.stringify([]));
      await fs.writeFile(dataFilePath, encryptedData);
      await fs.chmod(dataFilePath, 0o600);
      console.log(
        chalk.green('.fauthy/data.enc has been created and encrypted.')
      );
    } else {
      console.log(chalk.blue('.fauthy/data.enc already exists.'));
    }
  } catch (error) {
    console.error(chalk.red('Error initializing data file:'), error);
    throw error;
  }
};

export const readData = async (): Promise<Device[]> => {
  try {
    const exists = await requireDataFile();
    if (!exists) return [];

    const enc = await getEncryptor();
    const encryptedData = await fs.readFile(dataFilePath, 'utf-8');
    const decryptedData = enc.decrypt(encryptedData);
    return JSON.parse(decryptedData);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error reading data: ${error.message}`));
    } else {
      console.error(chalk.red('Error reading data from file'));
    }
    return [];
  }
};

export const writeData = async (data: Device[]): Promise<void> => {
  try {
    const enc = await getEncryptor();
    const encryptedData = enc.encrypt(JSON.stringify(data));
    await fs.writeFile(dataFilePath, encryptedData);
    await fs.chmod(dataFilePath, 0o600);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error writing data: ${error.message}`));
    } else {
      console.error(chalk.red('Error writing data to file'));
    }
    throw error;
  }
};

export const checkDataFileExists = async (): Promise<boolean> => {
  return fs
    .access(dataFilePath)
    .then(() => true)
    .catch(() => false);
};

export const requireDataFile = async (): Promise<boolean> => {
  const exists = await checkDataFileExists();
  if (!exists) {
    console.error(chalk.red('Data file not found!'));
    console.log(
      chalk.yellow(
        "Please run 'fauthy init' first to initialize the application."
      )
    );
    return false;
  }
  return true;
};
