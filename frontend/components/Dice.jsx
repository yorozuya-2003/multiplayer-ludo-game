import axios from "axios";
import { useContext } from "react";
import API_URL from "./Config";
import { BoardStateContext } from "./Contexts";
import NumberedDice from "./NumberedDice";

const Dice = ({ gameId, playerId, color, visible }) => {
  const [
    absolutePositions,
    setAbsolutePositions,
    negativePositions,
    setNegativePositions,
    diceMap,
    setDiceMap,
  ] = useContext(BoardStateContext);

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
      <div
        className="w-20 h-20 bg-white border border-gray-500 rounded-lg flex items-center justify-center select-none"
        onClick={handleClickDice}
      >
        <NumberedDice number={diceMap[color]} color={color} />
      </div>
    );
  else {
    return (
      <div className="w-20 h-20 bg-white border border-gray-500 rounded-lg flex items-center justify-center invisible select-none"></div>
    );
  }
};

export default Dice;
