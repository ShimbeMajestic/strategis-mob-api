export const authConfig = {
    // secret: this.getValue('SECRET'),

    // refreshTokenSecret: this.getValue('REFRESH_TOKEN_SECRET'),

    /**
     * Token Lifetime in seconds
     *
     * Default: 15 days
     */
    tokenLife: 15 * 24 * 60 * 60,

    /**
     * Token Lifetime in seconds
     *
     * Default: 180 days
     */
    refreshTokenLife: 180 * 24 * 60 * 60,

    customerAuth: {
        /**
         * Token Lifetime in seconds
         *
         * Default: 5 minutes
         */
        otpLifeTime: process.env.OTP_EXPIRY_DURATION || 5 * 60,

        /**
         * Otp length, default 6 characters
         */
        otpLength: process.env.OTP_LENGTH
            ? parseInt(process.env.OTP_LENGTH, 10)
            : 6,

        /**
         * Maximum verification attempts per OTP
         */
        otpMaximumAttempts: process.env.OTP_ATTEMPTS
            ? parseInt(process.env.OTP_ATTEMPTS, 10)
            : 5,

        /**
         * Lock out time after OTP maximum failed attempts
         */
        // otpFailLockTime: 5 * 60,
    },
};
