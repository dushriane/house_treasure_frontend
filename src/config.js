// Configuration file with environment variable validation
// This ensures all required environment variables are present before the app runs

const requiredEnvVars = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_WS_URL: import.meta.env.VITE_WS_URL,
  VITE_GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID,
};

// Validate required environment variables
const missingVars = [];
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    missingVars.push(key);
  }
});

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Please create a .env file with the required variables. See .env.example for reference.'
  );
  // In development, warn but don't throw
  if (import.meta.env.MODE === 'production') {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Export validated config
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws',
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  environment: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
};

export default config;
