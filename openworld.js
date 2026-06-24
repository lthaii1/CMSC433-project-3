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
    {x: 1070, y: 780, w: 180,  h: 220}, //bottom water
    {x: 1120, y: 700, w: 240,  h: 15}, //horzontal line water
    {x: 1390, y: 450, w: 20,  h: 250}, //vertical line water
    {x: 1400, y: 420, w: 300,  h: 125}, //top right body water
    {x: 1630, y: 230, w: 20,  h: 140},//need to add very top rightpond

    {x: 945, y: 120, w: 145, h: 70}, //bottom trees
    {x: 1100, y: 160, w: 145, h: 20}, //bottom trees
    {x: 1420, y: 120, w: 195, h: 70}, //bottom trees

    {x: 690, y: 720, w: 110, h: 40}, //bottom trees


];

const encounterZone = [

    {x: 390, y: 540, w: 250, h: 80}, //middle bush
    {x: 1020, y: 340, w: 230, h: 40}, //mid right bush
    {x: 1420, y: 340, w: 180, h: 40}, //top right bush
    {x: 420, y: 250, w: 10,  h: 30}, //middle tree
    {x: 475, y: 250, w: 10,  h: 5}, //middle tree
    {x: 50, y: 165, w: 200, h: 70},  // top left trees
    {x: 80, y: 310, w: 110, h: 190}, //bottom trees
    {x: 40, y: 520, w: 110, h: 40}, //bottom trees

];


function isEncounter(newX, newY){
    return encounterZone.some(zone => 
        newX < zone.x + zone.w &&
        newX + 64 > zone.x &&
        newY < zone.y + zone.h &&
        newY + 64 > zone.y
    );

}


function isColliding(newX, newY){
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

    //ADD ENCOUNTER CHECK

    if(baseFrame % 40 == 0 &&  isEncounter(MoveX,MoveY)){

        if(Math.random() < .01){

            stopAnimate();

            alert("pokemon enecounter");

        }

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

    if(baseFrame % 40 == 0 &&  isEncounter(MoveX,MoveY)){

        if(Math.random() < .01){

            stopAnimate();

            alert("pokemon enecounter");

        }

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

    if( baseFrame % 40 == 0 && isEncounter(MoveX,MoveY)){

        if(Math.random() < .01){

            stopAnimate();

            alert("pokemon enecounter");

        }

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

    if(baseFrame % 40 == 0 && isEncounter(MoveX,MoveY)){

        if(Math.random() < .01){

            stopAnimate();

            alert("pokemon enecounter");

        }

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
