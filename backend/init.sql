CREATE SCHEMA ludo;

    CREATE TABLE ludo.user (
        id BIGSERIAL PRIMARY KEY NOT NULL,
        username VARCHAR(50) UNIQUE,
        password VARCHAR(100) NOT NULL,
        created_on BIGINT NOT NULL
    );

    CREATE TABLE ludo.game (
        id BIGSERIAL PRIMARY KEY NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_on BIGINT NOT NULL,
        created_by BIGINT NOT NULL,

        CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES ludo.user(id),
        CONSTRAINT check_status CHECK (status IN ('WAITING_FOR_PLAYERS', 'IN_PROGRESS', 'FINISHED'))
    );

    CREATE TABLE ludo.player (
        id BIGSERIAL PRIMARY KEY NOT NULL,
        user_id BIGINT NOT NULL,
        game_id BIGINT NOT NULL,
        status VARCHAR(50) NOT NULL,
        finished_ts BIGINT,

        CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES ludo.user(id),
        CONSTRAINT fk_game_id FOREIGN KEY(game_id) REFERENCES ludo.game(id),
        CONSTRAINT check_status  CHECK (status IN ('IN_GAME', 'FINISHED')),
        CONSTRAINT check_finished_ts CHECK (
            (status = 'FINISHED' AND finished_ts IS NOT NULL) OR 
            (status != 'FINISHED' AND finished_ts IS NULL)
        )
    );

    CREATE TABLE ludo.player_turn (
        id BIGSERIAL PRIMARY KEY NOT NULL,
        game_id BIGINT UNIQUE,
        player_id BIGINT NOT NULL,
        dice SMALLINT NOT NULL DEFAULT 0,

        CONSTRAINT fk_player_id FOREIGN KEY(player_id) REFERENCES ludo.player(id) ON DELETE CASCADE,
        CONSTRAINT check_dice CHECK (dice in (0, 1, 2, 3, 4, 5, 6))
    );

    CREATE TABLE ludo.coin_state (
        id BIGSERIAL PRIMARY KEY NOT NULL,
        -- color VARCHAR(10) NOT NULL,
        color SMALLINT NOT NULL,
        player_id BIGINT NOT NULL,
        position SMALLINT NOT NULL,
        
        CONSTRAINT fk_player_id FOREIGN KEY(player_id) REFERENCES ludo.player(id),
        -- CONSTRAINT check_color CHECK (color IN ('RED', 'GREEN', 'YELLOW', 'BLUE'))
        CONSTRAINT check_color CHECK (color IN (0, 1, 2, 3)),
        CONSTRAINT check_position CHECK (position >= -1 AND position <= 56)
    );

ALTER DATABASE girman SET search_path TO ludo;

CREATE INDEX idx_game_status on ludo.game(status);
