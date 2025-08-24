module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    PAYNOW_INTEGRATION_ID: process.env.PAYNOW_INTEGRATION_ID || 'your_paynow_id',
    PAYNOW_INTEGRATION_KEY: process.env.PAYNOW_INTEGRATION_KEY || 'your_paynow_key',
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
}