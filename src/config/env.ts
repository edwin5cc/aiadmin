// Environment configuration
export const config = {
  backendBaseUrl: import.meta.env.VITE_BACKEND_BASE_URL || 'https://api.example.com',
  xProjectId: import.meta.env.VITE_X_PROJECT_ID || 'aiaccelerator',
};

// Validate environment variables at runtime
export const validateConfig = () => {
  const missingVars: string[] = [];
  
  if (!import.meta.env.VITE_BACKEND_BASE_URL) {
    missingVars.push('VITE_BACKEND_BASE_URL');
  }
  
  if (!import.meta.env.VITE_X_PROJECT_ID) {
    missingVars.push('VITE_X_PROJECT_ID');
  }
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  return true;
};

// Initialize config validation
validateConfig();
