#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('fauthy')
  .description('A CLI tool for managing TOTP MFA secrets')
  .version('1.0.0');

program
  .command('add <deviceName> <secret>')
  .description('Add a new TOTP device')
  .action((deviceName, secret) => {
    console.log(`Device added: ${deviceName} with secret ${secret}`);
  });

program.parse(process.argv);
