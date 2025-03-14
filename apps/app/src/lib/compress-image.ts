import Compressor from "compressorjs";

export const compressImage = async (
  file: File,
  quality: number,
  maxHeight: number,
  maxWidth: number,
  convertSize?: number,
): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
     
    new Compressor(file, {
      quality,
      maxHeight,
      maxWidth,
      convertSize,
      success: resolve,
      error: reject,
    });
  });
};
