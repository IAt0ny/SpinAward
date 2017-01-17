var userChoosen = new Array(500);
for (var i = 0; i < userEmail.length; i++) {
    userChoosen[i] = true;
}

function luckyDraw() {
    var numRandom;
    userChoosen[numRandom] = false;
    while (userChoosen[numRandom] == false) {
        numRandom = Math.floor(Math.random() * userEmail.length);
    }
    userChoosen[numRandom] = false;
    return numRandom;
}