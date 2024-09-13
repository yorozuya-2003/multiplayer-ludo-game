import { useSignIn } from "@/hooks/useSignIn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignInForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, isLoading, error } = useSignIn();

  const router = useRouter();

  const handleSumbit = async (e) => {
    e.preventDefault();

    await signIn(username, password);

    setTimeout(() => {
      localStorage.getItem("user") && router.push("/");
    }, 3000);
  };

  return (
    <form
      className="font-Poppins flex flex-col px-4 justify-center border rounded-xl bg-slate-200 w-96 h-64 mx-auto"
      onSubmit={handleSumbit}
    >
      <div className="flex flex-col gap-y-3 mb-4">
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold ml-1 mb-1">
            Username
          </label>
          <input
            className="w-full py-2 px-3 text-gray-700 appearance-none border rounded-lg focus:outline-none focus:shadow-outline"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          ></input>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold ml-1 mb-1">
            Password
          </label>
          <input
            className="w-full py-2 px-3 text-gray-700 appearance-none border rounded-lg focus:outline-none focus:shadow-outline"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>
        </div>
      </div>
      <div className="flex flex-start justify-between">
        <button
          disabled={isLoading}
          className="w-auto py-2 px-4 text-white bg-blue-700 font-medium rounded-lg text-sm"
        >
          Sign in
        </button>
        <Link href="/sign-up" className="py-2 px-4 hover:underline">
          Don't have an account?
        </Link>
      </div>
      {error && (
        <div className="mt-4 text-sm text-red-500">
          {error.response.data.error}
        </div>
      )}
    </form>
  );
};

export default SignInForm;
