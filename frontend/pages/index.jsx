import useAuthContext from "@/hooks/useAuthContext";
import { useSignOut } from "@/hooks/useSignOut";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Home = () => {
  const { user } = useAuthContext();
  const { signOut } = useSignOut();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.refresh();
  };

  if (!user) {
    return (
      <div className="font-Poppins h-screen flex flex-col gap-5 items-center justify-center">
        <Link href="/sign-up">
          <button className="w-48 py-2 px-4 text-white bg-blue-700 font-medium rounded-lg text-lg">
            SIGN UP
          </button>
        </Link>
        <Link href="/sign-in">
          <button className="w-48 py-2 px-4 text-white bg-blue-700 font-medium rounded-lg text-lg">
            SIGN IN
          </button>
        </Link>
      </div>
    );
  }
  return (
    <div className="font-Poppins h-screen flex flex-col gap-5 items-center justify-center">
      <Link href="/game">
        <button className="w-48 py-2 px-4 text-white bg-blue-700 font-medium rounded-lg text-lg">
          JOIN GAME
        </button>
      </Link>
      <button
        className="w-48 py-2 px-4 text-white bg-blue-700 font-medium rounded-lg text-lg"
        onClick={handleSignOut}
      >
        SIGN OUT
      </button>
    </div>
  );
};

export default Home;
