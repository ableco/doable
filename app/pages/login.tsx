import { Button, Center } from "@ableco/abledev-components";
import { GetServerSideProps } from "blitz";

function LoginPage({ redirectUrl }: { redirectUrl: string }) {
  return (
    <Center className="w-screen h-screen flex-col space-y-8">
      <h1 className="text-gray-900 font-bold text-3xl">Doable</h1>
      <a href={`/api/auth/google?redirectUrl=${redirectUrl}`}>
        <Button>Log in with Google</Button>
      </a>
    </Center>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const redirectUrl = query.redirectUrl ?? "/";
  return { props: { redirectUrl } };
};

export default LoginPage;
