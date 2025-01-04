#!/usr/bin/env node

import { Command } from 'commander';
import * as Storage from './storage';
import { openSupportPage } from './utils';
import * as Commands from './commands';
import * as DynamicDisplay from './dynamicDisplay';

const program = new Command();

program
  .name('fauthy')
  .version('1.0.0')
  .description('a CLI tool for managing TOTP MFA secrets');

program
  .command('donate')
  .description('open the Buy Me a Coffee link')
  .action(() => {
    openSupportPage();
  });

program
  .command('init')
  .description('initialize fauthy and create a data.enc file')
  .action(() => {
    Storage.initDataFile();
  });

program
  .command('add <deviceName> <secret>')
  .description('add a new TOTP device')
  .usage('<deviceName> <secret> (e.g., fauthy add github JBSWY3DPEHPK3PXP)')
  .action(async (deviceName: string, secret: string) => {
    await Commands.addDevice(deviceName, secret);
  });

program
  .command('list')
  .description('list all TOTP devices')
  .action(() => {
    DynamicDisplay.displayDevicesWithTime();
  });

program
  .command('get <deviceName>')
  .description('get the TOTP for a device')
  .action((deviceName: string) => {
    Commands.getTOTPForDevice(deviceName);
  });

program
  .command('remove <deviceName>')
  .description('remove a TOTP device')
  .action((deviceName: string) => {
    Commands.removeDevice(deviceName);
  });

program
  .command('rename <oldDeviceName> <newDeviceName>')
  .description('rename a TOTP device')
  .action((oldDeviceName: string, newDeviceName: string) => {
    Commands.renameDevice(oldDeviceName, newDeviceName);
  });

program.parse(process.argv);
