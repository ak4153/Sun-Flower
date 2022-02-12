import mongoose from 'mongoose';

const connection = {};
//creates a mongo connection

//connect-creates a new connection if a connection isnt fount
//
async function connect() {
  if (connection.isConnected) {
    console.log('already connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }

  //a connection is created here
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('new connection');
  connection.isConnected = db.connections[0].readyState;
}
//disconnects if we are in production to save resources on the server
async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') connection.isConnected = false;
  } else console.log('not disconnected');
}

function convertDocToObj(d) {
  d._id = d._id.toString();
  d.createdAt = d.createdAt.toString();
  d.updatedAt = d.updatedAt.toString();

  return d;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
