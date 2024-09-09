import Board from "@/components/Board";
import API_URL from "@/components/Config";
import axios from "axios";
import { useEffect, useState } from "react";

const Game = () => {
  const [gameId, setGameId] = useState(null)

  useEffect(() => {
    getGameId();
  }, [])

  const getGameId = () => {
    const localStorageGameId = localStorage.getItem("gameId");
    if (localStorageGameId) setGameId(localStorageGameId);

    const url = `${API_URL}/games`;

    // joining (dummy) ongoing game
    axios
    .post(url, {}, {
      headers: { "Content-Type": "application/json", user_id: 5 },
    })
    .then((response) => {
      localStorage.setItem("gameId", response.data.id);
      setGameId(response.data.id);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  if (!gameId) return (<div className="p-4 font-Poppins">Loading...</div>)

  return (
    <div className="p-4 flex flex-row items-center justify-center">
      <Board gameId={gameId}/>
    </div>
  );
};

export default Game;
