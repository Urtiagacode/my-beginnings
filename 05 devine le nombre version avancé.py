import random

difficulte = input("fais ton choix : facile, moyen, dur")
print("tu as choisi",difficulte)

if difficulte == "facile":
    nombre_secret = random.randint(1, 50)

elif difficulte == "moyen":
    nombre_secret = random.randint(1, 100)

else:
    nombre_secret = random.randint(1, 500)

essais = 0

while True:
    proposition = int(input("Devine le nombre : "))

    essais = essais + 1

    if proposition < nombre_secret:
        print("Trop petit")
    elif proposition > nombre_secret:
        print("Trop grand")
    else:
        print("Bravo !")
        break

print("Tu as trouvé en", essais, "essais")
