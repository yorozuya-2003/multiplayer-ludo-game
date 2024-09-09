import { coinColorMapping } from "@/components/Utils";
import Coin from "./Coin";
import bg from "@/public/star.png";

const Cell = ({ position, cellColor, coins, gameId, star }) => {
  if (coins.length === 0) {
    return (
      <div
        className={`box-border h-12 w-12 p-0 m-0 bg-${coinColorMapping[cellColor]}-500 border border-gray-500 flex items-center justify-center`}
        style={
          star
            ? {
                backgroundColor: "#D3D3D3",
                backgroundImage: `url(${bg.src})`,
                backgroundSize: "contain",
              }
            : {}
        }
      >
        {/* {position} */}
      </div>
    );
  }

  let scale;
  const numCoins = coins.length;
  if (numCoins == 1) scale = 1;
  else if (numCoins <= 4) scale = 2;
  else if (numCoins <= 9) scale = 3;
  else scale = 4;

  return (
    <div
      className={`box-border h-12 w-12 p-0 m-0 bg-${coinColorMapping[cellColor]}-500 border border-gray-500 flex flex-wrap items-center justify-center`}
      style={
        star
          ? {
              backgroundColor: "#D3D3D3",
              backgroundImage: `url(${bg.src})`,
              backgroundSize: "contain",
            }
          : {}
      }
    >
      {coins.map((coin) => (
        <Coin
          key={coin.id}
          id={coin.id}
          color={coin.color}
          gameId={gameId}
          scale={scale}
        />
      ))}
      {/* {position} */}
    </div>
  );
};

export default Cell;
