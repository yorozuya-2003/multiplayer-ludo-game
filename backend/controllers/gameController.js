const pool = require("../db");

const colors = ["red", "green", "yellow", "blue"];

const create_game = async (req, res) => {
  try {
    const { game_user_id } = req.body;
    const availableGames = await pool.query(
      "SELECT id FROM game WHERE status='WAITING_FOR_PLAYERS' ORDER BY created_on DESC"
    );

    let gameId;

    // checking if active game with less than 4 players available
    if (availableGames.rowCount != 0) {
      gameId = availableGames.rows[0].id;
    }
    
    // creating game if no active game found
    else {
      const game = await pool.query(
        "INSERT INTO game (created_on, created_by, status) VALUES ($1, $2, $3) RETURNING id",
        [Date.now(), game_user_id, "WAITING_FOR_PLAYERS"]
      )
      gameId = game.rows[0].id;
    }

    // setting correct data type for game-id
    gameId = parseInt(gameId);

    const players = await pool.query(
      "INSERT INTO player (game_id, game_user_id, status) VALUES ($1, $2, $3) RETURNING id",
      [gameId, game_user_id, "IN_GAME"]
    );
    let playerId = players.rows[0].id;

    // setting correct data type for player-id
    playerId = parseInt(playerId);

    let countPlayers = await pool.query(
      "SELECT COUNT(id) FROM player WHERE game_id=$1",
      [gameId]
    );
    countPlayers = countPlayers.rows[0].count;

    // populating coin state
    if (1 <= countPlayers <= 4) {
      const playerColor = colors[countPlayers - 1];

      for (let each = 0; each < 4; each++) {
        await pool.query(
          "INSERT INTO coin_state (color, player_id, position) VALUES ($1, $2, $3)",
          [playerColor, playerId, -1]
        );
      }
    }

    // populate player turn (assigning first turn to game creator)
    if (countPlayers == 1) {
      await pool.query(
        "INSERT INTO player_turn (game_id, player_id) VALUES ($1, $2)",
        [gameId, playerId]
      );
    }

    // four players have joined
    else if (countPlayers == 4) {
      // update game status
      await pool.query(
        "UPDATE game SET status='IN_PROGRESS' WHERE id=$1",
        [gameId]
      );
    }

    res.status(201).json({ message: "created game." });

  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports = { create_game };
