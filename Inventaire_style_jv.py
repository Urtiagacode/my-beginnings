inventaire = []

while True:
    print("1.Ajouter un objet à l'inventaire")
    print("2.voir l'inventaire")
    print("3. Supp l'objet de l'inventaire")
    print("4. Quitter")
    choix = input("Entrez votre choix : ")
 
    if choix == "1":
        objet = input("Entrez le nom de l'objet à ajouter : ")
        inventaire.append(objet)
        print("Inventaire :")
        for item in inventaire:
            print(item)
    elif choix == "2":
        print("Inventaire :")
        for item in inventaire:
            print(item)
            if objet in inventaire:
    print("Déjà dans l'inventaire")
else:
    inventaire.append(objet)
    elif choix == "3":
        objet = input("Entrez le nom de l'objet à supprimer : ")
        if objet in inventaire:
            inventaire.remove(objet)
            print("Inventaire :")
            for item in inventaire:
                print(item)
        else :
            print("L'objet n'est pas dans l'inventaire.")
    elif choix == "4":
        break
    else:
        print("Choix invalide. Veuillez choisir 1, 2, 3 ou 4.")
print("Inventaire final :")
for item in inventaire:
    print(item)
