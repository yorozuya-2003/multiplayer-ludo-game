import Board from "@/components/Board";
import API_URL from "@/components/Config";
import { useSignOut } from "@/hooks/useSignOut";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Game = () => {
  const [gameId, setGameId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const router = useRouter();

  const { signOut } = useSignOut();

  const POLLING_INTERVAL = 5000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      getGameId();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const getGameId = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      router.push("/");
      return;
    }

    const url = `${API_URL}/games`;

    // joining (dummy) ongoing game
    axios
      .post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        setGameId(response.data.id);
        if (response.data.status === "IN_PROGRESS") {
          setGameStarted(true);
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          if (error.response.data.error === "TOKEN_EXPIRED") {
            signOut();
          }
        }
      });
  };

  if (!gameStarted)
    return <div className="p-4 font-Poppins">Waiting for players...</div>;

  return (
    <div className="p-4 flex flex-row items-center justify-center">
      <Board gameId={gameId} />
    </div>
  );
};

export default Game;
