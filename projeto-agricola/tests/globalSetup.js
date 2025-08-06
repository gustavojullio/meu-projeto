

const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  
  global.__MONGOINSTANCE = mongoServer;
  process.env.MONGO_URI_UNIT_TESTS = uri; 
};