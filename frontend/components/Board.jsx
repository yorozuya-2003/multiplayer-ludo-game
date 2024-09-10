import axios from "axios";
import { useState, useEffect } from "react";

import Cell from "./Cell";
import Centre from "./Centre";
import CoinBox from "./CoinBox";
import { BoardStateContext } from "./Contexts";
import Dice from "./Dice";
import {
  absolutePositionMapping,
  handlePositionMapping,
  negativePositionMapping,
} from "./Utils";

import API_URL from "./Config";

const Board = ({ gameId }) => {
  const [absolutePositions, setAbsolutePositions] = useState(
    absolutePositionMapping
  );
  const [negativePositions, setNegativePositions] = useState(
    negativePositionMapping
  );
  const [playerTurnId, setPlayerTurnId] = useState(null);
  const [playerIdMap, setPlayerIdMap] = useState({});

  const [diceMap, setDiceMap] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });

  const POLLING_INTERVAL = 2000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      getBoardState();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const getBoardState = () => {
    const gameId = 2;
    const url = `${API_URL}/games/state`;

    axios
      .get(url, {
        headers: { "Content-Type": "application/json", game_id: gameId },
      })
      .then((response) => {
        const [absolutePositionMapping, negativePositionMapping] =
          handlePositionMapping(response.data.board_state);
        setAbsolutePositions(absolutePositionMapping);
        setNegativePositions(negativePositionMapping);
        setPlayerTurnId(response.data.player_turn_id);
        handlePlayerMapping(response.data.board_state);

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

  const handlePlayerMapping = (coinStateData) => {
    const mapping = {};
    coinStateData.forEach((element) => {
      mapping[element.color] = element.player_id;
    });
    setPlayerIdMap(mapping);
  };

  return (
    <BoardStateContext.Provider
      value={[
        absolutePositions,
        setAbsolutePositions,
        negativePositions,
        setNegativePositions,
        diceMap,
        setDiceMap,
      ]}
    >
      <div className="p-4 flex flex-row gap-20 items-center justify-center">
        <div className="flex flex-col gap-96">
          <Dice
            gameId={gameId}
            color={1}
            playerId={playerIdMap[1]}
            visible={playerIdMap[1] === playerTurnId}
          />
          <Dice
            gameId={gameId}
            color={0}
            playerId={playerIdMap[0]}
            visible={playerIdMap[0] === playerTurnId}
          />
        </div>
        <div>
          <div className="flex flex-row">
            {/* green color box */}
            <CoinBox gameId={gameId} color={1} coins={negativePositions[1]} />

            <div className="flex flex-col">
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={23}
                  position={23}
                  coins={absolutePositions[23]}
                />
                <Cell
                  gameId={gameId}
                  key={24}
                  position={24}
                  coins={absolutePositions[24]}
                />
                <Cell
                  gameId={gameId}
                  key={25}
                  position={25}
                  coins={absolutePositions[25]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={22}
                  position={22}
                  coins={absolutePositions[22]}
                />
                <Cell
                  gameId={gameId}
                  key={351}
                  position={351}
                  cellColor={2}
                  coins={absolutePositions[351]}
                />
                <Cell
                  gameId={gameId}
                  key={26}
                  position={26}
                  cellColor={2}
                  coins={absolutePositions[26]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={21}
                  position={21}
                  coins={absolutePositions[21]}
                  star={true}
                />
                <Cell
                  gameId={gameId}
                  key={352}
                  position={352}
                  cellColor={2}
                  coins={absolutePositions[352]}
                />
                <Cell
                  gameId={gameId}
                  key={27}
                  position={27}
                  coins={absolutePositions[27]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={20}
                  position={20}
                  coins={absolutePositions[20]}
                />
                <Cell
                  gameId={gameId}
                  key={353}
                  position={353}
                  cellColor={2}
                  coins={absolutePositions[353]}
                />
                <Cell
                  gameId={gameId}
                  key={28}
                  position={28}
                  coins={absolutePositions[28]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={19}
                  position={19}
                  coins={absolutePositions[19]}
                />
                <Cell
                  gameId={gameId}
                  key={354}
                  position={354}
                  cellColor={2}
                  coins={absolutePositions[354]}
                />
                <Cell
                  gameId={gameId}
                  key={29}
                  position={29}
                  coins={absolutePositions[29]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={18}
                  position={18}
                  coins={absolutePositions[18]}
                />
                <Cell
                  gameId={gameId}
                  key={355}
                  position={355}
                  cellColor={2}
                  coins={absolutePositions[355]}
                />
                <Cell
                  gameId={gameId}
                  key={30}
                  position={30}
                  coins={absolutePositions[30]}
                />
              </div>
            </div>

            {/* yellow color box */}
            <CoinBox gameId={gameId} color={2} coins={negativePositions[2]} />
          </div>

          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={12}
                  position={12}
                  coins={absolutePositions[12]}
                />
                <Cell
                  gameId={gameId}
                  key={13}
                  position={13}
                  cellColor={1}
                  coins={absolutePositions[13]}
                />
                <Cell
                  gameId={gameId}
                  key={14}
                  position={14}
                  coins={absolutePositions[14]}
                />
                <Cell
                  gameId={gameId}
                  key={15}
                  position={15}
                  coins={absolutePositions[15]}
                />
                <Cell
                  gameId={gameId}
                  key={16}
                  position={16}
                  coins={absolutePositions[16]}
                />
                <Cell
                  gameId={gameId}
                  key={17}
                  position={17}
                  coins={absolutePositions[17]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={11}
                  position={11}
                  coins={absolutePositions[11]}
                />
                <Cell
                  gameId={gameId}
                  key={251}
                  position={251}
                  cellColor={1}
                  coins={absolutePositions[251]}
                />
                <Cell
                  gameId={gameId}
                  key={252}
                  position={252}
                  cellColor={1}
                  coins={absolutePositions[252]}
                />
                <Cell
                  gameId={gameId}
                  key={253}
                  position={253}
                  cellColor={1}
                  coins={absolutePositions[253]}
                />
                <Cell
                  gameId={gameId}
                  key={254}
                  position={254}
                  cellColor={1}
                  coins={absolutePositions[254]}
                />
                <Cell
                  gameId={gameId}
                  key={255}
                  position={255}
                  cellColor={1}
                  coins={absolutePositions[255]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={10}
                  position={10}
                  coins={absolutePositions[10]}
                />
                <Cell
                  gameId={gameId}
                  key={9}
                  position={9}
                  coins={absolutePositions[9]}
                />
                <Cell
                  gameId={gameId}
                  key={8}
                  position={8}
                  coins={absolutePositions[8]}
                  star={true}
                />
                <Cell
                  gameId={gameId}
                  key={7}
                  position={7}
                  coins={absolutePositions[7]}
                />
                <Cell
                  gameId={gameId}
                  key={6}
                  position={6}
                  coins={absolutePositions[6]}
                />
                <Cell
                  gameId={gameId}
                  key={5}
                  position={5}
                  coins={absolutePositions[5]}
                />
              </div>
            </div>

            {/* home */}
            <Centre />

            {/* */}
            <div className="flex flex-col">
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={31}
                  position={31}
                  coins={absolutePositions[31]}
                />
                <Cell
                  gameId={gameId}
                  key={32}
                  position={32}
                  coins={absolutePositions[32]}
                />
                <Cell
                  gameId={gameId}
                  key={33}
                  position={33}
                  coins={absolutePositions[33]}
                />
                <Cell
                  gameId={gameId}
                  key={34}
                  position={34}
                  coins={absolutePositions[34]}
                  star={true}
                />
                <Cell
                  gameId={gameId}
                  key={35}
                  position={35}
                  coins={absolutePositions[35]}
                />
                <Cell
                  gameId={gameId}
                  key={36}
                  position={36}
                  coins={absolutePositions[36]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={455}
                  position={455}
                  cellColor={3}
                  coins={absolutePositions[455]}
                />
                <Cell
                  gameId={gameId}
                  key={454}
                  position={454}
                  cellColor={3}
                  coins={absolutePositions[454]}
                />
                <Cell
                  gameId={gameId}
                  key={453}
                  position={453}
                  cellColor={3}
                  coins={absolutePositions[453]}
                />
                <Cell
                  gameId={gameId}
                  key={452}
                  position={452}
                  cellColor={3}
                  coins={absolutePositions[452]}
                />
                <Cell
                  gameId={gameId}
                  key={451}
                  position={451}
                  cellColor={3}
                  coins={absolutePositions[451]}
                />
                <Cell
                  gameId={gameId}
                  key={37}
                  position={37}
                  coins={absolutePositions[37]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={43}
                  position={43}
                  coins={absolutePositions[43]}
                />
                <Cell
                  gameId={gameId}
                  key={42}
                  position={42}
                  coins={absolutePositions[42]}
                />
                <Cell
                  gameId={gameId}
                  key={41}
                  position={41}
                  coins={absolutePositions[41]}
                />
                <Cell
                  gameId={gameId}
                  key={40}
                  position={40}
                  coins={absolutePositions[40]}
                />
                <Cell
                  gameId={gameId}
                  key={39}
                  position={39}
                  cellColor={3}
                  coins={absolutePositions[39]}
                />
                <Cell
                  gameId={gameId}
                  key={38}
                  position={38}
                  coins={absolutePositions[38]}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row">
            {/* red color box */}
            <CoinBox gameId={gameId} color={0} coins={negativePositions[0]} />

            <div className="flex flex-col">
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={4}
                  position={4}
                  coins={absolutePositions[4]}
                />
                <Cell
                  gameId={gameId}
                  key={155}
                  position={155}
                  cellColor={0}
                  coins={absolutePositions[155]}
                />
                <Cell
                  gameId={gameId}
                  key={44}
                  position={44}
                  coins={absolutePositions[44]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={3}
                  position={3}
                  coins={absolutePositions[3]}
                />
                <Cell
                  gameId={gameId}
                  key={154}
                  position={154}
                  cellColor={0}
                  coins={absolutePositions[154]}
                />
                <Cell
                  gameId={gameId}
                  key={45}
                  position={45}
                  coins={absolutePositions[45]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={2}
                  position={2}
                  coins={absolutePositions[2]}
                />
                <Cell
                  gameId={gameId}
                  key={153}
                  position={153}
                  cellColor={0}
                  coins={absolutePositions[153]}
                />
                <Cell
                  gameId={gameId}
                  key={46}
                  position={46}
                  coins={absolutePositions[46]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={1}
                  position={1}
                  coins={absolutePositions[1]}
                />
                <Cell
                  gameId={gameId}
                  key={152}
                  position={152}
                  cellColor={0}
                  coins={absolutePositions[152]}
                />
                <Cell
                  gameId={gameId}
                  key={47}
                  position={47}
                  coins={absolutePositions[47]}
                  star={true}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={0}
                  position={0}
                  cellColor={0}
                  coins={absolutePositions[0]}
                />
                <Cell
                  gameId={gameId}
                  key={151}
                  position={151}
                  cellColor={0}
                  coins={absolutePositions[151]}
                />
                <Cell
                  gameId={gameId}
                  key={48}
                  position={48}
                  coins={absolutePositions[48]}
                />
              </div>
              <div className="flex flex-row">
                <Cell
                  gameId={gameId}
                  key={51}
                  position={51}
                  coins={absolutePositions[51]}
                />
                <Cell
                  gameId={gameId}
                  key={50}
                  position={50}
                  coins={absolutePositions[50]}
                />
                <Cell
                  gameId={gameId}
                  key={49}
                  position={49}
                  coins={absolutePositions[49]}
                />
              </div>
            </div>

            {/* blue color box */}
            <CoinBox gameId={gameId} color={3} coins={negativePositions[3]} />
          </div>
        </div>

        <div className="flex flex-col gap-96">
          <Dice
            gameId={gameId}
            color={2}
            playerId={playerIdMap[2]}
            visible={playerIdMap[2] === playerTurnId}
          />
          <Dice
            gameId={gameId}
            color={3}
            playerId={playerIdMap[3]}
            visible={playerIdMap[3] === playerTurnId}
          />
        </div>

        {/* <button
          className="font-Poppins border border-black"
          onClick={getBoardState}
        >
          Load Game State
        </button> */}
        {/* <p className="font-Poppins">{playerTurnId}</p> */}
      </div>
    </BoardStateContext.Provider>
  );
};

export default Board;
