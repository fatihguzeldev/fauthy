import open from 'open';
import chalk from 'chalk';

export const openSupportPage = () => {
  try {
    const url = 'https://buymeacoffee.com/fatihguzel';
    open(url);
    console.log(chalk.blue('Opening Buy Me a Coffee page...'));
  } catch (error) {
    console.error(chalk.red('Failed to open the URL:'), error);
  }
};
