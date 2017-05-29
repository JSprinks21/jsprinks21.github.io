function main() {

    cv = document.getElementById("canvas");
    
    //set canvas size
    cv.width = document.body.clientWidth;
    cv.height = document.body.clientHeight;

    //start game
    game = new Snake();
    game.run(cv.getContext("2d"));
}

function Game() {
    this.name = "";
}

Game.prototype = {
    constructor: Game,

    Direction: {
	RIGHT: 0,
	DOWN: 1,
	LEFT: 2,
	UP: 3
    },

    run(context) {

    }
};

function Snake() {
    this.snake = [];
    this.snake_len = 5;
    this.snake_color = "green";
    this.food_color = "red";
    this.bg_color = "black";
    this.cvWidth = 160;
    this.cvHeight = 90;
    this.pos = [80,45];
    this.dir = null;
    this.food_loc = null;
}

Snake.prototype = Object.create(Game.prototype);
Snake.prototype.constructor = Snake;
Snake.prototype.run = function(ctx) {

    //scale canvas to 160x90
    ctx.scale(ctx.canvas.clientWidth / 160, ctx.canvas.clientHeight / 90);
    
    //init
    this.dir = this.Direction.RIGHT;
    for (let i = 0; i < this.snake_len; i++) {
	this.snake.push([this.pos[0] - i, this.pos[1]]);
    }
    this.fillBackground(ctx);

    //set interval main loop
    this.drawSnake(ctx);
    this.spawnFood(ctx);
};
Snake.prototype.fillBackground = function(ctx) {
    ctx.fillStyle = this.bg_color;
    ctx.fillRect(0, 0, this.cvWidth, this.cvHeight);
};
Snake.prototype.drawSnake = function(ctx) {
    ctx.fillStyle = this.snake_color;
    for (let i = 0; i < this.snake.length; i++) {
	ctx.fillRect(this.snake[i][0], this.snake[i][1], 1, 1);
    }
};
Snake.prototype.spawnFood = function(ctx) {
    ctx.fillStyle = this.food_color;
    
    do {
	let xrand = Math.floor(Math.random() * this.cvWidth);
	let yrand = Math.floor(Math.random() * this.cvHeight);
	this.food_loc = [xrand, yrand];
    } while (!(this.valid(this.food_loc)));

    ctx.fillRect(this.food_loc[0], this.food_loc[1], 1, 1);
};
Snake.prototype.move = function() {
    
};

//coord is of the form [x, y]
//valid locations are those within the bounds, and not part of the snake
Snake.prototype.valid = function(coord) {
    
    //check whether the point is on the snake
    for (let i = 0; i < this.snake.length; i++) {
	if (this.snake[i][0] == coord[0] && this.snake[i][1] == coord[1]) {
	    return false;
	}
    }

    //check whether the point is in bounds
    if (coord[0] < 0 || coord[1] < 0 || coord[0] >= this.cvWidth || coord[1] >= this.cvHeight) {
	return false;
    }
    
    return true;
};
