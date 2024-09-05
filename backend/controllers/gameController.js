const pool = require("../db");

// const colors = ["RED", "GREEN", "YELLOW", "BLUE"];
const colors = [0, 1, 2, 3];
// safe positions on board without including home
const safePositions = new Set([
  0, 13, 26, 39, 8, 21, 34, 47, 51, 52, 53, 54, 55,
]);

const create_game = async (req, res) => {
  const userId = req.headers.user_id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const availableGames = await client.query(
      "SELECT * FROM game WHERE status='WAITING_FOR_PLAYERS' ORDER BY created_on DESC LIMIT 1"
    );

    let game;

    // creating game if no active game found
    if (availableGames.rowCount === 0) {
      const createdGame = await client.query(
        "INSERT INTO game (created_on, created_by, status) VALUES ($1, $2, $3) RETURNING *",
        [Date.now(), userId, "WAITING_FOR_PLAYERS"]
      );
      game = createdGame.rows[0];
    }

    // otherwise joining active game with less than 4 players available
    else {
      game = availableGames.rows[0];
    }

    // setting correct data type for game-id
    const gameId = parseInt(game.id);

    const players = await client.query(
      "INSERT INTO player (game_id, user_id, status) VALUES ($1, $2, $3) RETURNING id",
      [gameId, userId, "IN_GAME"]
    );
    let playerId = players.rows[0].id;

    // setting correct data type for player-id
    playerId = parseInt(playerId);

    let countPlayers = await client.query(
      "SELECT COUNT(id) FROM player WHERE game_id = $1",
      [gameId]
    );
    countPlayers = parseInt(countPlayers.rows[0].count);

    // populating coin state
    if (1 <= countPlayers <= 4) {
      const playerColor = colors[countPlayers - 1];

      for (let ctr = 0; ctr < 4; ctr++) {
        await client.query(
          "INSERT INTO coin_state (color, player_id, position) VALUES ($1, $2, $3)",
          [playerColor, playerId, -1]
        );
      }
    }

    // populate player turn (assigning first turn to game creator)
    if (countPlayers === 1) {
      await client.query(
        "INSERT INTO player_turn (game_id, player_id) VALUES ($1, $2)",
        [gameId, playerId]
      );
    }

    // four players have joined; update game status
    if (countPlayers === 4) {
      await client.query("UPDATE game SET status='IN_PROGRESS' WHERE id = $1", [
        gameId,
      ]);
    }

    const gameData = await client.query(
      "SELECT * FROM game WHERE id = $1 LIMIT 16",
      [gameId]
    );

    await client.query("COMMIT");
    res.status(201).json(gameData.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in creating/joining the game:", error);
    res.status(500).json({ error: error });
  } finally {
    client.release();
  }
};

const get_game_state = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const gameId = parseInt(req.headers.game_id);

    // checking if game has not started
    const gameStatus = await client.query(
      "SELECT status FROM game WHERE id = $1 LIMIT 1",
      [gameId]
    );

    // checking if requested game-id exists
    if (gameStatus.rowCount === 0) {
      await client.query("ROLLBACK");
      const error = "requested game-id does not exist.";
      console.error(error);
      res.status(500).json({ error: error });
      return;
    }

    if (gameStatus.rows[0].status === "WAITING_FOR_PLAYERS") {
      await client.query("ROLLBACK");
      const error = "requested game-id has not started.";
      console.error(error);
      res.status(500).json({ error: error });
      return;
    }

    // getting player-turn
    const playerTurn = await client.query(
      "SELECT player_id FROM player_turn WHERE game_id = $1",
      [gameId]
    );
    if (playerTurn.rowCount === 0) {
      await client.query("ROLLBACK");
      const error = "player-id does not exist in the player-turn table for the requested game-id.";
      console.error(error);
      res.status(500).json({ error: error });
      return;
    }
    const playerTurnId = playerTurn.rows[0].player_id;

    // checking if game has finished
    const finishPlayerCount = await client.query(
      "SELECT COUNT(id) FROM player WHERE game_id = $1 AND status = 'FINISHED' LIMIT 4",
      [gameId]
    );
    const gameHasEnded = finishPlayerCount.rows[0].count === 3;

    // if game has finished
    if (gameHasEnded) {
      // dropping game from player-turn table
      await client.query("DELETE from player_turn where game_id = $1", [
        gameId,
      ]);

      // updating game status
      await client.query(
        "UPDATE game SET status = 'FINISHED' where game_id = $1",
        [gameId]
      );

      // updating finish-timestamp for the last player
      await client.query(
        "UPDATE player SET status = 'FINISHED' where game_id = $1 and status <> 'FINISHED'",
        [gameId]
      );
      res.status(200).json({
        board_state: null,
        game_has_ended: gameHasEnded,
        player_turn_id: null,
      });
    }

    const coinStates = await client.query(
      "SELECT coin_state.id, coin_state.color, coin_state.position, coin_state.player_id FROM coin_state JOIN player ON coin_state.player_id = player.id WHERE player.game_id = $1 LIMIT 16",
      [gameId]
    );
    const coinStateData = coinStates.rows;

    await client.query("COMMIT");
    res.status(200).json({
      board_state: coinStateData,
      game_has_ended: gameHasEnded,
      player_turn_id: playerTurnId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in getting the game state:", error);
    res.status(500).json({ error: error });
  } finally {
    client.release();
  }
};

const roll_dice = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const gameId = req.headers.game_id;

    // checking if game has not started
    const gameStatus = await client.query(
      "SELECT status FROM game WHERE id = $1 LIMIT 1",
      [gameId]
    );

    // checking if requested game-id exists
    if (gameStatus.rowCount === 0) {
      await client.query("ROLLBACK");
      const error = "requested game-id does not exist.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    if (gameStatus.rows[0].status === "WAITING_FOR_PLAYERS") {
      await client.query("ROLLBACK");
      const error = "requested game-id has not started.";
      console.error(error);
      res.status(500).json({ error: error });
      return;
    }

    const gameHasEnded = gameStatus.rows[0].status === "FINISHED";

    // checking if game has finished
    if (gameHasEnded) {
      await client.query("COMMIT");
      res.status(200).json({
        game_has_ended: true,
      });
      return;
    }

    // get player-id and dice-value from player-turn table directly
    const playerTurn = await client.query(
      "SELECT player_id, dice FROM player_turn WHERE game_id = $1",
      [gameId]
    );

    // checking if previous turn player had moved their coin
    if (playerTurn.rows[0].dice !== 0) {
      await client.query("ROLLBACK");
      const error = "Previous player did not move their coin.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    // checking if player-id in request header matches player-id in player-turn
    const playerId = playerTurn.rows[0].player_id;
    const reqPlayerId = req.headers.player_id;

    if (playerId !== reqPlayerId) {
      await client.query("ROLLBACK");
      const error =
        "player-id in player-turn table does not match the player-id in request header.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    // generating random number from 1 to 6
    const diceValue = Math.floor(Math.random() * 6) + 1;

    // checking if any moves possible (coin-position + dice-value <= 56)
    const value = 56 - diceValue;

    let moveableCoins;
    if (diceValue === 6) {
      moveableCoins = await client.query(
        "SELECT COUNT(id) FROM coin_state WHERE player_id = $1 AND position <= $2 AND position <> 56 LIMIT 4",
        [playerId, value]
      );
    } else {
      moveableCoins = await client.query(
        "SELECT COUNT(id) FROM coin_state WHERE player_id = $1 AND position <= $2 AND position <> -1 AND position <> 56 LIMIT 4",
        [playerId, value]
      );
    }
    const countMoveableCoins = parseInt(moveableCoins.rows[0].count);
    const cannotMove = countMoveableCoins === 0;

    // if no move possible; update player turn
    if (cannotMove) {
      // getting unfinished players (as well as current player in order)
      const unfinishedPlayers = await client.query(
        "SELECT id FROM player WHERE game_id = $1 AND status = 'IN_GAME' ORDER BY id LIMIT 4",
        [gameId]
      );
      const unfinishedPlayersOrder = unfinishedPlayers.rows.map(
        (row) => row.id
      );
      let nextTurnPlayerId = null;
      const numPlayers = unfinishedPlayersOrder.length;
      if (numPlayers !== 1) {
        const nextPlayerIndex =
          (unfinishedPlayersOrder.indexOf(playerId) + 1) % numPlayers;
        nextTurnPlayerId = unfinishedPlayersOrder[nextPlayerIndex];
      }

      if (nextTurnPlayerId)
        await client.query(
          "UPDATE player_turn SET player_id = $1, dice = 0 WHERE game_id = $2",
          [nextTurnPlayerId, gameId]
        );
    } else {
      // update dice value in player-turn table
      await client.query(
        "UPDATE player_turn SET player_id = $1, dice = $2 WHERE game_id = $3",
        [playerId, diceValue, gameId]
      );
    }

    await client.query("COMMIT");
    res.status(200).json({
      game_has_ended: false,
      dice_value: diceValue,
      moves_possible: !cannotMove,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in rolling the dice:", error);
    res.status(500).json({ error: error });
  } finally {
    client.release();
  }
};

const move_coin = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const coinId = req.headers.coin_id;
    const gameId = req.headers.game_id;

    const coinData = await client.query(
      "SELECT color, player_id FROM coin_state WHERE id = $1 LIMIT 1",
      [coinId]
    );

    // checking if requested coin-id is valid
    if (coinData.rowCount === 0) {
      await client.query("ROLLBACK");
      const error = "requested coin-id is invalid.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    const coinColor = coinData.rows[0].color;
    const playerId = parseInt(coinData.rows[0].player_id);

    const playerTurn = await client.query(
      "SELECT dice, player_id from player_turn where game_id = $1",
      [gameId]
    );

    // checking if game-id exists or not
    if (playerTurn.rowCount === 0) {
      await client.query("ROLLBACK");
      const error = "requested game-id does not exist.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    const diceValue = playerTurn.rows[0].dice;

    // check if the current player rolled the dice
    if (diceValue === 0) {
      await client.query("ROLLBACK");
      const error = "previous player did not roll the dice.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    // checking if requested coin id belongs to player in player-turn
    if (playerId !== parseInt(playerTurn.rows[0].player_id)) {
      await client.query("ROLLBACK");
      const error =
        "coin-id in request header does not belong to player-id in player-turn table.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    // checking if the requested coin can move or not

    let coinPosition = await client.query(
      "SELECT position FROM coin_state WHERE id = $1 LIMIT 1",
      [coinId]
    );
    coinPosition = coinPosition.rows[0].position;

    if (
      (coinPosition !== -1 && coinPosition + diceValue <= 56) |
      (coinPosition === -1 && diceValue === 6)
    ) {
      coinPosition = coinPosition === -1 ? 0 : coinPosition + diceValue;

      // updating position in coin state
      await client.query("UPDATE coin_state SET position = $1 WHERE id = $2", [
        coinPosition,
        coinId,
      ]);

      // getting unfinished players (as well as current player in order)
      const unfinishedPlayers = await client.query(
        "SELECT id FROM player WHERE game_id = $1 AND status = 'IN_GAME' ORDER BY id LIMIT 4",
        [gameId]
      );
      const unfinishedPlayersOrder = unfinishedPlayers.rows.map(
        (row) => row.id
      );
      let nextTurnPlayerId = null;
      const numPlayers = unfinishedPlayersOrder.length;
      if (numPlayers !== 1) {
        const nextPlayerIndex =
          (unfinishedPlayersOrder.indexOf(playerId) + 1) % numPlayers;
        nextTurnPlayerId = unfinishedPlayersOrder[nextPlayerIndex];
      }

      // coin reaches home
      if (coinPosition === 56) {
        let countHome = await client.query(
          "SELECT COUNT(id) FROM coin_state where player_id = $1 and position = 56",
          [playerId]
        );
        countHome = countHome.rows[0].count;
        // if all coins reach home
        if (countHome === 4) {
          // update player finish status
          await client.query(
            "UPDATE player SET status = $1, finished_ts = $2, WHERE id = $3",
            ["FINISHED", Date.now(), playerId]
          );

          // update next player's turn
          if (nextTurnPlayerId !== null) {
            await client.query(
              "UPDATE player_turn SET player_id = $1, dice = 0 where game_id = $1",
              [nextTurnPlayerId, gameId]
            );
          }
        }
        // otherwise no change in player turn but update dice-value in player-turn table
        await client.query(
          "UPDATE player_turn SET dice = 0 where game_id = $1",
          [gameId]
        );

        // coin does not reach home
      } else {
        const absoluteCoinPosition = (coinPosition + 13 * coinColor) % 52;
        const cut = await client.query(
          "SELECT * FROM coin_state JOIN player ON coin_state.player_id = player.id WHERE (coin_state.position + 13 * coin_state.color) % 52 = $1 AND coin_state.id != $2",
          [absoluteCoinPosition, coinId]
        );
        const hasCut = cut.rowCount !== 0;
        // if new coin position is not among the safe positions
        if (!safePositions.has(coinPosition) && hasCut) {
          const cutCoinId = cut.rows[0].id;
          // set the cut coin position to -1
          await client.query(
            "UPDATE coin_state SET position = -1 WHERE id = $1",
            [cutCoinId]
          );
        } else if (diceValue !== 6) {
          // next player's turn update
          if (nextTurnPlayerId !== null) {
            await client.query(
              "UPDATE player_turn SET player_id = $1, dice = 0 where game_id = $2",
              [nextTurnPlayerId, gameId]
            );
          }
        }

        // update dice value to 0 in player-turn table (indicating that player has moved)
        await client.query(
          "UPDATE player_turn SET dice = 0 where game_id = $1",
          [gameId]
        );
      }

      // getting board state
      const coinStates = await client.query(
        "SELECT coin_state.id, coin_state.color, coin_state.position, coin_state.player_id FROM coin_state JOIN player ON coin_state.player_id = player.id WHERE player.game_id = $1",
        [gameId]
      );
      const coinStateData = coinStates.rows;

      await client.query("COMMIT");
      res.status(200).json({ can_move: true, board_state: coinStateData });
    } else {
      await client.query("COMMIT");
      res.status(200).json({ can_move: false, board_state: null });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in moving the coin:", error);
    res.status(500).json({ error: error });
  } finally {
    client.release();
  }
};

const get_game_rankings = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const gameId = parseInt(req.headers.game_id);

    // checking if game has finished
    const gameStatus = await client.query(
      "SELECT status from game where id = $1 LIMIT 1",
      [gameId]
    );

    // checking if requested game-id exists or not
    if (gameStatus.rowCount === 0) {
      await client.query("ROLLBACK");
      const error = "requested game-id does not exist.";
      console.error(error);
      res.status(500).json({ error: error });
      return;
    }

    if (gameStatus.rows[0].status === "FINISHED") {
      const rankings = await client.query(
        "SELECT id FROM player where game_id = $1 ORDER_BY finished_ts LIMIT 4",
        [gameId]
      );
      res.status(200).json({ rankings: rankings.rows });
    }

    await client.query("COMMIT");
    res.status(200).json({ rankings: null });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in generating the game rankings: ", error);
    res.status(500).json({ error: error });
  } finally {
    client.release();
  }
};

module.exports = {
  create_game,
  get_game_state,
  roll_dice,
  move_coin,
  get_game_rankings,
};
