import { Button, Center } from "@ableco/abledev-components";

function LoginPage() {
  return (
    <Center className="w-screen h-screen flex-col space-y-8">
      <h1 className="text-gray-900 font-bold text-3xl">Doable</h1>
      <a href="/api/auth/google">
        <Button>Log in with Google</Button>
      </a>
    </Center>
  );
}

export default LoginPage;
