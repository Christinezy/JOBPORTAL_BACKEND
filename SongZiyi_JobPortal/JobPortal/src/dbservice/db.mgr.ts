import {  db } from "../scripts/init.mongo";
import { MongoClient, Db, Collection} from "mongodb";


// const url = "mongodb://127.0.0.1:27017";
// console.log("db.mge.ts");



// export async function connectToCluster() {
//   try {
//     const mongoClient = new MongoClient(url);
//     await mongoClient.connect();
//     console.log("successfully connected to MongoDB Atlas!");
//     return mongoClient;

//   } catch (error) {
//     console.error("connection to MongoDB Atlas failed!", error);
//     process.exit();
//   }
// }


export function closeConnection(client: MongoClient) {
  client.close();
  console.log("MongoDB connection closed.");
}


// validate whether the user has all the correct information to register
export async function registerValidation() {
  console.log("user validation ...");
  if (!db) {
    throw new Error('database connection not initialized');
  }

  await db.command({
    "collMod": "users",
    "validator": {
        $jsonSchema: {
            bsonType: "object",
            required: ["email", "firstName", "lastName", "password", "role"],
            additionalProperties: false,
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "'_id' is an optional field and must be an objectId"
                },
                email: {
                    bsonType: "string",
                    description: "'email' is required and must be a string"
                },
                firstName: {
                    bsonType: "string",
                    description: "'firstName' is required and must be a string"
                },
                lastName: {
                    bsonType: "string",
                    description: "'lastName' is required and must be a string"
                },
                password: {
                    bsonType: "string",
                    description: "'password' is required and must be a string"
                },
                role: {
                  bsonType: "string",
                  description: "'role' is optional and must be a string, can be user or admin"
              },
                phoneNumber: {
                    bsonType: "string",
                    description: "'phoneNumber' is optional and must be a string"
                },
                jobs: {
                    bsonType: "array",
                    description: "'jobs' is optional and must be an array of ObjectIds"
                },
                education: {
                    bsonType: "array",
                    description: "'education' is optional and must be an array of strings"
                },
                resume: {
                    bsonType: "string",
                    description: "'resume' is optional and must be a string"
                },
                location: {
                    bsonType: "string",
                    description: "'location' is optional and must be a string"
                },
                profession: {
                    bsonType: "string",
                    description: "'profession' is optional and must be a string"
                },
                image: {
                    bsonType: "string",
                    description: "'image' is optional and must be a string"
                },
                experience: {
                    bsonType: "object",
                    description: "'experience' is optional and must be an object"
                },
                skills: {
                    bsonType: "array",
                    description: "'skills' is optional and must be an array of strings"
                }
            }
        }
    }
  });

}



export async function jobValidation() {
  console.log("job validation ...");
  if (!db) {
    throw new Error('database connection not initialized');
  }

  await db.command({
    "collMod": "jobs",
    "validator": {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "description", "active", "company"],
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId",
            description: "'_id' is an optional field and must be an objectId"
          },
          title: {
            bsonType: "string",
            description: "'title' is required and must be a string"
          },
          description: {
            bsonType: "string",
            description: "'description' is required and must be a string"
          },
          active: {
            bsonType: "bool",
            description: "'active' is required and must be a boolean"
          },
          company: {
            bsonType: "string",
            description: "'company' is required and must be a string"
          },
          postedAt: {
            bsonType: "date",
            description: "'postedAt' is optinal and must be a date with a default value of the current date/time"
          },
          salary: {
            bsonType: "string",
            description: "'salary' is optional and must be a string"
          },
          image: {
            bsonType: "string",
            description: "'image' is optional and must be a string"
          },
          location: {
            bsonType: "string",
            description: "'location' is optional and must be a string"
          }
        }
      }
    }
  });
}


export async function applicationValidation() {
  console.log("application validation ...");
  if (!db) {
    throw new Error('database connection not initialized');
  }

  await db.command({
    "collMod": "applications",
    "validator": {
      $jsonSchema: {
        bsonType: "object",
        required: ["jobId", "userId", "applicationStatus"],
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId",
            description: "'_id' is an optional field and must be an objectId"
          },
          jobId: {
            bsonType: "objectId",
            description: "'jobId' is required and must be an objectId"
          },
          userId: {
            bsonType: "objectId",
            description: "'userId' is required and must be an objectId"
          },
          applicationStatus: {
            bsonType: "string",
            description: "'applicationStatus' is required and must be a string"
          },
          createdAt: {
            bsonType: "date",
            description: "'createdAt' is optinal and must be a date with a default value of the current date/time"
          }
        }
      }
    }
  });
}