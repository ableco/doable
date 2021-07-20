import { Suspense } from "react";
import { BlitzPage, useMutation } from "blitz";
import Layout from "app/core/layouts/Layout";
import { useCurrentUser } from "app/core/hooks/useCurrentUser";
import logout from "app/auth/mutations/logout";

const Home: BlitzPage = () => {
  const currentUser = useCurrentUser();
  const [logoutMutation] = useMutation(logout);

  return (
    <div>
      {currentUser ? (
        <div
          style={{ display: "flex", flexDirection: "column", width: "100px" }}
        >
          {currentUser.picture ? (
            <img src={currentUser.picture} alt="Profile picture" />
          ) : null}
          <button onClick={() => logoutMutation()}>Logout</button>
        </div>
      ) : (
        <a href="/api/auth/google">Log In</a>
      )}
    </div>
  );
};

Home.suppressFirstRenderFlicker = true;
Home.getLayout = (page) => (
  <Layout title="Home">
    <Suspense fallback={<span>Loading...</span>}>{page}</Suspense>
  </Layout>
);

export default Home;
