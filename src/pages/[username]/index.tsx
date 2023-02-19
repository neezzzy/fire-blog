import {
  getUserWithUsername,
  postToJSON,
  firestore,
} from "../../../lib/firebase";
import UserProfile from "../../../components/UserProfile";
import PostFeed from "../../../components/PostFeed";
import {
  collection,
  where,
  query as q,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc.exists()) {
    user = userDoc.data();
    const userDocRef = collection(firestore, "posts");
    const postsQuery = q(
      userDocRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const postSnapshot = await getDocs(postsQuery);
    posts = postSnapshot.docs.map((doc) => postToJSON(doc));
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({
  user,
  posts,
}: {
  user: {};
  posts: [];
}) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
