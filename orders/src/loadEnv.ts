export function loadEnv() {
  if (process.env.NODE_ENV !== "production") {
    try {
      require("dotenv").config();
      console.log("Loaded .env configuration");
    } catch (error) {
      console.warn("dotenv not installed. skipping .env config lead");
    }
  }
}
