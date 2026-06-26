var battleIMG = document.getElementById("battleScreen");
var ctx = battleIMG.getContext('2d');
//postion of the pokemon on the feild , the first x,y is on the left
var feildPos = {
    grass: [
        {x:80, y:420},
        {x:1380, y:420}
    ]
    
}

var battleUI = {
    mode: "intro",   // "intro", "moves", "items"
    message: "",
    moves: ["Tackle", "Growl", "Ember", "Scratch"]
}

var backgrounds = {
    "grass": "grassEncounter.png",
    "water" : "waterEncounter.png",
    "battle": "BattleEncounter.png" //might not use
}

// Move button size
var btnW = 500;
var btnH = 60;

// Move positions (2×2 grid)
var positions = [
{ x: 100,  y: 820 }, // Move 1
{ x: 650,  y: 820 }, // Move 2
{ x: 100,  y: 900 }, // Move 3
{ x: 650,  y: 900 } // Move 4
]

var pokeballImg = new Image();
pokeballImg.src = "pokeball.png";

function drawBattleArena(area) {
    var bg = new Image();
    bg.src = backgrounds[area];
    battleUI.mode = "moves";
    battleUI.message = "A wild " + "pokemon" + " appeared!";

    
    bg.onload = function () {
        //clear the drawing
        ctx.clearRect(0, 0, battleIMG.width, battleIMG.height)
        //draws the battle feild
        ctx.drawImage(bg, 0, 0, battleIMG.width, battleIMG.height);
        //going to be used to store the pokemon images
        var pokemon = "proj3_images/1st_Generation/108Lickitung.png";
        var enemy = "proj3_images/1st_Generation/126Magmar.png";
        //draws your pokemon
        drawPokemon(enemy, 100, 680, true);
        //draws enmeny pokemon
        drawPokemon(pokemon, 1500, 680);
        // PLAYER HP bar
        drawHPBar(100, 350, 250, 25, 39, 39);
        // ENEMY HP bar
        drawHPBar(1350, 350, 250, 25, 45, 45)
        if (battleUI.mode === "intro") {
            drawTextBox();
        } else if (battleUI.mode === "moves") {
            drawMoveBox();
        } else if (battleUI.mode === "items") {
            //drawItemsBox(); // optional later
        }
        drawPokeballCount(20, 40, 6);
        drawPokeballCount(1250, 40, 6);

    }
}

function drawPokemon(imgSrc, x, y, flip = false) {
    var poke = new Image();
    poke.src = imgSrc;

    var boxW = 250;
    var boxH = 250;

    poke.onload = function () {
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
    };
}




function drawHPBar(x, y, width, height, hp, maxHp) {
    // background (gray)
    ctx.fillStyle = "#444";
    ctx.fillRect(x, y, width, height);

    // HP percent
    var percent = hp / maxHp;
    var barWidth = width * percent;

    // HP color
    if (percent > 0.5) ctx.fillStyle = "#4CAF50";      // green
    else if (percent > 0.2) ctx.fillStyle = "#FFEB3B"; // yellow
    else ctx.fillStyle = "#F44336";                    // red

    // fill HP
    ctx.fillRect(x, y, barWidth, height);

    // border
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, width, height);
}

function drawTextBox() {
    ctx.fillStyle = "white";
    ctx.fillRect(50, 800, 1600, 180);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 800, 1600, 180);

    ctx.fillStyle = "black";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";    
    ctx.textBaseline = "middle";  
    //Center point of the box
    var centerX = 50 + 1600 / 2;
    var centerY = 800 + 180 / 2;
    ctx.fillText(battleUI.message, centerX, centerY);
}

function drawMoveBox() {
    // Main box
    ctx.fillStyle = "white";
    ctx.fillRect(50, 800, 1600, 180);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 800, 1600, 180);

    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    

    // Draw move buttons
    for (var i = 0; i < battleUI.moves.length; i++) {
        var move = battleUI.moves[i];
        var pos = positions[i];

        // Button background
        ctx.fillStyle = "#e6e6e6";
        ctx.fillRect(pos.x, pos.y, btnW, btnH);

        // Button border
        ctx.strokeStyle = "black";
        ctx.strokeRect(pos.x, pos.y, btnW, btnH);

        // Move text
        ctx.fillStyle = "black";
        ctx.fillText(move, pos.x + btnW / 2, pos.y + btnH / 2);
    }

    var itemX = 1200;
    var itemY = 900;
    // Items button (bottom right)
    ctx.fillStyle = "#e6e6e6";
    ctx.fillRect(itemX, itemY, btnW -100, btnH);

    ctx.strokeStyle = "black";
    ctx.strokeRect(itemX, itemY,  btnW -100, btnH);

    ctx.fillStyle = "black";
    ctx.fillText("Items", itemX + (btnW -100)/2, itemY + btnH/2);
}


function drawPokeballCount(x, y, count) {
    var sizeX = 65;   
    var sizeY = 50;
    var spacing = 10;   // space between pokeballs

    for (var i = 0; i < count; i++) {
        ctx.save();
        //used to show fainted pokemon, goes out left to right
        if(i == 3) {
            ctx.filter = "grayscale(100%)";
        }
        ctx.drawImage(pokeballImg, x + i * (sizeX + spacing), y, sizeX, sizeY);
        ctx.restore();
    }

}





var encounter = "grass";
drawBattleArena(encounter);


