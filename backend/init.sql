CREATE SCHEMA ludo;
    CREATE TABLE ludo.user (
        id BIGSERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(50) NOT NULL,
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

        CONSTRAINT fk_player_id FOREIGN KEY(player_id) REFERENCES ludo.player(id) ON DELETE CASCADE
    );

    CREATE TABLE ludo.coin_state (
        id BIGSERIAL PRIMARY KEY NOT NULL,
        color VARCHAR(10) NOT NULL,
        player_id BIGINT NOT NULL,
        position SMALLINT NOT NULL,
        
        CONSTRAINT fk_player_id FOREIGN KEY(player_id) REFERENCES ludo.player(id),
        CONSTRAINT check_color CHECK (color IN ('RED', 'GREEN', 'YELLOW', 'BLUE'))
    );
