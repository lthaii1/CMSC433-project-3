const battleIMG = document.getElementById("battleScreen");
const ctx = battleIMG.getContext('2d');

//the pokeball images to show amount of pokemon you have left
var pokeballImg = new Image();
pokeballImg.src = "proj3_images/pokeball.png";

//the battle feilds that are avaliable 
var backgrounds = {
    "grass": "proj3_images/grassEncounter.png",
    "water" : "proj3_images/waterEncounter.png",
    "cave": "proj3_images/caveEncounter.png"
}

//store the pokemon loaded in, prevents flickering of pokemon
var imageCache = {};

//used to animate the pokemon 
var playerOffsetX = 0;
var enemyOffsetX = 0;
var hoverTarget = false;

//used to store which pokemon is out and the battle situation
var playerIndex = 0;
var enemyIndex = 0;
var playerMaxHP = 0;
var enemyMaxHP = 0;
var trainer = false;
var playerDead = false;
var enemyDead = false;

//used to store pokemons of each team 
var playerTeam = [
    {name: "pok1", hp: 15, maxHP: 15 ,  attack: 10, def:90, speed: 80,
         type1:"", type2:"", img:"proj3_images/1st Generation/126Magmar.png",
        move1: "", move2: "", move3: "", move4: ""},
    {name:"poke2", hp: 0},
    {name: "poke3", hp: 20, img: "proj3_images/1st Generation/006Charizard.png"},
    {name: "poke4", hp: 60, img: "proj3_images/1st Generation/143Snorlax.png"},
    {name: "poke5", hp: 90, img: "proj3_images/1st Generation/099Kingler.png"}

];
var enemyTeam = [
    {name: "poke6", hp: 15, maxHP: 15, attack: 10, def:50, speed: 90,
         type1:"", type2:"", img:"proj3_images/1st Generation/108Lickitung.png",
        move1: "", move2: "", move3: "", move4: ""},
    {name: "poke6", hp: 0, maxHP: 15, attack: 10, def:90, speed: 90,
        type1:"", type2:"", img:"proj3_images/1st Generation/108Lickitung.png",
    move1: "", move2: "", move3: "", move4: ""},
];

//stores the moves of the pokemon of both teams 
var playerMoves = [
    {name: "tackle", base_power: "10"},
    {name: "peck", base_power: "10"},
    {name: "run", base_power: "10"},
    {name: "fly", base_power: "10"}
];
var enemyMoves = [
    {name: "tackle", base_power: "10"},
    {name: "peck", base_power: "10"},
    {name: "run", base_power: "10"},
    {name: "fly", base_power: "10"}
];


//text box information
var battleUI = {
    mode: "intro",   // intro, moves, items, text, switch, end
    message: "A Wild Pokemon Appeared!",
    moves: ["tackle", "peck", "run", "fly"]
};
//postion and demensions of the box
var boxW = 1600;
var boxH = 180;
var boxX = 50;
var boxY = 800;

//moves button size
var btnW = 500;
var btnH = 60;
var spacingTop = Math.floor((2*btnH - boxH)/3);
var spacingSide = Math.floor((2*btnW - boxW)/3);

//move button positions (2×2 grid)
var positions = [
    { x: 100,  y: 820 }, // Move 1
    { x: 650,  y: 820 }, // Move 2
    { x: 100,  y: 900 }, // Move 3
    { x: 650,  y: 900 } // Move 4
];

var switchW = 500;
var switchH = 70;
//postions of the pokemon for switching
var switchPositions = [
    { x: 75,  y: 813 },  // row 1 col 1
    { x: 600,  y: 813 },  // row 1 col 2
    { x: 1125, y: 813 },  // row 1 col 3

    { x: 75,  y: 897 },  // row 2 col 1
    { x: 600,  y: 897 },  // row 2 col 2
    { x: 1125, y: 897 }   // row 2 col 3
];


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
var encounter = "grass";
battleUI.message = "A Wild Pokemon Appeared!";
drawBattleArena(encounter);

//used to load in the teams and set any variables
function initValues() {
    //load in player pokemon 

    //checks if we are battling a trainer
    var battleType = localStorage.getItem("battleType");
    if (battleType == "trainer") trainer = true;

    //loads in enemy pokemon including trainers/wild pokemon
    if (!trainer) {
        var num = Math.floor(Math.random() * 36) + 1;
        //use that number to pick the pokemon with that id from database
    }
    else {
        //load in the trainer
    }
    var initialMessage = "";
    //set local varibles
    if (trainer) initialMessage = "Trainer Joe Appeared!";
    else initialMessage = "A Wild "+ enemyTeam[0].name + " Appeared!";

    //loads the moves of each pokemon
    loadMoves(playerTeam[playerIndex], playerMoves, true); 
    loadMoves(enemyTeam[enemyIndex], enemyMoves);

   
    //checks what map we are and set the correct battle scene
    var currMap = localStorage.getItem("currMap");
    
    switch(currMap) {
        case 1:
            encounter = "grass";
            break;
        case 2:
            encounter = "water";
            break;
        case 3:
            encounter = "cave";
            break;
        default:
            encounter = "grass";
            break;
    }
    
    //draws the scene   
    drawBattleArena(encounter); 
}

//loads
function loadMoves(pokemon, teamMoves, player = false) { 
    if (player) battleUI.moves = [];
    
    var moves = [pokemon.move1, pokemon.move2, pokemon.move3, pokemon.move4 ];

    for (var m of moves) {
        if (m) {
            teamMoves.push(m);
            //needs to be updated to store onlt the moves name
            //not the move object
            if (player) battleUI.moves.push(m);
        }
    }
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
        drawPokemon(pokemon, 100 + playerOffsetX, 680, true);
        //draws enmeny pokemon on the right
        drawPokemon(enemy, 1500 + enemyOffsetX, 680);
        //player hp bar
        playerMaxHP = playerTeam[playerIndex].maxHP;
        drawHPBar(100, 350, 250, 25, playerTeam[playerIndex].hp, playerMaxHP);
        //enemy hp bar
        enemyMaxHP =  enemyTeam[enemyIndex].maxHP;
        drawHPBar(1350, 350, 250, 25, enemyTeam[enemyIndex].hp, enemyMaxHP)
        //draws the textbox with theinteractons on the bottom
        drawBox();
        //shows the amount of pokemon you have left
        drawPokeballCount(20, 40, playerTeam.length);
        //only draws the pokeball for trainers not wild pokemon
        if(trainer) drawPokeballCount(1615, 40, enemyTeam.length, true);
    
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
        var offsetY = (boxH - finalH) / 2;

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
            var teamIndex = enemyTeam.length -1 -i;
        }
        ctx.save();
        //checks if that pokemon fainted and draws a grey pokeball
        if (!enemy) {
          if(playerTeam[i].hp <= 0) ctx.filter = "grayscale(100%)";
        }else {
            if (enemyTeam[teamIndex].hp <= 0) ctx.filter = "grayscale(100%)";
        }
        ctx.drawImage(pokeballImg, pos, y, sizeX, sizeY);
        ctx.restore();
    }
}

//----The diffent texts boxs that could be drawn------

//the textbox for when you encounter a trainer or pokemon
function drawBox() {
    //the main text  box
    ctx.fillStyle = "white";
    ctx.fillRect(50, 800, 1600, 180);
    //border around the box
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 800, 1600, 180);
    //chose whats in the box
    if (battleUI.mode === "intro" || battleUI.mode === "text") {
            drawTextBox();
        } else if (battleUI.mode === "moves") {
            drawMoveBox();
        } else if (battleUI.mode === "items") {
            //drawItemsBox(); // optional later
        }else if (battleUI.mode === "switch") {
            drawSwitchBox();
        }
}
function drawTextBox() {
    //highlights the box 
    if (hoverTarget === "textbox") ctx.fillStyle = "#ffffcc";
    else ctx.fillStyle = "white";

    ctx.fillRect(50, 800, 1600, 180);

    //the text thats being drawn 
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";    
    ctx.textBaseline = "middle";  
    var centerX = boxX + boxW/2;
    var centerY = boxY + boxW/2;
    ctx.fillText(battleUI.message, centerX, centerY);
    //the click to advance instruction
    ctx.font = "25px Arial";
    ctx.fillStyle = " dark grey";
    ctx.fillText("Click to Advance",1500, 920 );
}

function drawMoveBox() {
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    //draws 4 move buttons
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];

        //hightlighs the button
         if (hoverTarget && hoverTarget.type === "move" && hoverTarget.index === i) {
            ctx.fillStyle = "#ffff99"; // light yellow highlight
        } else {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(pos.x, pos.y, btnW, btnH);
        ctx.strokeStyle = "black";
        ctx.strokeRect(pos.x, pos.y, btnW, btnH);
        //only adds the names for the moves that exits
        if(i < battleUI.moves.length) {
            var move = battleUI.moves[i];
            ctx.fillStyle = "black";
            ctx.fillText(move, pos.x + btnW / 2, pos.y + btnH / 2);
        }
    }
    //item button (bottom right)
    var itemX = 1350;
    var itemY = 900;
    
    //hilghts the button
    if (hoverTarget === "items") ctx.fillStyle = "#ffff99";
    else ctx.fillStyle = "white";
    ctx.fillRect(itemX, itemY, btnW/2, btnH);
    ctx.strokeStyle = "black";
    ctx.strokeRect(itemX, itemY,  btnW/2, btnH);
    ctx.fillStyle = "black";
    ctx.fillText("Items", itemX + (btnW/2)/2, itemY + btnH/2);

    //switch button (top right)
    var switchX = 1350;
    var switchY = 820;
    //highlights the button
    if (hoverTarget === "switch") ctx.fillStyle = "#ffff99";
    else ctx.fillStyle = "white";
    ctx.fillRect(switchX, switchY, btnW/2, btnH);
    ctx.strokeStyle = "black";
    ctx.strokeRect(switchX, switchY, btnW/2, btnH);
    ctx.fillStyle = "black";
    ctx.fillText("Switch", switchX + (btnW/2)/2, switchY + btnH/2);

}

//draws all your pokemon, up to 6
function drawSwitchBox() {
    for (let i = 0; i < 6; i++) {
        var pos = switchPositions[i];
        //draws a grey box if you have less then 6 pokemon
        if(i >= playerTeam.length) {
            ctx.fillStyle = "#7a7878"
            ctx.fillRect(pos.x, pos.y, switchW, switchH);
            ctx.strokeStyle = "black";
            ctx.strokeRect(pos.x, pos.y, switchW, switchH);
        }
        else {
            var p = playerTeam[i];
            ctx.font = "28px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            //changes the box color for highlight and fainted
            if (hoverTarget && hoverTarget.type === "poke" && hoverTarget.index === i) {
                ctx.fillStyle = "#ffff99";
            } else if (p.hp <= 0)  ctx.fillStyle = "#94908f"
            else ctx.fillStyle = "white";
            ctx.fillRect(pos.x, pos.y, switchW, switchH);

            ctx.strokeStyle = "black";
            ctx.strokeRect(pos.x, pos.y, switchW, switchH);

            //pokemon name
            ctx.fillStyle = "black";
            ctx.fillText(p.name, pos.x + switchW/2, pos.y + switchH/3);

            //show hp
            ctx.font = "22px Arial";
            if (p.hp <= 0) {
                ctx.fillStyle = "red";
                ctx.fillText("(Fainted)",  pos.x + switchW/2, pos.y + 3*(switchH/4));
            }else {
                ctx.fillText(`HP: ${p.hp}/${p.maxHp}`, pos.x + switchW/2, pos.y + 3*(switchH/4));
            }
        }
        
    }
}

function calculateDamage(attacker, defender, movePower = 40) {
    // Basic Pokémon-style damage formula
    var level = 5; // fixed level for now
    var attack = attacker.attack;
    var defense = defender.def;

    var base = (((2 * level / 5 + 2) * movePower * (attack / defense)) / 50) + 2;

    // Random variation (85%–100%)
    var random = (Math.random() * 0.15) + 0.85;

    return Math.floor(base * random);
}
//reduces the hp of the pokemon taking damage
function applyDamage(targetTeam, index, dmg) {
    targetTeam[index].hp -= dmg;
    if (targetTeam[index].hp < 0) targetTeam[index].hp = 0;
}

//returns a number between 0 and the number ofr moves the enemy has
function enemyChooseMove() {
    return Math.floor(Math.random() * enemyMoves.length);
}

function checkTeamDead(team) {
    for (let i = 0; i < team.length; i++) {
        if (team[i].hp > 0) {
            return false; // at least one Pokémon is still alive
        }
    }
    return true; // all Pokémon are fainted
}

function playerAttack( attacker, defender, index,  callback) {
    attackAnimation("player", () => {
                var power =  playerMoves[index].base_power;
                var dmg = calculateDamage(attacker, defender, power);
                applyDamage(enemyTeam, enemyIndex, dmg);
                
                damageAnimation("enemy", () =>{
                    
                    if(defender.hp <= 0) {
                        battleUI.message =  defender.name + " fainted!";
                        drawBattleArena(encounter);
                        
                        //checks if the trainer or wild pokemon is dead
                        if (checkTeamDead(enemyTeam)) {
                            enemyDead = true;
                            battleUI.message = "You Won!!!!!";
                            battleUI.mode = "end";
                            drawBattleArena(encounter);
                            return;
                        }
                        //trainer uses their next pokemon
                        enemyIndex++;
                        loadMoves(enemyTeam[enemyIndex], enemyMoves);
                        battleUI.message = "Enemy sent out " + enemyTeam[enemyIndex].name + "!";
                        battleUI.mode = "intro";
                        drawBattleArena(encounter);
                        return;

                    }
                    callback();
                })
            })
}

function enemyAttack (attacker, defender, callback) {
    attackAnimation("enemy", () => {
                    var selectedMove = enemyMoves[enemyChooseMove()];
                    battleUI.message =  attacker.name + " used " +selectedMove.name;
                    drawBattleArena(encounter);

                    var power = selectedMove.base_power;
                    var dmg = calculateDamage(attacker, defender, power);
                    applyDamage(playerTeam, playerIndex, dmg);

                    damageAnimation("player", () =>{
                        if(defender.hp <= 0) {
                            battleUI.message = defender.name + " fainted!";
                            drawBattleArena(encounter);
                            if (checkTeamDead(playerTeam)) {
                                playerDead = true;
                                battleUI.message = "You Have dies!!";
                                battleUI.mode = "end";
                                drawBattleArena(encounter);
                            }
                            //player goes to the pokemon selection screen
                            battleUI.mode = "switch";
                            battleUI.message = "Choose a Pokemon"
                            drawBattleArena(encounter);
                            return;
                        }
                        callback();
                    })
                })
}

function turnManager(playerMoveIndex) {
    var player = playerTeam[playerIndex];
    var enemy = enemyTeam[enemyIndex];

    var playerFirst = player.speed >= enemy.speed;

    if (playerFirst) {
        playerAttack(player, enemy, playerMoveIndex, () => {
            // Only attack if enemy survived
            if (!enemyDead && enemy.hp > 0) {
                enemyAttack(enemy, player);
            }
        });
    } else {
        enemyAttack(enemy, player, () => {
            // Only attack if player survived
            if (!playerDead && player.hp > 0) {
                playerAttack(player, enemy, playerMoveIndex);
            }
        });
    }
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
            if (frame <= 10) playerOffsetX = forward;
            else playerOffsetX = backward;
        } else {
            if (frame <= 10) enemyOffsetX = forward;
            else enemyOffsetX = backward;
        }
        drawBattleArena(encounter);
        if (frame < 20) {
            requestAnimationFrame(step);
        } else {
            if (person === "player") playerOffsetX = 0;
            else enemyOffsetX = 0;
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
            if (Math.floor(frame / 5) % 2 === 0) playerOffsetX = amplitude;
            else playerOffsetX = -amplitude;
        }
        else {
            if (Math.floor(frame / 5) % 2 === 0) enemyOffsetX = amplitude;
            else enemyOffsetX = -amplitude;
        }
        drawBattleArena(encounter);
        if (frame < frameMax) {
            requestAnimationFrame(step);
        } else {
            if (person === "player") playerOffsetX = 0;
            else enemyOffsetX = 0;
            callback();
        }
    }

    step();
}

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
        var itemX = 1350;
        var itemY = 900;
        var itemW = btnW/2;
        var itemH = btnH;
        if (
            mouseX >= itemX &&
            mouseX <= itemX + itemW &&
            mouseY >= itemY &&
            mouseY <= itemY + itemH
        ) {
            return "items";
        }

        //switch button area
        var itemX = 1350;
        var itemY = 820;
        var itemW = btnW/2;
        var itemH = btnH;
        if (
            mouseX >= itemX &&
            mouseX <= itemX + itemW &&
            mouseY >= itemY &&
            mouseY <= itemY + itemH
        ) {
            return "switch";
        }
    }
    //needs to be implemented
    if (battleUI.mode === "item") {}
    if (battleUI.mode === "switch") {
        for (let i = 0; i < 6; i++) {
            var pos = switchPositions[i];
            //checks if pokemon exits
            if(i < playerTeam.length) {
                if (
                    mouseX >= pos.x &&
                    mouseX <= pos.x + switchW &&
                    mouseY >= pos.y &&
                    mouseY <= pos.y + switchH &&
                    playerTeam[i].hp >0 //not fainted
                ) {
                    return { type: "poke", index: i };
                }
            }
        }
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
    hoverTarget = getHoverTarget(mouseX, mouseY);
    //change the cursur to be the hand if the area is clickable
    if(hoverTarget) battleIMG.style.cursor = "pointer";
    else battleIMG.style.cursor= "default";
    
    drawBattleArena(encounter); // redraw to show highlight
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

        battleUI.mode = "text";
        battleUI.message = "You used " + chosenMove + "!";
        drawBattleArena(encounter);
        turnManager(target.index);
    }

    //for the item button
    if (target === "items") {
        battleUI.mode = "intro";
        battleUI.message = "You opened your bag.";
        drawBattleArena(encounter);
        return;
    }
    //when you press the switch button
    if (target === "switch") {
        battleUI.mode = "switch";
        drawBattleArena(encounter);
        return;
    }
    if (target.type === "poke") {
        playerIndex =  target.index;
        loadMoves(playerTeam[playerIndex], playerMoves, true);

        battleUI.mode = "moves"
        drawBattleArena(encounter);
        return;
    }
   
}