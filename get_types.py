import json


with open("cars.json", "r", encoding="utf-8") as fichier:
    cars = json.load(fichier)


HYPERCARS = {
    "bugatti": [
        "chiron",
        "veyron",
        "divo",
        "bolide",
        "centodieci"
    ],

    "koenigsegg": [
        "jesko",
        "regera",
        "agera",
        "one:1"
    ],

    "pagani": [
        "huayra",
        "utopia",
        "zonda"
    ],

    "rimac": [
        "nevera"
    ],

    "mclaren": [
        "senna",
        "speedtail",
        "p1"
    ],

    "aston martin": [
        "valkyrie"
    ]
}


SUPERCARS = {
    "audi": [
        "r8"
    ],

    "ferrari": [
        "488",
        "f8",
        "812",
        "roma",
        "portofino",
        "sf90",
        "458",
        "488 pista"
    ],

    "lamborghini": [
        "huracan",
        "aventador",
        "gallardo",
        "murcielago",
        "urus"
    ],

    "mclaren": [
        "570s",
        "570gt",
        "600lt",
        "650s",
        "675lt",
        "720s",
        "765lt",
        "artura"
    ],

    "porsche": [
        "918 spyder",
        "carrera gt",
        "911 gt3",
        "911 gt2"
    ],

    "chevrolet": [
        "corvette"
    ],

    "acura": [
        "nsx"
    ],

    "nissan": [
        "gt-r"
    ],

    "ford": [
        "gt"
    ],

    "mercedes-benz": [
        "amg gt",
        "amg gt r",
        "amg gt c"
    ]
}


SPORTIVES = {
    "audi": [
        "s3",
        "s4",
        "s5",
        "s6",
        "s7",
        "s8",
        "rs3",
        "rs4",
        "rs5",
        "rs6",
        "rs7",
        "tt",
        "ttrs"
    ],

    "bmw": [
        "m2",
        "m3",
        "m4",
        "m5",
        "m6",
        "m8",
        "z4"
    ],

    "mercedes-benz": [
        "amg a45",
        "amg c43",
        "amg c63",
        "amg e53",
        "amg e63",
        "amg s63",
        "amg gt"
    ],

    "porsche": [
        "boxster",
        "cayman",
        "718",
        "911",
        "panamera",
        "taycan"
    ],

    "ford": [
        "mustang",
        "focus rs",
        "focus st",
        "fiesta st"
    ],

    "chevrolet": [
        "camaro",
        "corvette"
    ],

    "dodge": [
        "challenger",
        "charger",
        "viper"
    ],

    "nissan": [
        "370z",
        "350z",
        "gt-r"
    ],

    "toyota": [
        "supra",
        "gr86",
        "gt86",
        "gr yaris"
    ],

    "subaru": [
        "wrx",
        "wrx sti",
        "brz"
    ],

    "honda": [
        "civic type r",
        "nsx",
        "s2000"
    ],

    "lexus": [
        "rc f",
        "is f",
        "lc 500"
    ],

    "jaguar": [
        "f-type",
        "xkr"
    ],

    "alfa romeo": [
        "4c",
        "giulia quadrifoglio",
        "stelvio quadrifoglio"
    ],

    "lotus": [
        "elise",
        "exige",
        "evora",
        "emira"
    ]
}


def trouver_categorie(marque, modele):

    marque = marque.lower().strip()
    modele = modele.lower().strip()

    # Hypercars
    if marque in HYPERCARS:

        for nom in HYPERCARS[marque]:

            if nom in modele:
                return "Hypercar"


    # Supercars
    if marque in SUPERCARS:

        for nom in SUPERCARS[marque]:

            if nom in modele:
                return "Supercar"


    # Sportives
    if marque in SPORTIVES:

        for nom in SPORTIVES[marque]:

            if nom in modele:
                return "Sportive"


    # Si ce n'est pas une sportive connue,
    # on conserve le type existant.

    type_existant = modele_original = None

    return None


modifications = 0


for voiture in cars:

    categorie = trouver_categorie(
        voiture["marque"],
        voiture["modele"]
    )

    if categorie:

        ancienne_categorie = voiture.get(
            "categorie"
        )

        voiture["categorie"] = categorie

        if ancienne_categorie != categorie:
            modifications += 1


with open("cars.json", "w", encoding="utf-8") as fichier:

    json.dump(
        cars,
        fichier,
        indent=4,
        ensure_ascii=False
    )


print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("🚗 CLASSIFICATION TERMINÉE")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

print(
    f"✅ {modifications} voitures modifiées."
)


print("\n📊 RÉPARTITION")


compteurs = {}


for voiture in cars:

    categorie = voiture.get(
        "categorie",
        "Non renseignée"
    )

    compteurs[categorie] = (
        compteurs.get(categorie, 0) + 1
    )


for categorie, nombre in sorted(
    compteurs.items()
):

    print(
        f"{categorie} : {nombre}"
    )