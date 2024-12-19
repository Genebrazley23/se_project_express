const { JWT_SECRET: string = "dev-secret" } = process.env;

module.exports = {
  JWT_SECRET: string,
};
