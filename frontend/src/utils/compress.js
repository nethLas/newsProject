import Compressor from 'compressorjs';

export default async function compress(file, options) {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File) || !(file instanceof Blob)) {
      throw new TypeError('Function expected file or blob as first argument ');
    }
    const maxSize = options?.maxSize;
    const quality = options?.quality ?? 0.8;
    if (file.size > maxSize) throw new Error('file size exceeds max size');
    const start = Date.now();
    new Compressor(file, {
      quality, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        const photo = compressedResult;
        photo.name = file.name;
        console.log(
          `started: ${file.size} finished: ${compressedResult.size},time: ${
            Date.now() - start
          }`
        );
        resolve(photo);
      },
      error: (err) => {
        console.log(err);
        reject(err);
      },
    });
  });
}
