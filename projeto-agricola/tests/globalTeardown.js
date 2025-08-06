module.exports = async () => {

  const mongoServer = global.__MONGOINSTANCE;
 
  await mongoServer.stop();
};