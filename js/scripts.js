var amountCoins = 0;
var coinsPerSecond = 0;
var coinsPerClick = 1;
var upgrades = [];
var shopItems;
var cordinates = [0, 0];
var stats = [];
var startTime = new Date().getTime();


$(document).ready(function () {
    loadJsonItemsToShop();
    createStats();
});
document.addEventListener('mousemove', getMousePosition);
setInterval(clickAutomatic, 1000);

function loadCache() {
}

function clickCoin() {
    amountCoins += coinsPerClick;
    amountCoins = decimalRound(amountCoins, 1);
    stats["coinsEver"] += coinsPerClick;
    stats["coinsEver"] = decimalRound(stats["coinsEver"], 1);
    stats["coinsClicked"] += coinsPerClick;
    stats["coinsClicked"] = decimalRound(stats["coinsClicked"], 1);
    stats["coinsClicks"]++;
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
                        var Item = getItemInShop(upgrades[i][y].getName());
                        Item.textContent=upgrades[i][y].toString();
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
                        for (var z = 0; z < shopItems.length; z++) {
                            if (shopItems[z].id === upgrades[i][y].getName()) {
                                shopItems[z].parentElement.removeChild(shopItems[z]);
                            }
                        }
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
    if (document.getElementById("dayNightSwitch").classList.contains("fa-sun")) {
        document.getElementById('style').setAttribute('href', 'css/nightmode.css');
        document.getElementById("dayNightSwitch").classList.remove("fa-sun");
        document.getElementById("dayNightSwitch").classList.add("fa-moon");
    }
    else {
        document.getElementById('style').setAttribute('href', 'css/day.css');
        document.getElementById("dayNightSwitch").classList.remove("fa-moon");
        document.getElementById("dayNightSwitch").classList.add("fa-sun");
    }
}

function changeVolume() {
    var audio = document.getElementById("audioplayer");
    if (document.getElementById("volumes").classList.contains("fa-volume-up")) {
        audio.muted = true;
        document.getElementById("volumes").classList.remove("fa-volume-up");
        document.getElementById("volumes").classList.add("fa-volume-off");
    }
    else {
        audio.muted = false;
        document.getElementById("volumes").classList.remove("fa-volume-off");
        document.getElementById("volumes").classList.add("fa-volume-up");
    }
}

function removeInvisibleObjects() {
    var items = document.getElementsByClassName("flyingNumber");
    var body = document.body;
    for (var i = 0; i < items.length; i++) {
        if (parseInt(new Date().getTime()) > (parseInt(items[i].name + 2000))) {
            body.removeChild(items[i]);
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
    $.ajaxSetup({
        async: true
    });
    var target = document.getElementById("videocardsShopContent");
    for (var i = 0; i < upgrades[0].length; i++) {
        var newCard = document.createElement("LI");
        newCard.textContent = upgrades[0][i].toString();
        newCard.classList.add("notAffordable");
        newCard.classList.add("shopItem");
        newCard.id = upgrades[0][i].getName();
        newCard.onclick = function (e) {
            buyItem(e.currentTarget.id);
        };
        target.appendChild(newCard);
    }
    target = document.getElementById("upgradesShopContent");
    for (var i = 0; i < upgrades[1].length; i++) {
        var newUpgrade = document.createElement("LI");
        newUpgrade.textContent = upgrades[1][i].toString();
        newUpgrade.classList.add("notAffordable");
        newUpgrade.classList.add("shopItem");
        newUpgrade.id = upgrades[1][i].getName();
        newUpgrade.onclick = function (e) {
            buyItem(e.currentTarget.id);
        };
        target.appendChild(newUpgrade);
    }
    shopItems=document.getElementsByClassName("shopItem");
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
    }
    else {
        document.getElementById(name).classList.add("invisible");
    }
}

function getItemInShop(nameItem){
    for(var i=0;i<shopItems.length;i++)
    {
        if(shopItems[i].id===nameItem)
        {
            return shopItems[i];
        }
    }
}