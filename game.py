import random


def creer_joueur(numero):

    print(f"\n👤 JOUEUR {numero}")

    while True:
        try:
            budget = float(input("💰 Budget de départ : "))

            if budget <= 0:
                print("❌ Le budget doit être supérieur à 0.")
                continue

            break

        except ValueError:
            print("❌ Entre un nombre valide.")

    return {
        "nom": f"Joueur {numero}",
        "budget": budget,
        "garage": []
    }


def tirer_voiture(cars_disponibles):

    if not cars_disponibles:
        print("❌ Il n'y a plus de voitures disponibles.")
        return None

    voiture = random.choice(cars_disponibles)

    cars_disponibles.remove(voiture)

    print("\n🎰 TIRAGE EN COURS...")
    print("...")
    print("...")
    print("...")

    print("\n🚗 VOITURE TIRÉE")
    print("━━━━━━━━━━━━━━━━━━━━")
    print(f"Marque      : {voiture['marque']}")
    print(f"Modèle      : {voiture['modele']}")
    print(f"Année       : {voiture['annee']}")
    print(
        f"Catégorie   : "
        f"{voiture.get('categorie', 'Non renseignée')}"
    )
    print(
        f"Carrosserie : "
        f"{voiture.get('carrosserie', 'Non renseignée')}"
    )
    print("━━━━━━━━━━━━━━━━━━━━")

    return voiture


def lancer_enchere(joueur1, joueur2, voiture):

    if voiture is None:
        return None

    if len(joueur1["garage"]) >= 5 and len(joueur2["garage"]) >= 5:
        print("❌ Les deux joueurs ont déjà 5 voitures.")
        return None

    if len(joueur1["garage"]) >= 5:

        print("\n🚗 Joueur 1 possède déjà 5 voitures.")
        print("🏆 Joueur 2 remporte automatiquement la voiture !")

        joueur2["garage"].append(voiture)

        print(
            f"🚗 {voiture['marque']} "
            f"{voiture['modele']} "
            "ajouté au garage de Joueur 2."
        )

        return joueur2

    if len(joueur2["garage"]) >= 5:

        print("\n🚗 Joueur 2 possède déjà 5 voitures.")
        print("🏆 Joueur 1 remporte automatiquement la voiture !")

        joueur1["garage"].append(voiture)

        print(
            f"🚗 {voiture['marque']} "
            f"{voiture['modele']} "
            "ajouté au garage de Joueur 1."
        )

        return joueur1


    print("\n🔨 ENCHÈRE")
    print("━━━━━━━━━━━━━━━━━━━━")

    joueur_actuel = joueur1
    autre_joueur = joueur2


    print("\n🚨 Joueur 1 commence !")
    print(f"💳 Budget : {joueur1['budget']:,.0f} €")


    while True:

        try:

            prix = float(
                input(
                    "💰 Combien proposes-tu "
                    "pour commencer ? "
                )
            )

            if prix <= 0:

                print(
                    "❌ L'enchère doit être "
                    "supérieure à 0."
                )

                continue


            if prix > joueur1["budget"]:

                print(
                    "❌ Tu n'as pas assez d'argent."
                )

                continue

            break

        except ValueError:

            print(
                "❌ Entre un nombre valide."
            )


    prix_actuel = prix

    print(
        f"✅ Joueur 1 propose "
        f"{prix_actuel:,.0f} € !"
    )


    while True:

        print("\n━━━━━━━━━━━━━━━━━━━━")

        print(
            f"💰 Prix actuel : "
            f"{prix_actuel:,.0f} €"
        )

        print(
            f"👤 {autre_joueur['nom']}"
        )

        print(
            f"💳 Budget : "
            f"{autre_joueur['budget']:,.0f} €"
        )


        if autre_joueur["budget"] <= prix_actuel:

            print(
                f"\n💸 {autre_joueur['nom']} "
                "ne peut pas enchérir davantage."
            )

            gagnant = joueur_actuel

            break


        choix = input(
            "\n[e] Enchérir\n"
            "[c] Se coucher\n\n"
            "Ton choix : "
        ).lower()


        if choix == "c":

            print(
                f"\n🏳️ "
                f"{autre_joueur['nom']} "
                "se couche."
            )

            gagnant = joueur_actuel

            break


        elif choix == "e":

            while True:

                try:

                    nouvelle_enchere = float(
                        input(
                            "💰 Nouvelle enchère : "
                        )
                    )


                    if nouvelle_enchere <= prix_actuel:

                        print(
                            "❌ L'enchère doit être "
                            "supérieure au prix actuel."
                        )

                        continue


                    if nouvelle_enchere > autre_joueur["budget"]:

                        print(
                            "❌ Tu n'as pas assez d'argent."
                        )

                        continue

                    break

                except ValueError:

                    print(
                        "❌ Entre un nombre valide."
                    )


            prix_actuel = nouvelle_enchere

            print(
                f"✅ {autre_joueur['nom']} "
                f"propose "
                f"{prix_actuel:,.0f} € !"
            )


            joueur_actuel, autre_joueur = (
                autre_joueur,
                joueur_actuel
            )


        else:

            print(
                "❌ Choisis e ou c."
            )


    gagnant["budget"] -= prix_actuel

    gagnant["garage"].append(voiture)


    print("\n🏆 VENTE !")

    print(
        f"🏆 {gagnant['nom']} remporte "
        f"{voiture['marque']} "
        f"{voiture['modele']} "
        f"pour "
        f"{prix_actuel:,.0f} € !"
    )

    print(
        f"💰 Nouveau budget de "
        f"{gagnant['nom']} : "
        f"{gagnant['budget']:,.0f} €"
    )

    print("🚗 Voiture ajoutée au garage.")


    return gagnant


def afficher_garages(joueur1, joueur2):

    print("\n🏠 GARAGES")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


    print(f"\n👤 {joueur1['nom']}")

    print(
        f"💰 Budget : "
        f"{joueur1['budget']:,.0f} €"
    )


    if joueur1["garage"]:

        for voiture in joueur1["garage"]:

            print(
                f"🚗 {voiture['marque']} "
                f"{voiture['modele']} "
                f"({voiture['annee']})"
            )

    else:

        print("🚗 Garage vide")


    print(f"\n👤 {joueur2['nom']}")

    print(
        f"💰 Budget : "
        f"{joueur2['budget']:,.0f} €"
    )


    if joueur2["garage"]:

        for voiture in joueur2["garage"]:

            print(
                f"🚗 {voiture['marque']} "
                f"{voiture['modele']} "
                f"({voiture['annee']})"
            )

    else:

        print("🚗 Garage vide")


    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
