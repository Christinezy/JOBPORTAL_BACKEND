import { ObjectId } from "mongodb";


export function isValidObjectId(id: string): ObjectId | null {
  if (ObjectId.isValid(id) && (new ObjectId(id).toString() === id)) {
    console.log("this id is valid")
    const objectId = new ObjectId(id);
    return objectId
  }
  return null;
}