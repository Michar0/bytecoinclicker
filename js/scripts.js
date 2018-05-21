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
var shopMode = "buy";
var volume = true;
var shopAmount = 1;
var reset = false;
var autoloot = false;
var events = [];
var eventStarted = new Date().getTime();
var eventDuration = 0;
var actualEvent;
var timeToEvent = eventStarted + Math.floor(Math.random() * (1200000 - 120000 + 1)) + 120000;
const version = 0.501;
var previousPlaytime = 0;



$(document).ready(function () {
    if (document.getElementsByClassName("Show").length > 0) {
        screenMode = "mobile";
    }
    if (screenMode !== "mobile") {
        detectMobile();
    }
    loadJsonItemsToShop();
    loadEvents();
    detectBrowser();
    createStats();
    setInterval(clickAutomatic, 1000);
    document.addEventListener('mousemove', getMousePosition);
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 83) {
            togglePage("shopPage");
        }
        if (event.keyCode == 84) {
            spawnThief();
        }
    });
    if (version > parseFloat(localStorage.getItem("version")) || localStorage.getItem("version") == null) {
        document.getElementById("aboutPage").classList.remove("invisible");
        document.getElementById("closeChangelog").classList.remove("invisible");
        document.getElementById("closeChangelog").onclick = function () {
            document.getElementById("closeChangelog").classList.add("invisible");
            document.getElementById("aboutPage").classList.add("invisible");
        }

    }
});
window.onbeforeunload = function () {
    saveGame();
};


function loadCache() {
    if (localStorage.length > 0) {
        if (document.getElementsByClassName("Show").length > 0) {
            screenMode = "mobile";
        }
        if (localStorage.getItem("CssMode") === "night") {
            changeDayNight();
        }
        if (localStorage.getItem("Volume") === "false") {
            changeVolume();
        }
        if (screenMode === "desktop") {
            var text = document.getElementById("myProgress");
            text.textContent = localStorage.getItem("CoinHealth") + "%";
        }
        else {
            var bar = document.getElementById("myBar");
            bar.style.width = localStorage.getItem("CoinHealth") + "%";
        }
        coinHealth = localStorage.getItem("CoinHealth");
        amountCoins = parseFloat(localStorage.getItem("Coins"));
        coinsPerSecond = parseFloat(localStorage.getItem("CPS"));
        coinsPerClick = parseFloat(localStorage.getItem("CPC"));
        autoloot = (localStorage.getItem("autoloot") === 'true');
        previousPlaytime = parseFloat(localStorage.getItem("previousTime"));
        document.getElementById("amountSecond").innerText = "Coins Per Second: " + coinsPerSecond;
        document.getElementById("amount").innerText = "ByteCoins: " + amountCoins;
        document.getElementById("coinsPerClick").innerText = "Coins Per Click: " + coinsPerClick;
    }
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
            if (upgrades[i][y].getName() === itemName && amountCoins >= (upgrades[i][y].getPrice() * shopAmount)) {
                amountCoins -= (upgrades[i][y].getPrice() * shopAmount);
                switch (upgrades[i][y].constructor.name) {
                    case "Videocard":
                        for (var z = 0; z < shopAmount; z++) {
                            upgrades[i][y].raiseLevel();
                            coinsPerSecond += (upgrades[i][y].getEffectOperand() * getSpecialMultiplier());
                            coinsPerSecond = decimalRound(coinsPerSecond, 2);
                            upgrades[i][y].addCoinsPerSecond(upgrades[i][y].getEffectOperand());
                            var item = getItemInShop(upgrades[i][y].getName());
                            item.classList.add("bought");
                            item.classList.add("videocard");
                            var textObject = item.children[0].children[1];
                            textObject.textContent = upgrades[i][y].toString();
                            stats["boughtVideocards"]++;
                        }
                        break;

                    case "Upgrade":
                        switch (upgrades[i][y].getEffectTarget()) {
                            case "coinsPerClick":
                                coinsPerClick *= (upgrades[i][y].getMultiplier());
                                break;
                            case "coinsPerSecond":
                                coinsPerSecond *= (upgrades[i][y].getMultiplier());
                                coinsPerSecond = decimalRound(coinsPerSecond, 2);
                                break;
                            case "autoloot":
                                autoloot = true;
                                var items = document.getElementsByClassName("drop");
                                for (var o = 0; o < items.length; o++) {
                                    items[o].onclick();
                                }
                                break;
                        }
                        if (shopAmount > 1) {
                            var wastedMoney = upgrades[i][y].getPrice() * (shopAmount - 1);
                            amountCoins += wastedMoney;
                        }
                        var item = getItemInShop(upgrades[i][y].getName());
                        upgrades[i][y].buys();
                        item.classList.add("bought");
                        item.style.display = "none";
                        stats["boughtUpgrades"]++;
                        break;
                    case "Overclock":
                        for (var z = 0; z < upgrades[0].length; z++) {
                            if (upgrades[0][z].getName() === upgrades[i][y].getEffectTarget()) {
                                coinsPerSecond -= (upgrades[0][z].getCoinsPerSecond() * getSpecialMultiplier());
                                upgrades[0][z].overclock();
                                coinsPerSecond += (upgrades[0][z].getCoinsPerSecond() * getSpecialMultiplier());
                            }
                        }
                        if (shopAmount > 1) {
                            var wastedMoney = upgrades[i][y].getPrice() * (shopAmount - 1);
                            amountCoins += wastedMoney;
                        }
                        var item = getItemInShop(upgrades[i][y].getName());
                        item.classList.add("bought");
                        item.style.display = "none";
                        stats["overclockVideocards"]++;
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

function sellItem(itemName) {
    for (var i = 0; i < upgrades.length; i++) {
        for (var y = 0; y < upgrades[i].length; y++) {
            if (upgrades[i][y].getName() === itemName) {
                switch (upgrades[i][y].constructor.name) {
                    case "Videocard":
                        for (var z = 0; z < shopAmount; z++) {
                            if (upgrades[i][y].getLevel() > 0) {
                                amountCoins += decimalRound(upgrades[i][y].getPrice() / upgrades[i][y].getPriceRaise(), 0);
                                upgrades[i][y].reduceLevel();
                                coinsPerSecond -= (upgrades[i][y].getEffectOperand() * getSpecialMultiplier());
                                coinsPerSecond = decimalRound(coinsPerSecond, 1);
                                upgrades[i][y].subCoinsPerSecond(upgrades[i][y].getEffectOperand());
                                var item = getItemInShop(upgrades[i][y].getName());
                                var textObject = item.children[0].children[1];
                                textObject.textContent = upgrades[i][y].toString();
                                stats["soldVideocards"]++;
                                if (upgrades[i][y].getLevel() === 0) {
                                    item.classList.remove("bought");
                                    item.style.display = "none";
                                }
                            }
                        }
                        break;
                    case "Upgrade":
                        amountCoins += (upgrades[i][y].getPrice());
                        switch (upgrades[i][y].getEffectTarget()) {
                            case "coinsPerClick":
                                coinsPerClick /= (upgrades[i][y].getMultiplier());
                                break;
                            case "coinsPerSecond":
                                coinsPerSecond /= (upgrades[i][y].getMultiplier());
                                coinsPerSecond = decimalRound(coinsPerSecond, 1);
                                break;
                            case "autoloot":
                                autoloot = false;
                                break;
                        }
                        var item = getItemInShop(upgrades[i][y].getName());
                        upgrades[i][y].sell();
                        item.classList.remove("bought");
                        item.style.display = "none";
                        stats["soldUpgrades"]++;
                        break;
                    case "Overclock":
                        amountCoins += upgrades[i][y].getPrice();
                        for (var z = 0; z < upgrades[0].length; z++) {
                            if (upgrades[0][z].getName() === upgrades[i][y].getEffectTarget()) {
                                coinsPerSecond -= upgrades[0][z].getCoinsPerSecond() * getSpecialMultiplier();
                                upgrades[0][z].underclock();
                                coinsPerSecond += upgrades[0][z].getCoinsPerSecond() * getSpecialMultiplier();
                                decimalRound(coinsPerSecond, 1);
                            }
                        }
                        var item = getItemInShop(upgrades[i][y].getName());
                        item.classList.remove("bought");
                        item.style.display = "none";
                        stats["underclockVideocards"]++;
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
    if (new Date().getTime() > (eventStarted + eventDuration) && actualEvent != null) {
        eventEnd();
    }
    if (new Date().getTime() > timeToEvent && actualEvent == null) {
        eventStart();
    }
    if(isPrime(Math.floor(Math.random() * (1000000 - 300000 + 1)+300000))&&amountCoins>100&&screenMode==="desktop")
    {
        spawnThief();
    }
    document.getElementById("amount").innerText = "ByteCoins: " + amountCoins;
    checkItemsAffordable();
    removeUsedObjects();
    repairShop();
    updateThiefPosition();
}

function checkItemsAffordable() {
    if (shopMode === "buy") {
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
}

function changeDayNight() {
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
        document.getElementById("modeSetting").textContent = "Daymode";
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
        document.getElementById("modeSetting").textContent = "Darkmode";
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
        document.getElementById("volumeSetting").textContent = "Unmute Sound";
    }
    else {
        for (i = 0; i < audioPlayers.length; i++) {
            audioPlayers[i].muted = false;
        }
        if (screenMode === "desktop") {
            document.getElementById("volumes").classList.remove("fa-volume-off");
            document.getElementById("volumes").classList.add("fa-volume-up");
        }
        volume = true;
        document.getElementById("volumeSetting").textContent = "Mute Sound";
    }
}

function removeUsedObjects() {
    var items = document.getElementsByClassName("flyingNumber");
    for (var i = 0; i < items.length; i++) {
        if (parseInt(new Date().getTime()) > (parseInt(items[i].name + 2000))) {
            document.body.removeChild(items[i]);
        }
    }
    items = document.getElementsByClassName("lootScreen");
    for (i = 0; i < items.length; i++) {
        if (parseInt(new Date().getTime()) > parseInt(items[i].id) + 10000) {
            document.body.removeChild(items[i]);
        }
    }
}

function playSound(url) {
    var audio = document.getElementById("audioplayer");
    audio.src = url;
    audio.play();
    if (volume === false) {
        audio.muted = true;
    }
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
    $.getJSON('https://api.myjson.com/bins/rxigi', function (data) { //Austauschen durch ein lokale json datei und anderem Algorithmus wegen Chrome
        console.log(data);
        if (localStorage.length > 0) {
            var videoLevel = localStorage.getItem("VideoCard").split(";");
        }
        for (var i = 0; i < data.length; i++) {
            if (localStorage.length > 0) {
                var videoTiles = videoLevel[i].split("_");
                upgrades[0][i] = new Videocard(data[i].name, data[i].price, data[i].costincrease, data[i].targetproperty, data[i].targetincrease, parseFloat(videoTiles[1]));
                if (videoTiles[2] === "true") {
                    upgrades[0][i].overclock();
                }
            }
            else {
                upgrades[0][i] = new Videocard(data[i].name, data[i].price, data[i].costincrease, data[i].targetproperty, data[i].targetincrease, 0);
            }
        }
    });
    upgrades[upgrades.length] = [];
    var upgradeTiles;
    if (localStorage.length > 0) {
        upgradeTiles = localStorage.getItem("Upgrades").split(";");
    }
    var found = false;
    var z = 0;
    $.getJSON('https://api.myjson.com/bins/1h8ssa', function (data) { //Austauschen durch ein lokale json datei und anderem Algorithmus wegen Chrome
        for (var i = 0; i < data.length; i++) {
            if (upgradeTiles != null && upgradeTiles !== "") {
                do {
                    var upgradeSlotTiles = upgradeTiles[z].split("_");
                    if (data[i].name === upgradeSlotTiles[0]) {
                        found = true;
                        upgradeTiles.splice(z, 1);
                        z = -1;
                    }
                    z++;
                } while (!found && z < upgradeTiles.length);
                if (found) {
                    var isBought = (upgradeSlotTiles[1] === 'true');
                    upgrades[1][i] = new Upgrade(data[i].name, data[i].price, data[i].targetproperty, data[i].targetmultiplier, isBought, data[i].description);
                }
            }
            else {
                upgrades[1][i] = new Upgrade(data[i].name, data[i].price, data[i].targetproperty, data[i].targetmultiplier, false, data[i].description);
            }
        }
    });
    upgrades[upgrades.length] = [];
    $.getJSON('https://api.myjson.com/bins/ccmbu', function (data) { //Austauschen durch ein lokale json datei und anderem Algorithmus wegen Chrome
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
        z = 0;
        var text = "";
        do {
            text += name[z];
            z++;
        } while (z < name.length);
        z = 0;
        newImage.src = "images/" + text + ".png";
        text = "";
        if (screenMode === "desktop") {
            newImage.style.width = "10%";
            newImage.style.height = "10%";
            newImage.style.float = "left";
            newImage.style.marginTop = "2%";
        }
        else {
            newImage.style.width = "8%";
            newImage.style.height = "8%";
            newImage.style.float = "left";
            newImage.style.marginTop = "1%";
        }
        newCard.style.lineHeight = getLineHeightPerScreenSize();
        newDiv.appendChild(newImage);
        var newP = document.createElement("P");
        newP.textContent = upgrades[0][i].toString();
        newDiv.appendChild(newP);
        newCard.appendChild(newDiv);
        newCard.classList.add("notAffordable");
        newCard.classList.add("shopItem");
        newCard.style.display = "block";
        newCard.id = upgrades[0][i].getName();
        newCard.onmousedown = function (e) {
            e.preventDefault();
            var button = e.button;
            if (shopMode === "info") {
                button = 1;
            }
            switch (button) {
                case 0:
                    buyItem(e.currentTarget.id);
                    break;
                case 1:
                    itemDescription(e.currentTarget.id);
                    break;
            }
        };
        if (upgrades[0][i].getLevel() > 0) {
            newCard.classList.add("bought");
        }
        targets[0].appendChild(newCard);
    }

    for (i = 0; i < upgrades[1].length; i++) {
        var newUpgrade = document.createElement("LI");
        newDiv = document.createElement("div");
        newImage = document.createElement("IMG");
        name = upgrades[1][i].getName().split(" ");
        z = 0;
        text = "";
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
        newUpgrade.style.lineHeight = getLineHeightPerScreenSize();
        newDiv.appendChild(newImage);
        newP = document.createElement("P");
        newP.textContent = upgrades[1][i].toString();
        newDiv.appendChild(newP);
        newUpgrade.appendChild(newDiv);
        newUpgrade.classList.add("notAffordable");
        newUpgrade.classList.add("shopItem");
        newUpgrade.style.display = "block";
        newUpgrade.id = upgrades[1][i].getName();
        newUpgrade.onmousedown = function (e) {
            e.preventDefault();
            var button = e.button;
            if (shopMode === "info") {
                button = 1;
            }
            switch (button) {
                case 0:
                    buyItem(e.currentTarget.id);
                    break;
                case 1:
                    itemDescription(e.currentTarget.id);
                    break;
            }
        };
        if (upgrades[1][i].getBought()) {
            newUpgrade.classList.add("bought");
            newUpgrade.style.display = "none";
        }
        if (screenMode === "desktop") {
            targets[1].appendChild(newUpgrade);
        }
        else {
            targets[0].appendChild(newUpgrade);
        }
    }
    for (i = 0; i < upgrades[2].length; i++) {
        var newOverclock = document.createElement("LI");
        newDiv = document.createElement("div");
        newImage = document.createElement("IMG");
        newImage.src = "images/overclock.png";
        newImage.style.width = "10%";
        newImage.style.height = "10%";
        newImage.style.float = "left";
        newImage.style.marginTop = "2%";
        newUpgrade.style.lineHeight = getLineHeightPerScreenSize();
        newDiv.appendChild(newImage);
        newP = document.createElement("P");
        newP.textContent = upgrades[2][i].toString();
        newDiv.appendChild(newP);
        newOverclock.appendChild(newDiv);
        newOverclock.classList.add("notAffordable");
        newOverclock.classList.add("shopItem");
        newOverclock.style.display = "block";
        newOverclock.id = upgrades[2][i].getName();
        newOverclock.onmousedown = function (e) {
            e.preventDefault();
            var button = e.button;
            if (shopMode === "info") {
                button = 1;
            }
            switch (button) {
                case 0:
                    buyItem(e.currentTarget.id);
                    break;
                case 1:
                    itemDescription(e.currentTarget.id);
                    break;
            }
        };
        if (getItemByName(upgrades[2][i].getEffectTarget()).getOverclock()) {
            newOverclock.classList.add("bought");
            newOverclock.style.display = "none";
        }
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
    stats["time"] = decimalRound(previousPlaytime + ((new Date().getTime() - startTime) / 1000), 2);

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
    if (localStorage.length > 0) {
        var statsString = localStorage.getItem("Statistics").split(";");
    }
    for (var i = 0; i < stat.length; i++) {
        if (localStorage.length > 0) {
            var statsTiles = statsString[i].split("_");
            stats[statsTiles[0]] = parseFloat(statsTiles[1]);
        }
        else {
            stats[stat[i].title] = 0;
        }
    }
    setInterval(updateStats, 3000);
}

function decimalRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function addCoins(number) {
    amountCoins += parseInt(number);
}

function togglePage(name) {
    if (document.getElementById(name).classList.contains("invisible")) {
        document.getElementById(name).classList.remove("invisible");
        var pages = document.getElementsByClassName("page");
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].id !== name) {
                pages[i].classList.add("invisible");
            }
        }
        if (name !== "shopPage") {
            document.getElementById("itemShowCase").classList.add("invisible");
        }
    }
    else {
        document.getElementById(name).classList.add("invisible");
        if (name === "shopPage") {
            document.getElementById("itemShowCase").classList.add("invisible");
        }
    }
}

function getItemInShop(nameItem) {
    for (var i = 0; i < shopItems.length; i++) {
        if (shopItems[i].id === nameItem) {
            return shopItems[i];
        }
    }
}

function getItemByName(nameItem) {
    for (var i = 0; i < upgrades.length; i++) {
        for (var z = 0; z < upgrades[i].length; z++) {
            if (upgrades[i][z].getName() === nameItem) {
                return upgrades[i][z];
            }
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
        stats["lootedDrops"]++;
        document.body.removeChild(this);
    };
    if (screenMode === "desktop") {
        drop.style.top = Math.floor((Math.random() * 600) + 1) + "px";
        drop.style.left = Math.floor((Math.random() * 600) + 1) + "px";
    }
    else {
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
    if (autoloot) {
        drop.onclick();
    }
}

function buildItemGetWindow() {
    var lootScreen = document.createElement("div");
    if (screenMode === "desktop") {
        lootScreen.style.width = "15%";
        lootScreen.style.height = "15%";
        lootScreen.style.top = "83%";
        lootScreen.style.left = "2%";
    }

    else {
        lootScreen.style.width = "50%";
        lootScreen.style.height = "15%";
        lootScreen.style.top = "10%";
        lootScreen.style.left = "25%";
    }
    lootScreen.style.position = "absolute";
    lootScreen.style.border = "1px solid black";
    lootScreen.style.borderRadius = "5%";
    lootScreen.classList.add("lootScreen");
    var loot = Math.floor((Math.random() * 100) + 1);
    addCoins(loot * getSpecialMultiplier());
    var lootText = document.createElement("P");
    lootText.textContent = "ByteCoins x" + loot;
    if (screenMode === "desktop") {
        lootText.style.top = "45%";
        lootText.style.left = "30%";
    }
    else {
        lootText.style.top = "50%";
        lootText.style.left = "25%";
    }
    lootText.style.position = "absolute";
    lootScreen.appendChild(lootText);
    var header = document.createElement("P");
    header.textContent = "New Loot";
    header.style.top = "5%";
    header.style.left = "35%";
    header.style.position = "absolute";
    header.style.fontWeight = "bold";
    var close = document.createElement("P");
    close.textContent = "X";
    close.style.top = "5%";
    close.style.left = "90%";
    close.style.position = "absolute";
    close.classList.add("noselect");
    close.style.cursor = "pointer";
    close.onclick = function (e) {
        document.body.removeChild(e.currentTarget.parentElement);
    };
    lootScreen.appendChild(close);
    lootScreen.appendChild(header);
    lootScreen.id = new Date().getTime();
    document.body.appendChild(lootScreen);
}

function showCoinHealth() {
    if (document.getElementById("myProgress").classList.contains("invisible")) {
        document.getElementById("myProgress").classList.remove("invisible");
        document.getElementById("coinSetting").textContent = "Hide Coinhealth";
    }
    else {
        document.getElementById("myProgress").classList.add("invisible");
        document.getElementById("coinSetting").textContent = "Show Coinhealth";
    }
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

function closeMobileMessage() {
    document.getElementById("mobileMessage").classList.add("invisible");
}

function detectBrowser() {
    var userAgent = navigator.userAgent.split(" ");
    var browser = userAgent[userAgent.length - 1].split("/");
    if (browser[0] === "Edge" || userAgent[userAgent.length - 1] === "Gecko") {
        document.getElementById("microsoftMessage").classList.remove("invisible");
    }
}

function saveGame() {
    localStorage.clear();
    localStorage.setItem("screenMode", screenMode);
    localStorage.setItem("CssMode", colorMode);
    localStorage.setItem("Volume", volume);
    localStorage.setItem("Coins", amountCoins);
    localStorage.setItem("CoinHealth", coinHealth);
    localStorage.setItem("CPS", coinsPerSecond);
    localStorage.setItem("CPC", coinsPerClick);
    localStorage.setItem("autoloot", autoloot);
    var statisticsString = "";
    var stat = document.getElementsByClassName("stat");
    for (var i = 0; i < stat.length; i++) {
        statisticsString += (stat[i].title + "_" + stats[stat[i].title] + ";");
    }
    localStorage.setItem("Statistics", statisticsString);
    var videoLevels = "";
    for (i = 0; i < upgrades[0].length; i++) {
        videoLevels += upgrades[0][i].getName() + "_" + upgrades[0][i].getLevel() + "_" + upgrades[0][i].getOverclock() + ";";
    }
    localStorage.setItem("VideoCard", videoLevels);
    var upgradesString = "";
    for (i = 0; i < upgrades[1].length; i++) {
        upgradesString += upgrades[1][i].getName() + "_" + upgrades[1][i].getBought() + ";";
    }
    localStorage.setItem("Upgrades", upgradesString);
    localStorage.setItem("version", version);
    localStorage.setItem("previousTime", previousPlaytime + ((new Date().getTime() - startTime) / 1000));
    if (reset) {
        localStorage.clear();
    }
}

function resetGame() {
    reset = true;
    location.reload();
}

function changeShopMode(mode) {
    if (mode !== shopMode) {
        if (mode === "buy") {
            shopMode = "buy";
            document.getElementById("buy").classList.add("buyMode");
            document.getElementById("sell").classList.remove("buyMode");
            document.getElementById("info").classList.remove("buyMode");
            var items = document.getElementsByClassName("shopItem");
            for (var i = 0; i < items.length; i++) {
                if (items[i].classList.contains("bought")) {
                    if (!items[i].classList.contains("videocard")) {
                        items[i].style.display = "none";
                    }
                    else {
                        items[i].onclick = function (e) {
                            buyItem(e.currentTarget.id);
                        }
                    }
                }
                else {
                    items[i].style.display = "block";
                    items[i].onclick = function (e) {
                        buyItem(e.currentTarget.id);
                    }
                }
            }
        }
        else if (mode === "sell") {
            shopMode = "sell";
            document.getElementById("sell").classList.add("buyMode");
            document.getElementById("buy").classList.remove("buyMode");
            document.getElementById("info").classList.remove("buyMode");
            var items = document.getElementsByClassName("shopItem");
            for (var i = 0; i < items.length; i++) {
                if (items[i].classList.contains("bought")) {
                    items[i].style.display = "block";
                    items[i].onclick = function (e) {
                        sellItem(e.currentTarget.id);
                    };
                    items[i].classList.remove("notAffordable");
                    items[i].classList.add("affordable");
                }
                else {
                    items[i].style.display = "none";
                }
            }
        }
        else {
            shopMode = "info";
            document.getElementById("info").classList.add("buyMode");
            document.getElementById("sell").classList.remove("buyMode");
            document.getElementById("buy").classList.remove("buyMode");
        }
    }
}

function changeShopAmount(amount) {
    if (shopAmount !== amount) {
        document.getElementById(amount + "x").classList.add("buyMode");
        shopAmount = amount;
        var modes = document.getElementsByClassName("shopAmount");
        for (var i = 0; i < modes.length; i++) {
            if (modes[i].id !== (amount + "x")) {
                modes[i].classList.remove("buyMode");
            }
        }
    }
}

function closeMicrosoftMessage() {
    document.getElementById("microsoftMessage").classList.add("invisible");
}

function eventStart() {
    eventStarted = new Date().getTime();
    actualEvent = events[Math.floor(Math.random() * events.length)];
    if (actualEvent.image !== "") {
        document.getElementById("clickPicture").src = "images/" + actualEvent.image;
    }
    switch (actualEvent.getTarget()) {
        case "all":
            coinsPerSecond *= actualEvent.getOperand();
            coinsPerClick *= actualEvent.getOperand();
            break;
    }
    eventDuration = actualEvent.getDuration() * 1000;
    document.getElementById("amountSecond").innerText = "Coins Per Second: " + coinsPerSecond;
    document.getElementById("coinsPerClick").innerText = "Coins Per Click: " + coinsPerClick;
    var myDiv = document.createElement("DIV");
    myDiv.style.width = "99.85%";
    myDiv.style.height = "5%";
    myDiv.style.backgroundColor = "orange";
    myDiv.style.color = "white";
    myDiv.style.top = "10%";
    myDiv.style.position = "absolute";
    myDiv.style.border = "1px solid black";
    myDiv.id = actualEvent.name;
    myText = document.createElement("P");
    myText.textContent = actualEvent.name;
    myText.id = "slideAnnounce";
    myText.style.top = "28%";
    myText.style.position = "absolute";
    myText.style.fontWeight = "bold";
    myDiv.appendChild(myText);
    document.body.appendChild(myDiv);
    $('#slideAnnounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this.parentElement).remove();
    });
}

function eventEnd() {
    document.getElementById("clickPicture").src = "images/clickPicture.png";
    switch (actualEvent.getTarget()) {
        case "all":
            coinsPerSecond /= actualEvent.getOperand();
            coinsPerClick /= actualEvent.getOperand();
            break;
    }
    actualEvent = null;
    document.getElementById("amountSecond").innerText = "Coins Per Second: " + coinsPerSecond;
    document.getElementById("coinsPerClick").innerText = "Coins Per Click: " + coinsPerClick;
    timeToEvent = new Date().getTime() + Math.floor(Math.random() * (1200000 - 120000 + 1)) + 120000;
}

function loadEvents() {
    $.ajaxSetup({
        async: false
    });
    $.getJSON('https://api.myjson.com/bins/11h422', function (data) {
        for (var i = 0; i < data.length; i++) {
            events[i] = new SpecialEvent(data[i].name, data[i].target, data[i].operand, data[i].image, data[i].duration);
        }
    });
}

function getSpecialMultiplier() {
    if (actualEvent != null) {
        if (actualEvent.getOperand() > 1) {
            return actualEvent.getOperand();
        }
    }
    else {
        return 1;
    }
}

function getLineHeightPerScreenSize() {
    if (screen.width < 1920) {
        return "175%";
    }
    else if (screen.width >= 1920 && screen.width < 2048) {
        return "200%";
    }
    else if (screen.width >= 2048 && screen.width < 3400) {
        return "250%";
    }
    else if (screen.width >= 3400 && screen.width < 5000) {
        return "400%";
    }
    else if (screen.width >= 5000) {
        return "500%";
    }
}

function itemDescription(itemName) {
    var itemTiles = itemName.split(" ");
    var itemImageName = "";
    for (var i = 0; i < itemTiles.length; i++) {
        itemImageName += itemTiles[i];
    }
    itemImageName += ".png";
    var item = getItemByName(itemName);
    document.getElementById("itemName").textContent = itemName;
    if (item.constructor.name != "Overclock") {
        document.getElementById("itemImage").src = "images/" + itemImageName;
    }
    else {
        document.getElementById("itemImage").src = "images/overclock.png";
    }
    switch (item.constructor.name) {
        case "Videocard":
            document.getElementById("itemText").textContent = "Erhöht die Coins Per Second um " + item.getEffectOperand() + "!";
            break;
        case "Upgrade":
            document.getElementById("itemText").textContent = item.getDescription();
            break;
        case "Overclock":
            var videocard = getItemByName(item.getEffectTarget());
            document.getElementById("itemText").textContent = "Übertaktet die Grafikkarte " + videocard.getName() + ". \n Verdoppelt die Coins Per Second pro Grafikkarte";
            break;
    }
    document.getElementById("itemShowCase").classList.remove("invisible");
}

function repairShop() {
    for (var i = 0; i < upgrades[0].length; i++) {
        if (isNaN(upgrades[0][i].getLevel())) {
            {
                upgrades[0][i].level = 0;
                var shopItem = getItemInShop(upgrades[0][i].getName());
                var textObject = shopItem.children[0].children[1];
                textObject.textContent = upgrades[0][i].toString();
            }
        }
    }
}

function spawnThief() {
    var newThief = document.createElement("IMG");
    newThief.src = "images/thief_02.png";
    newThief.style.position = "absolute";
    newThief.style.top = Math.floor(Math.random() * (60 - 30 + 1)) + 30 + "%";
    if(Math.round(Math.random())===1)
    {
        newThief.style.left="0";
    }
    else
    {
        newThief.style.left="95%";
        newThief.classList.add("reverseThief");
        var tiles = newThief.src.split(".");
        newThief.src=tiles[0]+"_reverse."+tiles[1];
    }
    newThief.style.width = "5%";
    newThief.style.height = "17%";
    newThief.style.cursor="crosshair";
    newThief.classList.add("thief");
    newThief.style.zIndex="-1";
    newThief.onclick=function (e) {
        if(e.currentTarget.id!=="")
        {
            amountCoins+=(parseInt(e.currentTarget.id)*0.95);
        }
        document.body.removeChild(e.currentTarget);
        stats["caughtThiefs"]+=1;
    };
    document.body.appendChild(newThief);
}
function updateThiefPosition(){
    var thiefs = document.getElementsByClassName("thief");
    for(var i=0;i<thiefs.length;i++){
        var tiles = thiefs[i].style.left;
        tiles = tiles.replace('%','');
        tiles = tiles.replace('px','');
        if(parseInt(tiles)<95&&!thiefs[i].classList.contains("reverseThief"))
        {
            thiefs[i].style.left=(parseInt(tiles)+2)+"%";
        }
        else if(!thiefs[i].classList.contains("reverseThief"))
        {
            document.body.removeChild(thiefs[i]);
        }
        else if(parseInt(tiles)>1&&thiefs[i].classList.contains("reverseThief"))
        {
            thiefs[i].style.left=(parseInt(tiles)-2)+"%";
        }
        else
        {
            document.body.removeChild(thiefs[i]);
        }
        if(elementsColliding(thiefs[i],document.getElementById("clickPicture"))&&thiefs[i].id==="")
        {
          var thiefLoot= Math.floor(Math.random() * (amountCoins + 1));
          amountCoins-=thiefLoot;
          thiefs[i].id=thiefLoot;
          if(amountCoins<0)
          {
              amountCoins=0;
          }
        }
    }
}
function elementsColliding(a,b){
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}
function isPrime(num) {
    for(var i = 2; i < num; i++)
        if(num % i === 0) return false;
    return num !== 1;
}

