//board
let board;
let boardHeight=800;
let boardWidth=400;
let context;

//bird
let birdwidth=50;
let birdheight=40;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let birdimg;
let bird={
    x: birdX,
    y: birdY,
    height: birdheight,
    width:birdwidth
}

let pipeArray=[]
let pipewidth=64;
let pipeheight=512;
let pipeX=boardWidth;
let pipeY=0;

let topPipeImg;
let BottomPipeImg;
let gameOver = false;
let score =0;
//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;


window.onload=function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");

    //draw flappybird
    // context.fillStyle="green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load images
    birdimg=new Image();
    birdimg.src="./flappybird.png";
    birdimg.onload=function(){
        context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);
    }
    
    topPipeImg= new Image();
    topPipeImg.src="./toppipe.png";

    bottomPipeImg= new Image();
    bottomPipeImg.src="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes,1500);
    document.addEventListener("keydown",moveBird);

}

function update(){
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0,0,board.width, board.height);

    //bird
    velocityY+=gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }
    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }

    }

       //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipewidth) {
        pipeArray.shift(); //removes first element from the array
    }
      //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes(){

    let randomPipeY=pipeY-pipeheight/4-(Math.random()*(pipeheight/2));
    let openingSpace = board.height/4;
    let topPipe={
        img:topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width:pipewidth,
        height:pipeheight,
        passed:false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeheight + openingSpace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -8;
}

//reset game
if (gameOver) {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
}
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}