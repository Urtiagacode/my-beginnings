import json

from game import (
    creer_joueur,
    tirer_voiture,
    lancer_enchere,
    afficher_garages
)


with open("cars.json", "r", encoding="utf-8") as fichier:
    cars = json.load(fichier)

cars_disponibles = cars.copy()


print("🎮 JEU D'ENCHÈRES")
print("━━━━━━━━━━━━━━━━━━━━")

joueur1 = creer_joueur(1)
joueur2 = creer_joueur(2)


print("\n━━━━━━━━━━━━━━━━━━━━")
print("💰 BUDGETS")
print("━━━━━━━━━━━━━━━━━━━━")
print(f"{joueur1['nom']} : {joueur1['budget']:,.0f} €")
print(f"{joueur2['nom']} : {joueur2['budget']:,.0f} €")


nombre_tours = 10


for tour in range(1, nombre_tours + 1):

    print("\n\n")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"🎰 TOUR {tour} / {nombre_tours}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    voiture = tirer_voiture(cars_disponibles)

    lancer_enchere(
        joueur1,
        joueur2,
        voiture
    )

    afficher_garages(
        joueur1,
        joueur2
    )


print("\n\n")
print("🏁 FIN DE LA PARTIE")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


print("\n👤 JOUEUR 1")
print(f"💰 Budget : {joueur1['budget']:,.0f} €")
print("🚗 Collection :")

for voiture in joueur1["garage"]:
    print(
        f"   • {voiture['marque']} "
        f"{voiture['modele']} "
        f"({voiture['annee']})"
    )


print("\n👤 JOUEUR 2")
print(f"💰 Budget : {joueur2['budget']:,.0f} €")
print("🚗 Collection :")

for voiture in joueur2["garage"]:
    print(
        f"   • {voiture['marque']} "
        f"{voiture['modele']} "
        f"({voiture['annee']})"
    )


print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("🏆 À VOUS DE DÉCIDER !")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


while True:

    choix = input(
        "\nQui possède la meilleure collection ? "
        "(1/2) : "
    )

    if choix == "1":
        print("\n🏆 JOUEUR 1 REMPORTE LA PARTIE !")
        break

    elif choix == "2":
        print("\n🏆 JOUEUR 2 REMPORTE LA PARTIE !")
        break

    else:
        print("❌ Choisis 1 ou 2.")