'use strict';

(function () {
    'use strict';

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
    gameState.brickWidth = canvas.width / gameState.cols;
    gameState.bricks = _.fill(Array(gameState.rows), _.fill(Array(gameState.cols), {}));

    gameState.togglePause = function () {
        gameState.paused = !gameState.paused;
        if (gameState.paused === false) {
            window.requestAnimationFrame(function () {
                main();
            });
        }
    };

    gameState.pause = function () {
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
        ctx.fillText('Lives: ' + gameState.lives, canvas.width, canvas.height - 1);
    }

    function drawScore() {
        ctx.font = "15px sans-serif";
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + gameState.score, 0, canvas.height - 1);
    }

    function buildBricks() {
        return _.map(gameState.bricks, function (rows, y) {
            return _.map(rows, function (brick, x) {
                return new Brick(x, y);
            });
        });
    }

    function checkHit() {
        _.forEach(gameState.bricks, function (row, y) {
            _.forEach(row, function (brick, x) {
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
        _.forEach(gameState.bricks, function (row, y) {
            _.forEach(row, function (brick, x) {
                if (brick.visible) {
                    brick.draw();
                }
            });
        });
    }

    /*************************************************
    * Brick - Brick - Brick - Brick - Brick - Brick **
    *************************************************/

    var Brick = function Brick(x, y) {
        _.assign(this, {
            x: x * gameState.brickWidth,
            y: y * gameState.brickHeight,
            visible: true,
            colors: {
                fill: 'firebrick',
                stroke: 'darkred'
            }
        });
    };

    Brick.prototype.draw = function () {
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.setStyles();
        ctx.rect(this.x, this.y, gameState.brickWidth, gameState.brickHeight);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    };

    Brick.prototype.isHit = function () {
        if (this.visible) {
            var hitX = _.inRange(gameState.ball.addRadius(gameState.ball.x), this.x, this.x + gameState.brickWidth) || _.inRange(gameState.ball.minusRadius(gameState.ball.x), this.x, this.x + gameState.brickWidth);
            var hitY = _.inRange(gameState.ball.addRadius(gameState.ball.y), this.y, this.y + gameState.brickHeight) || _.inRange(gameState.ball.minusRadius(gameState.ball.y), this.y, this.y + gameState.brickHeight);
            return hitX && hitY;
        } else {
            return false;
        }
    };

    Brick.prototype.setStyles = function () {
        ctx.strokeStyle = this.colors.stroke;
        ctx.fillStyle = this.colors.fill;
    };

    /************************************************
    * Paddle - Paddle - Paddle - Paddle - Paddle ****
    *************************************************/

    var Paddle = function Paddle() {
        this.width = gameState.width / 10;
        this.height = 10;
        this.speed = 13;
        this.x = (gameState.width - this.width) / 2;
        this.y = gameState.height - this.height;
    };

    Paddle.prototype.draw = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    };

    Paddle.prototype.move = function () {
        if (this.dir === 'left' && this.x > 0) {
            this.x -= this.speed;
        } else if (this.dir === 'right' && this.x + this.width <= canvas.width) {
            this.x += this.speed;
        }
    };

    Paddle.prototype.isHit = function () {
        var hitX = _.inRange(gameState.ball.addRadius(gameState.ball.x), this.x, this.x + this.width + 1) || _.inRange(gameState.ball.minusRadius(gameState.ball.x), this.x, this.x + this.width + 1);
        var hitY = _.inRange(gameState.ball.addRadius(gameState.ball.y), this.y, this.y + this.height + 1);
        return hitY && hitX;
    };

    /************************************************
    * Ball - Ball - Ball - Ball - Ball - Ball- Ball *
    *************************************************/
    var Ball = function Ball() {
        this.radius = 10;
        this.vel = {
            x: 2,
            y: -2
        };
        this.x = canvas.width / 2;
        this.y = canvas.height - 25;
        this.colors = {
            fill: 'yellow',
            stroke: '#000'
        };
    };

    Ball.prototype.draw = function (x, y) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.colors.stroke;
        ctx.fillStyle = this.colors.fill;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    };

    Ball.prototype.move = function () {
        this.x += this.vel.x;
        this.y += this.vel.y;
        var hitRight = this.addRadius(this.x) > canvas.width;
        var hitBottom = this.minusRadius(this.y) > canvas.height;
        var hitLeft = this.minusRadius(this.x) < 0;
        var hitTop = this.minusRadius(this.y) < 0;
        var hitPaddle = gameState.paddle.isHit();
        if (hitTop || hitPaddle) {
            // Hit top wall
            this.vel.y = -this.vel.y;
        }
        if (hitRight || hitLeft) {
            // Hit right or left wall
            this.vel.x = -this.vel.x;
        }

        if (hitBottom) {
            if (gameState.lives === 0) {
                ctx.font = "80px sans-serif";
                ctx.textAlign = 'center';
                ctx.fillText("GAME OVER", gameState.middle.w, gameState.middle.h);
                ctx.font = "20px sans-serif";
                ctx.fillText("Press Enter to start a new game", gameState.middle.w, gameState.middle.h + 20);
            } else {
                gameState.ball = new Ball();
                gameState.paddle = new Paddle();
                gameState.lives--;
                drawLives();
            }
        }
        this.draw();
    };

    Ball.prototype.addRadius = function (val) {
        return val + this.radius;
    };

    Ball.prototype.minusRadius = function (val) {
        return val - this.radius;
    };

    // keyboard controls via kibo.js
    var arrows = ['left', 'right'];
    k.down(arrows, function () {
        gameState.paddle.dir = k.lastKey();
        gameState.paddle.move();
    });

    k.down('enter', function () {
        gameState.isNew = false;
        main();
    });

    k.down('space', function () {
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
            window.requestAnimationFrame(function () {
                main();
            });
        }
    }
})();