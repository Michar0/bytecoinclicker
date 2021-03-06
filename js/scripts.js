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
var items = [];
const version = 0.51;
var previousPlaytime = 0;
var extremeOverclockCard;
var videoShopScroll;
var upgradeShopScroll;
var overclockShopScroll;
var plus = function (first, second) {
    return first + second;
};
var minus = function (first, second) {
    return first - second;
};
var multiply = function (first, second) {
    return first * second;
};
var divide = function (first, second) {
    return first / second;
};

window.onbeforeunload = function () {
    saveGame()
};
$(document).ready(function () {
    if (document.getElementsByClassName("Show").length > 0) {
        screenMode = "mobile";
    }
    if (screenMode !== "mobile") {
        detectMobile();
    }
    if (screenMode === "desktop") {
        videoShopScroll = new PerfectScrollbar('#videocardsShopContent');
        upgradeShopScroll = new PerfectScrollbar('#upgradesShopContent');
        overclockShopScroll = new PerfectScrollbar('#overclockShopContent');
    }
    loadJsonItemsToShop();
    loadChangelog();
    detectBrowser();
    createStats();
    setInterval(clickAutomatic, 1000);
    document.addEventListener('mousemove', getMousePosition);
    if (screenMode === "mobile") {
        document.getElementById("clickPicture").ontouchstart = function (e) {
            for (var i = 0; i < e.targetTouches.length; i++) {
                cordinates[0] = e.targetTouches[i].pageX;
                cordinates[1] = e.targetTouches[i].pageY;
                clickCoin();
            }
        }
    }
    else {
        document.getElementById("clickPicture").onclick = function () {
            clickCoin();
        }
    }
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 83) {
            togglePage("shopPage");
        }
        if (event.keyCode === 27) {
            togglePage("close");
        }
    });
    if (version > parseFloat(localStorage.getItem("version")) || localStorage.getItem("version") == null) {
        document.getElementById("aboutPage").classList.remove("invisible");
    }
});


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
        if (localStorage.getItem("progressStyle") === "DIV") {
            changeCoinhealthLook();
        }
        if (document.getElementById("myProgress").tagName === "P") {
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
    if (document.getElementById("myProgress").tagName === "P") {
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

function buySellItem(itemName) {
    for (var i = 0; i < upgrades.length; i++) {
        for (var y = 0; y < upgrades[i].length; y++) {
            if (shopMode === "buy") {
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
                                textObject.textContent = upgrades[i][y].toString(0, shopAmount);
                                stats["boughtVideocards"]++;
                            }
                            break;
                        case "Upgrade":
                        case "LevelUpgrade":
                            var backup;
                            switch (upgrades[i][y].getEffectTarget()) {
                                case "coinsPerClick":
                                    backup = coinsPerClick;
                                    coinsPerClick = window[upgrades[i][y].getEffectOperator()];
                                    coinsPerClick = coinsPerClick(backup, upgrades[i][y].getEffectOperand());
                                    coinsPerClick = decimalRound(coinsPerClick, 2);
                                    break;
                                case "coinsPerSecond":
                                    backup = coinsPerSecond;
                                    coinsPerSecond = window[upgrades[i][y].getEffectOperator()];
                                    coinsPerSecond = coinsPerSecond(backup, upgrades[i][y].getEffectOperand());
                                    coinsPerSecond = decimalRound(coinsPerSecond, 2);
                                    break;
                                case "all":
                                    backup = coinsPerClick;
                                    coinsPerClick = window[upgrades[i][y].getEffectOperator()];
                                    coinsPerClick = coinsPerClick(backup, upgrades[i][y].getEffectOperand());
                                    coinsPerClick = decimalRound(coinsPerClick, 2);
                                    backup = coinsPerSecond;
                                    coinsPerSecond = window[upgrades[i][y].getEffectOperator()];
                                    coinsPerSecond = coinsPerSecond(backup, upgrades[i][y].getEffectOperand());
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
                            var item = getItemInShop(upgrades[i][y].getName());
                            item.classList.add("bought");
                            if (shopAmount > 1) {
                                var wastedMoney = upgrades[i][y].getPrice() * (shopAmount - 1);
                                amountCoins += wastedMoney;
                            }
                            if (upgrades[i][y].constructor.name == "LevelUpgrade") {
                                upgrades[i][y].raiseLevel();
                                var textObject = item.children[0].children[1];
                                textObject.textContent = upgrades[i][y].toString(0, shopAmount);
                                item.classList.add("videocard");
                            }
                            else {
                                var item = getItemInShop(upgrades[i][y].getName());
                                upgrades[i][y].buys();
                                item.style.display = "none";
                                stats["boughtUpgrades"]++;
                            }
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
                            SS

                        case "XOverclock":
                            if (extremeOverclockCard == null) {
                                for (var z = 0; z < upgrades[0].length; z++) {
                                    if (upgrades[0][z].getName() === upgrades[i][y].getEffectTarget()) {
                                        coinsPerSecond -= (upgrades[0][z].getCoinsPerSecond() * getSpecialMultiplier());
                                        upgrades[0][z].extremeOverclock();
                                        coinsPerSecond += (upgrades[0][z].getCoinsPerSecond() * getSpecialMultiplier());
                                        extremeOverclockCard = upgrades[0][z];
                                        break;
                                    }
                                }
                                if (shopAmount > 1) {
                                    var wastedMoney = upgrades[i][y].getPrice() * (shopAmount - 1);
                                    amountCoins += wastedMoney;
                                }
                                var item = getItemInShop(upgrades[i][y].getName());
                                text = createStringForImgSource(upgrades[0][z].getName());
                                document.getElementById("xoverclockImage").src = "images/" + text + ".png";
                                text = "";
                                document.getElementById("healthBar").style.width = 100 + "%";
                                document.getElementById("xoverclockInfo").classList.remove("invisible");
                                upgrades[i].splice(y, 1);
                                item.parentElement.removeChild(item);
                                stats["extremOverclockedVideocards"]++;
                                break;
                            }
                            else {
                                amountCoins += (upgrades[i][y].getPrice() * shopAmount);
                            }
                    }
                    playSound("sounds/buySound.mp3");
                }
            }
            else {
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
                                    textObject.textContent = upgrades[i][y].toString(0, shopAmount);
                                    stats["soldVideocards"]++;
                                    if (upgrades[i][y].getLevel() === 0) {
                                        item.classList.remove("bought");
                                        item.style.display = "none";
                                    }
                                }
                            }
                            break;
                        case "Upgrade":
                        case "LevelUpgrade":
                            amountCoins += (upgrades[i][y].getPrice());
                            switch (upgrades[i][y].getEffectTarget()) {
                                case "coinsPerClick":
                                    backup = coinsPerClick;
                                    coinsPerClick = window[reverseOperator(upgrades[i][y].getEffectOperator())];
                                    coinsPerClick = coinsPerClick(backup, upgrades[i][y].getEffectOperand());
                                    coinsPerClick = decimalRound(coinsPerClick, 2);
                                    break;
                                case "coinsPerSecond":
                                    backup = coinsPerSecond;
                                    coinsPerSecond = window[reverseOperator(upgrades[i][y].getEffectOperator())];
                                    coinsPerSecond = coinsPerSecond(backup, upgrades[i][y].getEffectOperand());
                                    coinsPerSecond = decimalRound(coinsPerSecond, 2);
                                    break;
                                case "all":
                                    backup = coinsPerClick;
                                    coinsPerClick = window[reverseOperator(upgrades[i][y].getEffectOperator())];
                                    coinsPerClick = coinsPerClick(backup, upgrades[i][y].getEffectOperand());
                                    coinsPerClick = decimalRound(coinsPerClick, 2);
                                    backup = coinsPerSecond;
                                    coinsPerSecond = window[reverseOperator(upgrades[i][y].getEffectOperator())];
                                    coinsPerSecond = coinsPerSecond(backup, upgrades[i][y].getEffectOperand());
                                    coinsPerSecond = decimalRound(coinsPerSecond, 2);
                                    break;
                                case "autoloot":
                                    autoloot = false;
                                    break;
                            }
                            var item = getItemInShop(upgrades[i][y].getName());
                            if (upgrades[i][y].constructor.name == "LevelUpgrade") {
                                amountCoins -= (upgrades[i][y].getPrice());
                                amountCoins += decimalRound(upgrades[i][y].getPrice() / upgrades[i][y].getPriceRaise(), 0);
                                upgrades[i][y].reduceLevel();
                                var textObject = item.children[0].children[1];
                                textObject.textContent = upgrades[i][y].toString(0, shopAmount);
                                if (upgrades[i][y].getLevel() === 0) {
                                    item.classList.remove("bought");
                                    item.style.display = "none";
                                }
                            }
                            else {
                                upgrades[i][y].sell();
                                item.style.display = "none";
                                item.classList.remove("bought");
                                stats["soldUpgrades"]++;
                            }
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
        if (document.getElementById("myProgress").tagName === "P") {
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
    document.getElementById("amount").innerText = "ByteCoins: " + amountCoins;
    checkItemsAffordable();
    removeUsedObjects();
    if (extremeOverclockCard != null) {
        extremeOverclockCard.reduceHealth();
        document.getElementById("healthBar").style.width = extremeOverclockCard.getHealth() + "%";
        if (extremeOverclockCard.getHealth() === 0) {
            coinsPerSecond -= extremeOverclockCard.getCoinsPerSecond() * getSpecialMultiplier();
            extremeOverclockCard.extremeUnderclock();
            coinsPerSecond += extremeOverclockCard.getCoinsPerSecond() * getSpecialMultiplier();
            decimalRound(coinsPerSecond, 1);
            for (var i = extremeOverclockCard.getLevel(); i > 0; i--) {
                var random = (Math.random() * 10);
                if (random < 7.5) {
                    extremeOverclockCard.reduceLevel();
                    coinsPerSecond -= (extremeOverclockCard.getEffectOperand() * getSpecialMultiplier());
                    coinsPerSecond = decimalRound(coinsPerSecond, 1);
                    extremeOverclockCard.subCoinsPerSecond(extremeOverclockCard.getEffectOperand());
                    var item = getItemInShop(extremeOverclockCard.getName());
                    var textObject = item.children[0].children[1];
                    textObject.textContent = extremeOverclockCard.toString(0, shopAmount);
                    if (extremeOverclockCard.getLevel() === 0) {
                        item.classList.remove("bought");
                    }
                    document.getElementById("xoverclockInfo").classList.add("invisible");
                }
            }
            extremeOverclockCard = null;
        }
    }
}

function checkItemsAffordable() {
    if (shopMode === "buy") {
        for (var i = 0; i < upgrades.length; i++) {
            for (var y = 0; y < upgrades[i].length; y++) {
                var item = getItemInShop(upgrades[i][y].getName());
                var price = upgrades[i][y].getPrice();
                var addPrice = upgrades[i][y].getPrice();
                if (upgrades[i][y].constructor.name === "Videocard") {
                    for (var z = 1; z < shopAmount; z++) {
                        addPrice *= upgrades[i][y].getPriceRaise();
                        addPrice = decimalRound(addPrice, 0);
                        price += addPrice;
                    }
                    price = decimalRound(price, 0);
                    var textObject = item.children[0].children[1];
                    textObject.textContent = upgrades[i][y].toString(price, shopAmount);
                }
                if (amountCoins >= price) {
                    item.classList.remove("notAffordable");
                    item.classList.add("affordable");
                }
                else if (amountCoins < price) {
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
    if (audio.paused) {
        audio.src = url;
        audio.play();
        if (volume === false) {
            audio.muted = true;
        }
    }
}

function getMousePosition(event) {
    cordinates[0] = event.pageX;
    cordinates[1] = event.pageY;
}

function loadJsonItemsToShop() {
    upgrades[upgrades.length] = [];
    if (localStorage.length > 0) {
        var videoLevel = localStorage.getItem("VideoCard").split(";");
    }
    for (var i = 0; i < data.videocards.length; i++) {
        if (localStorage.length > 0) {
            var videoTiles = videoLevel[i].split("_");
            upgrades[0][i] = new Videocard(data.videocards[i].name, data.videocards[i].price, data.videocards[i].costincrease, data.videocards[i].targetproperty, "plus", data.videocards[i].targetincrease, parseFloat(videoTiles[1]));
            if (videoTiles[2] === "true") {
                upgrades[0][i].overclock();
            }
        }
        else {
            upgrades[0][i] = new Videocard(data.videocards[i].name, data.videocards[i].price, data.videocards[i].costincrease, data.videocards[i].targetproperty, "plus", data.videocards[i].targetincrease, 0);
        }
    }
    upgrades[upgrades.length] = [];
    var upgradeTiles;
    if (localStorage.length > 0) {
        upgradeTiles = localStorage.getItem("Upgrades").split(";");
    }
    var found = false;
    var z = 0;
    for (var i = 0; i < data.upgrades.length; i++) {
        if (upgradeTiles != null && upgradeTiles !== "") {
            do {
                var upgradeSlotTiles = upgradeTiles[z].split("_");
                if (data.upgrades[i].name === upgradeSlotTiles[0]) {
                    found = true;
                    upgradeTiles.splice(z, 1);
                    z = -1;
                }
                z++;
            } while (!found && z < upgradeTiles.length);
            if (found) {
                var isBought = (upgradeSlotTiles[1] === 'true');
                upgrades[1][i] = new Upgrade(data.upgrades[i].name, data.upgrades[i].price, data.upgrades[i].targetproperty, data.upgrades[i].targetoperand, data.upgrades[i].targetoperator, isBought, data.upgrades[i].description);
            }
        }
        else {
            upgrades[1][i] = new Upgrade(data.upgrades[i].name, data.upgrades[i].price, data.upgrades[i].targetproperty, data.upgrades[i].targetoperand, data.upgrades[i].targetoperator, false, data.upgrades[i].description);
        }
    }
    var index = i;
    for (var y = 0; y < data.levelUpgrades.length; y++) {
        if (upgradeTiles != null && upgradeTiles !== "") {
            upgradeSlotTiles = upgradeTiles[y].split("_");
            upgrades[1][index] = new LevelUpgrade(data.levelUpgrades[y].name, data.levelUpgrades[y].price, data.levelUpgrades[y].priceRaise, data.levelUpgrades[y].targetproperty, data.levelUpgrades[y].targetoperand, data.levelUpgrades[y].targetoperator, parseInt(upgradeSlotTiles[1]), data.levelUpgrades[y].description);
        }
        else {
            upgrades[1][index] = new LevelUpgrade(data.levelUpgrades[y].name, data.levelUpgrades[y].price, data.levelUpgrades[y].priceRaise, data.levelUpgrades[y].targetproperty, data.levelUpgrades[y].targetoperand, data.levelUpgrades[y].targetoperator, 0, data.levelUpgrades[y].description);
        }
        index++;
    }
    upgrades[upgrades.length] = [];
    z = 0;
    for (var i = 0; i < data.overclocks.length; i++) {
        var card = getItemByName(data.overclocks[i].targetCard);
        if (!card.getOverclock()) {
            upgrades[2][z] = new Overclock(data.overclocks[i].name, data.overclocks[i].price, data.overclocks[i].targetCard);
            z++;
        }
        if (card.health === 100) {
            upgrades[2][z] = new XOverclock("X " + data.overclocks[i].name, data.overclocks[i].price, data.overclocks[i].targetCard);
            z++;
        }
    }
    for (var i = 0; i < data.events.length; i++) {
        events[i] = new SpecialEvent(data.events[i].name, data.events[i].target, data.events[i].operand, data.events[i].image, data.events[i].duration);
    }
    var itemTiles;
    if (localStorage.length > 0) {
        itemTiles = localStorage.getItem("Items").split(";");
    }
    for (i = 0; i < data.items.length; i++) {
        if (itemTiles != null && itemTiles !== ""){
            var itemSlotTiles = itemTiles[0].split("_");
            items[i] = new SpecialItem(data.items[i].name, data.items[i].price, data.items[i].effect, data.items[i].effectProperty,data.items.description,parseInt(itemSlotTiles[1]));
        }
        else {
            items[i] = new SpecialItem(data.items[i].name, data.items[i].price, data.items[i].effect, data.items[i].effectProperty,data.items.description,0);
        }
    }
    var targets = document.getElementsByClassName("shopContent");
    for (var i = 0; i < upgrades[0].length; i++) {
        var newCard = document.createElement("LI");
        var newDiv = document.createElement("div");
        var newImage = document.createElement("IMG");
        var newP = document.createElement("P");

        newCard.style.lineHeight = getLineHeightPerScreenSize();
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
                    buySellItem(e.currentTarget.id);
                    break;
                case 1:
                    itemDescription(e.currentTarget.id);
                    break;
            }
        };
        if (upgrades[0][i].getLevel() > 0) {
            newCard.classList.add("bought");
        }
        text = createStringForImgSource(upgrades[0][i].getName());
        newImage.src = "images/" + text + ".png";
        text = "";
        newImage.classList.add("shopCardImage");
        newDiv.appendChild(newImage);
        newP.textContent = upgrades[0][i].toString(0, shopAmount);
        newDiv.appendChild(newP);
        newCard.appendChild(newDiv);
        targets[0].appendChild(newCard);
    }
    if (screenMode === "desktop") {
        videoShopScroll.update();
    }
    for (i = 0; i < upgrades[1].length; i++) {
        var newUpgrade = document.createElement("LI");
        newDiv = document.createElement("div");
        newImage = document.createElement("IMG");
        newP = document.createElement("P");

        newUpgrade.style.lineHeight = getLineHeightPerScreenSize();
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
                    buySellItem(e.currentTarget.id);
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
        text = createStringForImgSource(upgrades[1][i].getName());
        newImage.src = "images/" + text + ".png";
        text = "";
        newImage.style.width = "5%";
        newImage.style.height = "5%";
        newImage.style.float = "left";
        newImage.style.marginTop = "1%";
        newDiv.appendChild(newImage);
        if (upgrades[1][i].constructor.name == "LevelUpgrade") {
            newP.textContent = upgrades[1][i].toString(0, shopAmount);
        }
        else {
            newP.textContent = upgrades[1][i].toString();
        }
        newDiv.appendChild(newP);
        if (screenMode === "desktop") {
            targets[1].appendChild(newUpgrade);
        }
        else {
            targets[0].appendChild(newUpgrade);
        }
    }
    if (screenMode === "desktop") {
        upgradeShopScroll.update();
    }
    for (i = 0; i < upgrades[2].length; i++) {
        var newOverclock = document.createElement("LI");
        newDiv = document.createElement("div");
        newImage = document.createElement("IMG");
        newP = document.createElement("P");

        newOverclock.style.lineHeight = getLineHeightPerScreenSize();
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
                    buySellItem(e.currentTarget.id);
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
        newImage.src = "images/overclock.png";
        newImage.style.width = "10%";
        newImage.style.height = "10%";
        newImage.style.float = "left";
        newImage.style.marginTop = "2%";
        newDiv.appendChild(newImage);
        newP.textContent = upgrades[2][i].toString();
        newDiv.appendChild(newP);
        newOverclock.appendChild(newDiv);
        if (screenMode === "desktop") {
            targets[2].appendChild(newOverclock);
        }
        else {
            targets[0].appendChild(newOverclock);
        }
    }
    shopItems = document.getElementsByClassName("shopItem");
    if (screenMode === "desktop") {
        overclockShopScroll.update();
    }
    for(i=0;i<items.length;i++) {
        var inventory = document.getElementById("inventoryList");
        var newLI = document.createElement("LI");
        newLI.textContent = items[i].toString();
        newLI.id = items[i].getName();
        inventory.appendChild(newLI);
        newLI.onclick = function (e) {
            itemDescription(e.currentTarget.id);
        }
    }

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
    if (name === "close") {
        var pages = document.getElementsByClassName("page");
        for (var i = 0; i < pages.length; i++) {
            pages[i].classList.add("invisible");
        }
    }
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
    for(i=0;i<items.length;i++)
    {
        if (items[i].getName() === nameItem) {
            return items[i];
        }
    }
}

function setupNewClickCoin() {
    coinHealth = 100;
    if (document.getElementById("myProgress").tagName === "P") {
        var elm = document.getElementById("myProgress");
        elm.textContent = "100%";
    }
    else {
        document.getElementById("myBar").style.width = "100%";
    }
    var drop = document.createElement("IMG");
    drop.src = "images/drop" + Math.floor((Math.random() * 4) + 1) + ".png";
    drop.classList.add("drop");
    drop.onclick = function () {
        buildLootScreen();
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

function buildLootScreen() {
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
    var random = (Math.random() * 10);
    if(random<9.0) {
        var maxLoot = coinsPerSecond * 100;
        if (maxLoot === 0) {
            maxLoot = 100;
        }
        var minLoot = coinsPerSecond * 10;
        if (minLoot === 0) {
            minLoot = 1;
        }
        var loot = (Math.floor((Math.random() * maxLoot - minLoot) + minLoot));
        addCoins(loot);
        var lootText = document.createElement("P");
        lootText.textContent = loot + " ByteCoins";
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
    }
    else
    {
        var currentLootItem = items[Math.round(Math.random() * (items.length-1))];
        var lootImage = document.createElement("IMG");
        lootImage.src = "images/" + createStringForImgSource(currentLootItem.getName()) + ".png";
        if (screenMode === "desktop") {
            lootImage.style.top = "30%";
            lootImage.style.left = "30%";
            lootImage.style.width="50%";
            lootImage.style.height="50%";
        }
        else {
            lootImage.style.top = "50%";
            lootImage.style.left = "25%";
        }
        lootImage.style.position = "absolute";
        lootImage.onclick=function (e) {
            itemDescription(currentLootItem.getName());
        }
        lootScreen.appendChild(lootImage);
        currentLootItem.raiseLevel();
        var lootName = document.createElement("P");
        lootName.textContent =currentLootItem.getName();
        lootName.style.top = "75%";
        lootName.style.left = "30%";
        lootName.style.position = "absolute";
        lootScreen.appendChild(lootName);
        var inventory = document.getElementById("inventoryList");
        var foundItem=false;
        var inventoryitems = inventory.children;
        for(var i=0;i<inventoryitems.length;i++)
        {
            if(inventoryitems[i].id==currentLootItem.getName())
            {
                inventoryitems[i].textContent=currentLootItem.toString();
                foundItem=true;
            }
        }
        if(!foundItem){
            var newLI = document.createElement("LI");
            newLI.textContent=currentLootItem.toString();
            newLI.id=currentLootItem.getName();
            inventory.appendChild(newLI);
            newLI.onclick=function (e) {
                itemDescription(e.currentTarget.id);
            }
        }

    }
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
    localStorage.setItem("CPS", (coinsPerSecond / getSpecialMultiplier()));
    localStorage.setItem("CPC", (coinsPerClick / getSpecialMultiplier()));
    localStorage.setItem("autoloot", autoloot);

    var statisticsString = "";
    var stat = document.getElementsByClassName("stat");
    for (var i = 0; i < stat.length; i++) {
        statisticsString += (stat[i].title + "_" + stats[stat[i].title] + ";");
    }
    var videoLevels = "";
    for (i = 0; i < upgrades[0].length; i++) {
        videoLevels += upgrades[0][i].getName() + "_" + upgrades[0][i].getLevel() + "_" + upgrades[0][i].getOverclock() + ";";
    }
    var upgradesString = "";
    for (i = 0; i < upgrades[1].length; i++) {
        if (upgrades[1][i].constructor.name == "Upgrade") {
            upgradesString += upgrades[1][i].getName() + "_" + upgrades[1][i].getBought() + ";";
        }
        else {
            upgradesString += upgrades[1][i].getName() + "_" + upgrades[1][i].getLevel() + ";";
        }
    }
    var itemsString="";
    for(i=0;i<items.length;i++)
    {
        itemsString+= items[i].getName()+"_"+items[i].getLevel();
    }

    localStorage.setItem("Items",itemsString);
    localStorage.setItem("VideoCard", videoLevels);
    localStorage.setItem("Statistics", statisticsString);
    localStorage.setItem("Upgrades", upgradesString);
    localStorage.setItem("version", version);
    localStorage.setItem("previousTime", previousPlaytime + ((new Date().getTime() - startTime) / 1000));
    localStorage.setItem("progressStyle", document.getElementById("myProgress").tagName);

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
            if (screenMode === "mobile") {
                document.getElementById("info").classList.remove("buyMode");
            }
            var items = document.getElementsByClassName("shopItem");
            for (var i = 0; i < items.length; i++) {
                if (items[i].classList.contains("bought")) {
                    if (!items[i].classList.contains("videocard")) {
                        items[i].style.display = "none";
                    }
                }
                else {
                    items[i].style.display = "block";
                }
            }
        }
        else if (mode === "sell") {
            shopMode = "sell";
            document.getElementById("sell").classList.add("buyMode");
            document.getElementById("buy").classList.remove("buyMode");
            if (screenMode === "mobile") {
                document.getElementById("info").classList.remove("buyMode");
            }
            var items = document.getElementsByClassName("shopItem");
            for (var i = 0; i < items.length; i++) {
                if (items[i].classList.contains("bought")) {
                    items[i].style.display = "block";
                    items[i].classList.remove("notAffordable");
                    items[i].classList.add("affordable");
                    var item = getItemByName(items[i].id);
                    var textObject = items[i].children[0].children[1];
                    if (item.constructor.name === "Videocard" || item.constructor.name === "LevelUpgrade") {
                        textObject.textContent = item.toString(0, shopAmount);
                    }
                    else {
                        textObject.textContent = item.toString();
                    }

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
        document.getElementById("clickPicture").src = actualEvent.image;
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
            coinsPerSecond = decimalRound(coinsPerSecond, 2);
            coinsPerClick /= actualEvent.getOperand();
            coinsPerClick = decimalRound(coinsPerClick, 2);
            break;
    }
    actualEvent = null;
    document.getElementById("amountSecond").innerText = "Coins Per Second: " + coinsPerSecond;
    document.getElementById("coinsPerClick").innerText = "Coins Per Click: " + coinsPerClick;
    timeToEvent = new Date().getTime() + Math.floor(Math.random() * (1200000 - 120000 + 1)) + 120000;
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
    if (item.constructor.name != "Overclock" && item.constructor.name != "XOverclock") {
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
        case "LevelUpgrade":
        case "SpecialItem":
            document.getElementById("itemText").textContent = item.getDescription();
            break;
        case "Overclock":
            var videocard = getItemByName(item.getEffectTarget());
            document.getElementById("itemText").textContent = "Übertaktet die Grafikkarte " + videocard.getName() + ". \n Verdoppelt die Coins Per Second pro Grafikkarte";
            break;
        case "XOverclock":
            var videocard = getItemByName(item.getEffectTarget());
            document.getElementById("itemText").textContent = "Übertaktet die Grafikkarte " + videocard.getName() + " extrem. \n Vervierfacht die Coins Per Second pro Grafikkarte \n Eine 75% Chance besteht das dabei die Grafikkarte kaputt geht.";
            break;
    }
    document.getElementById("itemShowCase").classList.remove("invisible");
}

function changeCoinhealthLook() {
    var elem = document.getElementById("myProgress");
    if (screenMode === "desktop") {
        if (elem.tagName === "P") {
            var newDiv = document.createElement("DIV");
            newDiv.id = "myProgress";
            newDiv.style.backgroundColor = "grey";
            newDiv.style.width = "100%";
            newDiv.classList = elem.classList;
            var newBar = document.createElement("DIV");
            newBar.id = "myBar";
            newBar.style.width = coinHealth + "%";
            newDiv.appendChild(newBar);
            document.getElementById("clickCenter").removeChild(elem);
            document.getElementById("clickCenter").appendChild(newDiv);
            document.getElementById("healthSetting").textContent = "Coinhealth: Percentage"
        }
        else {
            var newP = document.createElement("P");
            newP.id = "myProgress";
            newP.textContent = coinHealth + "%";
            newP.classList = elem.classList;
            document.getElementById("clickCenter").removeChild(elem);
            document.getElementById("clickCenter").appendChild(newP);
            document.getElementById("healthSetting").textContent = "Coinhealth: Progressbar"
        }
    }
}

function createStringForImgSource(name) {
    var i = 0;
    var nameTiles = name.split(" ");
    var text = "";

    do {
        text += nameTiles[i];
        i++;
    } while (i < nameTiles.length);
    return text;
}

function toogleMenuByName(name) {
    if (document.getElementById(name).classList.contains("invisible")) {
        document.getElementById(name).classList.remove("invisible");
    }
    else {
        document.getElementById(name).classList.add("invisible");
    }
}

function loadChangelog() {
    for (var i = 0; i < data.changelog.length; i++) {
        var newLi = document.createElement("LI");
        var newD = document.createElement("DIV");
        var newH3 = document.createElement("H3");
        var newUL = document.createElement("UL");
        var z = 0;
        var text = "";
        var version = data.changelog[i].version.toString();
        newLi.id = data.changelog[i].version;
        while (z < version.length) {
            if (!isNaN(version[z - 1]) && z != 0 && version[z] != ".") {
                text += ".";
            }
            text += version[z];
            z++;
        }
        z = 0;
        newH3.textContent = "Version " + text;
        text = "";
        for (var j = 0; j < data.changelog[i].text.length; j++) {
            var newLiChange = document.createElement("LI");
            newLiChange.textContent = data.changelog[i].text[j];
            newUL.appendChild(newLiChange);
        }
        newD.appendChild(newH3);
        newD.appendChild(newUL);
        newLi.appendChild(newD);
        document.getElementById("changelogList").appendChild(newLi);
    }
}

function reverseOperator(operator) {
    if (operator == "plus") {
        return "minus";
    }
    if (operator == "minus") {
        return "plus";
    }
    if (operator == "multiply") {
        return "divide";
    }
    if (operator == "divide") {
        return "multiply";
    }
}

function convertSaveToCode()
{
    var saveString="";
    var helpString="";

    var statisticsString = "";
    var stat = document.getElementsByClassName("stat");
    for (var i = 0; i < stat.length; i++) {
        statisticsString += (stat[i].title + "_" + stats[stat[i].title] + "#");
    }
    var videoLevels = "";
    for (i = 0; i < upgrades[0].length; i++) {
        videoLevels += upgrades[0][i].getName() + "_" + upgrades[0][i].getLevel() + "_" + upgrades[0][i].getOverclock() + "#";
    }
    var upgradesString = "";
    for (i = 0; i < upgrades[1].length; i++) {
        if (upgrades[1][i].constructor.name == "Upgrade") {
            upgradesString += upgrades[1][i].getName() + "_" + upgrades[1][i].getBought() + "#";
        }
        else {
            upgradesString += upgrades[1][i].getName() + "_" + upgrades[1][i].getLevel() + "#";
        }
    }
    var itemsString="";
    for(i=0;i<items.length;i++)
    {
        itemsString+= items[i].getName()+"_"+items[i].getLevel()+"#";
    }

    helpString=encodeString(colorMode+";");
    saveString+=helpString;
    helpString=encodeString(volume+";");
    saveString+=helpString;
    helpString=encodeString(amountCoins+";");
    saveString+=helpString;
    helpString=encodeString(coinHealth+";");
    saveString+=helpString;
    helpString=encodeString((coinsPerSecond / getSpecialMultiplier())+";");
    saveString+=helpString;
    helpString=encodeString((coinsPerClick / getSpecialMultiplier())+";");
    saveString+=helpString;
    helpString=encodeString(autoloot+";");
    saveString+=helpString;
    helpString=encodeString(statisticsString+";");
    saveString+=helpString;
    helpString=encodeString(videoLevels+";");
    saveString+=helpString;
    helpString=encodeString(upgradesString+";");
    saveString+=helpString;
    helpString=encodeString(itemsString+";");
    saveString+=helpString;
    helpString=encodeString(version+";");
    saveString+=helpString;
    helpString=encodeString(previousPlaytime + ((new Date().getTime() - startTime) / 1000)+";");
    saveString+=helpString;
    helpString=encodeString(document.getElementById("myProgress").tagName);
    saveString+=helpString;

    copyTextToClipboard(saveString);
}
function convertCodeToSave(saveString){
    var saveTiles=saveString.split(";")
    coinHealth = saveTiles[3];

    if (saveTiles[0] === "night"&&colorMode!="night") {
        changeDayNight();
    }
    if (saveTiles[1] === "false"&&volume!=false) {
        changeVolume();
    }
    if (document.getElementById("myProgress").tagName === "P") {
        var text = document.getElementById("myProgress");
        text.textContent = coinHealth + "%";
    }
    else {
        var bar = document.getElementById("myBar");
        bar.style.width = coinHealth + "%";
    }
    amountCoins = parseFloat(saveTiles[2]);
    coinsPerSecond = parseFloat(saveTiles[4]);
    coinsPerClick = parseFloat(saveTiles[5]);
    autoloot = (saveTiles[6] === 'true');
    previousPlaytime = parseFloat(saveTiles[12]);
    document.getElementById("amountSecond").innerText = "Coins Per Second: " + coinsPerSecond;
    document.getElementById("amount").innerText = "ByteCoins: " + amountCoins;
    document.getElementById("coinsPerClick").innerText = "Coins Per Click: " + coinsPerClick;
    saveTiles[7] = saveTiles[7].replace(/#/g, ';');
    saveTiles[8] = saveTiles[8].replace(/#/g, ';');
    saveTiles[9] = saveTiles[9].replace(/#/g, ';');
    saveTiles[10] = saveTiles[10].replace(/#/g, ';');
    localStorage.setItem("Items",saveTiles[10]);
    localStorage.setItem("VideoCard", saveTiles[8]);
    localStorage.setItem("Statistics", saveTiles[7]);
    localStorage.setItem("Upgrades", saveTiles[9]);
    upgrades=[];
    items=[];
    stats=[];
    createStats();
    var shops = document.getElementsByClassName("shopContent");
    for(i =0;i<shops.length;i++)
    {
        shops[i].innerHTML="";
    }
    document.getElementById("inventoryList").innerHTML="";
    loadJsonItemsToShop();
}

function encodeString(text)
{
    var helpArr = new Array(text.length);
    var helpString="";

    for(var i=0;i<text.length;i++)
    {
        helpArr[i]=(text.charCodeAt(i))+1;
    }
    helpString = String.fromCharCode.apply(null, helpArr);
    return helpString;
}
function decodeString(text)
{
    var helpArr = new Array(text.length);
    var helpString="";

    for(var i=0;i<text.length;i++)
    {
        helpArr[i]=(text.charCodeAt(i))-1;
    }
    helpString = String.fromCharCode.apply(null, helpArr);
    return helpString;
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}
