function createProfile() {
    return {
        wins: 0,
        losses: 0,
        streak: 0,
        losestreak: 0,
        bestStreak: 0
    };
}

let profiles = JSON.parse(localStorage.getItem("rlTracker")) || {
    verso: createProfile(),
    duo: createProfile(),
    leqooo: createProfile()
};

let current = "verso";

function save() {
    localStorage.setItem("rlTracker", JSON.stringify(profiles));
}

function switchProfile(profile) {

    current = profile;

    const names = {
        verso: "👤 Verso",
        duo: "👥 Verso & Leqooo",
        leqooo: "👤 Leqooo"
    };

    document.getElementById("profileName").textContent = names[profile];

    updateDisplay();
}

function addWin(){

    let p = profiles[current];

    p.wins++;
    p.streak++;
    p.losestreak = 0;

    if(p.streak > p.bestStreak)
        p.bestStreak = p.streak;

    save();
    updateDisplay();
}

function addLoss(){

    let p = profiles[current];

    p.losses++;
    p.losestreak++;
    p.streak = 0;

    save();
    updateDisplay();
}

function resetProfile(){

    if(!confirm("Réinitialiser les statistiques de ce profil ?"))
        return;

    profiles[current] = createProfile();

    save();
    updateDisplay();
}

function updateDisplay(){

    let p = profiles[current];

    let games = p.wins + p.losses;

    let winrate = games === 0 ? 0 : ((p.wins / games) * 100).toFixed(1);

    document.getElementById("wins").textContent = p.wins;
    document.getElementById("losses").textContent = p.losses;
    document.getElementById("games").textContent = games;
    document.getElementById("winrate").textContent = winrate + "%";
    document.getElementById("streak").textContent = p.streak;
    document.getElementById("losestreak").textContent = p.losestreak;
    document.getElementById("bestStreak").textContent = p.bestStreak;
}

switchProfile(current);