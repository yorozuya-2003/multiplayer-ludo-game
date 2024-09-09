import axios from "axios";
import { useState } from "react";
import API_URL from "./Config";

const Dice = ({ gameId, playerId, color, visible }) => {
  const [currentDiceValue, setCurrentDiceValue] = useState(null);

  const handleClickDice = () => {
    const url = `${API_URL}/games/roll-dice`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          game_id: gameId,
          player_id: playerId,
        },
      })
      .then((response) => {
        setCurrentDiceValue(response.data.dice_value);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  if (visible)
    return (
      <div
        className="w-20 h-20 bg-white border border-gray-500 rounded-lg flex items-center justify-center select-none"
        onClick={handleClickDice}
      >
        <p className="font-Poppins text-2xl">
          {currentDiceValue ? currentDiceValue : "ROLL"}
        </p>
      </div>
    );
  else {
    return (
      <div className="w-20 h-20 bg-white border border-gray-500 rounded-lg flex items-center justify-center invisible select-none">
        {/* <p className="font-Poppins text-2xl">{currentDiceValue}</p> */}
      </div>
    );
  }
};

export default Dice;
