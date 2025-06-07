# fauthy - Fatih's TOTP Manager

<p align="center">
  <img src="./logo.png" alt="fauthy Logo" width="200"/>
</p>

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![npm version](https://img.shields.io/npm/v/fauthy.svg?style=flat)](https://www.npmjs.com/package/fauthy)
[![Downloads](https://img.shields.io/npm/dm/fauthy.svg)](https://www.npmjs.com/package/fauthy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A secure command-line TOTP (Time-based One-Time Password) manager with local encryption.

## Support

If you find this tool useful, consider [buying me a coffee](https://buymeacoffee.com/fatihlovestosimplify)!

## Features

- 🔐 Local encryption using AES-256-GCM
- 🕒 Real-time TOTP code updates
- 💾 Secure local storage in user's home directory
- 🔄 Dynamic display with countdown timer
- 🎨 Colored output for better readability
- 🏷️ Device tagging and filtering

## Security

fauthy stores your TOTP secrets locally with strong encryption:
- AES-256-GCM encryption
- Random IV for each encryption
- Authentication tags to verify data integrity
- Encryption key stored securely in `.fauthy/.key`
- File permissions set to user-only (0o600)

## Installation

```bash
npm install -g fauthy
```

## Usage

### Initialize fauthy
```bash
fauthy init
```
Creates necessary directories and encryption key.

### Add a Device
```bash
fauthy add <deviceName> <secret>
# Example:
fauthy add github JBSWY3DPEHPK3PXP
```

### List Devices
```bash
fauthy list
```
Shows a real-time updating table with:
- Device names
- Current TOTP codes
- Creation dates
- Remaining time until code refresh

### Get Single TOTP
```bash
fauthy get <deviceName>
# Example:
fauthy get github
```

### Remove Device
```bash
fauthy remove <deviceName>
```

### Rename Device
```bash
fauthy rename <oldName> <newName>
```

### Add a Device with Tag
```bash
fauthy add <deviceName> <secret> -t <tag>
```

### List Devices with Tag
```bash
fauthy list -t <tag>
```

### Tag a Device
```bash
fauthy tag <deviceName> <tag>
```

## Data Storage

Fauthy stores data in your home directory:
- `~/.fauthy/data.enc`: Encrypted device data
- `~/.fauthy/.key`: Encryption key

## Technical Details

### Encryption Process
1. Generates a random 16-byte IV
2. Uses AES-256-GCM for encryption
3. Stores data in format: `iv:authTag:encryptedData`

### TOTP Implementation
- SHA-1 hashing (standard for most services)
- 6-digit codes

## Development

### Prerequisites
- Node.js >= 14.0.0
- npm

### Setup
```bash
git clone https://github.com/fatihguzeldev/fauthy.git
cd fauthy
npm install
```

### Build
```bash
npm run build
```

### Local Testing
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit using conventional commits
4. Push to your branch
5. Create a Pull Request

## License

MIT