import { Button } from "@ableco/abledev-components";

function LoginPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-gray-900 font-bold text-3xl">Doable</h1>
      <div className="h-8" />
      <a href="/api/auth/google">
        <Button variant="primary" size="base">
          Log in with Google
        </Button>
      </a>
    </div>
  );
}

export default LoginPage;
