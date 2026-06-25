const bgImg = document.getElementById("backgroundStart");
const ctx = bgImg.getContext("2d");

const background = new Image();
background.src = "openStart.png";

const background2 = new Image();
background2.src = "watermap.png";

const background3 = new Image();
background3.src = "cavemap.png";


var currBack = background;

    background.onload = () => {

        ctx.clearRect(0, 0, bgImg.width, bgImg.height);

        ctx.drawImage(background, 0, 0, bgImg.width, bgImg.height);
    };

const player = {

   playerName: "",
   pokeballs: 0,
   pokemon: 0,

};



//check to see if we need to switch location
//0 if map not in use, 1 if map in use
var map3 = 0;
var map2 =0;
var map1 = 1;

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


//teleport noti
const teleNoti = new Image();
teleNoti.src = "swimteleport.png";


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

const collisionZoneWater = [

    {x: 0, y: 0, w: 370, h: 130},
    {x: 700, y: 100, w: 1100, h: 35},
    {x: 750, y: 190, w: 190, h: 150},
    {x: 0, y: 190, w: 20, h: 150},
    {x: 0, y: 560, w: 20, h: 450},
    {x: 1680, y: 190, w: 10, h: 950},
    {x: 1570, y: 840, w: 180, h: 150},
    {x: 750, y: 810, w: 190, h: 180},
    {x: 800, y: 600, w: 90, h: 190},
    {x: 900, y: 840, w: 90, h: 100},
    {x: 960, y: 880, w: 600, h: 100},
    {x: 700, y: 940, w: 40, h: 50},
    {x: 300, y: 940, w: 160, h: 50},
    {x: 0, y: 970, w: 300, h: 50},



];

const collisionZoneCave = [




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

const encounterZoneWater = [


];

const encounterZoneCave = [


];

const spawnToWater = [{x: 1140, y: 660, w: 40, h: 5},];

const waterToSpawn = [{x: 300, y: 0, w: 370, h: 130},];

const waterToCave = [{x: 40, y: 900, w: 150, h: 50},];

const caveToWater = [];

function isTeleport(newX, newY){
    if(map1 == 1){
    return spawnToWater.some(zone => 
        newX < zone.x + zone.w &&
        newX + 64 > zone.x &&
        newY < zone.y + zone.h &&
        newY + 64 > zone.y
    );
    }else if(map2 == 1){
        return waterToSpawn.some(zone => 
            newX < zone.x + zone.w &&
            newX + 64 > zone.x &&
            newY < zone.y + zone.h &&
            newY + 64 > zone.y
        ) || waterToCave.some(zone =>
            newX < zone.x + zone.w &&
            newX + 64 > zone.x &&
            newY < zone.y + zone.h &&
            newY + 64 > zone.y
        );
    }else if (map3 ==1){
        return caveToWater.some(zone => 
            newX < zone.x + zone.w &&
            newX + 64 > zone.x &&
            newY < zone.y + zone.h &&
            newY + 64 > zone.y
        );

    }

}


function isEncounter(newX, newY){

    if(map1 == 1){
        return encounterZone.some(zone => 
            newX < zone.x + zone.w &&
            newX + 64 > zone.x &&
            newY < zone.y + zone.h &&
            newY + 64 > zone.y
        );
    }else if(map2 ==1){
        return encounterZoneWater.some(zone => 
            newX < zone.x + zone.w &&
            newX + 64 > zone.x &&
            newY < zone.y + zone.h &&
            newY + 64 > zone.y
        );
    }else{
        return encounterZoneCave.some(zone => 
            newX < zone.x + zone.w &&
            newX + 64 > zone.x &&
            newY < zone.y + zone.h &&
            newY + 64 > zone.y
        );

    }

    //map2 encounter
}


function isColliding(newX, newY){

    if(map1 == 1){
        return collisionZone.some(zone => 
            newX < zone.x + zone.w &&
            newX + 64 > zone.x &&
            newY < zone.y + zone.h &&
            newY + 64 > zone.y
        );
    }else if(map2 ==1){
        return collisionZoneWater.some(zone => 
            newX < zone.x + zone.w &&
            newX + 64 > zone.x &&
            newY < zone.y + zone.h &&
            newY + 64 > zone.y
        );
    } else{
        return collisionZoneCave.some(zone => 
            newX < zone.x + zone.w &&
            newX + 64 > zone.x &&
            newY < zone.y + zone.h &&
            newY + 64 > zone.y
        );


    }
    //map2 collsion
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
const updateFrame = 20;
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

    //boundries
    if(MoveY < bgImg.height-45 && !isColliding(MoveX, MoveY + dist)){
        MoveY += dist;
    }

    //encounter
    if(baseFrame % 40 == 0 &&  isEncounter(MoveX,MoveY)){

        if(Math.random() < .01){

            stopAnimate();

            confirm("pokemon enecounter, do you want to battle?");

        }

    }

    //console.log(MoveY);


    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
    
    ctx.drawImage(spriteImg,frameDown * 64,0 * 64, 64, 64,MoveX,MoveY,64, 64);


    if(isTeleport(MoveX,MoveY)){

        if(map1 == 1){
            ctx.drawImage(teleNoti, 0, 0, 1500, 800);
        } else if (map2 == 1){
            ctx.drawImage(teleNoti, 100, -300, 1500, 800);
        }else if(map3 ==1){
            ctx.drawImage(teleNoti, 100, -300, 1500, 800);
        }

    }
    

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

            confirm("pokemon enecounter, do you want to battle?");

        }

    }


    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
    
    ctx.drawImage(spriteImg,frameUp * 64,192, 64, 64,MoveX,MoveY,64, 64);

    if(isTeleport(MoveX,MoveY)){

        if(map1 == 1){
            ctx.drawImage(teleNoti, 0, 0, 1500, 800);
        } else if (map2 == 1){
            ctx.drawImage(teleNoti, 100, -300, 1500, 800);
        }else if(map3 ==1){
            ctx.drawImage(teleNoti, 100, -300, 1500, 800);
        }

    }
    

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

            confirm("pokemon enecounter, do you want to battle?");

        }

    }


    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
    
    ctx.drawImage(spriteImg,frameRight * 64,128, 64, 64,MoveX,MoveY,64, 64);

    if(isTeleport(MoveX,MoveY)){

        if(map1 == 1){
            ctx.drawImage(teleNoti, 0, 0, 1500, 800);
        } else if (map2 == 1){
            ctx.drawImage(teleNoti, 100, -300, 1500, 800);
        }else if(map3 ==1){
            ctx.drawImage(teleNoti, 100, -300, 1500, 800);
        }

    }
    

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

            confirm("pokemon enecounter, do you want to battle?");

        }

    }

    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
    
    ctx.drawImage(spriteImg,frameLeft * 64,64, 64, 64,MoveX,MoveY,64, 64);

    if(isTeleport(MoveX,MoveY)){

        if(map1 == 1){
            ctx.drawImage(teleNoti, 0, 0, 1500, 800);
        } else if (map2 == 1){
            ctx.drawImage(teleNoti, 100, -300, 1500, 800);
        }else if(map3 ==1){
            ctx.drawImage(teleNoti, 100, -300, 1500, 800);
        }

    }
    

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
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
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
    }else if(event.key == "e"){

        if(isTeleport(MoveX,MoveY)){

            stopAnimate();
            if(map1 == 1){
                //logic to switct to 2nd map

                currBack = background2;
                map1 = 0;
                map2 = 1;

                ctx.clearRect(0,0,bgImg.width,bgImg.height);
                ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);

                MoveX = 400;
                MoveY = 100;

                ctx.drawImage(spriteImg,0 ,0,64, 64,400,100,64,64);
                requestAnimationFrame(init);

            }else if(map2 == 1 && waterToSpawn.some(zone =>
                MoveX < zone.x + zone.w &&
                MoveX + 64 > zone.x &&
                MoveY < zone.y + zone.h &&
                MoveY + 64 > zone.y)){

                //logic to switct to original map
                currBack = background;
                map1 = 1;
                map2 = 0;

                ctx.clearRect(0,0,bgImg.width,bgImg.height);
                ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);

                MoveX = 1140;
                MoveY = 620;

                ctx.drawImage(spriteImg,0 ,0,64, 64,1140,620,64,64);
                requestAnimationFrame(init);

            } else if(map2 ==1 && waterToCave.some(zone =>
                MoveX < zone.x + zone.w &&
                MoveX + 64 > zone.x &&
                MoveY < zone.y + zone.h &&
                MoveY + 64 > zone.y)){

                currBack = background3;
                map2 = 0;
                map3 = 1;

                ctx.clearRect(0,0,bgImg.width,bgImg.height);
                ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);

                MoveX = 1130;
                MoveY = 200;

                ctx.drawImage(spriteImg,0 ,0,64, 64,1130,200,64,64);
                requestAnimationFrame(init);

            }else if(map3 == 1){

                currBack = background2
                map3 = 0;
                map2 = 1;

                ctx.clearRect(0,0,bgImg.width,bgImg.height);
                ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);

                MoveX = 400;
                MoveY = 100;

                ctx.drawImage(spriteImg,0 ,0,64, 64,400,100,64,64);
                requestAnimationFrame(init);

            }
    
        }

    }else if(event.key == "Tab"){

        //player inventory
        //prints it out when tab
        //list player name, pokemon and thier hp
        //how many potions you have
        //how many pokemballs you have
        //when keyup on tab clear

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
