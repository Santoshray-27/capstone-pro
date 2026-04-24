/**
 * JWT Token Generator
 * Creates signed JWT tokens for authentication
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a user
 * @param {string} userId - MongoDB user ID
 * @param {string} role - User role (jobseeker/recruiter/admin)
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, role = 'jobseeker') => {
  return jwt.sign(
    {
      id: userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'smart-resume-analyzer',
      audience: 'smart-resume-analyzer-api'
    }
  );
};

/**
 * Generate refresh token (longer expiry)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = { generateToken, generateRefreshToken };
