module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    PAYNOW_INTEGRATION_ID: process.env.PAYNOW_INTEGRATION_ID || 14906,
    PAYNOW_INTEGRATION_KEY: process.env.PAYNOW_INTEGRATION_KEY,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

      // Add validation
  validatePaynowConfig: function() {
    if (!PAYNOW_INTEGRATION_ID) {
      throw new Error('PAYNOW_INTEGRATION_ID is required');
    }
    if (!PAYNOW_INTEGRATION_KEY) {
      throw new Error('PAYNOW_INTEGRATION_KEY is required');
    }
    console.log('✅ Paynow configuration validated');
  }

}