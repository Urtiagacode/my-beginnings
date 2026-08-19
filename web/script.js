let voitures = [];
let voituresDisponibles = [];

let budget1 = 100000;
let budget2 = 100000;

let garage1 = [];
let garage2 = [];

let capaciteGarage = 5;
let nombreToursTotal = 0;

let tour = 1;

let numeroPartie = 0;
let joueurDepartPartie = 1;

let voitureActuelle = null;

let prixActuel = 0;
let joueurActuel = 1;

let enchereCommencee = false;
let tirageEnCours = false;

let nomJoueur1 = "JOUEUR 1";
let nomJoueur2 = "JOUEUR 2";

let modePartie = "football";
let modeAveugle = false;
let blindModePremiereInstructionAffichee = false;




const startScreen =
    document.getElementById("startScreen");

const gameScreen =
    document.getElementById("gameScreen");

const player1Name =
    document.getElementById("player1Name");

const player2Name =
    document.getElementById("player2Name");

const player1BudgetInput =
    document.getElementById("player1Budget");

const player2BudgetInput =
    document.getElementById("player2Budget");

const gameModeSelect =
    document.getElementById("gameModeSelect");

const blindModeSwitch =
    document.getElementById("blindModeSwitch");

const garageCapacityInput =
    document.getElementById("garageCapacity");

const startGameButton =
    document.getElementById("startGameButton");

const blindModeInstruction =
    document.getElementById("blindModeInstruction");

let carImage =
    document.getElementById("carImage");

const imagePlaceholder =
    document.getElementById("imagePlaceholder");

const carBrand =
    document.getElementById("carBrand");

const carName =
    document.getElementById("carName");

const carYear =
    document.getElementById("carYear");

const category =
    document.getElementById("category");

const body =
    document.getElementById("body");




function attendre(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}



function notification(message) {

    const element =
        document.getElementById("notification");

    element.textContent =
        message;

    element.classList.add("show");

    setTimeout(() => {

        element.classList.remove("show");

    }, 2500);
}




startGameButton.addEventListener(
    "click",
    commencerPartie
);


async function commencerPartie() {

    numeroPartie++;

    joueurDepartPartie =
        numeroPartie % 2 === 1
            ? 1
            : 2;

    nomJoueur1 =
        player1Name.value.trim() ||
        "JOUEUR 1";

    nomJoueur2 =
        player2Name.value.trim() ||
        "JOUEUR 2";

    modePartie =
        gameModeSelect.value ||
        "football";

    modeAveugle =
        blindModeSwitch.checked;

    blindModePremiereInstructionAffichee =
        false;


    document.body.classList.toggle(
        "theme-anime",
        modePartie === "anime"
    );


    const budget1Saisi =
        Number(player1BudgetInput.value);

    const budget2Saisi =
        Number(player2BudgetInput.value);

    const capaciteSaisie =
        Number(garageCapacityInput.value);


    budget1 =
        Number.isFinite(budget1Saisi) &&
        budget1Saisi > 0
            ? budget1Saisi
            : 100000;

    budget2 =
        Number.isFinite(budget2Saisi) &&
        budget2Saisi > 0
            ? budget2Saisi
            : 100000;

    capaciteGarage =
        Number.isFinite(capaciteSaisie) &&
        capaciteSaisie > 0
            ? Math.floor(capaciteSaisie)
            : 3;


 
    nombreToursTotal =
        capaciteGarage * 2;

    tour = 1;

    garage1 = [];
    garage2 = [];


    document.getElementById(
        "player1Label"
    ).textContent =
        nomJoueur1.toUpperCase();


    document.getElementById(
        "player2Label"
    ).textContent =
        nomJoueur2.toUpperCase();


    document.getElementById(
        "garageName1"
    ).textContent =
        nomJoueur1.toUpperCase();


    document.getElementById(
        "garageName2"
    ).textContent =
        nomJoueur2.toUpperCase();


    document.getElementById(
        "maxTours"
    ).textContent =
        `/${nombreToursTotal}`;


    afficherBudgets();


    startGameButton.disabled = true;


    startScreen.classList.add(
        "leaving"
    );


    await attendre(650);


    startScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.remove(
        "hidden"
    );


    gameScreen.classList.add(
        "appearing"
    );


    await chargerVoitures();
}



async function chargerVoitures() {

    try {

        const fichierDonnees =
            modePartie === "anime"
                ? "personnages.json"
                : "cars.json";


        const response =
            await fetch(fichierDonnees);


        if (!response.ok) {

            throw new Error(
                `Impossible de charger ${fichierDonnees}`
            );

        }


        voitures =
            await response.json();


        if (
            !Array.isArray(voitures) ||
            voitures.length === 0
        ) {

            throw new Error(
                `${fichierDonnees} est vide ou invalide`
            );

        }


        voituresDisponibles =
            [...voitures];


        nombreToursTotal =
            Math.min(
                capaciteGarage * 2,
                voitures.length
            );


        tour = 1;


        document.getElementById(
            "tour"
        ).textContent =
            tour;


        document.getElementById(
            "maxTours"
        ).textContent =
            `/${nombreToursTotal}`;


        console.log(
            `🚗 ${voitures.length} éléments chargés (${fichierDonnees})`
        );


        afficherBudgets();

        afficherGarages();

        preparerProchainTour();


    } catch (error) {

        console.error(error);

        notification(
            "❌ Impossible de charger les données."
        );

    }
}



function tirerVoiture() {

    if (
        voituresDisponibles.length === 0
    ) {

        return null;

    }


    const index =
        Math.floor(
            Math.random() *
            voituresDisponibles.length
        );


    return voituresDisponibles.splice(
        index,
        1
    )[0];
}



async function chercherImageAniList(
    nomPersonnage
) {

    if (!nomPersonnage) return null;

    try {

        const requete = `
            query ($recherche: String) {
                Character(search: $recherche) {
                    image {
                        large
                    }
                }
            }
        `;


        const response =
            await fetch(
                "https://graphql.anilist.co",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({
                        query: requete,

                        variables: {
                            recherche:
                                nomPersonnage
                        }
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `Erreur API AniList (${response.status})`
            );

        }


        const data =
            await response.json();


        return (
            data?.data?.Character?.image?.large ||
            null
        );


    } catch (error) {

        console.error(
            "Erreur AniList :",
            error
        );

        return null;

    }
}



async function chercherImageJikan(
    nomPersonnage,
    tentative = 1
) {

    if (!nomPersonnage) return null;

    try {

        const url =
            `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(nomPersonnage)}&limit=1`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Erreur API Jikan (${response.status})`
            );

        }


        const data =
            await response.json();


        const resultat =
            data?.data?.[0];


        return (
            resultat?.images?.jpg?.image_url ||
            resultat?.images?.webp?.image_url ||
            null
        );


    } catch (error) {

        if (tentative < 2) {

            await attendre(800);

            return chercherImageJikan(
                nomPersonnage,
                tentative + 1
            );

        }


        console.error(
            "Erreur Jikan :",
            error
        );

        return null;

    }
}

async function chercherImagePersonnage(
    nomPersonnage
) {

    if (!nomPersonnage) return null;


    const urlAniList =
        await chercherImageAniList(
            nomPersonnage
        );


    if (urlAniList) {

        return urlAniList;

    }


    return chercherImageJikan(
        nomPersonnage
    );
}




async function chargerImageVoiture(
    voiture
) {

    if (!voiture) return;


    const ancienImage =
        document.getElementById(
            "carImage"
        );


    if (!ancienImage) return;


    ancienImage.style.display =
        "none";


    imagePlaceholder.style.display =
        "block";


    imagePlaceholder.textContent =
        "CHARGEMENT";


    
    if (modePartie === "anime") {

        const nouvelleImagePerso =
            document.createElement("img");


        nouvelleImagePerso.id =
            "carImage";


        nouvelleImagePerso.alt =
            voiture.modele || "";


        nouvelleImagePerso.style.display =
            "none";


        ancienImage.replaceWith(
            nouvelleImagePerso
        );


        carImage =
            nouvelleImagePerso;


        const urlImage =
            await chercherImagePersonnage(
                voiture.modele
            );


        if (urlImage) {

            carImage.src =
                urlImage;

        }


        const imageChargee =
            urlImage
                ? await attendreImage(
                    carImage,
                    6000
                )
                : false;


        if (imageChargee) {

            imagePlaceholder.style.display =
                "none";

            carImage.style.display =
                "block";


            carImage.style.animation =
                "none";

            void carImage.offsetWidth;

            carImage.style.animation =
                "carEnter .8s ease both";

        } else {

            imagePlaceholder.textContent =
                "IMAGE INDISPONIBLE";

        }


        return;

    }




    const nouvelleImage =
        document.createElement("img");


    nouvelleImage.id =
        "carImage";


    nouvelleImage.alt =
        `${voiture.marque || ""} ${voiture.modele || ""}`;


    nouvelleImage.setAttribute(
        "data-ci-type",
        "car"
    );


    nouvelleImage.setAttribute(
        "data-ci-make",
        voiture.marque || ""
    );


    nouvelleImage.setAttribute(
        "data-ci-model",
        voiture.modele || ""
    );


    nouvelleImage.setAttribute(
        "data-ci-year",
        String(voiture.annee || "")
    );


    nouvelleImage.setAttribute(
        "data-ci-width",
        "1200"
    );


    nouvelleImage.style.display =
        "none";


    ancienImage.replaceWith(
        nouvelleImage
    );


    carImage =
        nouvelleImage;


    const imageChargee =
        await attendreImage(
            carImage,
            6000
        );


    if (imageChargee) {

        imagePlaceholder.style.display =
            "none";

        carImage.style.display =
            "block";


        carImage.style.animation =
            "none";

        void carImage.offsetWidth;

        carImage.style.animation =
            "carEnter .8s ease both";

    } else {

        imagePlaceholder.textContent =
            "IMAGE INDISPONIBLE";

    }
}



function attendreImage(
    img,
    timeout = 6000
) {

    return new Promise(resolve => {

        let termine =
            false;


        const finir = ok => {

            if (termine) return;

            termine = true;

            clearInterval(interval);

            clearTimeout(timer);

            resolve(ok);

        };


        if (
            img.complete &&
            img.src &&
            img.src !==
                window.location.href
        ) {

            if (img.naturalWidth > 0) {

                finir(true);

                return;

            }

        }


        img.addEventListener(
            "load",
            () => {

                finir(true);

            },
            {
                once: true
            }
        );


        img.addEventListener(
            "error",
            () => {



            }
        );


        const interval =
            setInterval(() => {

                if (
                    img.src &&
                    img.naturalWidth > 0
                ) {

                    finir(true);

                }

            }, 100);


        const timer =
            setTimeout(() => {

                finir(
                    img.naturalWidth > 0
                );

            }, timeout);

    });
}




async function afficherVoiture(
    voiture
) {

    if (!voiture) return;


    const carDetails =
        document.querySelector(
            ".car-details"
        );


    if (carDetails) {

        carDetails.style.visibility =
            "visible";

    }


    voitureActuelle =
        voiture;


    carBrand.textContent =
        (
            voiture.marque ||
            "INCONNUE"
        ).toUpperCase();


    carName.textContent =
        (
            voiture.modele ||
            "MODÈLE INCONNU"
        ).toUpperCase();


    carYear.textContent =
        voiture.annee ||
        "----";


    category.textContent =
        (
            voiture.categorie ||
            voiture.type ||
            "AUTRE"
        ).toUpperCase();


    body.textContent =
        (
            voiture.carrosserie ||
            voiture.type ||
            "AUTRE"
        ).toUpperCase();


    document.getElementById(
        "carNumber"
    ).textContent =
        String(tour).padStart(
            2,
            "0"
        );


    if (modeAveugle) {

        afficherInstructionsAveugle(
            true
        );

    }


    await chargerImageVoiture(
        voiture
    );


    if (modeAveugle) {

        await masquerVoitureAveugle();

    }
}




function afficherInstructionsAveugle(
    initial
) {

    if (
        initial &&
        modeAveugle &&
        !blindModePremiereInstructionAffichee
    ) {

        blindModePremiereInstructionAffichee =
            true;

        const jailer =
            nomJoueur1;

        const looker =
            nomJoueur2;

        const messageInitial =
            `${looker}, ouvre les yeux. ${jailer}, ferme les yeux.`;


        blindModeInstruction.classList.add(
            "hidden"
        );

        return;

    }


    const joueurQuiVoit =
        joueurActuel === 1
            ? nomJoueur1
            : nomJoueur2;


    const joueurQuiFerme =
        joueurActuel === 1
            ? nomJoueur2
            : nomJoueur1;


    if (initial) {

        const messageInitial =
            `${joueurQuiVoit}, ouvre les yeux. ${joueurQuiFerme}, ferme les yeux.`;

        blindModeInstruction.classList.add(
            "hidden"
        );

        return;

    }


    const messageInverse =
        `${joueurQuiFerme}, ouvre les yeux. ${joueurQuiVoit}, ferme les yeux.`;

    blindModeInstruction.classList.add(
        "hidden"
    );
}


async function masquerVoitureAveugle() {

    const carDetails =
        document.querySelector(
            ".car-details"
        );


    await attendre(3000);


    if (!blindModeSwitch.checked)
        return;


    if (carImage) {

        carImage.style.display =
            "none";

    }


    blindModeInstruction.classList.add(
        "hidden"
    );


    if (carDetails) {

        carDetails.style.visibility =
            "hidden";

    }


    imagePlaceholder.style.display =
        "block";


    imagePlaceholder.textContent =
        "AVEUGLE";


    carBrand.textContent =
        "???";


    carName.textContent =
        "VOITURE";


    carYear.textContent =
        "----";


    category.textContent =
        "----";


    body.textContent =
        "----";


    afficherInstructionsAveugle(
        false
    );
}




async function animationTirage(
    voitureFinale
) {

    if (tirageEnCours)
        return;


    tirageEnCours =
        true;


    const showcase =
        document.querySelector(
            ".car-showcase"
        );


    const photo =
        document.querySelector(
            ".car-photo"
        );


    const details =
        document.querySelector(
            ".car-details"
        );


    if (showcase) {

        showcase.classList.add(
            "drawing"
        );

    }


    if (photo) {

        photo.classList.add(
            "drawing"
        );

    }


    if (details) {

        details.classList.add(
            "drawing"
        );

    }


    carImage.style.display =
        "none";


    imagePlaceholder.style.display =
        "block";


    imagePlaceholder.textContent =
        "TIRAGE";


    carBrand.textContent =
        "SÉLECTION";


    carName.textContent =
        "???";


    carYear.textContent =
        "----";


    category.textContent =
        "----";


    body.textContent =
        "----";


    const autresVoitures =
        voitures.filter(
            voiture =>
                voiture !==
                voitureFinale
        );


    const totalEtapes =
        34;


    for (
        let i = 0;
        i < totalEtapes;
        i++
    ) {

        let voitureAffichee;


        if (
            i ===
            totalEtapes - 1
        ) {

            voitureAffichee =
                voitureFinale;

        } else {

            const index =
                Math.floor(
                    Math.random() *
                    autresVoitures.length
                );


            voitureAffichee =
                autresVoitures[index];

        }


        carBrand.textContent =
            (
                voitureAffichee.marque ||
                "INCONNUE"
            ).toUpperCase();


        carName.textContent =
            (
                voitureAffichee.modele ||
                "???"
            ).toUpperCase();


        carYear.textContent =
            voitureAffichee.annee ||
            "----";


        category.textContent =
            (
                voitureAffichee.categorie ||
                voitureAffichee.type ||
                "AUTRE"
            ).toUpperCase();


        body.textContent =
            (
                voitureAffichee.carrosserie ||
                voitureAffichee.type ||
                "AUTRE"
            ).toUpperCase();


        carName.style.animation =
            "none";


        void carName.offsetWidth;


        carName.style.animation =
            "contentEnter .12s ease";


        let vitesse;


        if (i < 8) {

            vitesse = 45;

        } else if (i < 15) {

            vitesse = 55;

        } else if (i < 21) {

            vitesse = 75;

        } else if (i < 26) {

            vitesse = 110;

        } else if (i < 30) {

            vitesse = 170;

        } else if (i < 33) {

            vitesse = 260;

        } else {

            vitesse = 500;

        }


        await attendre(
            vitesse
        );

    }


    await afficherVoiture(
        voitureFinale
    );


    if (showcase) {

        showcase.classList.remove(
            "drawing"
        );

    }


    if (photo) {

        photo.classList.remove(
            "drawing"
        );

    }


    if (details) {

        details.classList.remove(
            "drawing"
        );

    }


    tirageEnCours =
        false;


    await attendre(500);


    notification(
        `🚗 ${voitureFinale.marque} ${voitureFinale.modele}`
    );
}


async function nouvelleVoiture() {

    if (tirageEnCours)
        return;


    if (
        garage1.length >= capaciteGarage &&
        garage2.length >= capaciteGarage
    ) {

        afficherFinPartie();

        return;

    }


    if (
        tour > nombreToursTotal ||
        voituresDisponibles.length === 0
    ) {

        afficherFinPartie();

        return;

    }


    enchereCommencee =
        false;


    prixActuel =
        0;


    if (joueurDepartPartie === 1) {

        joueurActuel =
            tour % 2 === 1
                ? 1
                : 2;

    } else {

        joueurActuel =
            tour % 2 === 1
                ? 2
                : 1;

    }


    document.getElementById(
        "statusText"
    ).textContent =
        "TIRAGE EN COURS";


    document.getElementById(
        "currentPrice"
    ).textContent =
        "0 €";


    document.getElementById(
        "waitingArea"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "auctionArea"
    ).classList.add(
        "hidden"
    );


    const voiture =
        tirerVoiture();


    if (!voiture) {

        afficherFinPartie();

        return;

    }


    await animationTirage(
        voiture
    );


    const nomJoueurQuiCommence =
        joueurActuel === 1
            ? nomJoueur1
            : nomJoueur2;


    document.getElementById(
        "currentPlayer"
    ).textContent =
        nomJoueurQuiCommence.toUpperCase();


    document.getElementById(
        "statusText"
    ).textContent =
        `${nomJoueurQuiCommence.toUpperCase()} COMMENCE`;


    document.getElementById(
        "waitingArea"
    ).classList.remove(
        "hidden"
    );


    const startBid =
        document.getElementById(
            "startBid"
        );


    startBid.value =
        "";


    startBid.focus();
}


function preparerProchainTour() {

    document.getElementById(
        "tour"
    ).textContent =
        tour;


    nouvelleVoiture();
}


function afficherBudgets() {

    document.getElementById(
        "budget1"
    ).textContent =
        budget1.toLocaleString(
            "fr-FR"
        ) + " €";


    document.getElementById(
        "budget2"
    ).textContent =
        budget2.toLocaleString(
            "fr-FR"
        ) + " €";
}


function afficherGarages() {

    afficherGarage(
        garage1,
        document.getElementById(
            "garage1"
        ),
        document.getElementById(
            "count1"
        )
    );


    afficherGarage(
        garage2,
        document.getElementById(
            "garage2"
        ),
        document.getElementById(
            "count2"
        )
    );
}


function afficherGarage(
    garage,
    element,
    compteur
) {

    compteur.textContent =
        `${garage.length} / ${capaciteGarage}`;


    element.innerHTML =
        "";


    if (garage.length === 0) {

        element.innerHTML = `
            <div class="empty-garage">
                Garage vide
            </div>
        `;

        return;

    }


    garage.forEach(
        voiture => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "garage-car";


            card.innerHTML = `

                <span class="garage-car-name">
                    ${voiture.marque || ""}
                    ${voiture.modele || ""}
                </span>

                <span class="garage-car-year">
                    ${voiture.annee || ""}
                </span>

            `;


            element.appendChild(
                card
            );

        }
    );
}


function lancerEnchere() {

    if (!voitureActuelle) {

        notification(
            "❌ Aucune voiture sélectionnée."
        );

        return;

    }


    const input =
        document.getElementById(
            "startBid"
        );


    const montant =
        Number(input.value);


    if (
        !Number.isFinite(montant) ||
        montant <= 0
    ) {

        notification(
            "Entre un montant valide."
        );

        return;

    }


    const budgetDepart =
        joueurActuel === 1
            ? budget1
            : budget2;


    const nomDebutant =
        joueurActuel === 1
            ? nomJoueur1
            : nomJoueur2;


    if (montant > budgetDepart) {

        notification(
            `❌ ${nomDebutant} n'a pas assez d'argent.`
        );

        return;

    }


    prixActuel =
        montant;


    joueurActuel =
        joueurActuel === 1
            ? 2
            : 1;


    enchereCommencee =
        true;


    document.getElementById(
        "currentPrice"
    ).textContent =
        prixActuel.toLocaleString(
            "fr-FR"
        ) + " €";


    const nomJoueurQuiRepond =
        joueurActuel === 1
            ? nomJoueur1
            : nomJoueur2;


    document.getElementById(
        "currentPlayer"
    ).textContent =
        nomJoueurQuiRepond.toUpperCase();


    document.getElementById(
        "statusText"
    ).textContent =
        `${nomJoueurQuiRepond.toUpperCase()} À VOUS`;


    document.getElementById(
        "waitingArea"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "auctionArea"
    ).classList.remove(
        "hidden"
    );


    input.value =
        "";


    document.getElementById(
        "bidInput"
    ).focus();
}


function encherir() {

    if (!enchereCommencee)
        return;


    const input =
        document.getElementById(
            "bidInput"
        );


    const montant =
        Number(input.value);


    if (
        !Number.isFinite(montant) ||
        montant <= prixActuel
    ) {

        notification(
            "❌ Ton offre doit être supérieure à l'offre actuelle."
        );

        return;

    }


    const budget =
        joueurActuel === 1
            ? budget1
            : budget2;


    if (montant > budget) {

        notification(
            "❌ Tu n'as pas assez d'argent."
        );

        return;

    }


    prixActuel =
        montant;


    joueurActuel =
        joueurActuel === 1
            ? 2
            : 1;


    document.getElementById(
        "currentPrice"
    ).textContent =
        prixActuel.toLocaleString(
            "fr-FR"
        ) + " €";


    const nomActuel =
        joueurActuel === 1
            ? nomJoueur1
            : nomJoueur2;


    document.getElementById(
        "currentPlayer"
    ).textContent =
        nomActuel.toUpperCase();


    document.getElementById(
        "statusText"
    ).textContent =
        `${nomActuel.toUpperCase()} À VOUS`;


    input.value =
        "";


    input.focus();
}


function seCoucher() {

    if (!enchereCommencee)
        return;


    const gagnant =
        joueurActuel === 1
            ? 2
            : 1;


    terminerEnchere(
        gagnant
    );
}


function determinerProprietaire(
    gagnant
) {

    const joueur1Plein =
        garage1.length >=
        capaciteGarage;


    const joueur2Plein =
        garage2.length >=
        capaciteGarage;


    if (
        joueur1Plein &&
        joueur2Plein
    ) {

        return null;

    }


    if (
        joueur1Plein &&
        !joueur2Plein
    ) {

        return 2;

    }


    if (
        joueur2Plein &&
        !joueur1Plein
    ) {

        return 1;

    }


    return gagnant;
}


async function terminerEnchere(
    gagnant
) {

    enchereCommencee =
        false;


    const proprietaireFinal =
        determinerProprietaire(
            gagnant
        );


    if (
        proprietaireFinal === null
    ) {

        afficherFinPartie();

        return;

    }


    if (gagnant === 1) {

        budget1 -=
            prixActuel;

    } else {

        budget2 -=
            prixActuel;

    }


    if (
        proprietaireFinal === 1
    ) {

        garage1.push(
            voitureActuelle
        );

    } else {

        garage2.push(
            voitureActuelle
        );

    }


    afficherBudgets();

    afficherGarages();


    const nomGagnant =
        gagnant === 1
            ? nomJoueur1
            : nomJoueur2;


    const nomProprietaireFinal =
        proprietaireFinal === 1
            ? nomJoueur1
            : nomJoueur2;


    

    if (
        proprietaireFinal !== gagnant
    ) {

        notification(
            `📦 ${nomGagnant} gagne l'enchère, mais ${nomProprietaireFinal} reçoit directement ${voitureActuelle.marque || ""} ${voitureActuelle.modele || ""} car son garage est le seul avec de la place !`
        );

    } else {

        notification(
            `🏆 ${nomGagnant} remporte ${voitureActuelle.marque || ""} ${voitureActuelle.modele || ""} !`
        );

    }


    document.getElementById(
        "auctionArea"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "statusText"
    ).textContent =
        `${nomProprietaireFinal.toUpperCase()} RÉCUPÈRE LE PERSONNAGE`;


    await attendre(
        1800
    );



    if (
        garage1.length >=
            capaciteGarage &&
        garage2.length >=
            capaciteGarage
    ) {

        afficherFinPartie();

        return;

    }


    const totalAffecte =
        garage1.length +
        garage2.length;


    if (
        totalAffecte >=
        nombreToursTotal
    ) {

        afficherFinPartie();

        return;

    }


    tour++;


    if (
        tour >
        nombreToursTotal
    ) {

        afficherFinPartie();

        return;

    }


    document.getElementById(
        "tour"
    ).textContent =
        tour;


    nouvelleVoiture();
}




function afficherFinPartie() {

    document.getElementById(
        "statusText"
    ).textContent =
        "🏁 PARTIE TERMINÉE";


    document.getElementById(
        "waitingArea"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "auctionArea"
    ).classList.add(
        "hidden"
    );


    notification(
        `🏁 Les ${nombreToursTotal} tours sont terminés !`
    );


    console.log(
        `${nomJoueur1} :`,
        garage1
    );


    console.log(
        `${nomJoueur2} :`,
        garage2
    );
}




document
    .getElementById("startButton")
    .addEventListener(
        "click",
        lancerEnchere
    );


document
    .getElementById("bidButton")
    .addEventListener(
        "click",
        encherir
    );


document
    .getElementById("foldButton")
    .addEventListener(
        "click",
        seCoucher
    );




document
    .getElementById("startBid")
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                lancerEnchere();

            }

        }
    );




document
    .getElementById("bidInput")
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                encherir();

            }

        }
    );




player1Name.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            player2Name.focus();

        }

    }
);



player2Name.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            commencerPartie();

        }

    }
);