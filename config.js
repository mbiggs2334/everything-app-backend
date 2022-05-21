const WEATHER_API_KEY="254e60d52fe1410a99c221357220903";
const NEWS_API_KEY="4d7JLuqmVpu8Qaf6pQGfP9dUOBqYWrBtzL7mnQ6i";
const CRYPTO_API_KEY="08d1bd2c2fmsh0a1862eb3327676p12955djsneb36f2f23e49";

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "everything_app_test"
        : process.env.DATABASE_URL || "everything_app";
  }

// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
    WEATHER_API_KEY,
    NEWS_API_KEY,
    CRYPTO_API_KEY,
    SECRET_KEY,
    getDatabaseUri,
    BCRYPT_WORK_FACTOR
}