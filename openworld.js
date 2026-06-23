const bgImg = document.getElementById("backgroundStart");
const ctx = bgImg.getContext("2d");

const background = new Image();
background.src = "openStart.png";

    background.onload = () => {

        ctx.clearRect(0, 0, bgImg.width, bgImg.height);

        ctx.drawImage(background, 0, 0, bgImg.width, bgImg.height);
    };


//binar varaible to check if we started or not
var started = 0;

//initila spawn when start the game
//most like will never be used after we implment a save 
//or will be respawn for the case where ythe trainer lost a battle
const initSpawnX = 335;
const initSpawnY = 100;

const spriteImg = new Image();
spriteImg.src = "sprite.png";

//SPRITES IMG SIZE IS 64


const collisionZone = [
    {x: 15, y: 165, w: 71, h: 20},  // top left trees
    {x: 24, y: 310, w: 8,  h: 30}, //left tree
    {x: 24, y: 430, w: 8,  h: 30}, //left tree
    {x: 540, y: 220, w: 92,  h: 20}, //middle tree
    {x: 24, y: 650, w: 8,  h: 40}, //left bottom tree
    {x: 145, y: 620, w: 100,  h: 45}, //left bottom house


];


function isColliding(newX, newY) {
    return collisionZone.some(zone => 
        newX < zone.x + zone.w &&
        newX + 64 > zone.x &&
        newY < zone.y + zone.h &&
        newY + 64 > zone.y
    );
}


function init(){

    if(started == 0){
        ctx.drawImage(spriteImg,0 ,0,64, 64,initSpawnX,initSpawnY,64,64);
        requestAnimationFrame(init);
    }
    
}

init();


//made to slow down the sprite
//updateframe is amount of ticks until spriteframe can be updated
//baseframe is updated every function call
const updateFrame = 15;
var baseFrame = 0;


//used to move around the canvas
var MoveX =335;
var MoveY =100;
var dist = .4;


//initialized varaible for the start of each frame
var frameUp = 0;
var frameDown = 0;
var frameLeft =0;
var frameRight =0;

var action = 0;




function animateDown(){

    if(MoveY < bgImg.height-45 && !isColliding(MoveX, MoveY + dist)){
        MoveY += dist;
    }

    //console.log(MoveY);


    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(background, 0, 0, bgImg.width, bgImg.height);
    
    ctx.drawImage(spriteImg,frameDown * 64,0 * 64, 64, 64,MoveX,MoveY,64, 64);
    

    if(baseFrame % updateFrame == 0){
    if(frameDown < 3){
        frameDown++;
    }else{
        frameDown = 0;
    }
    }
    baseFrame++;

    if(action == 1){
    requestAnimationFrame(animateDown);
    }
}


function animateUp(){

    if(MoveY > 60 && !isColliding(MoveX, MoveY - dist)){
        MoveY -= dist;
    }


    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(background, 0, 0, bgImg.width, bgImg.height);
    
    ctx.drawImage(spriteImg,frameUp * 64,192, 64, 64,MoveX,MoveY,64, 64);
    

    if(baseFrame % updateFrame == 0){
    if(frameUp < 3){
        frameUp++;
    }else{
        frameUp = 0;
    }
    }
    baseFrame++;

    if(action == 1){
    requestAnimationFrame(animateUp);
    }
}



function animateRight(){

    if(MoveX < 1650 && !isColliding(MoveX + dist, MoveY)){
        MoveX += dist;
    }


    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(background, 0, 0, bgImg.width, bgImg.height);
    
    ctx.drawImage(spriteImg,frameRight * 64,128, 64, 64,MoveX,MoveY,64, 64);
    

    if(baseFrame % updateFrame == 0){
    if(frameRight < 3){
        frameRight++;
    }else{
        frameRight = 0;
    }
    }
    baseFrame++;

    if(action == 1){
    requestAnimationFrame(animateRight);
    }
}


function animateLeft(){

    if(MoveX > -15 && !isColliding(MoveX - dist, MoveY)){
        MoveX -= dist;
    }


    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(background, 0, 0, bgImg.width, bgImg.height);
    
    ctx.drawImage(spriteImg,frameLeft * 64,64, 64, 64,MoveX,MoveY,64, 64);
    

    if(baseFrame % updateFrame == 0){
    if(frameLeft < 3){
        frameLeft++;
    }else{
        frameLeft = 0;
    }
    }
    baseFrame++;

    if(action == 1){
    requestAnimationFrame(animateLeft);
    }
}




function stopAnimate() {
    //clear the sprite
    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(background, 0, 0, bgImg.width, bgImg.height);
    //draw sprite  back with the first sprite animation
    ctx.drawImage(spriteImg,0 ,0,64, 64,MoveX,MoveY,64,64);
    //set action back to zero
    action = 0;

} 


document.addEventListener('keydown', function(event){

    started = 1;
    if(event.key == "w"){

        animateUp();
        action =1;

    }else if(event.key == "s"){

        animateDown();
        action =1;

    }else if(event.key == "a"){

        animateLeft();
        action =1;

    }else if(event.key == "d"){

        animateRight();
        action =1;

    }

})

//once key up from wasd call stopanimate and in stop animate sets action back to 0

document.addEventListener('keyup', function(event){

    if(event.key == "w"){

        stopAnimate();

    }else if(event.key == "s"){

        stopAnimate();

    }else if(event.key == "a"){

        stopAnimate();

    }else if(event.key == "d"){

        stopAnimate();

    }

})



bgImg.addEventListener('mousemove', (e) => {
    const rect = bgImg.getBoundingClientRect();
    const scaleX = bgImg.width / rect.width;
    const scaleY = bgImg.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    console.log(x, y);
});