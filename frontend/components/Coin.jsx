import { coinColorMapping } from "@/components/Utils";

const Coin = ({ id, color, position }) => {
  const handleClickCoin = () => {
    alert(`${id}, ${position}, ${color}`);
  }
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
