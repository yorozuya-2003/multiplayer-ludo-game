# Multi-Player Ludo Game
## Overview
A Ludo game created using React (Next.js) with Node.js and Express as backend, with PostgreSQL (dockerized) for database.

![ludo](https://github.com/user-attachments/assets/6b77ee52-df5a-489a-b8c2-0c0063d01453)
![auth](https://github.com/user-attachments/assets/4c18f4a8-a42e-4264-a35d-b14b20fbea40)


## Setup
### Prerequisites
Make sure you have the following installed on your machine:
- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/engine/install/)
- [Node.js](https://nodejs.org/en/download/package-manager)

### Steps
1. Clone the repository:
    ```sh
    git clone https://github.com/yorozuya-2003/multiplayer-ludo-game.git
    ```

2. Navigate to the cloned repository:
    ```sh
    cd multiplayer-ludo-game
    ```

3. **Backend Setup**
    - From the root directory of the cloned repository, navigate to the backend directory:
        ```sh
        cd backend
        ```

    - Start the PostgreSQL docker container:
        ```sh
        docker compose up -d
        ```

    - Install the npm dependencies:
        ```sh
        npm install
        ```

    - Start the backend server:
        ```sh
        npm run dev
        ```

4. **Frontend Setup**
    - From the root directory of the cloned repository, navigate to the frontend directory:
        ```sh
        cd frontend
        ```

    - Install the npm dependencies:
        ```sh
        npm install
        ```

    - Start the frontend application:
        ```sh
        npm run dev
        ```

5. **Accessing the game**:
    - Ensure that both the backend and frontend servers remain running in separate terminals.
    - Open a web browser and go to http://localhost:3000 to start playing the game.
