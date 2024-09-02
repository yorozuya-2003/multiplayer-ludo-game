CREATE TABLE game_user (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_on BIGINT NOT NULL
);

CREATE TABLE game (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    created_on BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,

    CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES game_user(id),
    CONSTRAINT check_status CHECK (status IN ('WAITING_FOR_PLAYERS', 'IN_PROGRESS', 'FINISHED'))
);

CREATE TABLE player (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    game_user_id BIGINT NOT NULL,
    game_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    finished_ts BIGINT,

    CONSTRAINT fk_game_user_id FOREIGN KEY(game_user_id) REFERENCES game_user(id),
    CONSTRAINT fk_game_id FOREIGN KEY(game_id) REFERENCES game(id),
    CONSTRAINT check_status  CHECK (status IN ('IN_GAME', 'FINISHED'))
);

CREATE TABLE player_turn (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    game_id BIGINT UNIQUE,
    player_id BIGINT NOT NULL,

    CONSTRAINT fk_player_id FOREIGN KEY(player_id) REFERENCES player(id) ON DELETE CASCADE
);

CREATE TABLE coin_state (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    color VARCHAR(10) NOT NULL,
    player_id BIGINT NOT NULL,
    position SMALLINT NOT NULL,
    
    CONSTRAINT fk_player_id FOREIGN KEY(player_id) REFERENCES player(id)
);
