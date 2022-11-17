/* eslint-disable import/prefer-default-export */

export const arrayBufferBase64 = async (data?: Buffer, mimeType?: string) => {
  if (!data) {
    return undefined;
  }

  // Use a FileReader to generate a base64 data URI
  const base64url: string = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(new Blob([data]));
  });

  /*
    The result looks like 
    "data:application/octet-stream;base64,<your base64 data>", 
    so we split off the beginning:
    */
  return `data:${mimeType || ''};base64,${base64url.split(',', 2)[1]}`;
};
