import useAuthContext from "@/hooks/useAuthContext";
import axios from "axios";
import { useContext } from "react";
import API_URL from "./Config";
import { BoardStateContext } from "./Contexts";
import NumberedDice from "./NumberedDice";

const Dice = ({ gameId, playerId, color, visible, playerName }) => {
  const [
    absolutePositions,
    setAbsolutePositions,
    negativePositions,
    setNegativePositions,
    diceMap,
    setDiceMap,
  ] = useContext(BoardStateContext);

  const { user } = useAuthContext();

  const handleClickDice = () => {
    const url = `${API_URL}/games/roll-dice`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          game_id: gameId,
          player_id: playerId,
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        const resDiceValue = parseInt(response.data.dice_value);
        setDiceMap({
          0: resDiceValue,
          1: resDiceValue,
          2: resDiceValue,
          3: resDiceValue,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  if (visible)
    return (
      <div className="flex flex-col items-center gap-y-1">
        <div
          className="w-20 h-20 bg-white border border-gray-500 rounded-lg flex items-center justify-center select-none"
          onClick={handleClickDice}
        >
          <NumberedDice number={diceMap[color]} color={color} />
        </div>
        <p className="font-Poppins">{playerName}</p>
      </div>
    );
  else {
    return (
      <div>
        <div className="w-20 h-20 bg-white border border-gray-500 rounded-lg flex items-center justify-center invisible select-none"></div>
        <p className="font-Poppins">{playerName}</p>
      </div>
    );
  }
};

export default Dice;
