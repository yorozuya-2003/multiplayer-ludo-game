import SignUpForm from "@/components/SignUpForm";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignUp = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user")) router.push("/");
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <SignUpForm />
    </div>
  );
};

export default SignUp;
