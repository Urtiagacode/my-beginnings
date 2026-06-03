import random 

def choisir_mot():
    mots = ["python","arbre", "montagne", "lumière", "rivière", "nuage", "océan", "fenêtre", "chemin", "étoile", "forêt", "papier", "horloge", "jardin", "silence", "tempête", "crayon", "soleil", "boussole", "cascade", "horizon", "ordinateur", "programmation", "jeu", "devinette"]
    return random.choice(mots) 

def afficher_progression(mot, lettres_trouvees):
    progression = ""
    for lettre in mot:
        if lettre in lettres_trouvees:
            progression += lettre + " "
        else:
            progression += "_ "
    return progression.strip()

def jouer():
    mot_a_deviner = choisir_mot()
    lettres_trouvees = set()
    tentatives = 0
    coeurs = 5
    print("bienvenue au jeu de L'urtiag ambulant !")
    print("devinez le mot en proposant des lettres.")
    while True:
        print("\nMot à deviner : ", afficher_progression(mot_a_deviner, lettres_trouvees))
        print("Coeurs restants :", coeurs)
        lettre = input("Proposez une lettre : ").lower().strip()
        if lettre in lettres_trouvees:
            print("Vous avez déjà proposé cette lettre.")
        else:
            lettres_trouvees.add(lettre)
            tentatives += 1
            if lettre in mot_a_deviner:
                print("Bonne lettre !")
            else:
                coeurs -= 1
                print("Lettre incorrecte. Cœur perdu !")
                if coeurs <= 0:
                    print("\nGame over. Vous avez perdu. Le mot était :", mot_a_deviner)
                    break
        if all(lettre in lettres_trouvees for lettre in mot_a_deviner):
            print("\nFélicitations ! Vous avez deviné le mot :", mot_a_deviner)
            print("Nombre de tentatives :", tentatives)
            break

if __name__ == "__main__":
    jouer()
