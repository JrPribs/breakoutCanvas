(() => {
    'use strict';

    var k = new Kibo();
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    class Brick {
        constructor(x, y) {
            this.x = x * gameState.brickWidth;
            this.y = y * gameState.brickHeight;
            this.visible = true;
            this.colors = {
                fill: 'firebrick',
                stroke: 'darkred'
            };
        }
        draw() {
            ctx.lineWidth = 1;
            ctx.beginPath();
            this.setStyles();
            ctx.rect(this.x, this.y, gameState.brickWidth, gameState.brickHeight);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }

        isHit() {
            if (this.visible) {
                var ballBounds = {
                    right: gameState.ball.bounds.right(),
                    left: gameState.ball.bounds.left(),
                    top: gameState.ball.bounds.top(),
                    bottom: gameState.ball.bounds.bottom()
                };
                var hitX = _.inRange(ballBounds.right + gameState.ball, this.x + 1, this.x + gameState.brickWidth) || _.inRange(ballBounds.left, this.x + 1, this.x +
                    gameState.brickWidth);
                var hitY = _.inRange(ballBounds.bottom, this.y, this.y + gameState.brickHeight + 1) || _.inRange(ballBounds.top, this.y, this.y +
                    gameState.brickHeight + 1);
                if (this.x === ballBounds.right && hitY || this.x === ballBounds.left && hitY) {
                    gameState.ball.bounceX();
                    return true;
                } else if(hitX && hitY) {
                    gameState.ball.bounceY();
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        setStyles() {
            ctx.strokeStyle = this.colors.stroke;
            ctx.fillStyle = this.colors.fill;
        }
    }

    function buildBricks() {
        return _.map(gameState.bricks, (rows, y) => {
            return _.map(rows, (brick, x) => {
                return new Brick(x, y);
            });
        });
    }

    class Ball {
        constructor() {
            this.radius = 10;
            this.vel = {
                x: 3,
                y: -3
            };
            this.x = canvas.width / 2;
            this.y = canvas.height - 25;
            this.colors = {
                fill: 'yellow',
                stroke: '#000'
            };
            this.bounds = {
                right: () => this.addRadius(this.x),
                top: () => this.minusRadius(this.y),
                left: () => this.minusRadius(this.x),
                bottom: () => this.addRadius(this.y)
            };
        }

        draw(x, y) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.strokeStyle = this.colors.stroke;
            ctx.fillStyle = this.colors.fill;
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }

        move() {
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.draw();
        }

        bounceY() {
            this.vel.y = -this.vel.y;
        }

        bounceX() {
            this.vel.x = -this.vel.x;
        }

        addRadius(val) {
            return val + this.radius;
        }

        minusRadius(val) {
            return val - this.radius;
        }
    }

    class Paddle {
        constructor() {
            this.height = 10;
            this.speed = 13;
            this.width = gameState.width / 10;
            this.x = (gameState.width - this.width) / 2;
            this.y = gameState.height - this.height;
        }

        draw() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = '#000';
            ctx.stroke();
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
        }

        move() {
            if (this.dir === 'left' && this.x > 0) {
                this.x -= this.speed;
            } else if (this.dir === 'right' && this.x + this.width <= canvas.width) {
                this.x += this.speed;
            }
        }

        isHit() {
            var hitX = _.inRange(gameState.ball.addRadius(gameState.ball.x), this.x, this.x + this.width + 1) || _.inRange(gameState.ball.minusRadius(gameState.ball.x), this.x, this.x + this.width +
                1);
            var hitY = _.inRange(gameState.ball.addRadius(gameState.ball.y), this.y, this.y + this.height + 1);
            return hitY && hitX;
        }
    }

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

    function pause() {
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.fillText('PAUSED', gameState.middle.w, gameState.middle.h);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#D0D0D0';
        ctx.fillText('Press space to resume', gameState.middle.w, gameState.middle.h + 25);
    }

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

    function checkBrickHit() {
         _.forEach(gameState.bricks, row => {
            _.forEach(row, brick => {
                const hit = brick.isHit();
                if (hit) {
                    brick.visible = false;
                    gameState.score += 5;
                }
            });
        });
    }

    function checkHits() {
        var hitRight = gameState.ball.bounds.right() > canvas.width;
        var hitBottom = gameState.ball.bounds.top() > canvas.height;
        var hitLeft = gameState.ball.bounds.left() < 0;
        var hitTop = gameState.ball.bounds.top() < 0;
        var hitPaddle = gameState.paddle.isHit();

        if (hitTop || hitPaddle) {
            // Hit top wall
            gameState.ball.bounceY();
        }

        if (hitRight || hitLeft) {
            // Hit right or left wall
            gameState.ball.bounceX();
        }

        if (hitBottom) {
            if (gameState.lives === 0) {
                ctx.font = "80px sans-serif";
                ctx.textAlign = 'center';
                ctx.fillText("GAME OVER", gameState.middle.w, gameState.middle.h);
            } else {
                gameState.lives--;
                gameState.paddle = new Paddle();
                gameState.ball = new Ball();
            }
        }
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
        if (gameState.isNew) {
            gameState.isNew = false;
            main();
        }
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
        checkBrickHit();
        checkHits();
        gameState.ball.move();
        gameState.paddle.draw();
        gameState.paddle.isHit();
        drawLives();
        drawScore();
        if (gameState.isNew === true) {
            ctx.textAlign = 'center';
            ctx.fillText('Press enter to start the game', gameState.middle.w, gameState.middle.h);
        } else if (gameState.paused) {
            pause();
        } else {
            window.requestAnimationFrame(() => {
                main();
            });
        }
    }

})();
