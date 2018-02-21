var amountCoins=0;
var coinsPerSecond=0;
var coinsPerClick=1;
setInterval(clickAutomatic,1000);

function clickCoin(event) {
    //var x = event.screenX;
    //var y = event.screenY;
    amountCoins+=coinsPerClick;
    amountCoins=decimalRound(amountCoins,1);
    document.getElementById("amount").innerText="ByteCoins: "+amountCoins;
    var clickHit = document.createElement("P");
    clickHit.textContent="+"+coinsPerClick;
    clickHit.className="flyingNumber noselect";
    clickHit.name=new Date().getTime();
    document.body.appendChild(clickHit);
    checkUpgradesAffordable();
    playSound("sounds/coinClick.mp3");
}
function buyUpgrade(upgrade)
{
    var upgrades = document.getElementsByClassName("upgrade");
    var upgradesNames = document.getElementsByClassName("upgradeNames");
    var upgradesImages = document.getElementsByClassName("upgradeImages");
    var upgradeFields = document.getElementsByClassName("upgradeFields");
    var parts;
    switch(upgrade)
    {
        case "GTX1080Ti":
            if(amountCoins>=parseInt(upgrades[0].textContent))
            {
                coinsPerSecond+=1;
                amountCoins-=parseInt(upgrades[0].textContent);
                upgrades[0].textContent=(parseInt(upgrades[0].textContent)+30);
                upgradesImages[0].name=parseInt(upgradesImages[0].name)+1;
                parts=upgradesNames[0].textContent.split(" ");
                upgradesNames[0].textContent=parts[0]+" "+parts[1]+" x"+upgradesImages[0].name;
                playSound("sounds/buySound.mp3");
            }
            break;
        case "GT1030":
            if(amountCoins>=parseInt(upgrades[1].textContent))
            {
                coinsPerSecond+=0.1;
                coinsPerSecond=decimalRound(coinsPerSecond,1);
                amountCoins-=parseInt(upgrades[1].textContent);
                upgrades[1].textContent=(parseInt(upgrades[1].textContent)+5);
                upgradesImages[1].name=parseInt(upgradesImages[1].name)+1;
                parts=upgradesNames[1].textContent.split(" ");
                upgradesNames[1].textContent=parts[0]+" "+parts[1]+" x"+upgradesImages[1].name;
                playSound("sounds/buySound.mp3");
            }
            break;
        case "ES":
            if(amountCoins>=parseInt(upgrades[2].textContent))
            {
                coinsPerClick*=2;
                amountCoins-=parseInt(upgrades[2].textContent);
                document.getElementById("upgradeField").removeChild(upgradeFields[2]);
                playSound("sounds/buySound.mp3");
            }
            break;
        case "GS":
            if(amountCoins>=parseInt(upgrades[2].textContent))
            {
                coinsPerClick*=2;
                amountCoins-=parseInt(upgrades[2].textContent);
                document.getElementById("upgradeField").removeChild(upgradeFields[2]);
                playSound("sounds/buySound.mp3");
            }
            break;

    }
    document.getElementById("amountSecond").innerText="Coins Per Second: "+coinsPerSecond;
    document.getElementById("amount").innerText="ByteCoins: "+amountCoins;
    document.getElementById("coinsPerClick").innerText="Coins Per Click: "+coinsPerClick;

}
function clickAutomatic(){
    amountCoins+=coinsPerSecond;
    amountCoins=decimalRound(amountCoins,1);
    document.getElementById("amount").innerText="ByteCoins: "+amountCoins;
    checkUpgradesAffordable();
    removeInvisibleObjects();
}
function checkUpgradesAffordable(){
    var upgrades = document.getElementsByClassName("upgrade");
    for(var i=0;i< upgrades.length;i++)
    {
        if(amountCoins>=parseInt(upgrades[i].textContent))
        {
            upgrades[i].className="upgrade affordable";
            upgrades[i].disabled=false;
        }
        if(amountCoins<parseInt(upgrades[i].textContent))
        {
            upgrades[i].className="upgrade notAffordable";
            upgrades[i].disabled=true;

        }
    }
}
function decimalRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}
function addCoins(coinsAdd)
{
    amountCoins+=coinsAdd;
}
function changeDayNight() {
    removeInvisibleObjects();
    if(document.getElementById("dayNightSwitch").classList.contains("fa-sun")){
        document.getElementById('style').setAttribute('href', 'css/nightmode.css');
        document.getElementById("dayNightSwitch").classList.remove("fa-sun");
        document.getElementById("dayNightSwitch").classList.add("fa-moon");
    }
    else
    {
        document.getElementById('style').setAttribute('href', 'css/day.css');
        document.getElementById("dayNightSwitch").classList.remove("fa-moon");
        document.getElementById("dayNightSwitch").classList.add("fa-sun");
    }
}
function changeVolume(){
    var audio = document.getElementById("audioplayer");
    if(document.getElementById("volumes").classList.contains("fa-volume-up")){
        audio.muted=true;
        document.getElementById("volumes").classList.remove("fa-volume-up");
        document.getElementById("volumes").classList.add("fa-volume-off");
    }
    else
    {
        audio.muted=false;
        document.getElementById("volumes").classList.remove("fa-volume-off");
        document.getElementById("volumes").classList.add("fa-volume-up");
    }
}
function removeInvisibleObjects(){
    var items = document.getElementsByClassName("flyingNumber");
    var body = document.body;
    for(var i=0;i<items.length;i++)
    {
        if(parseInt(new Date().getTime())>(parseInt(items[i].name+2000)))
        {
            body.removeChild(items[i]);
        }
    }
}
function playSound(url){
    var audio = document.getElementById("audioplayer");
    audio.src = url;
    audio.autoplay = true;
    audio.play();
}