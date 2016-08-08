export class Brick {
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
            var hitSide = () => gameState.ball.addRadius(gameState.ball.x) === this.x || gameState.ball.addRadius(gameState.ball.x) === this.x + gameState.brickWidth;
            var hitX = _.inRange(gameState.ball.addRadius(gameState.ball.x), this.x, this.x + gameState.brickWidth) || _.inRange(gameState.ball.minusRadius(gameState.ball.x), this.x, this.x +
                gameState.brickWidth);
            var hitY = _.inRange(gameState.ball.addRadius(gameState.ball.y), this.y, this.y + gameState.brickHeight) || _.inRange(gameState.ball.minusRadius(gameState.ball.y), this.y, this.y +
                gameState.brickHeight);

            if (hitSide && hitY) {
                console.log('sidehit');
            }

            return hitX && hitY;
        } else {
            return false;
        }
    }

    setStyles() {
        ctx.strokeStyle = this.colors.stroke;
        ctx.fillStyle = this.colors.fill;
    }
}
