import { Device } from './types';
import * as Storage from './storage';
import { authenticator } from 'otplib';
import chalk from 'chalk';

export const getTOTPForDevice = async (deviceName: string) => {
  try {
    if (!(await Storage.requireDataFile())) return;

    const data: Device[] = await Storage.readData();
    const device = data.find((d) => d.deviceName === deviceName);
    if (!device) {
      console.log('Device not found.');
      return;
    }
    const token = authenticator.generate(device.secret);
    console.log(`TOTP for ${deviceName}: ${token}`);
  } catch (error) {
    console.error('Error fetching TOTP:', error);
  }
};

export const addDevice = async (deviceName: string, secret: string) => {
  try {
    try {
      authenticator.generate(secret);
    } catch (error) {
      throw new Error('Invalid TOTP secret');
    }

    if (!(await Storage.requireDataFile())) {
      return;
    }

    const data: Device[] = await Storage.readData();
    if (data.find((d) => d.deviceName === deviceName)) {
      throw new Error(`Device "${deviceName}" already exists`);
    }

    const newDevice: Device = {
      deviceName,
      secret,
      createdAt: new Date().toISOString(),
    };
    data.push(newDevice);
    await Storage.writeData(data);
    console.log(chalk.green(`Device added: ${deviceName}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unexpected error occurred'));
    }
  }
};

export const removeDevice = async (deviceName: string) => {
  try {
    if (!(await Storage.requireDataFile())) {
      return;
    }

    let data: Device[] = await Storage.readData();
    data = data.filter((device) => device.deviceName !== deviceName);
    await Storage.writeData(data);
    console.log(chalk.green(`Device removed: ${deviceName}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unexpected error occurred'));
    }
  }
};

export const renameDevice = async (
  oldDeviceName: string,
  newDeviceName: string
) => {
  try {
    if (!(await Storage.requireDataFile())) {
      return;
    }

    const data: Device[] = await Storage.readData();
    const device = data.find((d) => d.deviceName === oldDeviceName);
    if (!device) {
      console.log(chalk.red('Device not found.'));
      return;
    }
    device.deviceName = newDeviceName;
    await Storage.writeData(data);
    console.log(chalk.green(`Device renamed to: ${newDeviceName}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unexpected error occurred'));
    }
  }
};
