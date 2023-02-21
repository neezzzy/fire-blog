import Loader from "../../components/Loader";
import PostFeed from "../../components/PostFeed";
import { firestore, fromMillis, postToJSON } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  collectionGroup,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/database";
import { useState } from "react";

// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context: any) {
  const postsQuery = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

  const querySnapshot = await getDocs(postsQuery);

  const posts = querySnapshot.docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props = { posts: [] }) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const LIMIT = 10;

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? serverTimestamp(last.createdAt)
        : last.createdAt;

    const postsQuery = query(
      collection(firestore, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const querySnapshot = await getDocs(postsQuery);
    const newPosts = querySnapshot.docs.map(postToJSON);

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <meta title="Home Page" description="Get the latest posts on our site" />

      <div className="card card-info">
        <h2>Reddit Style Blog with Next.js + Firebase</h2>
        <p>
          Hello and welcome! This application is developed using Next.js and
          Firebase.
        </p>
        <p>
          Register for an account, create engaging posts, and show appreciation
          for posts made by other users by using the heart feature. All public
          content is optimized for search engines and rendered on the server.
        </p>
      </div>

      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
