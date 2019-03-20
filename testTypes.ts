import { exec } from 'child_process';
import pify from 'pify';
import { readdir } from 'fs';
import path from 'path';

const getFilesInDir = async (...paths: string[]): Promise<string[]> => {
  const files = await pify(readdir)(path.join(...paths));
  return files.map((file: string) => path.join(...paths, file));
}

export const typeCheckFolder = async (...paths: string[]): Promise<void> {
  const files = await getFilesInDir(...paths);
  await typeCheckFiles(files);
}

export const typeCheckFiles = async (files: string[], expectError?: boolean) => {
  await Promise.all(files.map(file => new Promise((resolve, reject) => {
    const tscArgs = '--strict --experimentalDecorators --emitDecoratorMetadata --esModuleInterop --noEmit --lib esnext';
    exec(`$(npm bin)/tsc ${tscArgs} ${file}`, (err) => {
      if ((err && expectError) || (!err && !expectError)) {
        resolve();
      } else {
        let errorText = expectError
          ? `Types in file ${file} valid, expected invalid`
          : `Types in file ${file} invalid, expected valid`;

        if (err) {
          errorText = `${errorText}\nOriginal error: ${err.toString()}`
        }
        reject(new Error(errorText));
      }
    });
  })));
};


