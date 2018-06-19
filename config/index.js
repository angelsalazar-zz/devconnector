const ENV = process.env.NODE_ENV || 'DEV';

console.log(`ENV => ${ENV}`);

if (ENV === 'DEV' || ENV === 'TEST') {
    const config = require('./config.json'),
          envConfig = config[ENV];
    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    })
}
