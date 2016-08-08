(() => {
    'use strict';

    import Paddle from 'paddle';
    import Brick from 'brick';
    import Ball from 'ball';

    var k = new Kibo();
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var gameState = {
        width: canvas.width,
        height: canvas.height,
        middle: {
            h: canvas.height / 2,
            w: canvas.width / 2
        },
        rows: 5,
        cols: 10,
        lastTime: new Date(),
        lives: 3,
        score: 0,
        isNew: true
    };
    gameState.wallHeight = canvas.height / 4;
    gameState.brickHeight = gameState.wallHeight / gameState.rows;
    gameState.brickWidth = (canvas.width / gameState.cols);
    gameState.bricks =  _.fill(Array(gameState.rows), _.fill(Array(gameState.cols), {}));

    gameState.togglePause = () => {
        gameState.paused = !gameState.paused;
        if (gameState.paused === false) {
            window.requestAnimationFrame(() => {
                main();
            });
        }
    };

    gameState.pause = () => {
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.fillText('PAUSED', gameState.middle.w, gameState.middle.h);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#D0D0D0';
        ctx.fillText('Press space to resume', gameState.middle.w, gameState.middle.h + 25);
    };

    function drawLives() {
        ctx.font = "15px sans-serif";
        ctx.fillStyle = '#000';
        ctx.textAlign = 'right';
        ctx.fillText(`Lives: ${gameState.lives}`, canvas.width, canvas.height - 1);
    }

    function drawScore() {
        ctx.font = "15px sans-serif";
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + gameState.score, 0, canvas.height - 1);
    }

    function buildBricks() {
        return _.map(gameState.bricks, (rows, y) => {
            return _.map(rows, (brick, x) => {
                return new Brick(x, y);
            });
        });
    }

    function checkHit() {
         _.forEach(gameState.bricks, (row, y) => {
            _.forEach(row, (brick, x) => {
                var hit = brick.isHit();
                if (hit) {
                    brick.visible = false;
                    gameState.score += 5;
                    gameState.ball.vel.y = -gameState.ball.vel.y;
                }
            });
        });
    }

    function drawBricks() {
        _.forEach(gameState.bricks, (row, y) => {
            _.forEach(row, (brick, x) => {
                if (brick.visible) {
                    brick.draw();
                }
            });
        });
    }

    // keyboard controls via kibo.js
    var arrows = ['left', 'right'];
    k.down(arrows, () => {
        gameState.paddle.dir = k.lastKey();
        gameState.paddle.move();
    });

    k.down('enter', () => {
        gameState.isNew = false;
        main();
    });

    k.down('space', () => {
        gameState.togglePause();
    });

    window.onload = init();

    function init() {
        // Build initial game objects
        gameState.bricks = buildBricks();
        gameState.paddle = new Paddle();
        gameState.ball = new Ball();
        main();
    }

    function main() {
        var now = Date.now();
        var dt = (now - gameState.lastTime) / 1000.0;

        // clear last Frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        gameState.ball.move();
        gameState.paddle.draw();
        gameState.paddle.isHit();
        checkHit();
        drawLives();
        drawScore();
        if (gameState.isNew === true) {
            ctx.textAlign = 'center';
            ctx.fillText('Press enter to start the game', gameState.middle.w, gameState.middle.h);
        } else if (gameState.paused) {
            gameState.pause();
        } else {
            window.requestAnimationFrame(() => {
                main();
            });
        }
    }
 })();
