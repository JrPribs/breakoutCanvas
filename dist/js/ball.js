'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/************************************************
* Ball - Ball - Ball - Ball - Ball - Ball- Ball *
*************************************************/
var Ball = exports.Ball = function () {
    function Ball() {
        _classCallCheck(this, Ball);

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
        this.bounds = {
            right: this.addRadius(this.x),
            top: this.minusRadius(this.y),
            left: this.minusRadius(this.x),
            bottom: this.addRadius(this.y)
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
            var hitRight = this.bounds.right > canvas.width;
            var hitBottom = this.bounds.top > canvas.height;
            var hitLeft = this.bounds.left < 0;
            var hitTop = this.bounds.top < 0;
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