/************************************************
* Ball - Ball - Ball - Ball - Ball - Ball- Ball *
*************************************************/
export class Ball {
    constructor() {
        this.radius = 10;
        this.vel = {
            x: 2,
            y: -2
        };
        this.x = canvas.width/ 2;
        this.y = canvas.height -  25;
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
    var hitRight = this.bounds.right > canvas.width;
    var hitBottom =  this.bounds.top > canvas.height;
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

addRadius(val) {
    return val + this.radius;
}

minusRadius(val) {
    return val - this.radius;
}
}
