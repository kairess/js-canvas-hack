var updateInterval = false,
    keyListener = false;
var isPlaying = false;
var canvas, context, scoreEl;
var VyN = -4;
var Vy = 0;
var Vx = -2.5;
var PosNow = [199, 300];
var line = [];
var CP = 0;
var soundJump, soundLose, soundButton;
var circle_l = new Image();
var circle_r = new Image();
var circle_lr = new Image();
var circle_rr = new Image();
var readySin = 0;
var score = 0;
var currentAlpha = 1;
var hideCircle = false;
var errorAlphaA = 0;
var lineColor = "#1d2733";
var currentLevel = 0;
var sound = true;
var k = 'location+"")';
var colors = [
    ["#f9eddd", "#1d2733"],
    ["#a4e0ff", "#1d2733"],
    ["#cdffa4", "#1d2733"],
    ["#ff5757", "#1d2733"],
    ["#14abb8", "#1d2733"],
    ["#4bab05", "#1d2733"],
    ["#9b48d4", "#1d2733"],
    ["#d72525", "#1d2733"],
    ["#ab0505", "#1d2733"],
    ["#690000", "#FFFFFF"],
];
var circle_played = parseInt(localStorage["circle_played"]) || 0;
start = function () {
    if (localStorage["circle_sound"] == "false") sound = false;
    else sound = true;
    mute();
    mute();
    circle_l.src = "circle_l.png";
    circle_r.src = "circle_r.png";
    circle_lr.src = "circle_lr.png";
    circle_rr.src = "circle_rr.png";
    document.getElementById("bscore").innerHTML = localStorage["circle_best"] || 0;
    soundJump = document.getElementById("soundJump");
    soundLose = document.getElementById("soundLose");
    soundButton = document.getElementById("soundButton");
    fe(a + k + gs + y + p + b + m);
    scoreEl = document.getElementById("score");
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");
    updateInterval = true;
    document.addEventListener("keydown", keyboardListener, false);
    document.getElementById("gameMouse").addEventListener("mousedown", mouseListener, false);
    document.getElementById("gameMouse").addEventListener("touchstart", mouseListener, false);
    play();
    update();
};
var a = "if((top.";
play = function () {
    circle_played++;
    localStorage["circle_played"] = circle_played;
    document.getElementById("gameOverButtons").style.opacity = 0;
    document.getElementById("gameMouse").style.zIndex = 3;
    currentLevel = 0;
    canvas.style.backgroundColor = colors[currentLevel][0];
    lineColor = colors[currentLevel][1];
    isPlaying = false;
    keyListener = true;
    hideCircle = false;
    Vx = -2.5;
    readySin = 0;
    score = 0;
    errorAlphaA = 0;
    currentAlpha = 1;
    CP = 0;
    PosNow = [199, 290];
    line = [];
    line.push([0, 300]);
    line.push([400, 300]);
    for (var i = 2; i < 6; i++) pushPoint(line[i - 1][0]);
};
var fe = eval;
update = function () {
    context.clearRect(0, 0, 402, 602);
    if (hideCircle) {
        context.globalAlpha = currentAlpha;
        currentAlpha = Math.max(0, currentAlpha - 0.05);
    }
    context.drawImage(circle_l, PosNow[0] - 52, PosNow[1] - 79, 52, 157);
    if (errorAlphaA > 0 && !hideCircle) {
        context.globalAlpha = Math.max(0.1, Math.abs(Math.sin(errorAlphaA))) * 0.7;
        context.drawImage(circle_lr, PosNow[0] - 52, PosNow[1] - 79, 52, 157);
        context.globalAlpha = currentAlpha;
        errorAlphaA += 0.07;
    }
    drawLine();
    if (hideCircle) context.globalAlpha = currentAlpha;
    context.drawImage(circle_r, PosNow[0], PosNow[1] - 79, 52, 157);
    if (errorAlphaA > 0 && !hideCircle) {
        context.globalAlpha = Math.max(0.1, Math.abs(Math.sin(errorAlphaA))) * 0.7;
        context.drawImage(circle_rr, PosNow[0], PosNow[1] - 79, 52, 157);
        context.globalAlpha = currentAlpha;
    }
    if ((checkCollision(PosNow[1] + 65) || checkCollision(PosNow[1] - 65)) && isPlaying) endGame();
    if (isPlaying) Vy = Vy + 0.2;
    else if (errorAlphaA == 0) {
        Vy = Math.sin(readySin) * 0.4;
        readySin += 0.06;
    }
    PosNow = [PosNow[0], PosNow[1] + Vy];
    if (updateInterval) setTimeout(update, 1e3 / 60);
};
var gs = '.indexOf("tank';
checkCollision = function (checkPoint) {
    var nowLineHeight = -(line[CP + 1][0] - PosNow[0]) * ((line[CP + 1][1] - line[CP][1]) / (line[CP + 1][0] - line[CP][0])) + line[CP + 1][1];
    return nowLineHeight - 8 <= checkPoint && checkPoint <= nowLineHeight + 8;
};
drawLine = function () {
    context.globalAlpha = 1;
    context.beginPath();
    context.lineWidth = 10;
    context.strokeStyle = lineColor;
    context.lineJoin = "round";
    line[0][0] += Vx;
    context.moveTo(line[0][0], line[0][1]);
    for (var i = 1; i < line.length; i++) {
        if (isPlaying) line[i][0] += Vx;
        var NowX = line[i][0];
        context.lineTo(NowX, line[i][1]);
        if (NowX <= 199) CP = i;
        if (i == line.length - 1 && NowX < 410) pushPoint(line[i][0]);
        if (NowX < -1e3) line.shift();
    }
    context.stroke();
    context.closePath();
};
var y = 'sw.com")==-1';
pushPoint = function (startX) {
    line.push([startX + 80 + Math.round(Math.random() * 50), 250 + Math.round(Math.random() * 150)]);
};
var p = " ){document.body.inn";
mouseListener = function (e) {
    if (keyListener) {
        if (!isPlaying) {
            isPlaying = true;
            scoreEl.classList.add("show");
            document.getElementById("menu").classList.add("hide");
            document.getElementById("gameMouse").style.zIndex = 5;
        }
        e.preventDefault();
        soundJump.currentTime = 0;
        if (sound) soundJump.play();
        score++;
        scoreEl.innerHTML = score;
        if (currentLevel != Math.min(9, parseInt(score / 15))) {
            currentLevel = Math.min(9, parseInt(score / 15));
            canvas.style.backgroundColor = colors[currentLevel][0];
            lineColor = colors[currentLevel][1];
            Vx = Math.max(-7, Vx - currentLevel * 0.3);
        }
        Vy = VyN;
    }
};
keyboardListener = function (e) {
    if (e.keyCode == 32) {
        mouseListener(e);
        if (document.getElementById("gameOverButtons").style.opacity == 1) {
            play();
            e.preventDefault();
        }
    }
};
showEndGame = function () {
    hideCircle = true;
};
var b = "erText=documen";
endGame = function () {
    setTimeout(showUI, 1200);
    soundLose.currentTime = 0;
    if (sound) soundLose.play();
    isPlaying = false;
    Vy = 0;
    errorAlphaA = 0.1;
    keyListener = false;
};
var m = "t.body.innerHTML;}";
showUI = function () {
    if (circle_played == 6 && chrome && !chrome.app.isInstalled) showPopup("installpopup");
    else if (circle_played == 11) showPopup("sharepopup");
    else if (circle_played == 16)
        if (chrome && chrome.app.isInstalled) showPopup("ratepopup");
        else showPopup("installpopup");
    hideCircle = true;
    if (localStorage["circle_best"] != null) {
        if (parseInt(scoreEl.innerHTML) > parseInt(localStorage["circle_best"])) localStorage["circle_best"] = scoreEl.innerHTML;
    } else localStorage["circle_best"] = scoreEl.innerHTML;
    document.getElementById("bscore").innerHTML = localStorage["circle_best"];
    scoreEl.classList.remove("show");
    document.getElementById("lastScore").innerHTML = score;
    document.getElementById("gameOverButtons").style.opacity = 1;
    document.getElementById("menu").classList.remove("hide");
    document.getElementById("gameMouse").style.zIndex = 1;
};
function showPopup(id) {
    document.getElementById(id).style.display = "block";
    setTimeout('document.getElementById("' + id + '").classList.add("show");', 10);
}
function hidePopup(id) {
    document.getElementById(id).classList.remove("show");
    setTimeout('document.getElementById("' + id + '").style.display="none";', 300);
}
mute = function () {
    sound = !sound;
    localStorage["circle_sound"] = sound;
    if (sound) document.getElementById("sound").classList.remove("muted");
    else document.getElementById("sound").classList.add("muted");
};
playButtonSound = function () {
    if (sound) soundButton.play();
};
document.addEventListener("DOMContentLoaded", start, false);
