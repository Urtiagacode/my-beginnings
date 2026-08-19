import requests
import json
import time
import os

URL = "https://car-api2.p.rapidapi.com/api/trims"

HEADERS = {
    "Content-Type": "application/json",
    "x-rapidapi-host": "car-api2.p.rapidapi.com",
    "x-rapidapi-key": "156d516cb4msh5d76b7d4878449dp145b6bjsn2843467422e7"
}


with open("cars.json", "r", encoding="utf-8") as fichier:
    cars = json.load(fichier)


if os.path.exists("cars_enriched.json"):
    with open("cars_enriched.json", "r", encoding="utf-8") as fichier:
        cars_enriched = json.load(fichier)
else:
    cars_enriched = []

ids_deja_faits = {
    car["id"]
    for car in cars_enriched
}

print(f"✅ {len(ids_deja_faits)} modèles déjà récupérés.")
print(f"🚗 {len(cars) - len(ids_deja_faits)} modèles restants.")
print()

for i, car in enumerate(cars, start=1):

    
    if car["id"] in ids_deja_faits:
        continue

    params = {
        "make_model_id": car["id"],
        "year": car["annee"],
        "verbose": "yes"
    }

    response = requests.get(
        URL,
        headers=HEADERS,
        params=params
    )

    
    print(
        "Reset :",
        response.headers.get("x-ratelimit-requests-reset")
    )

    print(
        "Restant :",
        response.headers.get("x-ratelimit-requests-remaining")
    )

    
    if response.status_code == 429:
        print()
        print("🛑 ERREUR 429 : limite de requêtes atteinte.")
        print(f"📍 Arrêt au modèle {i}/{len(cars)}.")
        print("💾 Tout ce qui a été récupéré est sauvegardé.")
        break

    
    if response.status_code != 200:
        print(
            f"❌ Erreur {response.status_code} : "
            f"{car['marque']} {car['modele']}"
        )
        continue

    data = response.json()

    trims = data.get("data", [])

    
    for trim in trims:
        cars_enriched.append({
            "id": car["id"],
            "marque": car["marque"],
            "modele": car["modele"],
            "annee": car["annee"],
            "trim": trim.get("name"),
            "description": trim.get("description"),
            "prix": trim.get("msrp")
        })

  
    with open("cars_enriched.json", "w", encoding="utf-8") as fichier:
        json.dump(
            cars_enriched,
            fichier,
            indent=4,
            ensure_ascii=False
        )

    print(
        f"[{i}/{len(cars)}] "
        f"{car['marque']} {car['modele']} → "
        f"{len(trims)} trims → sauvegardé"
    )

    print()

    time.sleep(0.5)

print()
print("==============================")
print(f"✅ Total trims sauvegardés : {len(cars_enriched)}")
print("📁 Fichier : cars_enriched.json")
print("==============================")