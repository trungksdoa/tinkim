export const encodeData = (data: any): string => {
  return btoa(JSON.stringify(data));
};

export const decodeData = (hash: string): any => {
  try {
    return JSON.parse(atob(hash));
  } catch (error) {
    return null;
  }
};