export const generateWebsiteId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  const userId = `${timestamp}-${randomStr}`.toUpperCase();
  return `ATLAS-${userId}`;
};

export const isValidWebsiteId = (websiteId: string): boolean => {
  const pattern = /^ATLAS-[A-Z0-9]+-[A-Z0-9]+$/;
  return pattern.test(websiteId);
};

export const getTimestampFromWebsiteId = (websiteId: string): Date | null => {
  if (!isValidWebsiteId(websiteId)) {
    return null;
  }
  
  try {
    const parts = websiteId.split('-');
    const timestamp = parseInt(parts[1], 36);
    return new Date(timestamp);
  } catch {
    return null;
  }
}; 