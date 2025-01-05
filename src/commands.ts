import { Device } from './types';
import * as Storage from './storage';
import { authenticator } from 'otplib';
import chalk from 'chalk';
import * as DynamicDisplay from './dynamicDisplay';

export const getTOTPForDevice = async (deviceName: string) => {
  try {
    if (!(await Storage.requireDataFile())) return;
    await DynamicDisplay.displaySingleDevice(deviceName);
  } catch (error) {
    console.error(chalk.red('Error fetching TOTP:'), error);
  }
};

export const addDevice = async (
  deviceName: string,
  secret: string,
  tag?: string
) => {
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
      tag,
    };
    data.push(newDevice);
    await Storage.writeData(data);

    const tagMessage = tag ? chalk.green(` with tag: ${tag}`) : '';
    console.log(chalk.green(`Device added: ${deviceName}${tagMessage}`));
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

export const tagDevice = async (deviceName: string, tag: string) => {
  try {
    if (!(await Storage.requireDataFile())) {
      return;
    }

    const data: Device[] = await Storage.readData();
    const deviceIndex = data.findIndex((d) => d.deviceName === deviceName);

    if (deviceIndex === -1) {
      console.log(chalk.red('Device not found.'));
      return;
    }

    data[deviceIndex].tag = tag;
    await Storage.writeData(data);
    console.log(chalk.green(`Added tag "${tag}" to device "${deviceName}"`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unexpected error occurred'));
    }
  }
};

export const listDevices = async (tag?: string) => {
  try {
    const data: Device[] = await Storage.readData();

    const filteredData = tag
      ? data.filter((device) => device.tag === tag)
      : data;

    if (filteredData.length === 0) {
      if (tag) {
        console.log(chalk.yellow(`No devices found with tag: ${tag}`));
      } else {
        console.log(chalk.yellow('No devices found.'));
      }
      return;
    }

    DynamicDisplay.displayDevicesWithTime(filteredData);
  } catch (error) {
    console.error(chalk.red('Error listing devices:'), error);
  }
};
