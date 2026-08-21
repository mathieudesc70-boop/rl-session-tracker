function createProfile() {
    return {
        wins: 0,
        losses: 0,
        streak: 0,
        losestreak: 0,
        bestStreak: 0
    };
}


/* =========================
   CHARGEMENT DES DONNÉES
   ========================= */

let savedData = JSON.parse(localStorage.getItem("rlTracker"));

let profiles = savedData || {
    verso: createProfile(),
    duo: createProfile(),
    total: createProfile()
};


/* =========================
   MIGRATION ANCIEN PROFIL
   ========================= */

/*
   Si l'ancien profil "leqooo" existe encore
   dans ton navigateur, on le transforme
   automatiquement en "total".
*/

if (!profiles.total) {
    profiles.total = profiles.leqooo || createProfile();
}

delete profiles.leqooo;


/* =========================
   PROFIL ACTUEL
   ========================= */

let current = "verso";


/* =========================
   SAUVEGARDE
   ========================= */

function save() {
    localStorage.setItem("rlTracker", JSON.stringify(profiles));
}


/* =========================
   CHANGEMENT DE PROFIL
   ========================= */

function switchProfile(profile) {

    current = profile;

    const names = {
        verso: "👤 Verso",
        duo: "👥 Verso & Leqooo",
        total: "📊 Total"
    };

    document.getElementById("profileName").textContent = names[profile];

    updateDisplay();
}


/* =========================
   AJOUT D'UNE WIN
   ========================= */

function addWin() {

    /*
       Le Total est uniquement un historique.
       On ne peut donc pas ajouter directement
       une partie dedans.
    */

    if (current === "total") {
        alert("Le Total est un historique. Ajoute les parties dans Verso ou Verso & Leqooo.");
        return;
    }

    let p = profiles[current];

    p.wins++;
    p.streak++;
    p.losestreak = 0;

    if (p.streak > p.bestStreak) {
        p.bestStreak = p.streak;
    }

    save();
    updateDisplay();
}


/* =========================
   AJOUT D'UNE LOSS
   ========================= */

function addLoss() {

    if (current === "total") {
        alert("Le Total est un historique. Ajoute les parties dans Verso ou Verso & Leqooo.");
        return;
    }

    let p = profiles[current];

    p.losses++;
    p.losestreak++;
    p.streak = 0;

    save();
    updateDisplay();
}


/* =========================
   RESET
   ========================= */

function resetProfile() {

    /*
       Le Total ne peut jamais être reset.
    */

    if (current === "total") {
        alert("Le Total contient ton historique et ne peut pas être réinitialisé.");
        return;
    }


    /*
       Pour le profil Verso :
       comportement classique.
    */

    if (current === "verso") {

        if (!confirm("Réinitialiser les statistiques de Verso ?")) {
            return;
        }

        profiles.verso = createProfile();

        save();
        updateDisplay();

        return;
    }


    /*
       Pour le Duo :
       on transfère les statistiques
       vers le Total avant de remettre
       le Duo à zéro.
    */

    if (current === "duo") {

        let duo = profiles.duo;
        let total = profiles.total;

        let games = duo.wins + duo.losses;

        /*
           S'il n'y a aucune partie,
           inutile de faire quoi que ce soit.
        */

        if (games === 0) {
            alert("Aucune partie à transférer.");
            return;
        }

        if (!confirm(
            "Transférer cette session dans le Total et réinitialiser le Duo ?\n\n" +
            "Wins : " + duo.wins + "\n" +
            "Losses : " + duo.losses + "\n" +
            "Games : " + games
        )) {
            return;
        }


        /* TRANSFERT DES WINS */

        total.wins += duo.wins;


        /* TRANSFERT DES LOSSES */

        total.losses += duo.losses;


        /*
           On conserve le meilleur winstreak
           rencontré pendant toute la période.
        */

        if (duo.bestStreak > total.bestStreak) {
            total.bestStreak = duo.bestStreak;
        }


        /*
           On garde également la dernière streak
           de la session dans le Total.
        */

        total.streak = duo.streak;
        total.losestreak = duo.losestreak;


        /*
           Le Duo est maintenant remis à zéro.
        */

        profiles.duo = createProfile();


        save();
        updateDisplay();
    }
}


/* =========================
   AFFICHAGE DES STATISTIQUES
   ========================= */

function updateDisplay() {

    let p = profiles[current];

    let games = p.wins + p.losses;

    let diff = p.wins - p.losses;

    let winrate = games === 0
        ? 0
        : ((p.wins / games) * 100).toFixed(1);


    /* Wins */

    document.getElementById("wins").textContent = p.wins;


    /* Losses */

    document.getElementById("losses").textContent = p.losses;


    /* Games */

    document.getElementById("games").textContent = games;


    /* Diff */

    if (diff > 0) {
        document.getElementById("diff").textContent = "+" + diff;
    } else {
        document.getElementById("diff").textContent = diff;
    }


    /* Winrate */

    document.getElementById("winrate").textContent = winrate + "%";


    /* Winstreak */

    document.getElementById("streak").textContent = p.streak;


    /* Losestreak */

    document.getElementById("losestreak").textContent = p.losestreak;


    /* Best Winstreak */

    document.getElementById("bestStreak").textContent = p.bestStreak;
}


/* =========================
   DÉMARRAGE
   ========================= */

save();
switchProfile(current);
