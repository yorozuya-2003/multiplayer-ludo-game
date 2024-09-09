import { coinColorMapping } from "@/components/Utils";
import Coin from "./Coin";

const CoinBox = ({ color, coins, gameId }) => {
  let coinArray = new Array(4).fill({ id: -1 });
  for (let ctr = 0; ctr < coins.length; ctr++) {
    coinArray[ctr] = coins[ctr];
  }

  return (
    <div
      className={`box-border h-72 w-72 p-0 m-0 bg-${coinColorMapping[color]}-500 border border-gray-500 flex items-center justify-center`}
    >
      <div
        className={`box-border h-48 w-48 p-0 m-0 bg-white border border-gray-500 space-y-5 flex flex-col items-center justify-center`}
      >
        <div className={`flex flex-row space-x-5`}>
          {coinArray
            .slice(0, 2)
            .map((coin, index) =>
              coin.id !== -1 ? (
                <Coin
                  key={coin.id}
                  id={coin.id}
                  color={coin.color}
                  position={coin.position}
                  gameId={gameId}
                />
              ) : (
                <div
                  key={index * -1}
                  className={`w-10 h-10 bg-white border border-gray-500 rounded-full flex items-center justify-center`}
                ></div>
              )
            )}
        </div>
        <div className={`flex flex-row space-x-5`}>
          {coinArray
            .slice(2)
            .map((coin, index) =>
              coin.id !== -1 ? (
                <Coin
                  key={coin.id}
                  id={coin.id}
                  color={coin.color}
                  position={coin.position}
                  gameId={gameId}
                />
              ) : (
                <div
                  key={index * -1}
                  className={`w-10 h-10 bg-white border border-gray-500 rounded-full flex items-center justify-center`}
                ></div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default CoinBox;
