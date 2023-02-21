import styles from "../../styles/Post.module.css";
import PostContent from "../../../components/PostContent";
import {
  firestore,
  getUserWithUsername,
  postToJSON,
} from "../../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  getFirestore,
  collectionGroup,
  query,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);
  let post, path;

  if (userDoc) {
    const postRef = doc(collection(userDoc.ref, "posts"), slug);
    const postDoc = await getDoc(postRef);
    post = postToJSON(postDoc);
    path = postRef.path.toString();
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}


export async function getStaticPaths() {
  const q = query(
    collectionGroup(firestore, 'posts'),
    // You can add additional query filters here, such as where() or orderBy()
  );

  const querySnapshot = await getDocs(q);

  const paths = querySnapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
      </aside>
    </main>
  );
}
