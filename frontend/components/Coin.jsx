import { coinColorMapping, handlePositionMapping } from "@/components/Utils";
import axios from "axios";
import { useContext } from "react";
import API_URL from "./Config";
import { BoardStateContext } from "./Contexts";

const Coin = ({ id, color, position, gameId }) => {
  const [
    absolutePositions,
    setAbsolutePositions,
    negativePositions,
    setNegativePositions,
    // playerTurnId,
    // setPlayerTurnId,
    // playerIdMap,
    // setPlayerIdMap,
  ] = useContext(BoardStateContext);

  const handleClickCoin = () => {
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
          },
        }
      )
      .then((response) => {
        const [absolutePositionMapping, negativePositionMapping] =
          handlePositionMapping(response.data.board_state);
        setAbsolutePositions(absolutePositionMapping);
        setNegativePositions(negativePositionMapping);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div
      className={`w-10 h-10 bg-white border border-gray-500 rounded-full flex items-center justify-center`}
      onClick={handleClickCoin}
    >
      <div
        className={`w-8 h-8 bg-${coinColorMapping[color]}-500 rounded-full`}
      ></div>
    </div>
  );
};

export default Coin;
