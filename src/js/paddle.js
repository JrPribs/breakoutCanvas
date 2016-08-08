export class Paddle {
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
