const bgImg = document.getElementById("backgroundStart");
const ctx = bgImg.getContext("2d");

ctx.fillStyle = "black";
ctx.fillRect(0, 0, bgImg.width, bgImg.height);
ctx.fillStyle = "white";
ctx.font = "40px Arial";
ctx.fillText("Loading...", bgImg.width/2 - 80, bgImg.height/2);


const background = new Image();
background.src = "imgs/proj3_images/openStart.png";

const background2 = new Image();
background2.src = "imgs/proj3_images/watermap.png";

const background3 = new Image();
background3.src = "imgs/proj3_images/cavemap.png";

const spriteImg = new Image();
spriteImg.src = "imgs/proj3_images/sprite.png";
//SPRITES IMG SIZE IS 64

const teleNoti = new Image();
teleNoti.src = "imgs/proj3_images/swimteleport.png";

const battleNoti = new Image();
battleNoti.src = "imgs/proj3_images/battlenoti.png";

const slotMach = new Image();
slotMach.src = "imgs/proj3_images/slotMachine.png";

const pullNoti = new Image();
pullNoti.src = "imgs/proj3_images/summon.png";

//after loading screen obtain the player name
//use player name to query the database
var playerName = localStorage.getItem("playerName");



//initila spawn when start the game
//if new game then 335, 100
//if loaded up then set init spawn to matching varible
//or will be respawn for the case where ythe trainer lost a battle
//used to move around the canvas
var MoveX =335;
var MoveY =100;
var dist = .3;

const initSpawnX =335;
const initSpawnY =100;

//check to see if we need to switch location
//1 for map 1 2 for map 2 3 for map 3
//when data base is implment make an if statement wether we are loading up 
//a save game or a new game
//if new the just set to one
var currMap =1;

//binar varaible to check if we started or not
//just used to see if game started primary function is 
//to spawn in character, once game starts wont be used again
var started = 0;

//make an if statment to check the save states map number, 
//then set this vraible to the coresponding map
//pull from data base, if not entry exist then default
var currBack = background;

//ensure player cant move until game loaded
var gameLoaded = false;

//load game from returning from battle
//load from database
//not done
async function loadGame(){

    //after returning to game remove battle type varaible
    if(localStorage.getItem("battleType")){
        localStorage.removeItem("battleType");
    }


        try{
            const response = await fetch(`load.php?playerName=${playerName}`);
            const data = await response.json();

            //if database cordinates are still at spawn then its a newplayer
            //database table for player has to set default 
            //x cord to 335
            //y to 100
            //map to 1
            if(data.coord_x == 335 || data.coord_y == 100 || data.current_map == 1){

                MoveX = initSpawnX;
                MoveY = initSpawnY;
                currMap = 1;
                currBack = background;
         //       console.log("new game");

            }else{

                MoveX = parseFloat(data.coord_x);
                MoveY = parseFloat(data.coord_y);
                currMap = parseInt(data.current_map);
                if(currMap == 1)currBack = background;
                if(currMap == 2)currBack = background2;
                if(currMap == 3)currBack = background3;
         //       console.log("save game");

            }
        } catch(fail){

            //this is here for retiurning to battle from a fight or encouncter for right now
            //database has not been implmented so i added this

            if(localStorage.getItem("mapNum") && localStorage.getItem("CordX") && localStorage.getItem("CordY")){

                MoveX = parseFloat(localStorage.getItem("CordX"));
                MoveY = parseFloat(localStorage.getItem("CordY"));
                currMap = parseInt(localStorage.getItem("mapNum"));

                if(currMap == 1)currBack = background;
                if(currMap == 2)currBack = background2;
                if(currMap == 3)currBack = background3;

                localStorage.removeItem("CordX");
                localStorage.removeItem("CordY");
                localStorage.removeItem("mapNum");

            }else{

                MoveX = initSpawnX;
                MoveY = initSpawnY;
                currMap = 1;
                currBack = background;
            }

     //       console.log("database not connected");


        }




    ctx.clearRect(0, 0, bgImg.width, bgImg.height);

    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);

    ctx.drawImage(spriteImg,0 ,0,64, 64,MoveX,MoveY,64,64);

    if(currMap == 1){
        ctx.drawImage(slotMach, 660, 100, 200, 100);
    }
    else if(currMap ==2){
        ctx.drawImage(slotMach, 10, 170, 200, 100);
    }
    else{
        ctx.drawImage(slotMach, 450, 200, 200, 100);
    }

    gameLoaded = true;


}


//Bug where load game would be called and images would be load
//this makes sure that all 6 images are load before load game gets called
//used as a source, images were not loading on load causing blank screen
//https://stackoverflow.com/questions/11071314/javascript-execute-after-all-images-have-loaded
const allImgs = [background, background2, background3, spriteImg, teleNoti, battleNoti, slotMach, pullNoti];

Promise.all(allImgs.map(img => new Promise(resolve => { img.onload = resolve; }))).then(() => {
    loadGame();
});




//done
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
    {x: 940, y: 550, w: 60, h: 200},

    {x: 760, y: 100, w: 20, h: 40}, //slot machine

];


//done
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
    {x: 200, y: 180, w: 60, h: 70}, //top left house
    {x: 600, y: 210, w: 60, h: 60}, //right, top left house
    {x: 1060, y: 210, w: 50, h: 60}, //right, top left house
    {x: 190, y: 520, w: 60, h: 60}, //top left house
    {x: 590, y: 510, w: 60, h: 70}, //top left house
    {x: 1320, y: 510, w: 50, h: 70}, //top left house
    {x: 1440, y: 510, w: 50, h: 70}, //top left house


    {x: 90, y: 170, w: 40, h: 40}, //slot machine

];

const collisionZoneCave = [

    {x: 0, y: 0, w: 1700, h: 200},

    {x: 750, y: 190, w: 190, h: 150}, //mid pillar
    {x: 280, y: 190, w: 120, h: 100}, //house
    //{x: 0, y: 560, w: 20, h: 450},
    {x: 1680, y: 190, w: 10, h: 950},
    {x: 1570, y: 840, w: 180, h: 150},
    //{x: 750, y: 810, w: 190, h: 180},
    //{x: 800, y: 600, w: 90, h: 190},
    //{x: 900, y: 840, w: 90, h: 100},
    {x: 910, y: 920, w: 640, h: 100},
    {x: 700, y: 960, w: 200, h: 50},
    {x: 370, y: 930, w: 100, h: 60},
    //{x: 0, y: 970, w: 300, h: 50},
    {x: 0, y: 0, w: 40, h: 1000},



    {x: 540, y: 200, w: 20, h: 40}, //slot machine
];

//done
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


//encounter zones in the water
const encounterZoneWater = [
    {x: 480, y: 740, w: 160, h: 100},
    {x: 1320, y: 290, w: 200, h: 230},
    {x: 930, y: 610, w: 200, h: 200}, 
    {x: 1130, y: 680, w: 200, h: 100},
];

//encounter zones in the cave
const encounterZoneCave = [
    {x: 0, y: 500, w: 1100, h: 280},
];

const trainerWater = [
    {x: 440, y: 410, w: 10, h: 10},
    {x: 920, y: 450, w: 10, h: 10},
];

const trainerCave = [
    {x: 1220, y: 720, w: 10, h: 10}, 
];

//these are all fast travel zones
const spawnToWater = [{x: 1140, y: 660, w: 40, h: 5},];

const waterToSpawn = [{x: 300, y: 0, w: 370, h: 130},];

const waterToCave = [{x: 40, y: 900, w: 150, h: 50},];

const caveToWater = [{x: 1140, y: 200, w: 60, h: 50},];


//slot machine zones

const spawnM = [{x: 740, y: 100, w: 50, h: 60},];

const waterM = [{x: 70, y: 170, w: 70, h: 60},];

const caveM = [{x: 520, y: 200, w: 60, h: 60},];




//uses some to check all collision zones
//passes x and y cordinate and checks wether it is in the area
// adds 64 due to size of our sprite
function inArea(newX,newY,area){
    return area.some(zone => 
        newX < zone.x + zone.w &&
        newX + 64 > zone.x &&
        newY < zone.y + zone.h &&
        newY + 64 > zone.y
    );
}

//checks wether player cords are in the zone for teleport
function isTeleport(newX, newY){
    if(currMap == 1){
        return inArea(newX,newY,spawnToWater);
    }else if(currMap == 2){
        return inArea(newX,newY,waterToSpawn) || inArea(newX,newY,waterToCave);
    }else if (currMap ==3 ){
        return inArea(newX,newY,caveToWater);
    }

}

//checks wether player cords are in the zone for battle
function isBattle(newX, newY){

    if(currMap == 2){
        return inArea(newX,newY,trainerWater);
    }else if (currMap == 3){
        return inArea(newX,newY,trainerCave);
    }

}


//checks wether player cords are in the zone for encounter
function isEncounter(newX, newY){

    if(currMap == 1){
        return inArea(newX,newY,encounterZone);
    }else if(currMap ==2){
        return inArea(newX,newY,encounterZoneWater);
    }else{
        return inArea(newX,newY,encounterZoneCave);

    }

}



//checks wether player cords are in the zone for collision
function isColliding(newX, newY){

    if(currMap == 1){
        return inArea(newX,newY,collisionZone);
    }else if(currMap ==2){
        return inArea(newX,newY,collisionZoneWater);
    } else{
        return inArea(newX,newY,collisionZoneCave);
    }
}


function isSlot(newX, newY){

    if(currMap == 1){
        return inArea(newX,newY,spawnM);
    }else if (currMap == 2){
        return inArea(newX,newY,waterM);
    }else if(currMap ==3){
        return inArea(newX,newY,caveM);
    }

}


//made to slow down the sprite
//updateframe is amount of ticks until spriteframe can be updated
//baseframe is updated every function call
const updateFrame = 25;
var baseFrame = 0;

//initialized varaible for the start of each frame
var frameUp = 0;
var frameDown = 0;
var frameLeft =0;
var frameRight =0;

var action = 0;

function animateDown(){

    if(gameLoaded == false){return;}

    //boundries
    if(MoveY < bgImg.height-45 && !isColliding(MoveX, MoveY + dist)){ MoveY += dist;}

    //encounter
    if(baseFrame % 40 == 0 &&  isEncounter(MoveX,MoveY)){

        if(Math.random() < .01){
            action = 0;
            stopAnimate();

            //if yes then save local storage
            //save battle type as encounter
            //send to battle screen
            
            if(confirm("pokemon enecounter, do you want to battle?")){

                saveGame();

                localStorage.setItem("battleType", 'encounter');
        
                window.location.href = "battle.html"


            }


        }
    }

    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);

    if(currMap == 1){
        ctx.drawImage(slotMach, 660, 100, 200, 100);
    }
    else if(currMap ==2){
        ctx.drawImage(slotMach, 10, 170, 200, 100);
    }
    else{
        ctx.drawImage(slotMach, 450, 200, 200, 100);
    }
    
    ctx.drawImage(spriteImg,frameDown * 64,0 * 64, 64, 64,MoveX,MoveY,64, 64);


    if(isTeleport(MoveX,MoveY)){

        if(currMap == 1)ctx.drawImage(teleNoti, 500, 200, 600, 300);
        if (currMap == 2)ctx.drawImage(teleNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(teleNoti, 500, 200, 600, 300);

    }

    if(isBattle(MoveX,MoveY)){
        if (currMap == 2)ctx.drawImage(battleNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(battleNoti, 500, 200, 600, 300);
    }

    if(isSlot(MoveX,MoveY)){

        if(currMap == 1)ctx.drawImage(pullNoti, 500, 200, 600, 300);
        if (currMap == 2)ctx.drawImage(pullNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(pullNoti, 500, 200, 600, 300);

    }

    if(baseFrame % updateFrame == 0){
    if(frameDown < 3){
        frameDown++;
    }else{
        frameDown = 0;
    }
    }
    baseFrame++;

    if(action == 1){requestAnimationFrame(animateDown);}
}


function animateUp(){

    if(gameLoaded == false){return;}

    if(MoveY > 60 && !isColliding(MoveX, MoveY - dist)){MoveY -= dist;}

    if(baseFrame % 40 == 0 &&  isEncounter(MoveX,MoveY)){

        if(Math.random() < .01){
            action = 0;
            stopAnimate();
            if(confirm("pokemon enecounter, do you want to battle?")){
                
                saveGame();

                localStorage.setItem("battleType", 'encounter');
        
                window.location.href = "battle.html"


            }
        }
    }


    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);

    if(currMap == 1){
        ctx.drawImage(slotMach, 660, 100, 200, 100);
    }
    else if(currMap ==2){
        ctx.drawImage(slotMach, 10, 170, 200, 100);
    }
    else{
        ctx.drawImage(slotMach, 450, 200, 200, 100);
    }
    
    ctx.drawImage(spriteImg,frameUp * 64,192, 64, 64,MoveX,MoveY,64, 64);

    if(isTeleport(MoveX,MoveY)){

        if(currMap == 1)ctx.drawImage(teleNoti, 500, 200, 600, 300);
        if (currMap == 2)ctx.drawImage(teleNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(teleNoti, 500, 200, 600, 300);

    }

    if(isBattle(MoveX,MoveY)){
        if (currMap == 2)ctx.drawImage(battleNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(battleNoti, 500, 200, 600, 300);
    }

    if(isSlot(MoveX,MoveY)){

        if(currMap == 1)ctx.drawImage(pullNoti, 500, 200, 600, 300);
        if (currMap == 2)ctx.drawImage(pullNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(pullNoti, 500, 200, 600, 300);

    }
    

    if(baseFrame % updateFrame == 0){
        if(frameUp < 3){
            frameUp++;
        }else{
            frameUp = 0;
        }
    }
    baseFrame++;

    if(action == 1){requestAnimationFrame(animateUp);}
}



function animateRight(){

    if(gameLoaded == false){return;}

    if(MoveX < 1650 && !isColliding(MoveX + dist, MoveY)){MoveX += dist;}

    if( baseFrame % 40 == 0 && isEncounter(MoveX,MoveY)){

        if(Math.random() < .01){
            action = 0;

            stopAnimate();

            if(confirm("pokemon enecounter, do you want to battle?")){
                
                saveGame();

                localStorage.setItem("battleType", 'encounter');
        
                window.location.href = "battle.html"


            }

        }

    }


    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);

    if(currMap == 1){
        ctx.drawImage(slotMach, 660, 100, 200, 100);
    }
    else if(currMap ==2){
        ctx.drawImage(slotMach, 10, 170, 200, 100);
    }
    else{
        ctx.drawImage(slotMach, 450, 200, 200, 100);
    }
    
    ctx.drawImage(spriteImg,frameRight * 64,128, 64, 64,MoveX,MoveY,64, 64);

    if(isTeleport(MoveX,MoveY)){

        if(currMap == 1)ctx.drawImage(teleNoti, 500, 200, 600, 300);
        if (currMap == 2)ctx.drawImage(teleNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(teleNoti, 500, 200, 600, 300);

    }

    if(isBattle(MoveX,MoveY)){
        if (currMap == 2)ctx.drawImage(battleNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(battleNoti, 500, 200, 600, 300);
    }

    if(isSlot(MoveX,MoveY)){

        if(currMap == 1)ctx.drawImage(pullNoti, 500, 200, 600, 300);
        if (currMap == 2)ctx.drawImage(pullNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(pullNoti, 500, 200, 600, 300);

    }
    

    if(baseFrame % updateFrame == 0){
        if(frameRight < 3){
            frameRight++;
        }else{
            frameRight = 0;
        }
    }
    baseFrame++;

    if(action == 1){requestAnimationFrame(animateRight);}
}


function animateLeft(){

    if(gameLoaded == false){return;}

    if(MoveX > -15 && !isColliding(MoveX - dist, MoveY)){MoveX -= dist;}

    if(baseFrame % 40 == 0 && isEncounter(MoveX,MoveY)){
        if(Math.random() < .01){
            action = 0;
            stopAnimate();
            if(confirm("pokemon enecounter, do you want to battle?")){
                
                saveGame();

                localStorage.setItem("battleType", 'encounter');
        
                window.location.href = "battle.html"


            }
        }
    }

    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);

    if(currMap == 1){
        ctx.drawImage(slotMach, 660, 100, 200, 100);
    }
    else if(currMap ==2){
        ctx.drawImage(slotMach, 10, 170, 200, 100);
    }
    else{
        ctx.drawImage(slotMach, 450, 200, 200, 100);
    }
    
    ctx.drawImage(spriteImg,frameLeft * 64,64, 64, 64,MoveX,MoveY,64, 64);

    if(isTeleport(MoveX,MoveY)){

        if(currMap == 1)ctx.drawImage(teleNoti, 500, 200, 600, 300);
        if (currMap == 2)ctx.drawImage(teleNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(teleNoti, 500, 200, 600, 300);

    }

    if(isBattle(MoveX,MoveY)){
        if (currMap == 2)ctx.drawImage(battleNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(battleNoti, 500, 200, 600, 300);
    }

    if(isSlot(MoveX,MoveY)){

        if(currMap == 1)ctx.drawImage(pullNoti, 500, 200, 600, 300);
        if (currMap == 2)ctx.drawImage(pullNoti, 700, 0, 600, 300);
        if(currMap ==3)ctx.drawImage(pullNoti, 500, 200, 600, 300);

    }

    if(baseFrame % updateFrame == 0){
    if(frameLeft < 3){
        frameLeft++;
    }else{
        frameLeft = 0;
    }
    }
    baseFrame++;

    if(action == 1){requestAnimationFrame(animateLeft);}
}


function stopAnimate() {
    //clear the sprite
    ctx.clearRect(0,0,bgImg.width,bgImg.height);
    ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
    if(currMap == 1){
        ctx.drawImage(slotMach, 660, 100, 200, 100);
    }
    else if(currMap ==2){
        ctx.drawImage(slotMach, 10, 170, 200, 100);
    }
    else{
        ctx.drawImage(slotMach, 450, 200, 200, 100);
    }
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
            if(currMap==1 ){
                //logic to switct to 2nd map

                currBack = background2;
                currMap = 2;

                ctx.clearRect(0,0,bgImg.width,bgImg.height);
                ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
                ctx.drawImage(slotMach, 10, 170, 200, 100);//slot machince

                MoveX = 400;
                MoveY = 100;

                ctx.drawImage(spriteImg,0 ,0,64, 64,400,100,64,64);

            }else if(currMap==2 && inArea(MoveX,MoveY,waterToSpawn)){

                //logic to switct to original map
                currBack = background;
                currMap = 1;

                ctx.clearRect(0,0,bgImg.width,bgImg.height);
                ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
                ctx.drawImage(slotMach, 660, 100, 200, 100);//slot machine 

                MoveX = 1140;
                MoveY = 620;

                ctx.drawImage(spriteImg,0 ,0,64, 64,1140,620,64,64);

            } else if(currMap==2 && inArea(MoveX,MoveY,waterToCave)){

                currBack = background3;
                currMap = 3;

                ctx.clearRect(0,0,bgImg.width,bgImg.height);
                ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
                ctx.drawImage(slotMach, 450, 200, 200, 100);

                MoveX = 1130;
                MoveY = 200;

                ctx.drawImage(spriteImg,0 ,0,64, 64,1130,200,64,64);

            }else if(currMap == 3){

                currBack = background2
                currMap = 2;

                ctx.clearRect(0,0,bgImg.width,bgImg.height);
                ctx.drawImage(currBack, 0, 0, bgImg.width, bgImg.height);
                ctx.drawImage(slotMach, 10, 170, 200, 100);//slot machince

                MoveX = 140;
                MoveY = 900;

                ctx.drawImage(spriteImg,0 ,0,64, 64,140,900,64,64);

            }
    
        }

    }else if (event.key == "f" && isBattle(MoveX,MoveY)){

        //transition into battle
        saveGame();

        localStorage.setItem("battleType", 'trainer');

        window.location.href = "battle.html"


    }else if(event.key == "f" && isSlot(MoveX,MoveY)){

        saveGame();

        window.location.href = ".html"

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


//saves every 5 seconds
setInterval(saveGame,10000);


//idk what to do, should i save under playername in the databswe???
function saveGame(){

    localStorage.setItem("CordX", MoveX);
    localStorage.setItem("CordY", MoveY);
    localStorage.setItem("mapNum", currMap);

    
    fetch("save.php", {

        method: "POST",
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({
            playerName: playerName,
            x: MoveX,
            y: MoveY,
            map: currMap,
        })
    });
    


}