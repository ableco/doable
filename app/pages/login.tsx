import { Button } from "@ableco/abledev-components";

function LoginPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center space-y-8">
      <h1 className="text-gray-900 font-bold text-3xl">Doable</h1>
      <a href="/api/auth/google">
        <Button>Log in with Google</Button>
      </a>
    </div>
  );
}

export default LoginPage;
