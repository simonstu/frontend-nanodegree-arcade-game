"use strict";
// general variables
var playerStartPosX = 201;
var playerStartPosY = 384;
var enemyStartPositionsY = [60, 143, 226];
var enemyStartPositionX = -101;

var GraphicalObject = function(x, y) {
    this.x = x;
    this.y = y;
}

// Enemies our player must avoid
var Enemy = function(x, y) {
    // calls the superclass GraphicalObject with the fixed start position for x and and a random position from the array for y
    GraphicalObject.call(this,
        enemyStartPositionX,
        enemyStartPositionsY[getRandomArbitrary(0,2)]);
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // position when enemy reacher the end of the canvas
    this.xEndPosition = 510;
    // random speed of the
    this.speed = getRandomArbitrary(100,400);
};

Enemy.prototype = Object.create(GraphicalObject.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < this.xEndPosition) {
        this.x = this.x + this.speed*dt;
    } else {
        this.speed = getRandomArbitrary(100,400);
        this.y = enemyStartPositionsY[getRandomArbitrary(0,2)];
        this.x = enemyStartPositionX;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (player.playerWasChosen) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// our player
var Player = function(x, y) {
    GraphicalObject.call(this, playerStartPosX, playerStartPosY);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = "images/char-boy.png";
    this.playerWasChosen = false;
    // outmost possible positions for the player
    this.outmostLeft = -1;
    this.outmostRight = 403;
    this.outmostBottom = 384;
    this.outmostTop = -26;
    // radius to check a collision
    this.collisionRadius = 35;
    // starting score
    this.score = 0;
};

Player.prototype = Object.create(GraphicalObject.prototype);
Player.prototype.constructor = Player;

// checks a collision with an enemy
Player.prototype.update = function() {
    for (var i=0; i<allEnemies.length; i++) {
        // save positions of enemy and player
        var enemyX = allEnemies[i].x;
        var enemyY = allEnemies[i].y;
        var playerX = this.x;
        var playerY = this.y;
        // check if a collision happens
        if (Math.abs(enemyX - playerX) < this.collisionRadius &&
            Math.abs(enemyY - playerY) < this.collisionRadius) {
            this.x = playerStartPosX;
            this.y = playerStartPosY;
            this.score = 0;
            break;
        }
    }
}

// Draw the player on the screen
Player.prototype.render = function() {
    if (this.playerWasChosen) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        this.renderScores();
    } else {
        this.showPlayerAvatars();
    }
}

Player.prototype.handleInput = function(key) {
    // move the player to the left if possible
    if (key === "left") {
        if (this.x > this.outmostLeft) {
            this.x -= 101;
        }
    // move the player to the right if possible
    } else if (key === "right") {
        if (this.x < this.outmostRight) {
            this.x += 101;
        };
    // move the player up if possible
    } else if (key === "up") {
        if (this.y > this.outmostTop) {
            this.y -= 82;
            // if the player reaches the water
            if (this.y === this.outmostTop) {
                this.y = playerStartPosY;
                this.x = playerStartPosX;
                this.score += 1;
            }
        };
    // move the player down
    } else if (key === "down") {
        if (this.y < this.outmostBottom) {
            this.y += 82;
        }
    }
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [ new Enemy(), new Enemy(), new Enemy() ];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

Player.prototype.showPlayerAvatars = function() {
    ctx.drawImage(Resources.get('images/char-boy.png'), 0, 213);
    ctx.drawImage(Resources.get('images/char-cat-girl.png'), 101, 213);
    ctx.drawImage(Resources.get('images/char-horn-girl.png'), 202, 213);
    ctx.drawImage(Resources.get('images/char-pink-girl.png'), 303, 213);
    ctx.drawImage(Resources.get('images/char-princess-girl.png'), 404, 213);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0,180,520,70);
    ctx.textAlign="center";
    ctx.fillStyle = "grey";
    ctx.font="45px Impact";
    ctx.fillText("Choose your avatar!",250,230);
    canvas.addEventListener("mousedown", avatarChosen, false);
}

var avatarChosen = function(event) {
    var x = event.x;
    var y = event.y;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    if (y > 260 && y < 360) {
        if (x > 0 && x < 101) {
            player.sprite = "images/char-boy.png";
        } else if (x >= 101 && x < 202) {
            player.sprite = "images/char-cat-girl.png";
        } else if (x >= 202 && x < 303) {
             player.sprite = "images/char-horn-girl.png";
        } else if (x >= 303 && x < 404) {
             player.sprite = "images/char-pink-girl.png";
        } else if (x >= 404 && x < 505) {
             player.sprite = "images/char-princess-girl.png";
        }
        canvas.removeEventListener("mousedown", avatarChosen, false);
        player.playerWasChosen = true;
    }
};

Player.prototype.renderScores = function() {
    ctx.textAlign="left";
    ctx.fillStyle = "black";
    ctx.font="25px Impact";
    ctx.fillText("Score: " + this.score,15,575);
}