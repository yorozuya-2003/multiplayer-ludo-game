const pool = require("../db");

const colors = ["RED", "GREEN", "YELLOW", "BLUE"];

const create_game = async (req, res) => {
  try {
    const userId = req.headers.user_id;
    const availableGames = await pool.query(
      "SELECT * FROM ludo.game WHERE status='WAITING_FOR_PLAYERS' ORDER BY created_on DESC"
    );

    let game;

    // creating game if no active game found
    if (availableGames.rowCount === 0) {
      const createdGame = await pool.query(
        "INSERT INTO ludo.game (created_on, created_by, status) VALUES ($1, $2, $3) RETURNING *",
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

    const players = await pool.query(
      "INSERT INTO ludo.player (game_id, user_id, status) VALUES ($1, $2, $3) RETURNING id",
      [gameId, userId, "IN_GAME"]
    );
    let playerId = players.rows[0].id;

    // setting correct data type for player-id
    playerId = parseInt(playerId);

    let countPlayers = await pool.query(
      "SELECT COUNT(id) FROM ludo.player WHERE game_id=$1",
      [gameId]
    );
    countPlayers = countPlayers.rows[0].count;

    // populating coin state
    if (1 <= countPlayers <= 4) {
      const playerColor = colors[countPlayers - 1];

      for (let ctr = 0; ctr < 4; ctr++) {
        await pool.query(
          "INSERT INTO ludo.coin_state (color, player_id, position) VALUES ($1, $2, $3)",
          [playerColor, playerId, -1]
        );
      }
    }

    // populate player turn (assigning first turn to game creator)
    if (countPlayers === 1) {
      await pool.query(
        "INSERT INTO ludo.player_turn (game_id, player_id) VALUES ($1, $2)",
        [gameId, playerId]
      );
    }

    // four players have joined; update game status
    if (countPlayers === 4) {
      await pool.query(
        "UPDATE ludo.game SET status='IN_PROGRESS' WHERE id=$1",
        [gameId]
      );
    }

    res.status(201).json(game);
  } catch (error) {
    console.error("Error in creating/joining the game:", error);
    res.status(500).json({ error: error });
  }
};

module.exports = { create_game };
