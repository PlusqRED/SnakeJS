let SIZE = 20;
let map = [];
let TILE_WIDTH = 30;
let TILE_HEIGHT = 30;
let LEFT_PADDING = 100;
let TOP_PADDING = 100;

let MAPTILE_COLOR = "#00E2FF";
let HEAD_COLOR = "#FF0000";
let BODY_COLOR = "#FF7700";
let APPLE_COLOR = "#00FF00";

let snake;
let apple;
let looping = true;
let debug = true;

class Segment {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
    }

    move() {
        switch(this.dir) {
            case 0:
                if(this.x + 1 < SIZE)
                    this.x++;
                else looping = false;
                    break;

            case 1:
                if(this.y - 1 >= 0)
                    this.y--;
                else looping = false;
                    break;

            case 2:
                if(this.x > 0)
                    this.x--;
                else looping = false;
                    break;

            case 3:
                if(this.y + 1 < SIZE)
                    this.y++;
                else looping = false;
                    break;
        }
    }

    setDirection(dir) {
        this.dir = dir;
    }
}
class Snake {
    constructor(x, y) {
        this.tail = [];

        this.head = new Segment(x, y, 1);
        map[x][y].style.backgroundColor = HEAD_COLOR;

        this.addTailTile(new Segment(x, y + 1, this.head.dir));
        this.addTailTile(new Segment(x, y + 2, this.head.dir));
    }

    addTailTile(segment) {
        this.tail.push(segment);
    }

    move() {
        this.head.move();

        for(let i = 0; i < this.tail.length; i++) {
            this.tail[i].move();
        }

        this.updateDirections();
    }

    updateDirections() {

        for(let i = this.tail.length - 1; i > 0; i--) {
            this.tail[i].dir = this.tail[i - 1].dir;
        }

        this.tail[0].dir = this.head.dir;
    }

    eat() {
        let x = this.tail[this.tail.length - 1].x, y = this.tail[this.tail.length - 1].y;
        let dir = this.tail[this.tail.length - 1].dir;

        if(this.tail[this.tail.length - 1].dir === 0)
            x = this.tail[this.tail.length - 1].x - 1;

        else if(this.tail[this.tail.length - 1].dir === 1)
            y = this.tail[this.tail.length - 1].y + 1;

        else if(this.tail[this.tail.length - 1].dir === 2)
            x = this.tail[this.tail.length - 1].x + 1;

        else if(this.tail[this.tail.length - 1].dir === 3)
            y = this.tail[this.tail.length - 1].y - 1;

        this.tail.push(new Segment(x, y, dir))
    }
}
class Apple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function createMap() {
    for(let i = 0; i < SIZE; i++)
        map[i] = [];

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            let tile = document.createElement('div');
            setTileProperty(tile, i, j);
            document.body.appendChild(tile);
            map[i].push(tile);
        }
    }

    function setTileProperty(tile, i, j) {
        tile.style.width = TILE_HEIGHT + 'px';
        tile.style.height = TILE_HEIGHT + 'px';
        tile.style.left = LEFT_PADDING + TILE_WIDTH * i + "px";
        tile.style.top = TOP_PADDING + TILE_HEIGHT * j + "px";
        tile.style.backgroundColor = MAPTILE_COLOR;
    }
}

function createSnake() {
    let x = SIZE / 2;
    let y = SIZE / 2;
    snake = new Snake(x, y);
}

function createApple() {
    apple = new Apple(getRandomInt(SIZE / 2), getRandomInt(SIZE / 2));
}

function drawMap() {
    for(let i = 0; i < SIZE; i++) {
        for(let j = 0; j < SIZE; j++) {
            map[i][j].style.backgroundColor = MAPTILE_COLOR;
        }
    }
}

function drawSnake() {
    map[snake.head.x][snake.head.y].style.backgroundColor = HEAD_COLOR; // drawing head

    for(let i = 0; i < snake.tail.length; i++) { // drawing tail
        map[snake.tail[i].x][snake.tail[i].y].style.backgroundColor = BODY_COLOR;
    }
	
	debug = true;
}

function drawApple() {
    map[apple.x][apple.y].style.backgroundColor = APPLE_COLOR;
}

function checkForTouch() {
    if(snake.head.x === apple.x && snake.head.y === apple.y) {
        snake.eat();
        spawnApple();
    }
}

function checkForSelfHarming() {
    for(let i = 0; i < snake.tail.length; i++) {
        if(snake.head.x === snake.tail[i].x && snake.head.y === snake.tail[i].y)
            looping = false;
    }
}

function updateGame() {
    if(looping) {
        drawMap();
        drawApple();
        drawSnake();
        snake.move();
        checkForTouch();
        checkForSelfHarming();
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function onkeydown(event) {
	if(debug) {
		
		if((event.keyCode===39||event.keyCode===68) && snake.head.dir !== 2) {
			snake.head.setDirection(0);
			debug = false;
		} // right

		else if((event.keyCode===38||event.keyCode===87) && snake.head.dir !== 3) {
			snake.head.setDirection(1);
			debug = false;
		} // up

		else if((event.keyCode===37||event.keyCode===65) && snake.head.dir !== 0) {
			snake.head.setDirection(2);
			debug = false;
		} // left

		else if((event.keyCode===40||event.keyCode===83) && snake.head.dir !== 1) {
			snake.head.setDirection(3);
			debug = false;
		} // down
		
	}
}

function spawnApple() {
    apple.x = getRandomInt(SIZE);
    apple.y = getRandomInt(SIZE);
}

window.onload = function () {
    createMap();
    createSnake();
    createApple();

    document.addEventListener("keydown", onkeydown)
    setInterval(updateGame, 100);
};