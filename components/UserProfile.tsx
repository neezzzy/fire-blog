// UI component for user profile
import hacker_logo from "../public/hacker.png";

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <img
        loading="eager"
        alt="User Profile"
        width="150"
        height="150"
        src={user.photoURL || hacker_logo}
        className="card-img-center"
      />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || "Anonymous User"}</h1>
    </div>
  );
}
