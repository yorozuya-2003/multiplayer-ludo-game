import SignInForm from "@/components/SignInForm";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignIn = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user")) router.push("/");
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <SignInForm />
    </div>
  );
};

export default SignIn;
