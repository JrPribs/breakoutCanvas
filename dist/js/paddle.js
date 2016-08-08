'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Paddle = exports.Paddle = function () {
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