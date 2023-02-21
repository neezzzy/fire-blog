import "firebase/storage";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  where,
  query,
  limit,
  getDocs,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const userQuery = query(usersRef, where("username", "==", username));
  const userDoc = await getDocs(userQuery);

  if (userDoc.empty) return null;

  return userDoc.docs[0];
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt ? Timestamp.fromDate(new Date(data.createdAt.seconds * 1000)).toMillis() : null,
    updatedAt: data.updatedAt ? Timestamp.fromDate(new Date(data.updatedAt.seconds * 1000)).toMillis() : null,
  };
}

const app = initializeApp(firebaseConfig);

const fromMillis = Timestamp.fromMillis;
export { fromMillis };
export const storage = getStorage(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth();
export const firestore = getFirestore(app);
export { serverTimestamp };
