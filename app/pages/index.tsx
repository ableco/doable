import { Suspense } from "react";
import { BlitzPage, useMutation } from "blitz";
import Layout from "app/core/layouts/Layout";
import { useCurrentUser } from "app/core/hooks/useCurrentUser";
import logout from "app/auth/mutations/logout";
import { Button } from "@ableco/abledev-components";

const Home: BlitzPage = () => {
  const currentUser = useCurrentUser();
  const [logoutMutation] = useMutation(logout);

  return (
    <div>
      {currentUser ? (
        <div>
          {currentUser.picture ? (
            <img
              src={currentUser.picture}
              alt="Profile picture"
              width="96"
              height="96"
            />
          ) : null}
          <Button
            variant="primary"
            size="base"
            onClick={() => logoutMutation()}
          >
            Logout
          </Button>
        </div>
      ) : (
        <Button variant="primary" size="base">
          <a href="/api/auth/google">Log In</a>
        </Button>
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
