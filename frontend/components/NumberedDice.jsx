import { coinColorMapping } from "./Utils";

const NumberedDice = ({ number, color }) => {
  if (number === 1)
    return (
      <div className="flex items-center justify-center">
        <div
          className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
        ></div>
      </div>
    );
  if (number === 2)
    return (
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-3 gap-1">
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
        </div>
      </div>
    );
  if (number === 3)
    return (
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-3 gap-1">
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
        </div>
      </div>
    );

  if (number === 4)
    return (
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-3 gap-1">
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
        </div>
      </div>
    );

  if (number === 5)
    return (
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-3 gap-1">
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
        </div>
      </div>
    );

  if (number === 6)
    return (
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-3 gap-1">
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
          <div className={`w-3.5 h-3.5 bg-white rounded-full`}></div>
          <div
            className={`w-3.5 h-3.5 bg-${coinColorMapping[color]}-500 rounded-full`}
          ></div>
        </div>
      </div>
    );

  return (
    <p
      className={`font-Poppins text-2xl text-${coinColorMapping[color]}-500 font-semibold`}
    >
      {" "}
      ROLL
    </p>
  );
};

export default NumberedDice;
