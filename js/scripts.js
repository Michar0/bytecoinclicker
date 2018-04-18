var amountCoins = 0;
var coinsPerSecond = 0;
var coinsPerClick = 1;
var upgrades = [];
var shopItems;
var cordinates = [0, 0];
var stats = [];
var startTime = new Date().getTime();
var coinHealth = 100;
var colorMode = "day";
var screenMode = "desktop";
var volume = true;


$(document).ready(function () {
    if (document.getElementsByClassName("Show").length > 0) {
        screenMode = "mobile";
    }
    if (screenMode !== "mobile") {
        detectMobile();
    }
    loadJsonItemsToShop();
    createStats();
});
window.onbeforeunload = function (e) {
    saveGame();
};
document.addEventListener('mousemove', getMousePosition);
setInterval(clickAutomatic, 1000);

function loadCache() {
    // if(localStorage.getItem("CssMode")==="night")
    // {
    //     changeDayNight();
    // }
    // if(localStorage.getItem("Volume")==="false") {
    //     changeVolume();
    // }
    // if(screenMode==="desktop")
    // {
    //     var text = document.getElementById("myProgress");
    //     text.textContent = localStorage.getItem("CoinHealth") + "%";
    // }
    // else
    // {
    //     var bar = document.getElementById("myBar");
    //     bar.style.width = localStorage.getItem("CoinHealth") + "%";
    // }
    // amountCoins=parseFloat(localStorage.getItem("Coins"));
    // coinsPerSecond=parseFloat(localStorage.getItem("CPS"));
    // coinsPerClick=parseFloat(localStorage.getItem("CPC"));
    //
    // document.getElementById("amountSecond").innerText = "Coins Per Second: " + coinsPerSecond;
    // document.getElementById("amount").innerText = "ByteCoins: " + amountCoins;
    // document.getElementById("coinsPerClick").innerText = "Coins Per Click: " + coinsPerClick;
}

function clickCoin() {
    amountCoins += coinsPerClick;
    amountCoins = decimalRound(amountCoins, 1);
    stats["coinsEver"] += coinsPerClick;
    stats["coinsEver"] = decimalRound(stats["coinsEver"], 1);
    stats["coinsClicked"] += coinsPerClick;
    stats["coinsClicked"] = decimalRound(stats["coinsClicked"], 1);
    stats["coinsClicks"]++;
    if (coinHealth < 1) {
        setupNewClickCoin();
    }
    coinHealth--;
    if (screenMode === "desktop") {
        var text = document.getElementById("myProgress");
        text.textContent = coinHealth + "%";
    }
    else {
        var bar = document.getElementById("myBar");
        bar.style.width = coinHealth + "%";
    }
    document.getElementById("amount").innerText = "ByteCoins: " + amountCoins;
    var clickHit = document.createElement("P");
    clickHit.textContent = "+" + coinsPerClick;
    clickHit.className = "flyingNumber noselect";
    clickHit.name = new Date().getTime();
    clickHit.style.top = (cordinates[1] - 30) + "px";
    clickHit.style.left = cordinates[0] + "px";
    clickHit.style.position = 'absolute';
    document.body.appendChild(clickHit);
    checkItemsAffordable();
    playSound("sounds/coinClick.mp3");
}

function buyItem(itemName) {
    for (var i = 0; i < upgrades.length; i++) {
        for (var y = 0; y < upgrades[i].length; y++) {
            if (upgrades[i][y].getName() === itemName && amountCoins >= upgrades[i][y].getPrice()) {
                amountCoins -= upgrades[i][y].getPrice();
                switch (upgrades[i][y].constructor.name) {
                    case "Videocard":
                        upgrades[i][y].raiseLevel();
                        coinsPerSecond += upgrades[i][y].getEffectOperand();
                        coinsPerSecond = decimalRound(coinsPerSecond, 2);
                        upgrades[i][y].addCoinsPerSecond(upgrades[i][y].getEffectOperand());
                        var item = getItemInShop(upgrades[i][y].getName());
                        var textObject = item.children[0].children[1];
                        textObject.textContent = upgrades[i][y].toString();
                        stats["boughtVideocards"]++;
                        break;
                    case "Upgrade":
                        switch (upgrades[i][y].getEffectTarget()) {
                            case "coinsPerClick":
                                coinsPerClick *= upgrades[i][y].getMultiplier();
                                break;
                            case "coinsPerSecond":
                                coinsPerSecond *= upgrades[i][y].getMultiplier();
                                coinsPerSecond = decimalRound(coinsPerSecond, 2);
                                break;
                        }
                        var item = getItemInShop(upgrades[i][y].getName());
                        item.parentElement.removeChild(item);
                        upgrades[i].splice(y, 1);
                        stats["boughtUpgrades"]++;
                        break;
                    case "Overclock":
                        for (var z = 0; z < upgrades[0].length; z++) {
                            if (upgrades[0][z].getName() === upgrades[i][y].getEffectTarget()) {
                                coinsPerSecond -= upgrades[0][z].getCoinsPerSecond();
                                upgrades[0][z].overclock();
                                coinsPerSecond += upgrades[0][z].getCoinsPerSecond();
                            }
                        }
                        var item = getItemInShop(upgrades[i][y].getName());
                        item.parentElement.removeChild(item);
                        stats["overclockVideocards"]++;
                        upgrades[i].splice(y, 1);
                        break;
                }
                playSound("sounds/buySound.mp3");
            }
        }
    }
    document.getElementById("amountSecond").innerText = "Coins Per Second: " + coinsPerSecond;
    document.getElementById("amount").innerText = "ByteCoins: " + amountCoins;
    document.getElementById("coinsPerClick").innerText = "Coins Per Click: " + coinsPerClick;
}

function clickAutomatic() {
    amountCoins += coinsPerSecond;
    amountCoins = decimalRound(amountCoins, 1);
    stats["coinsEver"] += coinsPerSecond;
    stats["coinsEver"] = decimalRound(stats["coinsEver"], 1);
    if (coinsPerSecond > 0 && coinHealth > 0) {
        coinHealth--;
        if (screenMode === "desktop") {
            document.getElementById("myProgress").textContent = coinHealth + "%";
        }
        else {
            document.getElementById("myBar").style.width = coinHealth + "%";
        }
    }
    else if (coinHealth === 0) {
        setupNewClickCoin();
    }
    document.getElementById("amount").innerText = "ByteCoins: " + amountCoins;
    checkItemsAffordable();
    removeInvisibleObjects();
}

function checkItemsAffordable() {
    for (var i = 0; i < upgrades.length; i++) {
        for (var y = 0; y < upgrades[i].length; y++) {
            var item = getItemInShop(upgrades[i][y].getName());
            if (amountCoins >= upgrades[i][y].getPrice()) {
                item.classList.remove("notAffordable");
                item.classList.add("affordable");
            }
            else if (amountCoins < upgrades[i][y].getPrice()) {
                item.classList.add("notAffordable");
                item.classList.remove("affordable");
            }
        }
    }
}

function changeDayNight() {
    removeInvisibleObjects();
    if (colorMode === "day") {
        if (screenMode === "desktop") {
            document.getElementById("dayNightSwitch").classList.remove("fa-sun");
            document.getElementById("dayNightSwitch").classList.add("fa-moon");
            document.getElementById('style').setAttribute('href', 'css/nightmode.css');
        }
        else {
            document.getElementById('style').setAttribute('href', 'css/nightmode_mobile.css');
        }
        colorMode = "night";
    }
    else {
        if (screenMode === "desktop") {
            document.getElementById('style').setAttribute('href', 'css/day.css');
            document.getElementById("dayNightSwitch").classList.remove("fa-moon");
            document.getElementById("dayNightSwitch").classList.add("fa-sun");
        }
        else {
            document.getElementById('style').setAttribute('href', 'css/day_mobile.css');
        }
        colorMode = "day";
    }
}

function changeVolume() {
    var audioPlayers = document.getElementsByClassName("audioSource");
    if (volume === true) {
        for (var i = 0; i < audioPlayers.length; i++) {
            audioPlayers[i].muted = true;
        }
        if (screenMode === "desktop") {
            document.getElementById("volumes").classList.remove("fa-volume-up");
            document.getElementById("volumes").classList.add("fa-volume-off");
        }
        volume = false;
    }
    else {
        for (var i = 0; i < audioPlayers.length; i++) {
            audioPlayers[i].muted = false;
        }
        if (screenMode === "desktop") {
            document.getElementById("volumes").classList.remove("fa-volume-off");
            document.getElementById("volumes").classList.add("fa-volume-up");
        }
        volume = true;
    }
}

function removeInvisibleObjects() {
    var items = document.getElementsByClassName("flyingNumber");
    for (var i = 0; i < items.length; i++) {
        if (parseInt(new Date().getTime()) > (parseInt(items[i].name + 2000))) {
            document.body.removeChild(items[i]);
        }
    }
}

function playSound(url) {
    var audio = document.getElementById("audioplayer");
    audio.src = url;
    audio.autoplay = true;
    audio.play();
}

function getMousePosition(event) {
    cordinates[0] = event.pageX;
    cordinates[1] = event.pageY;
}

function loadJsonItemsToShop() {
    $.ajaxSetup({
        async: false
    });
    upgrades[upgrades.length] = [];
    $.getJSON('https://api.myjson.com/bins/1bgsyl', function (data) { //Austauschen durch ein lokale json datei und anderem Algorithmus wegen Chrome
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            upgrades[0][i] = new Videocard(data[i].name, data[i].price, data[i].costincrease, data[i].targetproperty, data[i].targetincrease);
        }
    });
    upgrades[upgrades.length] = [];
    $.getJSON('https://api.myjson.com/bins/1cptbx', function (data) { //Austauschen durch ein lokale json datei und anderem Algorithmus wegen Chrome
        for (var i = 0; i < data.length; i++) {
            upgrades[1][i] = new Upgrade(data[i].name, data[i].price, data[i].targetproperty, data[i].targetmultiplier);
        }
    });
    upgrades[upgrades.length] = [];
    $.getJSON('https://api.myjson.com/bins/9pawz', function (data) { //Austauschen durch ein lokale json datei und anderem Algorithmus wegen Chrome
        for (var i = 0; i < data.length; i++) {
            upgrades[2][i] = new Overclock(data[i].name, data[i].price, data[i].targetCard);
        }
    });
    $.ajaxSetup({
        async: true
    });
    var targets = document.getElementsByClassName("shopContent");
    for (var i = 0; i < upgrades[0].length; i++) {
        var newCard = document.createElement("LI");
        var newDiv = document.createElement("div");
        var newImage = document.createElement("IMG");
        var name = upgrades[0][i].getName().split(" ");
        var z = 0;
        var text = "";
        do {
            text += name[z];
            z++;
        } while (z < name.length);
        z = 0;
        newImage.src = "images/" + text + ".png";
        text = "";
        newImage.style.width = "10%";
        newImage.style.height = "10%";
        newImage.style.float = "left";
        newImage.style.marginTop = "2%";
        newDiv.appendChild(newImage);
        var newP = document.createElement("P");
        newP.textContent = upgrades[0][i].toString();
        newDiv.appendChild(newP);
        newCard.appendChild(newDiv);
        newCard.classList.add("notAffordable");
        newCard.classList.add("shopItem");
        newCard.id = upgrades[0][i].getName();
        newCard.onclick = function (e) {
            buyItem(e.currentTarget.id);
        };
        newCard.onmouseover = function (e) {
            document.getElementById(e.currentTarget.id + "T").style.position = "absolute";
            document.getElementById(e.currentTarget.id + "T").classList.remove("invisible");
            document.getElementById(e.currentTarget.id + "T").style.top = (cordinates[0] - 50) + "px";
            document.getElementById(e.currentTarget.id + "T").style.left = (cordinates[1]) + "px";
        };
        newCard.onmouseout = function (e) {
            document.getElementById(e.currentTarget.id + "T").classList.add("invisible");
        };
        targets[0].appendChild(newCard);
        createToolTip(upgrades[0][i]);
    }

    for (var i = 0; i < upgrades[1].length; i++) {
        var newUpgrade = document.createElement("LI");
        var newDiv = document.createElement("div");
        var newImage = document.createElement("IMG");
        var name = upgrades[1][i].getName().split(" ");
        var z = 0;
        var text = "";
        do {
            text += name[z];
            z++;
        } while (z < name.length);
        z = 0;
        newImage.src = "images/" + text + ".png";
        text = "";
        newImage.style.width = "5%";
        newImage.style.height = "5%";
        newImage.style.float = "left";
        newImage.style.marginTop = "1%";
        newDiv.appendChild(newImage);
        var newP = document.createElement("P");
        newP.textContent = upgrades[1][i].toString();
        newDiv.appendChild(newP);
        newUpgrade.appendChild(newDiv);
        newUpgrade.classList.add("notAffordable");
        newUpgrade.classList.add("shopItem");
        newUpgrade.id = upgrades[1][i].getName();
        newUpgrade.onclick = function (e) {
            buyItem(e.currentTarget.id);
        };
        if (screenMode === "desktop") {
            targets[1].appendChild(newUpgrade);
        }
        else {
            targets[0].appendChild(newUpgrade);
        }
    }
    target = document.getElementById("overclockShopContent");
    for (var i = 0; i < upgrades[2].length; i++) {
        var newOverclock = document.createElement("LI");
        var newDiv = document.createElement("div");
        var newImage = document.createElement("IMG");
        newImage.src = "images/overclock.png";
        newImage.style.width = "10%";
        newImage.style.height = "10%";
        newImage.style.float = "left";
        newImage.style.marginTop = "2%";
        newDiv.appendChild(newImage);
        var newP = document.createElement("P");
        newP.textContent = upgrades[2][i].toString();
        newDiv.appendChild(newP);
        newOverclock.appendChild(newDiv);
        newOverclock.classList.add("notAffordable");
        newOverclock.classList.add("shopItem");
        newOverclock.id = upgrades[2][i].getName();
        newOverclock.onclick = function (e) {
            buyItem(e.currentTarget.id);
        };
        if (screenMode === "desktop") {
            targets[2].appendChild(newOverclock);
        }
        else {
            targets[0].appendChild(newOverclock);
        }
    }
    shopItems = document.getElementsByClassName("shopItem");
}

function updateStats() {
    var stat = document.getElementsByClassName("stat");
    var text = "";

    stats["coinsCurrent"] = amountCoins;
    stats["time"] = ((new Date().getTime() - startTime) / 1000);
    for (var i = 0; i < stat.length; i++) {
        var split = stat[i].textContent.split(" ");
        for (var y = 0; y < split.length - 1; y++) {
            text = text + " " + split[y];
        }
        text = text + " " + stats[stat[i].title];
        if (stat[i].title === "time") {
            text += "s";
        }
        stat[i].textContent = text;
        text = "";
    }
    document.title = amountCoins + " Coins - ByteCoin Clicker";
}

function createStats() {
    var stat = document.getElementsByClassName("stat");
    for (var i = 0; i < stat.length; i++) {
        stats[stat[i].title] = 0;
    }
    setInterval(updateStats, 3000);
}

function decimalRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function addCoins(number) {
    amountCoins += number;
}

function togglePage(name) {
    if (document.getElementById(name).classList.contains("invisible")) {
        document.getElementById(name).classList.remove("invisible");
        if (name === "statsPage") {
            document.getElementById("shopPage").classList.add("invisible");
            document.getElementById("settingsPage").classList.add("invisible");
            document.getElementById("aboutPage").classList.add("invisible");
        }
        else if (name === "shopPage") {
            document.getElementById("statsPage").classList.add("invisible");
            document.getElementById("settingsPage").classList.add("invisible");
            document.getElementById("aboutPage").classList.add("invisible");
        }
        else if (name === "settingsPage") {
            document.getElementById("statsPage").classList.add("invisible");
            document.getElementById("shopPage").classList.add("invisible");
            document.getElementById("aboutPage").classList.add("invisible");
        }
        else {
            document.getElementById("statsPage").classList.add("invisible");
            document.getElementById("settingsPage").classList.add("invisible");
            document.getElementById("shopPage").classList.add("invisible");
        }
    }
    else {
        document.getElementById(name).classList.add("invisible");
    }
}

function getItemInShop(nameItem) {
    for (var i = 0; i < shopItems.length; i++) {
        if (shopItems[i].id === nameItem) {
            return shopItems[i];
        }
    }
}

function setupNewClickCoin() {
    coinHealth = 100;
    if (screenMode === "desktop") {
        var elm = document.getElementById("myProgress");
        elm.textContent = "100%";
    }
    else {
        document.getElementById("myBar").style.width = "100%";
    }
    var drop = document.createElement("IMG");
    drop.src = "images/dropUSB.png";
    drop.classList.add("drop");
    drop.onclick = function () {
        buildItemGetWindow();
        document.body.removeChild(this);
    };
    if(screenMode==="desktop") {
        drop.style.top = Math.floor((Math.random() * 600) + 1) + "px";
        drop.style.left = Math.floor((Math.random() * 600) + 1) + "px";
    }
    else
    {
        drop.style.top = "35%";
        drop.style.left = "20%";
    }
    drop.style.cursor = "pointer";
    drop.style.width = 64 + "px";
    drop.style.height = 64 + "px";
    drop.style.position = 'absolute';
    var audio = document.createElement("AUDIO");
    audio.classList.add("audioSource");
    audio.src = "sounds/drop.mp3";
    audio.loop = true;
    audio.play();
    if (volume === false) {
        audio.muted = true;
    }
    drop.appendChild(audio);
    document.body.appendChild(drop);
}

function buildItemGetWindow() {
    var lootScreen = document.createElement("div");
    if (screenMode === "desktop")
    {
        lootScreen.style.width = "30%";
        lootScreen.style.height = "30%";
        lootScreen.style.top = "35%";
        lootScreen.style.left = "30%";
    }
    else
    {
        lootScreen.style.width = "80%";
        lootScreen.style.height = "30%";
        lootScreen.style.top = "20%";
        lootScreen.style.left = "10%";
    }
    lootScreen.style.position = "absolute";
    lootScreen.style.border = "2px solid black";
    lootScreen.classList.add("lootScreen");
    var loot = Math.floor((Math.random() * 100) + 1);
    var lootText = document.createElement("P");
    lootText.textContent = "ByteCoins x" + loot;
    if(screenMode==="desktop") {
        lootText.style.top = "40%";
        lootText.style.left = "30%";
    }
    else
    {
        lootText.style.top = "50%";
        lootText.style.left = "30%";
    }
    lootText.style.position = "absolute";
    lootScreen.appendChild(lootText);
    var header = document.createElement("P");
    header.textContent = "New Loot";
    header.style.top = "5%";
    header.style.left = "43%";
    header.style.position = "absolute";
    lootScreen.appendChild(header);
    var lootButton = document.createElement("BUTTON");
    lootButton.style.position = "absolute";
    if(screenMode==="desktop") {
        lootButton.style.top = "80%";
        lootButton.style.right = "45%";
        lootButton.style.width = "10%";
        lootButton.style.height = "10%";
    }
    else
    {
        lootButton.style.top = "65%";
        lootButton.style.right = "40%";
        lootButton.style.width = "30%";
        lootButton.style.height = "30%";
    }
    lootButton.textContent = "Loot";
    lootButton.onclick = function () {
        addCoins(loot);
        document.body.removeChild(this.parentElement);
        stats["lootedDrops"]++;
    };
    lootScreen.appendChild(lootButton);
    document.body.appendChild(lootScreen);
}

function showCoinHealth() {
    if (document.getElementById("myProgress").classList.contains("invisible")) {
        document.getElementById("myProgress").classList.remove("invisible");
    }
    else {
        document.getElementById("myProgress").classList.add("invisible");
    }
}

function createToolTip(object) {
    var toolTip = document.createElement("DIV");
    toolTip.id = object.getName() + "T";
    var toolHeader = document.createElement("P");
    toolHeader.textContent = object.getName();
    toolHeader.style.left = "30%";
    toolHeader.style.top = "1%";
    toolHeader.style.position = "absolute";
    toolTip.appendChild(toolHeader);
    var toolText = document.createElement("P");
    toolText.textContent = "Erhöht die Coins pro Sekunde um " + object.getEffectOperand();
    toolText.style.left = "2%";
    toolText.style.top = "40%";
    toolText.style.position = "absolute";
    toolTip.appendChild(toolHeader);
    toolTip.appendChild(toolText);
    toolTip.style.width = "15%";
    toolTip.style.height = "10%";
    toolTip.style.position = "absolute";
    toolTip.classList.add("tooltip");
    toolTip.style.border = "2px solid black";
    toolTip.classList.add("invisible");
    document.body.appendChild(toolTip);
}

function mobile() {
    window.location.replace("index_mobile.html");
}

function detectMobile() {
    if (screenMode === "desktop") {
        var width = screen.width;
        if (width < 700) {
            document.getElementById("mobileMessage").classList.remove("invisible");
        }
    }
}
function closeMobileMessage(){
    document.getElementById("mobileMessage").classList.add("invisible");
}

function saveGame() {
    // localStorage.setItem("CssMode",colorMode);
    // localStorage.setItem("Volume",volume);
    // localStorage.setItem("Coins",amountCoins);
    // localStorage.setItem("CoinHealth",coinHealth);
    // localStorage.setItem("CPS",coinsPerSecond);
    // localStorage.setItem("CPC",coinsPerClick);
}
