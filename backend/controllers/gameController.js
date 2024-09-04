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
      "SELECT * FROM game WHERE status='WAITING_FOR_PLAYERS' ORDER BY created_on DESC"
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

    const gameData = await client.query("SELECT * FROM game WHERE id = $1", [
      gameId,
    ]);

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
  try {
    const gameId = parseInt(req.headers.game_id);
    const coinStates = await pool.query(
      "SELECT coin_state.id, coin_state.color, coin_state.position, coin_state.player_id FROM coin_state JOIN player ON coin_state.player_id = player.id WHERE player.game_id = $1",
      [gameId]
    );

    // checking if game has ended
    const finishPlayerCount = await pool.query("SELECT COUNT(id) FROM player WHERE game_id = $1 AND status = 'FINISHED'", [gameId]);
    const gameHasEnded = (finishPlayerCount.rows[0].count === 3);

    // if game has ended: dropping game from player-turn table
    if (gameHasEnded) {
      await pool.query("DELETE from player_turn where game_id = $1", [
        gameId,
      ]);
    }

    const coinStateData = coinStates.rows;
    res.status(200).json({ board_state: coinStateData, game_has_ended: gameHasEnded });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const roll_dice = async (req, res) => {
  try {
    const gameId = req.headers.game_id;
    const playerId = req.headers.player_id;

    // checking if game has ended
    const playerTurn = await pool.query(
      "SELECT COUNT(id) FROM player_turn WHERE game_id = $1",
      [gameId]
    );

    const gameHasEnded = playerTurn.rows[0].count === 0;

    // if game has not ended
    if (!gameHasEnded) {
      // generating random number from 1 to 6
      const diceValue = Math.floor(Math.random() * 6) + 1;

      // checking if any moves possible (coin-position + dice-value <= 56)
      const value = 56 - diceValue;

      let moveableCoins;
      if (diceValue === 6) {
        moveableCoins = await pool.query(
          "SELECT COUNT(id) FROM coin_state WHERE player_id = $1 AND position <= $2",
          [playerId, value]
        );
      } else {
        moveableCoins = await pool.query(
          "SELECT COUNT(id) FROM coin_state WHERE player_id = $1 AND position <= $2 AND position <> -1",
          [playerId, value]
        );
      }
      const countMoveableCoins = moveableCoins.rows[0].count;
      const cannotMove = countMoveableCoins === 0;

      // if no move possible; update player turn
      if (cannotMove) {
        // getting unfinished players (as well as current player in order)
        const unfinishedPlayers = await pool.query(
          "SELECT * FROM player WHERE (game_id = $1 AND status = 'IN_GAME') OR player_id = $2 ORDER BY id",
          [gameId, playerId]
        );
        const unfinishedPlayersOrder = unfinishedPlayers.rows.map(
          (row) => row.id
        );
        let nextTurnPlayerId = null;
        if (unfinishedPlayersOrder.length !== 1) {
          const nextPlayerIndex = unfinishedPlayersOrder.indexOf(playerId) + 1;
          nextTurnPlayerId = unfinishedPlayersOrder[nextPlayerIndex];
        }
        
        if (nextTurnPlayerId) await pool.query("UPDATE player_turn SET player_id = $1 WHERE game_id = $2", [nextTurnPlayerId, gameId]);
      }
      res.status(200).json({
        game_has_ended: false,
        dice_value: diceValue,
        moves_possible: !cannotMove,
      });
    } else {
      res.status(200).json({
        game_has_ended: true,
      });
    }
  } catch (error) {
    console.error("Error in rolling the game:", error);
    res.status(500).json({ error: error });
  }
};

const move_coin = async (req, res) => {
  try {
    const coinId = req.headers.coin_id;
    const coinColor = req.headers.coin_color;
    const playerId = req.headers.player_id;
    const gameId = req.headers.game_id;
    const diceValue = req.headers.dice_value;

    // checking if the requested coin can move or not

    let coinPosition = await pool.query(
      "SELECT position FROM coin_state WHERE coin_id = $1",
      [coinId]
    );
    coinPosition = coinPosition.rows[0].position;

    if (
      (coinPosition !== -1 && coinPosition + diceValue <= 56) |
      (coinPosition === -1 && diceValue === 6)
    ) {
      coinPosition += diceValue;

      // updating position in coin state
      await pool.query(
        "UPDATE coin_state SET position = $1 WHERE coin_id = $2",
        [coinPosition, coinId]
      );

      // getting unfinished players (as well as current player in order)
      const unfinishedPlayers = await pool.query(
        "SELECT * FROM player WHERE (game_id = $1 AND status = 'IN_GAME') OR player_id = $2 ORDER BY id",
        [gameId, playerId]
      );
      const unfinishedPlayersOrder = unfinishedPlayers.rows.map(
        (row) => row.id
      );
      let nextTurnPlayerId = null;
      if (unfinishedPlayersOrder.length !== 1) {
        const nextPlayerIndex = unfinishedPlayersOrder.indexOf(playerId) + 1;
        nextTurnPlayerId = unfinishedPlayersOrder[nextPlayerIndex];
      }

      // coin reaches home
      if (coinPosition === 56) {
        let countHome = await pool.query(
          "SELECT COUNT(id) FROM coin_state where player_id = $1 and position = 56",
          [playerId]
        );
        countHome = countHome.rows[0].count;
        // if all coins reach home
        if (countHome === 4) {
          // update player finish status
          await pool.query(
            "UPDATE player SET status = $1, finished_ts = $2, WHERE id = $3",
            ["FINISHED", Date.now(), playerId]
          );
          
          // update next player's turn
          if (nextTurnPlayerId !== null) {
            await pool.query("UPDATE player_turn SET player_id = $1 where game_id = $1", [nextTurnPlayerId, gameId]);
          }
        }
        // otherwise no change in player turn
      
      // coin does not reach home
      } else {
        const absoluteCoinPosition = (coinPosition + 13 * coinColor) % 52;
        const cut = await pool.query(
          "SELECT * FROM coin_state JOIN player ON coin_state.player_id = player.id WHERE (coin_state.position + 13 * coin_state.color) % 52 = $1 AND coin_state.id != $2",
          [absoluteCoinPosition, coinId]
        );
        const hasCut = cut.rowCount !== 0;
        // if new coin position is among the safe positions
        if (!safePositions.has(coinPosition) && hasCut) {
          const cutCoinId = cut.rows[0].id;
          // set the cut coin position to -1
          await pool.query(
            "UPDATE coin_state SET position = -1 WHERE id = $1",
            [cutCoinId]
          );
          // otherwise no change in turn

        } else if (diceValue !== 6) {
          // next player's turn update
          if (nextTurnPlayerId !== null) {
            await pool.query("UPDATE player_turn SET player_id = $1 where game_id = $1", [nextTurnPlayerId, gameId]);
          } 
        }
      }

      // ? return board state

      res.status(200).json({ can_move: true });
    } else {
      res.status(200).json({ can_move: false });
    }
  } catch (error) {
    console.error("Error in rolling the game:", error);
    res.status(500).json({ error: error });
  }
};

module.exports = { create_game, get_game_state, roll_dice, move_coin };
