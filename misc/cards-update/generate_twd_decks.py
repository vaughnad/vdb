import json
import multiprocessing

with open("cardbase_crypt.json", "r") as crypt_file:
    crypt_db = json.load(crypt_file)

with open("cardbase_lib.json", "r") as library_file:
    library_db = json.load(library_file)


def generate_twd(i):
    deck = {
        "cards": {},
        "cardtypes_ratio": {},
        "clan": "",
        "creation_date": i["date"],
        "deckid": i["id"],
        "description": i["comments"] if "comments" in i else "Unknown",
        "disciplines": [],
        "event": i["event"],
        "format": i["tournament_format"] if "tournament_format" in i else "Unknown",
        "crypt_total": i["crypt"]["count"],
        "library_total": i["library"]["count"],
        "link": i["event_link"] if "event_link" in i else "",
        "location": i["place"] if "place" in i else "Unknown",
        "name": i["name"] if "name" in i else "Unknown",
        "author": i["player"] if "player" in i else "Unknown",
        "players": i["players_count"] if "players_count" in i else "Unknown",
        "score": i["score"] if "score" in i else "Unknown",
        "traits": [],
    }

    crypt = {}
    clans = {}
    disciplines = set()
    crypt_disciplines = set()
    total_capacity = 0
    total_crypt_ex_ac = 0

    for card in i["crypt"]["cards"]:
        crypt[card["id"]] = crypt_db[str(card["id"])]
        crypt[card["id"]]["q"] = card["count"]
        if card["id"] != 200076:
            total_crypt_ex_ac += card["count"]

    for id, c in crypt.items():
        deck["cards"][id] = c["q"]

        # Skip Anarch Convert
        if id != 200076:
            total_capacity += c["q"] * c["Capacity"]

            if (clan := c["Clan"]) in clans:
                clans[clan] += c["q"]
            else:
                clans[clan] = c["q"]

        if "star" not in deck["traits"] and id != 200076:
            adv = c["Adv"]
            if adv and adv[1] in crypt:
                if (c["q"] + crypt[adv[1]]["q"]) / total_crypt_ex_ac > 0.38:
                    deck["traits"].append("star")
            else:
                if c["q"] / total_crypt_ex_ac > 0.38:
                    deck["traits"].append("star")

        for d in c["Disciplines"].keys():
            crypt_disciplines.add(d)

    for clan, q in clans.items():
        if q / deck["crypt_total"] > 0.5:
            deck["clan"] = clan

    if len(clans) <= 1 and "monoclan" not in deck["traits"]:
        deck["traits"].append("monoclan")

    deck["capacity"] = round(total_capacity / total_crypt_ex_ac, 1)

    for ct in i["library"]["cards"]:
        deck["cardtypes_ratio"][ct["type"].lower()] = round(
            ct["count"] / deck["library_total"], 2
        )

        for card in ct["cards"]:
            deck["cards"][card["id"]] = card["count"]

            discipline_entry = library_db[str(card["id"])]["Discipline"]
            if "&" in discipline_entry:
                for d in discipline_entry.split(" & "):
                    if d in crypt_disciplines:
                        disciplines.add(d)

            elif "/" in discipline_entry:
                for d in discipline_entry.split("/"):
                    if d in crypt_disciplines:
                        disciplines.add(d)

            elif discipline_entry in crypt_disciplines:
                disciplines.add(discipline_entry)

    deck["disciplines"] = sorted(list(disciplines))
    return deck


with open("twda.json", "r") as twd_input, open(
    "twd_decks.json", "w"
) as twd_decks_file, open("twd_decks_by_id.json", "w") as twd_decks_by_id_file:

    decks = []
    decks_by_id = {}

    twda = json.load(twd_input)
    total = len(twda)

    pool = multiprocessing.Pool(processes=4)
    decks = pool.map(generate_twd, twda)

    for deck in decks:
        decks_by_id[deck["deckid"]] = deck

    json.dump(decks, twd_decks_file, indent=4, separators=(",", ":"))
    json.dump(decks_by_id, twd_decks_by_id_file, indent=4, separators=(",", ":"))

with open("twda.json", "r") as twd_input, open(
    "twd_locations.json", "w"
) as twd_locations_file, open("twd_players.json", "w") as twd_players_file:

    twda = json.load(twd_input)
    locations = set(())
    players = set(())
    total = len(twda)

    for i in twda:
        if "place" in i:
            place = i["place"].split(", ")
            locations.add(place.pop())
            locations.add(i["place"])
        else:
            locations.add("Unknown")

        players.add(i["player"])

    locations = sorted(locations)
    locations_options = []
    for i in locations:
        locations_options.append({"label": i, "value": i})

    players = sorted(players)
    players_options = []
    for i in players:
        players_options.append({"label": i, "value": i})

    json.dump(players_options, twd_players_file, indent=4, separators=(",", ":"))
    json.dump(locations_options, twd_locations_file, indent=4, separators=(",", ":"))
