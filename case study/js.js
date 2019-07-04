minheight = 40;
maxheight = 70;
minWidth = 45;
maxWidth = 65;
minGap = 300;
maxGap = 500;
gap = ranGap();
var myObstacles = [];
var nhacPlay = document.getElementById("play");
var nhacStop = document.getElementById("stop");

function startGame() {
    gameArea.start(); //gọi phương thức start của đối tượng gameArea
}

var hero = {  //tạo nhân vật để thêm vào gameArea
    x: 10,
    y: 350,
    speedY: 0,
    update: function() {
        var img = document.getElementById("hero");
        gameArea.context.drawImage(img, this.x, this.y, 130, 150);
    },

    newPos: function() {
        if (this.y < 100) {
            this.speedY = 2;
        }
        this.y += this.speedY;
        if(this.y == 350) {
            this.speedY = 0;
            window.addEventListener("keydown",  moveup);
        }
        else
            window.removeEventListener("keydown",  moveup);
    },

    crassWidth: function(obs) {
        return (this.x + 110 > obs.x && this.x < obs.x + obs.width - 10 && this.y + 130 > obs.y) ? true : false;
    }
}

function moveup() {
    hero.speedY = -2;
    nhacPlay.play();
}

function ranGap() {
    return Math.floor(minGap + Math.random() * (maxGap - minGap));
}

function obstacle() {
    this.height = Math.floor(minheight + Math.random() * (maxheight - minheight));
    this.width = Math.floor(minWidth + Math.random() * (maxWidth - minWidth));
    this.x = 1350;
    this.y = gameArea.canvas.height - this.height;
    this.draw = function() {
        var img = document.getElementById("obs");
        gameArea.context.drawImage(img, this.x, this.y, this.width, this.height);
    }
}

var score = {
    x: 680,
    y: 50,
    update: function(text) {
        gameArea.context.fillStyle = "black";
        gameArea.context.font = "50px Consolas";
        gameArea.context.fillText(text, this.x, this.y);
    }
}


function everyInterval(n) {
    return (gameArea.frame % n == 0) ? true : false; // Hàm everyinterval trả về true nếu số khung hình hiện tại tương ứng với khoảng đã cho.
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.height = 500;
        this.canvas.width = 1580;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.context = this.canvas.getContext("2d");
        this.frame = 0;
        this.score = 0;
        score.update("Score: 0");
        this.interval = setInterval(this.updateGame, 1);
    },

    updateGame: function() {
        for (i = 0; i < myObstacles.length; i++) {
            if (hero.crassWidth(myObstacles[i])) {
                gameArea.stop();
            }
        }
        gameArea.clear();
        if (everyInterval(gap)) {  // thêm 1 chướng ngại vật cho mỗi khung hình thứ gap
            myObstacles.push(new obstacle());
            gap = ranGap();
            gameArea.frame = 0;
        }
        for (i = 0; i < myObstacles.length; i++) {
            myObstacles[i].x -= 1;
            myObstacles[i].draw();
        }
        hero.newPos();
        hero.update();
        gameArea.frame += 1;
        gameArea.score += 0.01;
        score.update("Score: " + Math.floor(gameArea.score));
    },

    clear: function() { // xóa toàn bộ khung vẽ
        gameArea.context.clearRect(0, 0, this.canvas.width, this.canvas.width);
    },

    stop: function() {
        clearInterval(this.interval);
        nhacStop.play();
        alert("Game over");
    }
}