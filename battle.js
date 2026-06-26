var battleIMG = document.getElementById("battleScreen");
var ctx = battleIMG.getContext('2d');
//store the pokemon loaded in, prevents flickering of pokemon
var imageCache = {};
//Used to animate the pokemon
var battleAnim = {
    playerOffsetX: 0,
    enemyOffsetX: 0,
};
var playerIndex = 0;
var enemyIndex = 0;
var playerMaxHP = 0;
var enemyMaxHP = 0;
var trainer = false;
var playerFaint = false;
var enemyFaint = false;

//used to store pokemons of each team 
var playerTeam = [
    {name: "", hp: 15, attack: 10, def:90, speed: 90,
         type1:"", type2:"", img:"proj3_images/1st Generation/126Magmar.png",
        move1: "", move2: "", move3: "", move4: ""}

]
var enemyTeam = [
    {name: "", hp: 15, attack: 10, def:90, speed: 90,
         type1:"", type2:"", img:"proj3_images/1st Generation/108Lickitung.png",
        move1: "", move2: "", move3: "", move4: ""}
]
//stores all the moves the pokemon's of both teams have 
//is a dictionary with the move name as the key
var enemyMoves = {}
var playerMoves = {}

//stores what text box shows
var battleUI = {
    mode: "intro",   // intro, moves, items, text, poke
    message: "A Wild Pokemon Appeared!",
    moves: []
}
//the battle feilds that are avaliable 
var backgrounds = {
    "grass": "proj3_images/grassEncounter.png",
    "water" : "proj3_images/waterEncounter.png",
    "cave": "proj3_images/caveEncounter.png" //might not use
}

//moves button size
var btnW = 500;
var btnH = 60;

//move button positions (2×2 grid)
var positions = [
{ x: 100,  y: 820 }, // Move 1
{ x: 650,  y: 820 }, // Move 2
{ x: 100,  y: 900 }, // Move 3
{ x: 650,  y: 900 } // Move 4
]

//the pokeball images to show amount of pokemon you have left
var pokeballImg = new Image();
pokeballImg.src = "proj3_images/pokeball.png";

//loades the image only once, only used for pokemon to stop flicker
function loadImage(src, callback) {
    if (imageCache[src]) {
        callback(imageCache[src]);
        return;
    }

    var img = new Image();
    img.onload = function () {
        imageCache[src] = img;
        callback(img);
    };
    img.src = src;
}
//used to load in the teams and set any variables
function initValues() {
    //load in player pokemon 

    //loads in enemy pokemon including trainers/wild pokemon

    //loads in your pokemon move

    //sets starting variables

    //checks if we are battling a trainer


}

//draws the battle screen with all its componites 
function drawBattleArena(area) {
    var bg = new Image();
    bg.src = backgrounds[area];

    bg.onload = function () {
        ctx.clearRect(0, 0, battleIMG.width, battleIMG.height)
        //draws the battle feild
        ctx.drawImage(bg, 0, 0, battleIMG.width, battleIMG.height);
        //going to be used to store the pokemon images
        var pokemon = playerTeam[playerIndex].img;
        var enemy = enemyTeam[enemyIndex].img;
        //draws your pokemon on the left
        if(!playerFaint)drawPokemon(pokemon, 100 + battleAnim.playerOffsetX, 680, true);
        //draws enmeny pokemon on the right
        if(!enemyFaint)drawPokemon(enemy, 1500 +  battleAnim.enemyOffsetX, 680);
        //player hp bar
        playerMaxHP = playerTeam[playerIndex].hp;
        drawHPBar(100, 350, 250, 25, playerTeam[playerIndex].hp, playerMaxHP);
        //enemy hp bar
        enemyMaxHP =  enemyTeam[enemyIndex].hp;
        drawHPBar(1350, 350, 250, 25, enemyTeam[enemyIndex].hp, enemyMaxHP)
        if (battleUI.mode === "intro" || battleUI.mode === "text") {
            drawTextBox();
        } else if (battleUI.mode === "moves") {
            drawMoveBox();
        } else if (battleUI.mode === "items") {
            //drawItemsBox(); // optional later
        }
        //shows the amount of pokemon you have left
        drawPokeballCount(20, 40, 6);
        //only draws the pokeball for trainers not wild pokemon
        if(trainer) drawPokeballCount(1615, 40, 6, true);
    
    }
}

//--The basic drawings of the pokemon, their health and pokemon count
//draws pokemon in a 250x250 box at the given location and flips the image if needed
function drawPokemon(imgSrc, x, y, flip = false) {
    loadImage(imgSrc, function(poke) {
        var boxW = 250;
        var boxH = 250;
        var w = poke.width;
        var h = poke.height;
        //scale to fit inside the box
        var scale = Math.min(boxW / w, boxH / h);
        var finalW = w * scale;
        var finalH = h * scale;
        //center inside the box
        var offsetX = (boxW - finalW) / 2;
        var  offsetY = (boxH - finalH) / 2;

        ctx.save();
        if (flip) {
            //flip horizontally around center
            ctx.translate(x + boxW / 2, y);
            ctx.scale(-1, 1);
            ctx.drawImage(poke, -finalW / 2 + offsetX, -finalH + offsetY, finalW, finalH);
        } else {
            //draw centered horizontally, anchored by feet
            ctx.translate(x - boxW / 2, y);
            ctx.drawImage(poke, offsetX, -finalH + offsetY, finalW, finalH);
        }
        ctx.restore();
    });
}

//draw hp bar of the pokemon above them 
function drawHPBar(x, y, width, height, hp, maxHp) {
    ctx.fillStyle = "#444";
    ctx.fillRect(x, y, width, height);
    //hp percent
    var percent = hp / maxHp;
    var barWidth = width * percent;
    //hp color
    if (percent > 0.5) ctx.fillStyle = "#4CAF50";      // green
    else if (percent > 0.2) ctx.fillStyle = "#FFEB3B"; // yellow
    else ctx.fillStyle = "#F44336";                    // red
    //fill HP
    ctx.fillRect(x, y, barWidth, height);
    //border
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
}
//draws the amount of pokemon you have centering the 
//1st pokeball to the left or right side
function drawPokeballCount(x, y, count, enemy = false) {
    var sizeX = 65;   
    var sizeY = 50;
    var spacing = 10;   // space between pokeballs

    for (var i = 0; i < count; i++) {
        if (!enemy) {
            var pos = x + i * (sizeX + spacing);
        }
        else {
            var pos = x - i * (sizeX + spacing);
        }
        ctx.save();
        //used to show fainted pokemon, goes out left to right
        if(i == 3) {
            ctx.filter = "grayscale(100%)";
        }
        ctx.drawImage(pokeballImg, pos, y, sizeX, sizeY);
        ctx.restore();
    }
}

//----The diffent texts boxs that could be drawn------

//the textbox for when you encounter a trainer or pokemon
function drawTextBox() {
    //the main text  box
    ctx.fillStyle = "white";
    ctx.fillRect(50, 800, 1600, 180);
    //border around the box
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 800, 1600, 180);
    //the text thats being drawn 
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";    
    ctx.textBaseline = "middle";  
    var centerX = 50 + 1600 / 2;
    var centerY = 800 + 180 / 2;
    ctx.fillText(battleUI.message, centerX, centerY);
    //the click to advance instruction
    ctx.font = "25px Arial";
    ctx.fillStyle = " dark grey";
    ctx.fillText("Click to Advance",1500, 920 );
}

function drawMoveBox() {
    //main box
    ctx.fillStyle = "white";
    ctx.fillRect(50, 800, 1600, 180);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 800, 1600, 180);

    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    //draws 4 move buttons
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        //button background
        ctx.fillStyle = "#e6e6e6";
        ctx.fillRect(pos.x, pos.y, btnW, btnH);
        //button border
        ctx.strokeStyle = "black";
        ctx.strokeRect(pos.x, pos.y, btnW, btnH);
        //only adds the names for the moves that exits
        if(i < battleUI.moves.length) {
            var move = battleUI.moves[i];
            ctx.fillStyle = "black";
            ctx.fillText(move, pos.x + btnW / 2, pos.y + btnH / 2);
        }
    }

    var itemX = 1200;
    var itemY = 900;
    //items button (bottom right)
    ctx.fillStyle = "#e6e6e6";
    ctx.fillRect(itemX, itemY, btnW -100, btnH);
    ctx.strokeStyle = "black";
    ctx.strokeRect(itemX, itemY,  btnW -100, btnH);
    ctx.fillStyle = "black";
    ctx.fillText("Items", itemX + (btnW -100)/2, itemY + btnH/2);
}
//draws the pokemon selection box
function drawPokeBox() {
    //the main text  box
    ctx.fillStyle = "white";
    ctx.fillRect(50, 800, 1600, 180);
    //border around the box
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 800, 1600, 180);
}

//----------Animations

//moxes the attacking pokemon lung forwards then goes back
function attackAnimation(person,callback) {
    var frame = 0;
    
    function step() {
        frame++;
        var forward = frame *5;
        var backward = (20 - frame)*5
        if(person === "enemy") {
            forward = -forward;
            backward = -backward
        }

        if (person === "player") {
            if (frame <= 10) battleAnim.playerOffsetX = forward;
            else battleAnim.playerOffsetX = backward;
        } else {
            if (frame <= 10) battleAnim.enemyOffsetX = forward;
            else battleAnim.enemyOffsetX = backward;
        }
        drawBattleArena(encounter);
        if (frame < 20) {
            requestAnimationFrame(step);
        } else {
            if (person === "player") battleAnim.playerOffsetX = 0;
            else battleAnim.enemyOffsetX = 0;
            callback();
        }
    }

    step();
}

//pokemon shakes to show damage
function damageAnimation(person, callback) {
    var frame = 0;
    var frameMax = 30;
    //shake amplitude (bigger = stronger shake)
    var amplitude = 25;

    function step() {
        frame++;
        if (person === "player") {
            if (Math.floor(frame / 5) % 2 === 0) battleAnim.playerOffsetX = amplitude;
            else battleAnim.playerOffsetX = -amplitude;
        }
        else {
            if (Math.floor(frame / 5) % 2 === 0) battleAnim.enemyOffsetX = amplitude;
            else battleAnim.enemyOffsetX = -amplitude;
        }
        drawBattleArena(encounter);
        if (frame < frameMax) {
            requestAnimationFrame(step);
        } else {
            if (person === "player") battleAnim.playerOffsetX = 0;
            else battleAnim.enemyOffsetX = 0;
            callback();
        }
    }

    step();
}

//stores what stage to draw
var encounter = "cave";
//draws the battle screen
drawBattleArena(encounter);


//----------Mouse click/ Mouse hover/ player interactions-----------------------

battleIMG.addEventListener("click", handleCanvasClick);
battleIMG.addEventListener("mousemove", handleMouseMove);

//helper function to see if the mouse is within the box 
//for the battle ui stuff
function getHoverTarget(mouseX, mouseY) {
    //checks if the mouse is within the textbox when the ui 
    //is in intro mode
    if (battleUI.mode === "intro" || battleUI.mode === "text") {
        var boxX = 50, boxY = 800, boxW = 1600, boxH = 180;

        if (
            mouseX >= boxX &&
            mouseX <= boxX + boxW &&
            mouseY >= boxY &&
            mouseY <= boxY + boxH
        ) {
            return "textbox";
        }
        return null;
    }
    //checks is the mouse is in one of the move boxes
    //that is a move
    if (battleUI.mode === "moves") {
        for (let i = 0; i < battleUI.moves.length; i++) {
            var pos = positions[i];
            if (
                mouseX >= pos.x &&
                mouseX <= pos.x + btnW &&
                mouseY >= pos.y &&
                mouseY <= pos.y + btnH
            ) {
                return { type: "move", index: i };
            }
        }

        //item button area
        var itemX = 1200;
        var itemY = 900;
        var itemW = btnW - 100;
        var itemH = btnH;
        if (
            mouseX >= itemX &&
            mouseX <= itemX + itemW &&
            mouseY >= itemY &&
            mouseY <= itemY + itemH
        ) {
            return "items";
        }
    }
    //needs to be implemented
   //your mouse is within a pokemon selection box
    if (battleUI.mode === "poke") {
    }

    return null;
}

//changes the cursor to the hand if the mouse is in
//a clickable area
function handleMouseMove(event) {
    var rect = battleIMG.getBoundingClientRect();
    var scaleX = battleIMG.width / rect.width;
    var scaleY = battleIMG.height / rect.height;
    //get the mouse posiotion scaled to the battle screen
    var mouseX = (event.clientX - rect.left) * scaleX;
    var mouseY = (event.clientY - rect.top) * scaleY;
    //stores if the mouse in within a clickable area
    var target = getHoverTarget(mouseX, mouseY);
    //change the cursur to be the hand if the area is clickable
    if(target) battleIMG.style.cursor = "pointer";
    else battleIMG.style.cursor= "default";
}

function handleCanvasClick(event) {
    var rect = battleIMG.getBoundingClientRect();
    var scaleX = battleIMG.width / rect.width;
    var scaleY = battleIMG.height / rect.height;
    //stores the mouse postion
    var mouseX = (event.clientX - rect.left) * scaleX;
    var mouseY = (event.clientY - rect.top) * scaleY;
    //store is the mouse is in a clickable area
    var target = getHoverTarget(mouseX, mouseY);

    //if the mouse is not in a clickable area
    //then return and dont waste time checking
    if (!target) return; 

    //for the intro/textbox
    if (target === "textbox") {
        battleUI.mode = "moves";
        drawBattleArena(encounter);
        return;
    }
    //for the move that was clicked
    if (target.type === "move") {
        var chosenMove = battleUI.moves[target.index];

        battleUI.mode = "intro";
        battleUI.message = "You used " + chosenMove + "!";
        drawBattleArena(encounter);
        attackAnimation("player", () => {
            damageAnimation("enemy", () => {
                console.log("Attack sequence complete");
            })
        })
        return;
    }

    //for the item button
    if (target === "items") {
        battleUI.mode = "intro";
        battleUI.message = "You opened your bag.";
        drawBattleArena(encounter);
        return;
    }
    
}

