# Calcul de l'IMC

poids = float(input("Entrez votre poids (kg) : "))
taille = float(input("Entrez votre taille (m) : "))

imc = poids / (taille * taille)

print("Votre IMC est :", round(imc, 2))

if imc < 18.5:
    print("Catégorie : maigre")
elif imc < 25:
    print("Catégorie : corpulence normale")
elif imc < 30:
    print("Catégorie : surpoids")
else:
    print("Catégorie : obésité")