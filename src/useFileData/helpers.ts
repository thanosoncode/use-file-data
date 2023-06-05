export const validTypeFiles = (imageTypes: string[], files: FileList | null) => {
  return files !== null
    ? Array.from(files).every((file) => imageTypes.includes(file.type))
    : true;
};

export const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.readAsDataURL(file);
  });
};
