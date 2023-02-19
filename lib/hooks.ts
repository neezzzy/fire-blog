import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const auth = getAuth();
const firestore = getFirestore();

// Custom hook to read auth record and user profile doc
export function useUserData() {
  const [user, setUser] = useState(auth.currentUser);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Turn off realtime subscription
    let unsubscribe: () => void;

    if (user) {
      const ref = doc(firestore, "users", user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setUsername(null);
      }
    });

    return () => {
      unsubscribeAuth;
      unsubscribe;
    };
  }, [user]);

  return { user, username };
}
