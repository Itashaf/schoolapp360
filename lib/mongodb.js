import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "schoolapp360";

let clientPromise = null;

// Cache the client across hot-reloads in dev and across invocations on a
// warm serverless instance, so we don't open a new connection per request.
function getClientPromise() {
  if (!uri) return null;
  if (clientPromise) return clientPromise;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = new MongoClient(uri).connect();
  }

  return clientPromise;
}

export async function getDb() {
  const promise = getClientPromise();
  if (!promise) {
    throw new Error("MONGODB_URI is not set.");
  }
  const client = await promise;
  return client.db(dbName);
}
