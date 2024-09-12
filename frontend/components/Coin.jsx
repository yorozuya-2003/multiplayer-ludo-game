import { coinColorMapping, handlePositionMapping } from "@/components/Utils";
import axios from "axios";
import { useContext } from "react";
import API_URL from "./Config";
import { BoardStateContext } from "./Contexts";

const Coin = ({ id, color, gameId, scale }) => {
  const [
    absolutePositions,
    setAbsolutePositions,
    negativePositions,
    setNegativePositions,
    diceMap,
    setDiceMap,
  ] = useContext(BoardStateContext);

  const scaleMapping = {
    1: ["2.5rem", "2rem"],
    2: ["1.25rem", "1rem"],
    3: ["1rem", "0.75rem"],
    4: ["0.75rem", "0.5rem"],
  };

  const handleClickCoin = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const url = `${API_URL}/games/move-coin`;
    axios
      .post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            coin_id: id,
            game_id: gameId,
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        const [absolutePositionMapping, negativePositionMapping] =
          handlePositionMapping(response.data.board_state);
        setAbsolutePositions(absolutePositionMapping);
        setNegativePositions(negativePositionMapping);
        setDiceMap({ 0: 0, 1: 0, 2: 0, 3: 0 });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div
      className={`bg-white border border-gray-500 rounded-full flex items-center justify-center`}
      style={{ width: scaleMapping[scale][0], height: scaleMapping[scale][0] }}
      onClick={handleClickCoin}
    >
      <div
        className={`bg-${coinColorMapping[color]}-500 rounded-full`}
        style={{
          width: scaleMapping[scale][1],
          height: scaleMapping[scale][1],
        }}
      ></div>
    </div>
  );
};

export default Coin;
