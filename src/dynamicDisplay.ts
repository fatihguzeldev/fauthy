import { Device, DisplayDevice } from './types';
import * as Storage from './storage';
import { authenticator } from 'otplib';
import chalk from 'chalk';

const COLUMN_PADDING = 2;
const UPDATE_INTERVAL = 1000; // Update every second

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const getColumnWidths = (data: DisplayDevice[]) => {
  let deviceNameWidth = 'Device Name'.length;
  let totpWidth = 'TOTP'.length;
  let createdAtWidth = 'Created At'.length;
  let remainingTimeWidth = 'Remaining Time'.length;

  data.forEach((device) => {
    deviceNameWidth = Math.max(deviceNameWidth, device.deviceName.length);
    totpWidth = Math.max(totpWidth, device.token.length);
    createdAtWidth = Math.max(createdAtWidth, device.createdAt.length);
    remainingTimeWidth = Math.max(
      remainingTimeWidth,
      device.remainingTime.length
    );
  });

  return {
    deviceName: deviceNameWidth + COLUMN_PADDING,
    totp: totpWidth + COLUMN_PADDING,
    createdAt: createdAtWidth + COLUMN_PADDING,
    remainingTime: remainingTimeWidth + COLUMN_PADDING,
  };
};

const padString = (str: string, width: number): string => {
  return str.padEnd(width);
};

const displayTable = (displayData: DisplayDevice[]) => {
  // clear console but preserve scrollback buffer
  process.stdout.write('\x1B[2J\x1B[H');

  const widths = getColumnWidths(displayData);

  console.log(
    chalk.green(padString('Device Name', widths.deviceName)) +
      chalk.green(padString('TOTP', widths.totp)) +
      chalk.green(padString('Created At', widths.createdAt)) +
      chalk.green('Remaining Time')
  );

  displayData.forEach((device) => {
    console.log(
      chalk.blue(padString(device.deviceName, widths.deviceName)) +
        chalk.yellow(padString(device.token, widths.totp)) +
        chalk.magenta(padString(device.createdAt, widths.createdAt)) +
        chalk.magenta(device.remainingTime)
    );
  });
};

export const displayDevicesWithTime = async () => {
  try {
    const data: Device[] = await Storage.readData();
    if (data.length === 0) {
      console.log('No devices found.');
      return;
    }

    const updateDisplay = () => {
      const now = Math.floor(Date.now() / 1000);
      const displayData: DisplayDevice[] = data.map((device) => {
        const remainingTime = 30 - (now % 30);
        const token = authenticator.generate(device.secret);

        return {
          ...device,
          token,
          createdAt: formatDate(device.createdAt),
          remainingTime: `${remainingTime}s`,
        };
      });

      displayTable(displayData);
    };

    updateDisplay();

    const interval = setInterval(updateDisplay, UPDATE_INTERVAL);

    process.on('SIGINT', () => {
      clearInterval(interval);
      process.exit();
    });
  } catch (error) {
    console.error('Error displaying devices:', error);
  }
};
