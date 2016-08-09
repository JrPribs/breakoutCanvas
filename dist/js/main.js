'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var k = new Kibo();
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var Brick = function () {
        function Brick(x, y) {
            _classCallCheck(this, Brick);

            this.x = x * gameState.brickWidth;
            this.y = y * gameState.brickHeight;
            this.edges = {
                x: this.x + gameState.brickWidth,
                y: this.x + gameState.brickHeight
            };
            this.visible = true;
            this.colors = {
                fill: 'firebrick',
                stroke: 'darkred'
            };
        }

        _createClass(Brick, [{
            key: 'draw',
            value: function draw() {
                ctx.lineWidth = 1;
                ctx.beginPath();
                this.setStyles();
                ctx.rect(this.x, this.y, gameState.brickWidth, gameState.brickHeight);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }, {
            key: 'hitSide',
            value: function hitSide() {
                var newX = gameState.ball.x + gameState.ball.vel.x;
                var leftOffset = gameState.ball.minusRadius(this.x);
                var rightOffset = gameState.ball.addRadius(this.edges.x);
                var hitLeft = _.inRange(newX, leftOffset, this.x + 1);
                var hitRight = _.inRange(newX, this.edges.x, rightOffset + 1);
                return hitLeft || hitRight;
            }
        }, {
            key: 'hitX',
            value: function hitX() {
                var newX = gameState.ball.x + gameState.ball.vel.x;
                return _.inRange(newX, this.x + gameState.ball.radius, this.x + gameState.brickWidth + gameState.ball.radius);
            }
        }, {
            key: 'hitY',
            value: function hitY() {
                return _.inRange(gameState.ball.y, this.y - 12, this.y + gameState.brickHeight + gameState.ball.radius + 4);
            }
        }, {
            key: 'isHit',
            value: function isHit() {
                return this.hitX() && this.hitY();
            }
        }, {
            key: 'isSideHit',
            value: function isSideHit() {
                return this.hitSide() && this.hitY();
            }
        }, {
            key: 'setStyles',
            value: function setStyles() {
                ctx.strokeStyle = this.colors.stroke;
                ctx.fillStyle = this.colors.fill;
            }
        }]);

        return Brick;
    }();

    function buildBricks() {
        return _.map(gameState.bricks, function (rows, y) {
            return _.map(rows, function (brick, x) {
                return new Brick(x, y);
            });
        });
    }

    function checkBrickHit() {
        // check if hit this frame, so direction isnt changed twice
        var hit = false;
        _.forEach(gameState.bricks, function (row) {
            _.forEach(row, function (brick) {
                if (brick.visible) {
                    var sideHit = brick.isSideHit();
                    var regHit = brick.isHit();
                    if (!hit) {
                        if (sideHit) {
                            gameState.ball.bounceX();
                        } else if (regHit) {
                            gameState.ball.bounceY();
                        }
                    }
                    if (sideHit || regHit) {
                        hit = true;
                        brick.visible = false;
                        gameState.score += 5;
                    }
                }
            });
        });
    }

    var Ball = function () {
        function Ball() {
            var _this = this;

            _classCallCheck(this, Ball);

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
                right: function right() {
                    return _this.addRadius(_this.x);
                },
                top: function top() {
                    return _this.minusRadius(_this.y);
                },
                left: function left() {
                    return _this.minusRadius(_this.x);
                },
                bottom: function bottom() {
                    return _this.addRadius(_this.y);
                }
            };
        }

        _createClass(Ball, [{
            key: 'draw',
            value: function draw(x, y) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.strokeStyle = this.colors.stroke;
                ctx.fillStyle = this.colors.fill;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }, {
            key: 'move',
            value: function move() {
                this.x += this.vel.x;
                this.y += this.vel.y;
                this.draw();
            }
        }, {
            key: 'bounceY',
            value: function bounceY() {
                this.vel.y = -this.vel.y;
            }
        }, {
            key: 'bounceX',
            value: function bounceX() {
                this.vel.x = -this.vel.x;
            }
        }, {
            key: 'addRadius',
            value: function addRadius(val) {
                return val + this.radius;
            }
        }, {
            key: 'minusRadius',
            value: function minusRadius(val) {
                return val - this.radius;
            }
        }]);

        return Ball;
    }();

    var Paddle = function () {
        function Paddle() {
            _classCallCheck(this, Paddle);

            this.height = 10;
            this.speed = 13;
            this.width = gameState.width / 10;
            this.x = (gameState.width - this.width) / 2;
            this.y = gameState.height - this.height;
        }

        _createClass(Paddle, [{
            key: 'draw',
            value: function draw() {
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.strokeStyle = '#000';
                ctx.stroke();
                ctx.fillStyle = 'blue';
                ctx.fill();
                ctx.closePath();
            }
        }, {
            key: 'move',
            value: function move() {
                if (this.dir === 'left' && this.x > 0) {
                    this.x -= this.speed;
                } else if (this.dir === 'right' && this.x + this.width <= canvas.width) {
                    this.x += this.speed;
                }
            }
        }, {
            key: 'isHit',
            value: function isHit() {
                var hitX = _.inRange(gameState.ball.addRadius(gameState.ball.x), this.x, this.x + this.width + 1) || _.inRange(gameState.ball.minusRadius(gameState.ball.x), this.x, this.x + this.width + 1);
                var hitY = _.inRange(gameState.ball.addRadius(gameState.ball.y), this.y, this.y + this.height + 1);
                return hitY && hitX;
            }
        }]);

        return Paddle;
    }();

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
        ctx.fillText('Lives: ' + gameState.lives, canvas.width, canvas.height - 1);
    }

    function drawScore() {
        ctx.font = "15px sans-serif";
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + gameState.score, 0, canvas.height - 1);
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
        _.forEach(gameState.bricks, function (row, y) {
            _.forEach(row, function (brick, x) {
                if (brick.visible) {
                    brick.draw();
                }
            });
        });
    }

    // keyboard controls via kibo.js
    var arrows = ['left', 'right'];
    k.down(arrows, function () {
        gameState.paddle.dir = k.lastKey();
        gameState.paddle.move();
    });

    k.down('enter', function () {
        if (gameState.isNew) {
            gameState.isNew = false;
            main();
        }
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
            window.requestAnimationFrame(function () {
                main();
            });
        }
    }
})();