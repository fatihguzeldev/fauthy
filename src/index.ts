#!/usr/bin/env node

import { Command } from 'commander';
import * as Storage from './storage';
import { Device } from './types/device';

const program = new Command();

program
  .command('init')
  .description('Initialize fauthy and create a data.json file')
  .action(() => {
    Storage.initDataFile();
  });

program
  .command('add <deviceName> <secret>')
  .description('Add a new TOTP device')
  .action((deviceName: string, secret: string) => {
    const data: Device[] = Storage.readData();
    const newDevice: Device = {
      deviceName,
      secret,
      createdAt: new Date().toISOString(),
    };
    data.push(newDevice);
    Storage.writeData(data);
    console.log(`Device added: ${deviceName}`);
  });

program.parse(process.argv);
