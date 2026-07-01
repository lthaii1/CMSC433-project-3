//boosts one pokemon's stats after a win
function increaseStats(pokemon) {
    pokemon.attack += 5;
    pokemon.def += 5;
    pokemon.speed += 5;
    pokemon.maxHP += 5;
    pokemon.hp = pokemon.maxHP;
}

//boosts the whole team and saves each to the database
async function trainTeam(team, playerName) {
    for (var i = 0; i < team.length; i++) {
        increaseStats(team[i]);
    }
    await saveTraining(team, playerName);
}

//send each pokemon's new sta to the database
async function saveTraining(team, playerName) {
    var payload = team.map(p => ({
        id: p.id,
        current_hp: p.hp,
        attack: p.attack,
        defense: p.def,
        speed: p.speed
    }));

    await fetch("save_training.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName, team: payload })
    });
}