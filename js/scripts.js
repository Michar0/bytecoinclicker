var amountCoins=0;
var coinsPerSecond=0;
var coinsPerClick=1;
var coinsPerSecondUpgradeParts=[0,0];
var multiplierUpgrade=[1,1];
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
    var upgradesNames = document.getElementsByClassName("upgradeNames");
    var upgradeFields = document.getElementsByClassName("upgradeFields");
    var upgradePrices = document.getElementsByClassName("upgradePrice");
    var parts;
    var amount;
    var value="";
    switch(upgrade)
    {
        case "GTX1080Ti":
            if(amountCoins>=parseInt(upgradePrices[0].textContent))
            {
                coinsPerSecond+=multiplierUpgrade[0];
                coinsPerSecondUpgradeParts[0]+=multiplierUpgrade[0];
                parts=upgradesNames[0].textContent.split(" ");
                amountCoins-=parseInt(upgradePrices[0].textContent);
                upgradePrices[0].textContent=parseInt(upgradePrices[0].textContent)+30;
                amount=parts[2].split("");
                for(var i=1;i<amount.length;i++)
                {
                    value=String(value)+String(amount[i]);
                }
                value=parseInt(value)+1;
                upgradesNames[0].textContent=parts[0]+" "+parts[1]+" x"+value+" "+upgradePrices[0].textContent+" \u20BF";
                playSound("sounds/buySound.mp3");
            }
            break;
        case "GT1030":
            if(amountCoins>=parseInt(upgradePrices[1].textContent))
            {
                coinsPerSecond+=(0.1);
                coinsPerSecondUpgradeParts[1]+=0.1;
                coinsPerSecond=decimalRound(coinsPerSecond,1);
                parts=upgradesNames[1].textContent.split(" ");
                amountCoins-=parseInt(upgradePrices[1].textContent);
                upgradePrices[1].align=parseInt(upgradePrices[1].textContent)+5;
                amount=parts[2].split("");
                for(var i=1;i<amount.length;i++)
                {
                    value=String(value)+String(amount[i]);
                }
                value=parseInt(value)+1;
                upgradesNames[1].textContent=parts[0]+" "+parts[1]+" x"+value+" "+upgradePrices[1].textContent+"  \u20BF";
                playSound("sounds/buySound.mp3");
            }
            break;
        case "ES":
            if(amountCoins>=parseInt(upgradePrices[3].textContent))
            {
                coinsPerClick*=2;
                amountCoins-=parseInt(upgradePrices[3].textContent);
                document.getElementById("upgradeField").removeChild(upgradeFields[3]);
                playSound("sounds/buySound.mp3");
            }
            break;
        case "GS":

            if(amountCoins>=parseInt(upgradePrices[3].textContent))
            {
                coinsPerClick*=2;
                amountCoins-=parseInt(upgradePrices[3].textContent);
                document.getElementById("upgradeField").removeChild(upgradeFields[3]);
                playSound("sounds/buySound.mp3");
            }
            break;
        case "OCKTX1030Ti":
            if(amountCoins>=parseInt(upgradePrices[2].textContent))
            {
                coinsPerSecondUpgradeParts[0]*=2;
                multiplierUpgrade[0]*=2;
                coinsPerSecond=decimalRound(coinsPerSecondUpgradeParts[0]+coinsPerSecondUpgradeParts[1],1);
                amountCoins-=parseInt(upgradePrices[2].textContent);
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
    coinsPerSecond=decimalRound(coinsPerSecondUpgradeParts[0]+coinsPerSecondUpgradeParts[1],1);
    amountCoins+=coinsPerSecond;
    amountCoins=decimalRound(amountCoins,1);
    document.getElementById("amount").innerText="ByteCoins: "+amountCoins;
    checkUpgradesAffordable();
    removeInvisibleObjects();
}
function checkUpgradesAffordable(){
    var upgradePrices = document.getElementsByClassName("upgradePrice");
    for(var i=0;i< upgradePrices.length;i++)
    {
        if(amountCoins>=parseInt(upgradePrices[i].textContent))
        {
            upgradePrices[i].parentElement.classList.add("affordable");
            upgradePrices[i].parentElement.classList.remove("notAffordable");
        }
        if(amountCoins<parseInt(upgradePrices[i].textContent))
        {
            upgradePrices[i].parentElement.classList.add("notAffordable");
            upgradePrices[i].parentElement.classList.remove("affordable");
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
function toogleUpgradeMenu(){
    if(document.getElementById("upgradeField").style.display==='none')
    {
        document.getElementById("upgradeHeader").textContent="Upgrades\u2BC5";
        document.getElementById("upgradeField").style.display="inline-block";
    }
    else if(document.getElementById("upgradeField").style.display==='inline-block')
    {
        document.getElementById("upgradeHeader").textContent="Upgrades\u2BC6";
        document.getElementById("upgradeField").style.display="none";
    }
}