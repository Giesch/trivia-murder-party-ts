import p5 from "p5";
import { PLAYER_1, PLAYER_2, SYSTEM } from "@rcade/plugin-input-classic";
import triviaQuestions from "./data/trivia.json";

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;

const gameState = {
    lastFrame: [
        {},
        {}
    ],
    // the indexes of the players' currently selected answers, by player index
    selectedAnswers: [0, 0],
    // the two players' scores, by player index
    playerScores: [0, 0],
    question: triviaQuestions[0].question,
    correctAnswer: triviaQuestions[0].correct_answer,
    answersArray: [
        triviaQuestions[0].correct_answer,
        ...triviaQuestions[0].incorrect_answers,
    ],
    started: false,
    colors: ['rgb(0, 0, 255)', 'rgb(255, 0, 0)'],

    interval: null,
    secondsRemaining: 10,
};

let countdown: number | null = null;

// TODO regenerate game timer text each frame with p5
function startCountdown() {
    clearInterval(countdown as any);

    gameState.secondsRemaining = 10;
    // gameTimer.textContent = gameState.secondsRemaining;

    countdown = setInterval(() => {
        gameState.secondsRemaining--;
        // gameTimer.textContent = gameState.secondsRemaining;

        if (gameState.secondsRemaining <= 0) {
            clearInterval(countdown as any);
            checkScore();

            // let p1 = gameState.playerScores[0];
            // let p2 = gameState.playerScores[1];
            // gameTimer.textContent = `Time's up! P1: ${p1}, P2: ${p2}`;
        }
    }, 1000);
}

function checkScore() {
    for (
        let playerId = 0;
        playerId < gameState.selectedAnswers.length;
        playerId++
    ) {
        let playerAnswer =
            gameState.answersArray[gameState.selectedAnswers[playerId]];
        let playerCorrect = playerAnswer === gameState.correctAnswer;
        if (playerCorrect) {
            gameState.playerScores[playerId]++;
        }
    }
}

function setQuestion() {

    // TODO regenerate with p5 (this was writing to the question id element)
    // question.textContent = triviaQuestions[0].question;

    // TODO regenerate with p5
    // answers.innerHTML = gameState.answersArray
    //   .map(
    //     (answer, idx) => `<div class="answer" id="answer-${idx}">
    //          <span id="p1-dot"></span>
    //          <span id="p2-dot"></span>
    //          ${answer}
    //       </div>`,
    //   )
    //   .join("");
}

const sketch = (p: p5) => {
    let x: number;
    let y: number;
    const speed = 4;
    const ballSize = 10;

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        x = WIDTH / 2;
        y = HEIGHT / 2;
    };

    p.draw = () => {
        p.background(26, 26, 46);

        if (!gameState.started) {
            // Show start screen
            p.fill(255);
            p.textSize(18);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Trivia Murder Party", WIDTH / 2, HEIGHT / 2 - 30);
            p.text("Press 1P START", WIDTH / 2, HEIGHT / 2);
            p.textSize(12);
            p.text("Use D-PAD to move", WIDTH / 2, HEIGHT / 2 + 30);

            if (SYSTEM.ONE_PLAYER || SYSTEM.TWO_PLAYER) {
                gameState.started = true;
            }
            return;
        }

        playerInput(PLAYER_1, 0);
        playerInput(PLAYER_2, 1);

        const textHeight = 12;
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(textHeight);
        p.fill(255);
        p.text(gameState.question, 30, 30, WIDTH);
        p.fill(0, 0, 255);

        gameState.answersArray.forEach((ans, idx) => {
            const offset = idx + 1;
            p.fill(255);
            p.text(ans, 60, 50 + textHeight * offset);

            if (gameState.selectedAnswers[0] === idx) {
                p.fill(gameState.colors[0]);
                p.ellipse(30, 50 + textHeight * offset + (textHeight / 2), ballSize, ballSize);
            }

            if (gameState.selectedAnswers[1] === idx) {
                p.fill(gameState.colors[1]);
                p.ellipse(30 + ballSize * 1.25, 50 + textHeight * offset + (textHeight / 2), ballSize, ballSize);
            }
        })

        // // Handle input from arcade controls
        // if (PLAYER_1.DPAD.up) {
        //     y -= speed;
        // }
        // if (PLAYER_1.DPAD.down) {
        //     y += speed;
        // }
        // if (PLAYER_1.DPAD.left) {
        //     x -= speed;
        // }
        // if (PLAYER_1.DPAD.right) {
        //     x += speed;
        // }

        // // Keep ball in bounds
        // x = p.constrain(x, ballSize / 2, WIDTH - ballSize / 2);
        // y = p.constrain(y, ballSize / 2, HEIGHT - ballSize / 2);

        // // Draw ball (change color when A is pressed)
        // if (PLAYER_1.A) {
        //     p.fill(255, 100, 100);
        // } else if (PLAYER_1.B) {
        //     p.fill(100, 255, 100);
        // } else {
        //     p.fill(100, 200, 255);
        // }
        // p.noStroke();
        // p.ellipse(x, y, ballSize, ballSize);

        // store inputs for next frames previous input
        gameState.lastFrame[0] = structuredClone(PLAYER_1.DPAD);
        gameState.lastFrame[1] = structuredClone(PLAYER_2.DPAD);
    };
};

function playerInput(player, playerIndex) {
    if (player.DPAD.up && !gameState.lastFrame[playerIndex].up) {
        gameState.selectedAnswers[playerIndex]--;

        if (gameState.selectedAnswers[playerIndex] < 0) {
            gameState.selectedAnswers[playerIndex] =
                gameState.answersArray.length - 1;
        }
    }

    if (player.DPAD.down && !gameState.lastFrame[playerIndex].down) {
        gameState.selectedAnswers[playerIndex]++;

        if (
            gameState.selectedAnswers[playerIndex] >
            gameState.answersArray.length - 1
        ) {
            gameState.selectedAnswers[playerIndex] = 0;
        }
    }

    // TODO draw dots with P5
    // document
    //     .getElementById(`answer-${gameState.selectedAnswers[playerIndex]}`)
    //     .classList.add(`p${playerIndex + 1}-selected`);
}

new p5(sketch, document.getElementById("sketch")!);
