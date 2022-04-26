const words = [
    "succes",
    "programare",
    "administrare",
    "procedură",
    "situație",
    "mâncare",
    "sfat",
    "accent",
    "mașină",
    "educație",
    "scriere",
    "poartă",
    "cină",
    "independență",
    "raport",
    "nevastă",
    "posesie",
    "alcool",
    "iubire",
    "universitate",
    "importanță",
    "comitet",
    "decizie",
    "sesiune",
    "mulțumire",
    "înlocuire",
    "noroc",
    "soră",
    "articol",
    "studio",
    "reputație",
    "matematică",
    "procentaj",
    "inimă",
    "subiect",
    "birou",
    "interacțiune",
    "temă",
    "bunică",
    "telefon",
    "reacție",
    "combinație",
    "indicație",
    "elefant",
    "monedă",
    "țigară",
    "client",
    "discuție",
    "respirare",
    "actor",
	"pădure",
	"galben",
	"gheață",
	"muzică",
	"termometru",
	"oficiere",
	"carburant",
	"arestare",
	"trădare",
	"șuncă",
	"strălucire",
	"magazin",
	"prosop",
	"magnetic",
	"descuietoare",
	"rinichi",
	"trandafir",
	"frigider",
	"echipă",
	"confecțiune"
]

function createGame() {
    return new Promise(function (resolve, reject) {
        var cardIndex = []
        var cards = []
        var cardsfinal = [];
        //selecting 25 random words from the list
        for (var i = 0; i < 25; i++) {
            var singleIndex = getRandomInt(words.length)

            //while it's not in the list push it in
            while (cardIndex.includes(singleIndex)) {
                singleIndex = getRandomInt(words.length);
            }

            cardIndex.push(singleIndex)
            cards.push(
                {
                    word: words[singleIndex],
                    color: "neutral",
                    selected: false
                })
        }

        for (var red = 0; red < 9; red++) {
            var singleIndex = getRandomInt(cards.length)

            cards[singleIndex].color = "red";
            cardsfinal.push(cards[singleIndex]);
            cards.splice(singleIndex, 1);
        }

        for (var blue = 0; blue < 8; blue++) {
            var singleIndex = getRandomInt(cards.length)

            cards[singleIndex].color = "blue";
            cardsfinal.push(cards[singleIndex]);
            cards.splice(singleIndex, 1);
        }

        var bombIndex = getRandomInt(cards.length)
        cards[bombIndex].color = "black";

        var final = cards.concat(cardsfinal);
        final = shuffle(final);

        resolve(final);
    });
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    createGame
};