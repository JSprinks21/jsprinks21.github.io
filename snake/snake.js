function main() {

	cv = document.getElementById("canvas");
	ctx = cv.getContext("2d");
    
    //set canvas size
    cv.width = document.body.clientWidth;
    cv.height = document.body.clientHeight;

    //setup game
    game = new Snake();
    game.scale(ctx);

    window.onkeydown = function(e) {
	e = e || window.event;
	
	switch (e.keyCode) {
	case game.Key.LEFT:
	case game.Key.A:
	    game.left();
	    break;
	case game.Key.UP:
	case game.Key.W:
	    game.up();
	    break;
	case game.Key.RIGHT:
	case game.Key.D:
	    game.right();
	    break;
	case game.Key.DOWN:
	case game.Key.S:
	    game.down();
	    break;
	default:
	    game.playPause(ctx);
	}
    };

    //start game
    game.run(ctx);
}

function Game() {
    this.name = "";
}

Game.prototype = {
    constructor: Game,

    Direction: {
	LEFT: 0,
	UP: 1,
	RIGHT: 2,
	DOWN: 3
    },

    Key: {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	W: 87,
	A: 65,
	S: 83,
	D: 68
    },

    run(context) {

    },

    scale(context) {

    }
};

function Snake() {
    this.name = "Snake";
    this.snake = [];
    this.snake_len = 5;
    this.snake_color = "green";
    this.food_color = "red";
    this.bg_color = "black";
    this.cvWidth = 80;
    this.cvHeight = 45;
    this.pos = [Math.floor(this.cvWidth / 2), Math.floor(this.cvHeight / 2)];
    this.dir = null;
    this.dir_staging = null;
    this.food_loc = null;
    this.interval = null;
}

Snake.prototype = Object.create(Game.prototype);
Snake.prototype.constructor = Snake;
Snake.prototype.run = function(ctx) {
    
    //init
    if (this.snake.length == 0) {
	this.createSnake();
    }
    if (this.food_loc == null) {
	this.spawnFood();
    }
    
    //set interval main loop
    let self = this;
    this.interval = setInterval(function() {
	self.move();
	self.fillBackground(ctx);
	self.drawFood(ctx);
	self.drawSnake(ctx);
    }, 50);
};
Snake.prototype.playPause = function(ctx) {
    if (this.interval == null) {
	this.run(ctx);
    } else {
	clearInterval(this.interval);
	this.interval = null;
    }
};
Snake.prototype.scale = function(ctx) {
    //scale canvas to 160x90
    ctx.scale(ctx.canvas.clientWidth / this.cvWidth, ctx.canvas.clientHeight / this.cvHeight);
};
Snake.prototype.fillBackground = function(ctx) {
    ctx.fillStyle = this.bg_color;
    ctx.fillRect(0, 0, this.cvWidth, this.cvHeight);
};
Snake.prototype.createSnake = function() {
    this.dir = this.Direction.RIGHT;
    for (let i = 0; i < this.snake_len; i++) {
        this.snake.push([this.pos[0] - i, this.pos[1]]);
    }
};
Snake.prototype.drawSnake = function(ctx) {
    ctx.fillStyle = this.snake_color;
    for (let i = 0; i < this.snake.length; i++) {
	ctx.fillRect(this.snake[i][0], this.snake[i][1], 1, 1);
    }
};
Snake.prototype.spawnFood = function(ctx) {
    //TODO: optimize this so it doesn't slow down the game when the snake takes up
    //most of the screen
    do {
	let xrand = Math.floor(Math.random() * this.cvWidth);
	let yrand = Math.floor(Math.random() * this.cvHeight);
	this.food_loc = [xrand, yrand];
    } while (!(this.valid(this.food_loc)));
};
Snake.prototype.drawFood = function(ctx) {
    if (this.food_loc == null) {
	this.spawnFood();
    }
    ctx.fillStyle = this.food_color;
    ctx.fillRect(this.food_loc[0], this.food_loc[1], 1, 1);
};
Snake.prototype.move = function() {
    let loc = [this.pos[0], this.pos[1]];

    if (this.dir_staging != null) {
	this.dir = this.dir_staging
	this.dir_staging = null;
    }
    
    switch (this.dir) {
    case this.Direction.LEFT:
	loc[0] -= 1;
	break;
    case this.Direction.UP:
	loc[1] -= 1;
	break;
    case this.Direction.RIGHT:
        loc[0] += 1;
        break;
    case this.Direction.DOWN:
        loc[1] += 1;
        break;
    default:
	this.dir = this.Direction.DOWN;
	return;
    }
    
    if (!(this.valid(loc))) {
	//reset
	this.snake_length = 5;
	this.pos = [Math.floor(this.cvWidth / 2), Math.floor(this.cvHeight / 2)];
	this.snake = [];
	this.createSnake();
    } else if (loc[0] == this.food_loc[0] && loc[1] == this.food_loc[1]) {
	//eat the food, setting food_loc to null and prepending that position to the snake
	this.food_loc = null;
	this.snake_length += 1;
	this.snake.unshift(loc);
	this.pos = loc;
    } else {
	//move snake
	this.snake.pop();
	this.snake.unshift(loc);
	this.pos = loc;
    }
};
Snake.prototype.left = function() {
    if (this.dir != this.Direction.RIGHT) {
	this.dir_staging = this.Direction.LEFT;
    }
};
Snake.prototype.up = function() {
    if (this.dir != this.Direction.DOWN) {
	this.dir_staging = this.Direction.UP;
    }
};
Snake.prototype.right = function() {
    if (this.dir != this.Direction.LEFT) {
	this.dir_staging = this.Direction.RIGHT;
    }
};
Snake.prototype.down = function() {
    if (this.dir != this.Direction.UP) {
	this.dir_staging = this.Direction.DOWN;
    }
};
//coord is of the form [x, y]
//valid locations are those within the bounds, and not part of the snake
Snake.prototype.valid = function(coord) {
    
    //check whether the point is on the snake
    //end of the snakes tail is valid (because it will move out of the way)
    for (let i = 0; i < this.snake.length - 1; i++) {
	if (this.snake[i][0] === coord[0] && this.snake[i][1] === coord[1]) {
	    return false;
	}
    }

    //check whether the point is in bounds
    if (coord[0] < 0 || coord[1] < 0 || coord[0] >= this.cvWidth || coord[1] >= this.cvHeight) {
	return false;
    }
    
    return true;
};
