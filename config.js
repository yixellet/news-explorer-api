const { JWT_SECRET = 'super-secret-key' } = process.env;
const { DB_URL = 'mongodb://localhost:27017/diploma' } = process.env;
const { PORT = 3000 } = process.env;

module.exports = {
  JWT_SECRET,
  DB_URL,
  PORT,
};
