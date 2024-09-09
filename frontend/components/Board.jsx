import { useState } from "react";
import axios from "axios";

import Cell from "./Cell";
import CoinBox from "./CoinBox";
import Centre from "./Centre";

import API_URL from "./Config";

const Board = () => {
  let positions = [];
  for (let ctr = 0; ctr < 52; ctr++) {
    positions.push(ctr);
  }
  positions = positions.concat([
    151, 152, 153, 154, 155, 251, 252, 253, 254, 255, 351, 352, 353, 354, 355,
    451, 452, 453, 454, 455,
  ]);

  let absolutePositionMapping = {};
  for (let ctr = 0; ctr < positions.length; ctr++) {
    absolutePositionMapping[positions[ctr]] = [];
  }

  let negativePositionMapping = { 0: [], 1: [], 2: [], 3: [] };

  const [absolutePositions, setAbsolutePositions] = useState(
    absolutePositionMapping
  );
  const [negativePositions, setNegativePositions] = useState(
    negativePositionMapping
  );
  const [playerTurnId, setPlayerTurnId] = useState("");

  const getBoardState = () => {
    const gameId = 2;
    const url = `${API_URL}/games/state`;

    axios
      .get(url, {
        headers: { "Content-Type": "application/json", game_id: gameId },
      })
      .then((response) => {
        handlePositionMapping(response.data.board_state);
        setPlayerTurnId(response.data.player_turn_id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePositionMapping = (coinStateData) => {
    let coinStates = coinStateData.map((coinState) => {
      let absolutePosition = -1;

      if ((coinState.position === -1) | (coinState.position === 56)) {
        absolutePosition = coinState.position;
      } else if (coinState.position <= 50) {
        absolutePosition = (coinState.position + coinState.color * 13) % 52;
      } else if (coinState.position > 50) {
        absolutePosition = coinState.position + 100 * (coinState.color + 1);
      }

      return {
        id: coinState.id,
        color: coinState.color,
        position: absolutePosition,
      };
    });

    let absolutePositionMapping = {};
    for (let ctr = 0; ctr < positions.length; ctr++) {
      absolutePositionMapping[positions[ctr]] = [];
    }

    let negativePositionMapping = { 0: [], 1: [], 2: [], 3: [] };

    for (let ctr = 0; ctr < coinStates.length; ctr++) {
      const absolutePosition = coinStates[ctr].position;
      if (absolutePosition === -1) {
        negativePositionMapping[coinStates[ctr].color].push(coinStates[ctr]);
      } else if (absolutePosition !== 56) {
        absolutePositionMapping[absolutePosition].push(coinStates[ctr]);
      }
    }

    setAbsolutePositions(absolutePositionMapping);
    setNegativePositions(negativePositionMapping);
  };

  return (
    <div>
      <button
        className="font-Poppins border border-black"
        onClick={getBoardState}
      >
        Load Game State
      </button>
      <p className="font-Poppins">{playerTurnId}</p>
      <div className="flex flex-row">
        {/* green color box */}
        <CoinBox color={1} coins={negativePositions[1]} />

        <div className="flex flex-col">
          <div className="flex flex-row">
            <Cell key={23} position={23} coins={absolutePositions[23]} />
            <Cell key={24} position={24} coins={absolutePositions[24]} />
            <Cell key={25} position={25} coins={absolutePositions[25]} />
          </div>
          <div className="flex flex-row">
            <Cell key={22} position={22} coins={absolutePositions[22]} />
            <Cell
              key={351}
              position={351}
              cellColor={2}
              coins={absolutePositions[351]}
            />
            <Cell
              key={26}
              position={26}
              cellColor={2}
              coins={absolutePositions[26]}
            />
          </div>
          <div className="flex flex-row">
            <Cell key={21} position={21} coins={absolutePositions[21]} />
            <Cell
              key={352}
              position={352}
              cellColor={2}
              coins={absolutePositions[352]}
            />
            <Cell key={27} position={27} coins={absolutePositions[27]} />
          </div>
          <div className="flex flex-row">
            <Cell key={20} position={20} coins={absolutePositions[20]} />
            <Cell
              key={353}
              position={353}
              cellColor={2}
              coins={absolutePositions[353]}
            />
            <Cell key={28} position={28} coins={absolutePositions[28]} />
          </div>
          <div className="flex flex-row">
            <Cell key={19} position={19} coins={absolutePositions[19]} />
            <Cell
              key={354}
              position={354}
              cellColor={2}
              coins={absolutePositions[354]}
            />
            <Cell key={29} position={29} coins={absolutePositions[29]} />
          </div>
          <div className="flex flex-row">
            <Cell key={18} position={18} coins={absolutePositions[18]} />
            <Cell
              key={355}
              position={355}
              cellColor={2}
              coins={absolutePositions[355]}
            />
            <Cell key={30} position={30} coins={absolutePositions[30]} />
          </div>
        </div>

        {/* yellow color box */}
        <CoinBox color={2} coins={negativePositions[2]} />
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <Cell key={12} position={12} coins={absolutePositions[12]} />
            <Cell
              key={13}
              position={13}
              cellColor={1}
              coins={absolutePositions[13]}
            />
            <Cell key={14} position={14} coins={absolutePositions[14]} />
            <Cell key={15} position={15} coins={absolutePositions[15]} />
            <Cell key={16} position={16} coins={absolutePositions[16]} />
            <Cell key={17} position={17} coins={absolutePositions[17]} />
          </div>
          <div className="flex flex-row">
            <Cell key={11} position={11} coins={absolutePositions[11]} />
            <Cell
              key={251}
              position={251}
              cellColor={1}
              coins={absolutePositions[251]}
            />
            <Cell
              key={252}
              position={252}
              cellColor={1}
              coins={absolutePositions[252]}
            />
            <Cell
              key={253}
              position={253}
              cellColor={1}
              coins={absolutePositions[253]}
            />
            <Cell
              key={254}
              position={254}
              cellColor={1}
              coins={absolutePositions[254]}
            />
            <Cell
              key={255}
              position={255}
              cellColor={1}
              coins={absolutePositions[255]}
            />
          </div>
          <div className="flex flex-row">
            <Cell key={10} position={10} coins={absolutePositions[10]} />
            <Cell key={9} position={9} coins={absolutePositions[9]} />
            <Cell key={8} position={8} coins={absolutePositions[8]} />
            <Cell key={7} position={7} coins={absolutePositions[7]} />
            <Cell key={6} position={6} coins={absolutePositions[6]} />
            <Cell key={5} position={5} coins={absolutePositions[5]} />
          </div>
        </div>

        {/* home */}
        <Centre />

        {/* */}
        <div className="flex flex-col">
          <div className="flex flex-row">
            <Cell key={31} position={31} coins={absolutePositions[31]} />
            <Cell key={32} position={32} coins={absolutePositions[32]} />
            <Cell key={33} position={33} coins={absolutePositions[33]} />
            <Cell key={34} position={34} coins={absolutePositions[34]} />
            <Cell key={35} position={35} coins={absolutePositions[35]} />
            <Cell key={36} position={36} coins={absolutePositions[36]} />
          </div>
          <div className="flex flex-row">
            <Cell
              key={455}
              position={455}
              cellColor={3}
              coins={absolutePositions[455]}
            />
            <Cell
              key={454}
              position={454}
              cellColor={3}
              coins={absolutePositions[454]}
            />
            <Cell
              key={453}
              position={453}
              cellColor={3}
              coins={absolutePositions[453]}
            />
            <Cell
              key={452}
              position={452}
              cellColor={3}
              coins={absolutePositions[452]}
            />
            <Cell
              key={451}
              position={451}
              cellColor={3}
              coins={absolutePositions[451]}
            />
            <Cell key={37} position={37} coins={absolutePositions[37]} />
          </div>
          <div className="flex flex-row">
            <Cell key={43} position={43} coins={absolutePositions[43]} />
            <Cell key={42} position={42} coins={absolutePositions[42]} />
            <Cell key={41} position={41} coins={absolutePositions[41]} />
            <Cell key={40} position={40} coins={absolutePositions[40]} />
            <Cell
              key={39}
              position={39}
              cellColor={3}
              coins={absolutePositions[39]}
            />
            <Cell key={38} position={38} coins={absolutePositions[38]} />
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        {/* red color box */}
        <CoinBox color={0} coins={negativePositions[0]} />

        <div className="flex flex-col">
          <div className="flex flex-row">
            <Cell key={4} position={4} coins={absolutePositions[4]} />
            <Cell
              key={155}
              position={155}
              cellColor={0}
              coins={absolutePositions[155]}
            />
            <Cell key={44} position={44} coins={absolutePositions[44]} />
          </div>
          <div className="flex flex-row">
            <Cell key={3} position={3} coins={absolutePositions[3]} />
            <Cell
              key={154}
              position={154}
              cellColor={0}
              coins={absolutePositions[154]}
            />
            <Cell key={45} position={45} coins={absolutePositions[45]} />
          </div>
          <div className="flex flex-row">
            <Cell key={2} position={2} coins={absolutePositions[2]} />
            <Cell
              key={153}
              position={153}
              cellColor={0}
              coins={absolutePositions[153]}
            />
            <Cell key={46} position={46} coins={absolutePositions[46]} />
          </div>
          <div className="flex flex-row">
            <Cell key={1} position={1} coins={absolutePositions[1]} />
            <Cell
              key={152}
              position={152}
              cellColor={0}
              coins={absolutePositions[152]}
            />
            <Cell key={47} position={47} coins={absolutePositions[47]} />
          </div>
          <div className="flex flex-row">
            <Cell
              key={0}
              position={0}
              cellColor={0}
              coins={absolutePositions[0]}
            />
            <Cell
              key={151}
              position={151}
              cellColor={0}
              coins={absolutePositions[151]}
            />
            <Cell key={48} position={48} coins={absolutePositions[48]} />
          </div>
          <div className="flex flex-row">
            <Cell key={51} position={51} coins={absolutePositions[51]} />
            <Cell key={50} position={50} coins={absolutePositions[50]} />
            <Cell key={49} position={49} coins={absolutePositions[49]} />
          </div>
        </div>

        {/* blue color box */}
        <CoinBox color={3} coins={negativePositions[3]} />
      </div>
    </div>
  );
};

export default Board;
