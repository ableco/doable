import { Suspense } from "react";
import { BlitzPage, useMutation, useRouter } from "blitz";
import Layout from "app/core/layouts/Layout";
import { useCurrentUser } from "app/core/hooks/useCurrentUser";
import logout from "app/auth/mutations/logout";
import { Button } from "@ableco/abledev-components";
import protectPage from "app/core/helpers/protectPage";

const Home: BlitzPage = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [logoutMutation] = useMutation(logout);

  return (
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
        onClick={async () => {
          await logoutMutation();
          router.push("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
};

Home.suppressFirstRenderFlicker = true;
Home.getLayout = (page) => (
  <Layout title="Home">
    <Suspense fallback={<span>Loading...</span>}>{page}</Suspense>
  </Layout>
);

export const getServerSideProps = protectPage;

export default Home;
