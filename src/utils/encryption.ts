import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import chalk from 'chalk';

const configDir = path.join(os.homedir(), '.fauthy');
const keyPath = path.join(configDir, '.key');

const IV_LENGTH = 16;

export class Encryption {
  private static instance: Encryption;
  private readonly key: Buffer;

  private constructor(key: Buffer) {
    this.key = key;
  }

  public static async initialize(): Promise<void> {
    try {
      await fs.mkdir(configDir, { recursive: true });

      try {
        await fs.access(keyPath);
        const savedKey = await fs.readFile(keyPath, 'utf-8');
        this.instance = new Encryption(Buffer.from(savedKey, 'hex'));
      } catch {
        const newKey = crypto.randomBytes(32);
        await fs.writeFile(keyPath, newKey.toString('hex'), { mode: 0o600 });
        this.instance = new Encryption(newKey);
      }
    } catch (error) {
      console.error(chalk.red('Error initializing encryption:'), error);
      throw error;
    }
  }

  public static async getInstance(): Promise<Encryption> {
    if (!this.instance) {
      await this.initialize();
    }
    return this.instance;
  }

  public encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  public decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');

    if (!ivHex || !authTagHex || !encryptedText) {
      throw new Error('Invalid encrypted data format');
    }

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(ivHex, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
