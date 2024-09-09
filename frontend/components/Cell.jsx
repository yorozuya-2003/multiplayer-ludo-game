import { coinColorMapping } from "@/components/Utils";
import Coin from "./Coin";

const Cell = ({ position, cellColor, coins, gameId }) => {
  if (coins.length === 0) {
    return (
      <div
        className={`box-border h-12 w-12 p-0 m-0 bg-${coinColorMapping[cellColor]}-500 border border-gray-500 flex items-center justify-center`}
      >
        {/* {position} */}
      </div>
    );
  }

  //   if (coins.length === 2) {
  //     return (
  //       <div className="box-border h-12 w-12 p-0 m-0 border border-gray-500 flex items-center justify-center">
  //         {coins.map((coinColor) => (
  //           <div
  //             className={`w-5 h-5 bg-white border border-gray-500 rounded-full flex items-center justify-center`}
  //           >
  //             <div
  //               className={`w-4 h-4 bg-${coinColorMapping[coinColor]}-500 rounded-full`}
  //             ></div>
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   }

  return (
    <div
      className={`box-border h-12 w-12 p-0 m-0 bg-${coinColorMapping[cellColor]}-500 border border-gray-500 flex items-center justify-center`}
    >
      {coins.map((coin) => (
        <Coin
          key={coin.id}
          id={coin.id}
          position={coin.position}
          color={coin.color}
          gameId={gameId}
        />
      ))}
      {/* {position} */}
    </div>
  );
};

export default Cell;
