var battleIMG = document.getElementById("battleScreen");
var ctx = battleIMG.getContext('2d');
//store the pokemon loaded in, prevents flickering of pokemon
var imageCache = {};
//Used to animate the pokemon
var battleAnim = {
    playerOffsetX: 0,
    enemyOffsetX: 0,
};

//used to store player pokemon team and items
var playerTeam = {

}
//used to store trainer team
var trainerTeam = {

}
//stores what text boc is shown
var battleUI = {
    mode: "intro",   // "intro", "moves", "items"
    message: "A Wild Pokemon Appeared!!",
    moves: ["Tackle", "Growl", "Ember", "Scratch"]
}
//the battle feilds that are avaliable 
var backgrounds = {
    "grass": "proj3_images/grassEncounter.png",
    "water" : "proj3_images/waterEncounter.png",
    "battle": "proj3_images/battleEncounter.png" //might not use
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

//draws the battle screen with all its componites 
function drawBattleArena(area) {
    var bg = new Image();
    bg.src = backgrounds[area];

    bg.onload = function () {
        ctx.clearRect(0, 0, battleIMG.width, battleIMG.height)
        //draws the battle feild
        ctx.drawImage(bg, 0, 0, battleIMG.width, battleIMG.height);
        //going to be used to store the pokemon images
        var pokemon = "proj3_images/1st Generation/108Lickitung.png";
        var enemy = "proj3_images/1st Generation/126Magmar.png";
        //draws your pokemon on the left
        drawPokemon(pokemon, 100 + battleAnim.playerOffsetX, 680, true);
        //draws enmeny pokemon on the right
        drawPokemon(enemy, 1500 +  battleAnim.enemyOffsetX, 680);
        //player hp bar
        drawHPBar(100, 350, 250, 25, 39, 39);
        //enemy hp bar
        drawHPBar(1350, 350, 250, 25, 45, 45)
        if (battleUI.mode === "intro") {
            drawTextBox();
        } else if (battleUI.mode === "moves") {
            drawMoveBox();
        } else if (battleUI.mode === "items") {
            //drawItemsBox(); // optional later
        }
        //shows the amount of pokemon you have left
        drawPokeballCount(20, 40, 6);
        //only draws the pokeball for trainers not wild pokemon
        if(trainerTeam) drawPokeballCount(1615, 40, 6, true);
    
    }
}

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
    //draws the move buttons
    for (var i = 0; i < battleUI.moves.length; i++) {
        var move = battleUI.moves[i];
        var pos = positions[i];

        //button background
        ctx.fillStyle = "#e6e6e6";
        ctx.fillRect(pos.x, pos.y, btnW, btnH);
        //button border
        ctx.strokeStyle = "black";
        ctx.strokeRect(pos.x, pos.y, btnW, btnH);
        //move text
        ctx.fillStyle = "black";
        ctx.fillText(move, pos.x + btnW / 2, pos.y + btnH / 2);
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
function playPlayerAttackAnimation(callback) {
    let frame = 0;

    function step() {
        frame++;

        // Frames 1–10: move forward
        if (frame <= 10) {
            battleAnim.playerOffsetX = frame * 5;
        }
        // Frames 11–20: move back
        else if (frame <= 20) {
            battleAnim.playerOffsetX = (20 - frame) * 5;
        }

        drawBattleArena(encounter);

        if (frame < 20) {
            requestAnimationFrame(step);
        } else {
            battleAnim.playerOffsetX = 0;
            callback();
        }
    }

    step();
}

function playEnemyDamageAnimation(callback) {
    var frame = 0;
    var frameMax = 30;

    function step() {
        frame++;

        //shake amplitude (bigger = stronger shake)
        var amplitude = 25;

        //slow down the shake by changing direction every 5 frames
        if (Math.floor(frame / 5) % 2 === 0) {
            battleAnim.enemyOffsetX = amplitude;
        } else {
            battleAnim.enemyOffsetX = -amplitude;
        }

        drawBattleArena(encounter);

        // Increase total frames for a longer shake
        if (frame < frameMax) {
            requestAnimationFrame(step);
        } else {
            battleAnim.enemyOffsetX = 0;
            callback();
        }
    }

    step();
}

//stores waht stage to draw
var encounter = "grass";
//draws the battle screen
drawBattleArena(encounter);
battleIMG.addEventListener("click", handleCanvasClick);

function handleCanvasClick(event) {
// Get mouse position relative to canvas
    const rect = battleIMG.getBoundingClientRect();
    const scaleX = battleIMG.width / rect.width;
    const scaleY = battleIMG.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    if (battleUI.mode === "intro") {
        const rect = battleIMG.getBoundingClientRect();
        const scaleX = battleIMG.width / rect.width;
        const scaleY = battleIMG.height / rect.height;

        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        // Textbox bounds
        const boxX = 50;
        const boxY = 800;
        const boxW = 1600;
        const boxH = 180;

        if (
            mouseX >= boxX &&
            mouseX <= boxX + boxW &&
            mouseY >= boxY &&
            mouseY <= boxY + boxH
        ) {
            // Advance to move selection
            battleUI.mode = "moves";
            drawBattleArena(encounter);
            return;
        }
    }
    // Only allow clicking moves when in move mode
    if (battleUI.mode == "moves") {
        // Check each move button
        for (let i = 0; i < battleUI.moves.length; i++) {
            const pos = positions[i];

            if (
                mouseX >= pos.x &&
                mouseX <= pos.x + btnW &&
                mouseY >= pos.y &&
                mouseY <= pos.y + btnH
            ) {
                const chosenMove = battleUI.moves[i];
                console.log("You clicked:", chosenMove);

                // Switch UI to text mode to show message
                battleUI.mode = "intro";
                battleUI.message = "You used " + chosenMove + "!";

                // Redraw screen
                drawBattleArena(encounter);

                // Run attack animation → damage animation → finish
                playPlayerAttackAnimation(function () {
                    playEnemyDamageAnimation(function () {
                        console.log("Attack sequence complete");
                    });
});

            }
        }

        // Check Items button
        const itemX = 1200;
        const itemY = 900;
        const itemW = btnW - 100;
        const itemH = btnH;

        if (
            mouseX >= itemX &&
            mouseX <= itemX + itemW &&
            mouseY >= itemY &&
            mouseY <= itemY + itemH
        ) {
            console.log("Items clicked");
            battleUI.mode = "items";
            battleUI.message = "You opened your bag.";
            drawBattleArena(encounter);
        }
    }
}

