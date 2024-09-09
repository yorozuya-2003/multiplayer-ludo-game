const coinColorMapping = {
  0: "red",
  1: "green",
  2: "yellow",
  3: "blue",
};

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

  return [absolutePositionMapping, negativePositionMapping];
};

export {
  absolutePositionMapping, coinColorMapping, handlePositionMapping, negativePositionMapping
};

