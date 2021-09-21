import { Button, Center } from "@abledotdev/ui";
import { GetServerSideProps, getSession } from "blitz";

function LoginPage({ redirectUrl }: { redirectUrl: string }) {
  return (
    <Center className="w-screen h-screen space-y-8">
      <h1 className="text-gray-900 font-bold text-3xl">Doable</h1>
      <a href={`/api/auth/google?redirectUrl=${redirectUrl}`}>
        <Button>Log in with Google</Button>
      </a>
    </Center>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  const session = await getSession(req, res);

  if (session.userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Sometimes next can redirect to a .json url :S
  let redirectUrl = "/";

  if (Array.isArray(query.redirectUrl)) {
    redirectUrl = query.redirectUrl[0]!;
  } else if (typeof query.redirectUrl === "string") {
    redirectUrl = query.redirectUrl;
  }

  if (redirectUrl.endsWith(".json")) {
    redirectUrl = "/";
  }

  return { props: { redirectUrl } };
};

export default LoginPage;
