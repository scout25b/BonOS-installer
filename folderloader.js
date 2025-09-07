import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

export default function () {
  const callback = this.async(); // Make loader async

  // Get the folder path from the query or assume current resource
  const folderKey = path.basename(this.resourcePath.replace('.folder', ''));
  const folderPath = { "BonOS": path.resolve("./BonOS"),"lagoon-boot": path.resolve("./lagoon-boot") }[folderKey];

  // Use a memory stream to collect zipped output
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  const chunks = [];

  archive.on('data', chunk => {
    chunks.push(chunk);
  });

  archive.on('error', err => {
    callback(err);
  });

  archive.on('end', () => {
    const zippedBuffer = Buffer.concat(chunks);
    const arrayBuffer = zippedBuffer.buffer.slice(
      zippedBuffer.byteOffset,
      zippedBuffer.byteOffset + zippedBuffer.byteLength
    );

    const uint8Array = new Uint8Array(arrayBuffer);

    const jsExport = `
      export default new Uint8Array([${uint8Array.join(',')}]);
    `;

    callback(null, jsExport);
  });

  archive.glob('**/*', {
    cwd: folderPath,
    ignore: ['node_modules/**', '.git/**']
  });

  archive.finalize();
};
