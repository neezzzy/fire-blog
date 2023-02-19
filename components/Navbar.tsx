import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {user && (
          <>
            <ul className="push-left">
              <li>
                <Link href="/enter">
                  <button onClick={handleSignOut} className="btn">
                    Sign Out
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <button className="btn-blue">Write Posts</button>
                </Link>
              </li>

              <li>
                <Link href={`/${username}`}>
                  <img src={user?.photoURL} alt="photo URL image" />
                </Link>
              </li>
            </ul>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!user && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
