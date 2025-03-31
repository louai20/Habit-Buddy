export function AuthView(props) {
  return (
    <div>
      {props.loading && <p>Loading...</p>}
      {props.error && <p style={{ color: "red" }}>{props.error}</p>}
      {props.user && props.user.uid ? (
        <div>
          <p>Welcome, {props.user.name}</p>
          <button onClick={props.onLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={props.onLoginWithGoogle}>Login with Google</button>
          <button onClick={() => props.onLoginWithEmail("email", "password")}>
            Login with Email
          </button>
          <button onClick={() => props.onRegisterWithEmail("email", "password", "name")}>
            Register
          </button>
        </div>
      )}
    </div>
  );
}
