import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function testConnection() {
  try {
    await connect();
    console.log(
      "Database connection test successful",
    );
  } catch (error) {
    console.log("Database connection test failed. Error: " + error);
  }
}

export async function connect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  if (!process.env.DBHOST) {
    throw new Error("DBHOST environment variable is not defined");
  }

  try {
    connectionPromise = mongoose.connect(process.env.DBHOST);
    const connection = await connectionPromise;

    if (!connection.connection.db) {
      throw new Error("Database connection is not established");
    }

    await connection.connection.db.admin().command({ ping: 1 });
    return connection;
  } catch (error) {
    connectionPromise = null;
    console.log("Error connecting to the database. Error: " + error);
    throw error;
  }
}

export async function disconnect(force = false) {
  if (!force) {
    return;
  }

  try {
    await mongoose.disconnect();
    connectionPromise = null;
    console.log("Database connection closed successfully");
  } catch (error) {
    console.log("Error closing the database connection. Error: " + error);
    throw error;
  }
}
