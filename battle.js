const battleIMG = document.getElementById("battleScreen");
const ctx = battleIMG.getContext('2d');

//adds background music
const battleMusic = new Audio("proj3_audio/battle_music.mp3");
battleMusic.loop = true;      
battleMusic.volume = 0.3;     

const volumeStep = 0.05;


//toggles the mucisc with 'm' and the volume is adjusted using arrow keys
var battleMusicStarted = false;
document.addEventListener("keydown", function(event) {
    if(event.key === "m") {
        if (!battleMusicStarted){
            battleMusic.play();
            battleMusicStarted = true;
        }else {
            battleMusic.pause();
            battleMusicStarted = false;
        }
    } 
    if (event.key === "ArrowUp") {
        battleMusic.volume = Math.min(1, battleMusic.volume + volumeStep);
    }
    if (event.key === "ArrowDown") {
        battleMusic.volume = Math.max(0, battleMusic.volume - volumeStep);
    }
    
});



//the pokeball images to show amount of pokemon you have left
const pokeballImg = new Image();
pokeballImg.src = "imgs/proj3_images/pokeball.png";

//the battle feilds that are avaliable 
var backgrounds = {
    "grass": "imgs/proj3_images/grassEncounter.png",
    "water" : "imgs/proj3_images/waterEncounter.png",
    "cave": "imgs/proj3_images/caveEncounter.png"
}

var encounter = "";

//store the pokemon loaded in, prevents flickering of pokemon
var imageCache = {};
//stores the name of the triners that could appear
const weightedTrainer = [
    "May", "May", "May", "May", "May", //24% to get thre trainer Mary
    "Gary", "Gary", "Gary", "Gary", "Gary", //24% to get thre trainer Garry
    "Barry", "Barry", "Barry", "Barry", "Barry", //24% to get thre trainer Barry
    "Joe", "Joe", "Joe", //14% to get the trainer Joe
    "Ash", "Ash", //9% to get trainer Ash
    "Red" //5% to get trainer Red
];

//used to animate the pokemon 
var playerOffsetX = 0;
var enemyOffsetX = 0;
var hoverTarget = false;

//used to store which pokemon is out and the battle situation
const playerName = localStorage.getItem("playerName");
const battleType = localStorage.getItem("battleType");
var playerIndex = 0;
var enemyIndex = 0;
var trainer = false;
var switchTurn = false; //used to see if you are switching manually
var playerDead = false;
var enemyDead = false;


//used to store pokemons of each team 
var playerTeam = [];
var enemyTeam = [];

//stores the moves of each pokemon for each team
var playerMoves = [];
var enemyMoves = [];

//text box information
var battleUI = {
    mode: "intro",   // intro, moves, battle, switch, end
    message: "",
    moves: []
};

//postion and dimensions of the box
var boxW = 1600;
var boxH = 180;
var boxX = 50;
var boxY = 800;

//moves button size
var btnW = 500;
var btnH = 60;
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

const typeChart = {
    normal:   { rock: 0.5, ghost: 0},
    fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5},
    water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5 },
    ice:      { fire: 0.5, water: 0.5, grass: 2, ground: 2, flying: 2, dragon: 2},
    fighting: { normal: 2, ice: 2, rock: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, ghost: 0 },
    poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5},
    ground:   { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
    flying:   { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
    psychic:  { fighting: 2, poison: 2, psychic: 0.5, steel: 0. },
    bug:      { grass: 2, psychic: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5},
    rock:     { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5},
    ghost:    { psychic: 2, ghost: 2, normal: 0 },
    dragon:   { dragon: 2}
};

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



initValues();

//used to load in the teams and set any variables
async function initValues() {
    //load in player pokemon 
    const teamRes = await fetch("load_team.php?name=" + playerName);
    const teamData = await teamRes.json();
    console.log("teamData from PHP:", teamData);


    playerTeam = teamData.map(p => ({
        id: p.id,
        name: p.name,
        hp: p.current_hp,
        maxHP: p.max_hp,
        attack: p.attack,
        def: p.defense,
        speed: p.speed,
        type1: p.type1,
        type2: p.type2,
        img: p.image_path
    }));
    console.log("playerTeam mapped:", playerTeam);
    //checks if we are battling a trainer
    if (battleType == "trainer") trainer = true;

    //loads in enemy pokemon including trainers/wild pokemon
    if (!trainer) {
        const wildRes = await fetch("load_random.php");
        const wild = await wildRes.json();

        enemyTeam = [{
            id: wild.id,
            name: wild.name,
            hp: wild.hp,
            maxHP: wild.max_hp,
            attack: wild.attack,
            def: wild.defense,
            speed: wild.speed,
            type1: wild.type1,
            type2: wild.type2,
            img: wild.image_path
        }];

    }
    else {
        //load in the trainer
        var trainerName = weightedTrainer[Math.floor(Math.random() * weightedTrainer.length)];
        const trainerRes = await fetch("load_team.php?name=" + trainerName);
        const trainerData = await trainerRes.json();

        enemyTeam = trainerData.map(p => ({
            id: p.id,
            name: p.name,
            hp: p.current_hp,
            maxHP: p.max_hp,
            attack: p.attack,
            def: p.defense,
            speed: p.speed,
            type1: p.type1,
            type2: p.type2,
            img: p.image_path
        }));
    }

    var initialMessage = "";
    //set local varibles
    if (trainer) initialMessage = "Trainer " + trainerName +  " Appeared!";
    else initialMessage = "A Wild "+ enemyTeam[enemyIndex].name + " Appeared!";
    battleUI.message = initialMessage;

    //loads the moves of each team
    await loadMoves(playerTeam, playerMoves); 
    await loadMoves(enemyTeam, enemyMoves);

    //loads the moves to the ui
    loadMoveNames();
   
    const response = await fetch(`load.php?playerName=${playerName}`);
    const data = await response.json();
    //checks what map we are and set the correct battle scene
    var currMap = parseInt(data.current_map);
    switch(currMap) {
        case 1: encounter = "grass"; break;
        case 2: encounter = "water"; break;
        case 3: encounter = "cave"; break;
        default: encounter = "grass"; break;
    }
   
    //draws the scene   
    drawBattleArena(encounter); 
}

//loads the moves of the given pokemon
async function loadMoves(team, teamMoves) { 
    for (var i = 0; i < team.length; i++) {
        var p = team[i];
        
        var res = await fetch("load_moves.php?id=" + p.id);
        var moves = await res.json(); 

        teamMoves[i] = moves.map(m => ({
            name: m.name,
            type: m.type,
            base_power: m.power
        }))
    }
}

function loadMoveNames() {
    battleUI.moves = [];
    var moves = playerMoves[playerIndex];

    for( var i = 0; i < moves.length; i++) {
        battleUI.moves.push(moves[i].name);
    }

}

//draws the battle screen with all its componites 
function drawBattleArena(area) {
    var bg = new Image();
    bg.src = backgrounds[area];

    bg.onload = function () {
        ctx.clearRect(0, 0, battleIMG.width, battleIMG.height)
        ctx.drawImage(bg, 0, 0, battleIMG.width, battleIMG.height);
        
        //going to be used to store the pokemon images
        var pokemon = playerTeam[playerIndex].img;
        var enemy = enemyTeam[enemyIndex].img;
        
        //draws your pokemon on the left
        drawPokemon(pokemon, 100 + playerOffsetX, 680, true);
        //draws enmeny pokemon on the right
        drawPokemon(enemy, 1500 + enemyOffsetX, 680);
        
        //player hp bar
        var playerMaxHP = playerTeam[playerIndex].maxHP;
        drawHPBar(100, 350, 250, 25, playerTeam[playerIndex].hp, playerMaxHP);
        //enemy hp bar
        var enemyMaxHP =  enemyTeam[enemyIndex].maxHP;
        drawHPBar(1350, 350, 250, 25, enemyTeam[enemyIndex].hp, enemyMaxHP)
        
        //draws the textbox with theinteractons on the bottom
        drawBox();
        
        //shows the amount of pokemon you have left
        drawPokeballCount(20, 40, playerTeam.length);
        //only draws the pokeball for trainers not wild pokemon
        if(trainer) drawPokeballCount(1615, 40, enemyTeam.length, true);
    
    }
}

//----------The basic drawings of the pokemon, their health and pokemon count-------------------

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
    if (percent > 0.5) ctx.fillStyle = "#4CAF50";      
    else if (percent > 0.2) ctx.fillStyle = "#FFEB3B"; 
    else ctx.fillStyle = "#F44336";                    
    
    //fill HP
    ctx.fillRect(x, y, barWidth, height);
   
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
}

//draws the amount of pokemon you have centering the 
//1st pokeball to the left or right side
function drawPokeballCount(x, y, count, enemy = false) {
    var sizeX = 65;   
    var sizeY = 50;
    var spacing = 10; 

    for (var i = 0; i < count; i++) {
        if (!enemy) {
            var pos = x + i * (sizeX + spacing);
        }
        else {
            var pos = x - i * (sizeX + spacing);
            //used to make the last drawn pokeball represent the 1st pokemon
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
    if (battleUI.mode === "intro" || battleUI.mode === "battle" || battleUI.mode === "end") {
            drawTextBox();
        } else if (battleUI.mode === "moves") {
            drawMoveBox();
        } else if (battleUI.mode === "switch") {
            drawSwitchBox();
        }
}

//puts text in the text box
function drawTextBox() {
    //highlights the box 
    if (hoverTarget === "textbox" || hoverTarget === "end") { 
        ctx.fillStyle = "#ffffcc";
    }else ctx.fillStyle = "white";

    ctx.fillRect(50, 800, 1600, 180);

    //the text thats being drawn 
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";    
    ctx.textBaseline = "middle";  
    var centerX = boxX + boxW/2;
    var centerY = boxY + boxH/2;
    ctx.fillText(battleUI.message, centerX, centerY);
}

//shows your moves and options to use an item or switch pokemon
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

    //run button (bottom right)
    var runX = 1350;
    var runY = 900;
    
    //highlights the button
    if (hoverTarget === "run") ctx.fillStyle = "#ffff99";
    else ctx.fillStyle = "white";
    ctx.fillRect(runX, runY, btnW/2, btnH);
    ctx.strokeStyle = "black";
    ctx.strokeRect(runX, runY, btnW/2, btnH);
    ctx.fillStyle = "black";
    ctx.fillText("Run", runX + (btnW/2)/2, runY + btnH/2);

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
                ctx.fillText(`HP: ${p.hp}/${p.maxHP}`, pos.x + switchW/2, pos.y + 3*(switchH/4));
            }
        }
        
    }
}

//------- All the functions related battling-------------------

//calculates the damge the given move does to the pokemon
function calculateDamage(attacker, defender, move) {
    // Basic Pokémon-style damage formula
    var level = 10; // fixed level for now
    var attack = attacker.attack;
    var defense = defender.def;
    var movePower = move.base_power;

    var stab = 1;
    if(move.type === attacker.type1 || move.type === attacker.type2)  {
        stab = 1.5;
    }

    if(move.special != null) attack = attack *3;

    var base = (((2 * level / 5 + 2) * movePower * (attack / defense)) / 50) + 2;

    var type1 = getTypeEffectiveness(move.type, defender.type1);
    var type2 = getTypeEffectiveness(move.type, defender.type2);
    // Random variation (85%–100%)
    var random = (Math.random() * 0.15) + 0.85;

    return Math.floor(base *stab *type1 *type2 *random);
}

function getTypeEffectiveness(moveType, defenderType) {
    if (!defenderType) return 1;
    defenderType = defenderType.toLowerCase();

        if (typeChart[moveType] && typeChart[moveType][defenderType]) {
            return typeChart[moveType][defenderType];
        }
    return 1;
}

//reduces the hp of the pokemon taking damage
function applyDamage(targetTeam, index, dmg) {
    targetTeam[index].hp -= dmg;
    if (targetTeam[index].hp < 0) targetTeam[index].hp = 0;
}

//returns a number between 0 and the number of moves the enemy has
function enemyChooseMove() {
    return Math.floor(Math.random() * enemyMoves[enemyIndex].length);
}

//sees if all the pokemon within a team is dead
function checkTeamDead(team) {
    for (let i = 0; i < team.length; i++) {
        if (team[i].hp > 0) {
            return false; //at least one Pokémon is still alive
        }
    }
    return true; //all Pokémon are dead
}

//makes the player attack with correct damage, animations, and text
function playerAttack( attacker, defender, selectedMove,  callback) {
    attackAnimation("player", () => {
                var dmg = calculateDamage(attacker, defender, selectedMove);
                applyDamage(enemyTeam, enemyIndex, dmg);
                
                damageAnimation("enemy", () =>{
                    
                    if(defender.hp <= 0) {
                        battleUI.mode = "battle";
                        battleUI.message =  defender.name + " fainted!";
                        drawBattleArena(encounter);
                        //increase state of poekmon that won
                        increaseStats(attacker);
                        
                        setTimeout(()=> {
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
                            battleUI.message = "Enemy sent out " + enemyTeam[enemyIndex].name + "!";
                            battleUI.mode = "intro";
                            drawBattleArena(encounter);
                            return;
                            },200)
                    }
                    callback();
                })
            })
}

//makes the enemy attack with correct damage, animations, and text
function enemyAttack (attacker, defender, selectedMove,  callback) {
    attackAnimation("enemy", () => {
                    var dmg = calculateDamage(attacker, defender, selectedMove);
                    applyDamage(playerTeam, playerIndex, dmg);

                    damageAnimation("player", () =>{
                        if(defender.hp <= 0) {
                            battleUI.mode = "battle";
                            battleUI.message = defender.name + " fainted!";
                            drawBattleArena(encounter);
                            
                            setTimeout(()=> {
                                if (checkTeamDead(playerTeam)) {
                                    playerDead = true;
                                    battleUI.message = "You died!!";
                                    battleUI.mode = "end";
                                    drawBattleArena(encounter);
                                    return;
                                }
                                //player goes to the pokemon selection screen
                                battleUI.mode = "switch";
                                battleUI.message = "Choose a Pokemon"
                                drawBattleArena(encounter);
                                return;
                            }, 500)
                           
                           
                        }
                        callback();
                    })
                })
}

//controls who attacks first and if the second attack is needed
function turnManager(playerMoveIndex) {
    var player = playerTeam[playerIndex];
    var enemy = enemyTeam[enemyIndex];
    var playMove = playerMoves[playerIndex][playerMoveIndex];
    var enemyMove = enemyMoves[enemyIndex][enemyChooseMove()];

    var playerFirst = player.speed >= enemy.speed;

    if (playerFirst) {
        battleUI.mode = "battle";
        battleUI.message = "You used " + playMove.name + "!";
        drawBattleArena(encounter);
        //only does the animation after the text is displayed
        playerAttack(player, enemy, playMove, () => {
            //Only attack if enemy survived
            if (!enemyDead && enemy.hp > 0) {
               
                battleUI.message =  enemy.name + " used " +enemyMove.name;
                drawBattleArena(encounter);
                enemyAttack(enemy, player, enemyMove, () => {
                    battleUI.mode = "intro";
                    drawBattleArena(encounter);
                });
            
                
            } else {
                battleUI.mo = "intro";
                drawBattleArena(encounter);
            }
        });
        
    } else {
        battleUI.mode = "battle";
        battleUI.message =  enemy.name + " used " +enemyMove.name;
        drawBattleArena(encounter);
        enemyAttack(enemy, player, enemyMove, () => {
            // Only attack if player survived
            if (!playerDead && player.hp > 0) {
               
                battleUI.message = "You used " + playMove.name + "!";
                drawBattleArena(encounter);
                playerAttack(player, enemy, playMove, () => {
                    battleUI.mode = "intro";
                    drawBattleArena(encounter); 
                });
            
            }else {
                battleUI.mode = "intro";
                drawBattleArena(encounter);
            }
        });
    }
}



//----------Animations-------------------------------------------------

//moxes the attacking pokemon lung forwards then goes back
function attackAnimation(person,callback) {
    var duration = 400;
    var half = duration / 2;
    var start = performance.now();
    
    function step(timestamp) {
        var elapsed = timestamp - start;

        var offset;

        if (elapsed < half) {
                //forward motion
                offset = (elapsed / half) * 50;
            } else if (elapsed < duration) {
                //backward motion
                offset = ((duration - elapsed) / half) * 50;
            } else {
                //animation done
                if (person === "player") playerOffsetX = 0;
                else enemyOffsetX = 0;
                drawBattleArena(encounter);
                callback();
                return;
            }

            if (person === "enemy") offset = -offset;

            if (person === "player") playerOffsetX = offset;
            else enemyOffsetX = offset;

            drawBattleArena(encounter);
            requestAnimationFrame(step);
        }
        

    requestAnimationFrame(step);
}

//pokemon shakes to show damage
function damageAnimation(person, callback) {
    var duration = 300; // total shake time
    var start = performance.now();
    var amplitude = 25;

    function step(timestamp) {
        var elapsed = timestamp - start;

        if (elapsed >= duration) {
            if (person === "player") playerOffsetX = 0;
            else enemyOffsetX = 0;
            drawBattleArena(encounter);
            callback();
            return;
        }
       
        var phase = Math.floor(elapsed / 50) % 2;
        
        var offset = amplitude;
        if (phase != 0) offset = -amplitude;

        if (person === "player") playerOffsetX = offset;
        else enemyOffsetX = offset;

        drawBattleArena(encounter);
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

//----------Mouse click/ Mouse hover/ player interactions-----------------------

battleIMG.addEventListener("click", handleCanvasClick);
battleIMG.addEventListener("mousemove", handleMouseMove);

//helper function to see if the mouse is within the box 
//for the battle ui stuff
function getHoverTarget(mouseX, mouseY) {

    //if you are in a battle you can not click on anything
    if (battleUI.mode === "battle") return null;
    
    //checks if the mouse is within the textbox when the ui 
    //is in intro mode
    if (battleUI.mode === "intro") {
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

        //run button area
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
            return "run";
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
    
    if (battleUI.mode === "end") {
        var boxX = 50, boxY = 800, boxW = 1600, boxH = 180;

        if (
            mouseX >= boxX &&
            mouseX <= boxX + boxW &&
            mouseY >= boxY &&
            mouseY <= boxY + boxH
        ) {
            return "end";
        }
        return null;
    }

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

async function handleCanvasClick(event) {
   
    var rect = battleIMG.getBoundingClientRect();
    var scaleX = battleIMG.width / rect.width;
    var scaleY = battleIMG.height / rect.height;

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
        turnManager(target.index);
    }

    if (target === "run") {
        //reset hp
        battleMusic.pause();
        battleMusic.currentTime = 0;   

        window.location.href = "openworld.html";
    }
    //when you press the switch button
    if (target === "switch") {
        switchTurn = true;
        battleUI.mode = "switch";
        drawBattleArena(encounter);
        return;
    }
    if (target.type === "poke") {
        playerIndex =  target.index;
        
        loadMoveNames();

        //switching due to fainting
        if(!switchTurn) {
            battleUI.mode = "moves";
            drawBattleArena(encounter);
            return;
        }

        switchTurn = false;
        battleUI.mode = "battle";
        battleUI.message = "You swiched to " + playerTeam[playerIndex].name + "!";
        drawBattleArena(encounter);

        var enemy = enemyTeam[enemyIndex];
        var player = playerTeam[playerIndex];
        var enemyMove = enemyMoves[enemyIndex][enemyChooseMove()];

        setTimeout(() => {
            battleUI.message = enemy.name + " used " + enemyMove.name + "!";
            drawBattleArena(encounter);

            enemyAttack(enemy, player, enemyMove, () => {
                battleUI.mode = "intro";
                drawBattleArena(encounter);
            });
        }, 600);
        
        return;
    }

    if (target === "end") {
         if(playerDead) {
                
                battleMusic.pause();
                battleMusic.currentTime = 0;   

                window.location.href = "openworld.html";
            }

            if (enemyDead) {
                //increase stats of all the pokemon 
                
                battleMusic.pause();
                battleMusic.currentTime = 0;
                
                //increase stats of all the pokemon 
                await trainTeam(playerTeam, playerName);   //boost + save


                //go to train stuff
                window.location.href = "openworld.html";
            }
    }
}