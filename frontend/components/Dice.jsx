const Dice = ({ diceValue }) => {
  const handleClickDice = () => {
    alert(`dice clicked`);
  };
  return (
    <div
      className="w-20 h-20 bg-white border border-gray-500 rounded-lg flex items-center justify-center"
      onClick={handleClickDice}
    >
      <p className="font-Poppins text-3xl">{diceValue}</p>
    </div>
  );
};

export default Dice;
