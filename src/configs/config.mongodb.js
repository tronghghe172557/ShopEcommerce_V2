// lv0
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052,
  },
  db: {
    host: process.env.DEV_DB_HOST  || 'localhost',
    port: process.env.DEV_DB_POST  || 27017,
    name: process.env.DEV_DB_NAME  || 'ShopDEV3',
  },
  redis: {
    username: process.env.CLOUD_REDIS_NAME || "default",
    password: process.env.CLOUD_REDIS_PASSWORD,
    host: process.env.CLOUD_REDIS_HOST,
    port: process.env.CLOUD_REDIS_PORT,
  },
};

// lv01
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    port: process.env.PRO_DB_POST || 27017,
    name: process.env.PRO_DB_NAME || 'dbPro',
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env];
