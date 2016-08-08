'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Brick = exports.Brick = function () {
    function Brick(x, y) {
        _classCallCheck(this, Brick);

        this.x = x * gameState.brickWidth;
        this.y = y * gameState.brickHeight;
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
        key: 'isHit',
        value: function isHit() {
            var _this = this;

            if (this.visible) {
                var hitSide = function hitSide() {
                    return gameState.ball.addRadius(gameState.ball.x) === _this.x || gameState.ball.addRadius(gameState.ball.x) === _this.x + gameState.brickWidth;
                };
                var hitX = _.inRange(gameState.ball.addRadius(gameState.ball.x), this.x, this.x + gameState.brickWidth) || _.inRange(gameState.ball.minusRadius(gameState.ball.x), this.x, this.x + gameState.brickWidth);
                var hitY = _.inRange(gameState.ball.addRadius(gameState.ball.y), this.y, this.y + gameState.brickHeight) || _.inRange(gameState.ball.minusRadius(gameState.ball.y), this.y, this.y + gameState.brickHeight);

                if (hitSide && hitY) {
                    console.log('sidehit');
                }

                return hitX && hitY;
            } else {
                return false;
            }
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