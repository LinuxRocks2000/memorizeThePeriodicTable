const types = ["Atomic Symbol", "Atomic Name", "Atomic Number"];
const elements = [ // top three rows of the periodic table
    ["H", "Hydrogen", 1],
    ["He", "Helium", 2],
    ["Li", "Lithium", 3],
    ["Be", "Beryllium", 4],
    ["B", "Boron", 5],
    ["C", "Carbon", 6],
    ["N", "Nitrogen", 7],
    ["O", "Oxygen", 8],
    ["F", "Fluorine", 9],
    ["Ne", "Neon", 10],
    ["Na", "Sodium", 11],
    ["Mg", "Magnesium", 12],
    ["Al", "Aluminum", 13],
    ["Si", "Silicon", 14],
    ["P", "Phosphorous", 15],
    ["S", "Sulphur", 16],
    ["Cl", "Chlorine", 17],
    ["Ar", "Argon", 18]
];


function pad2(d) { // take a whole number and return it with exactly 2 digits
    d = Math.floor(d); // won't permit decimals
    if (d > 9) {
        return d + "";
    }
    else {
        return "0" + d;
    }
}


var clockTimer = undefined;


function clockDown(secs, f) {
    if (clockTimer != undefined) {
        clearInterval(clockTimer);
    }
    document.getElementById("clock").innerText = pad2(secs / 60) + ":" + pad2(secs % 60) + " REMAINING";
    clockTimer = setInterval(() => {
        if (secs == 0) {
            clearInterval(clockTimer);
            flash("bad");
            score(-2);
            f();
        }
        document.getElementById("clock").innerText = pad2(secs / 60) + ":" + pad2(secs % 60) + " REMAINING";
        secs -= 1;
    }, 1000);
}

function pickNot(not) {
    var pick = Math.floor(Math.random() * (elements.length - 1));
    if (pick >= not) {
        pick++;
    }
    return elements[pick];
}

function flash(el) {
    el = document.getElementById(el);
    el.style.display = "inline-block";
    setTimeout(() => {
        el.style.display = "none";
    }, 300);
}

function flashCorrect() {
    flash("right");
}

function flashWrong() {
    flash("wrong");
}

var cScore = 0;
function score(amount) {
    cScore += amount;
    document.getElementById("score").innerText = cScore;
}

score(0);

function rStep(n) { // return a random whole number from 0 to n - 1
    return Math.floor(Math.random() * n);
}

function ask() {
    clockDown(5, ask);
    var picked = Math.floor(Math.random() * elements.length);
    var question = elements[picked];
    var key = rStep(3);
    var value = rStep(2);
    if (value >= key) {
        value++;
    }
    document.getElementById("key").innerText = question[key];
    document.getElementById("datapoint-type").innerText = types[value];
    var picks = [];
    for (var i = 0; i < 4; i++) {
        picks.push(pickNot(picked));
    }
    picks[Math.floor(Math.random() * 4)] = question;
    for (var i = 0; i < 4; i++) {
        var el = document.getElementById("option-" + (i + 1));
        el.innerText = picks[i][value];
        if (picks[i] == question) {
            el.onclick = () => {
                flashCorrect();
                setTimeout(ask, 0); // allow the old scope to GC by putting the ask() call into the event queue, rather than just calling it
                score(1);
            };
        }
        else {
            el.onclick = () => {
                document.getElementById("wrong").innerText = "WRONG! The answer is " + question[value];
                flashWrong();
                setTimeout(ask, 0); // ditto
                score(-1);
            }
        }
    }
}


function start() {
    document.getElementById("multiple").style.display = "";
    document.getElementById("score").style.display = "";
    ask();
}