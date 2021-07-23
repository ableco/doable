import { Button } from "@ableco/abledev-components";
import { HTMLAttributes, ReactNode } from "react";

interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Center({ className = "", ...props }: CenterProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      {...props}
    />
  );
}

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
