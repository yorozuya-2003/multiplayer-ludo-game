import Board from "@/components/Board";
import Dice from "@/components/Dice"

const Game = () => {
  return (
    <div className="p-4 flex flex-row gap-5 items-center justify-center">
      <Board />
      <Dice />
    </div>
  );
};

export default Game;
