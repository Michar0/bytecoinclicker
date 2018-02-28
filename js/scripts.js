var amountCoins=0;
var coinsPerSecond=0;
var coinsPerClick=1;
var coinsPerSecondUpgradeParts = [];
var coinsPerSecondAddUpgrade=[];
var upgrades=document.getElementsByClassName("upgradeFields");
var cordinates=[0,0];

document.addEventListener('mousemove',getMousePosition);
setInterval(clickAutomatic,1000);

//will be changed in near future because crappy code
coinsPerSecondUpgradeParts['KTX1030Ti']=0;
coinsPerSecondUpgradeParts['KT1020']=0;
coinsPerSecondAddUpgrade['KTX1030Ti']=1;
coinsPerSecondAddUpgrade['KT1020']=0.1;

function clickCoin() {
    amountCoins+=coinsPerClick;
    amountCoins=decimalRound(amountCoins,1);
    document.getElementById("amount").innerText="ByteCoins: "+amountCoins;
    var clickHit = document.createElement("P");
    clickHit.textContent="+"+coinsPerClick;
    clickHit.className="flyingNumber noselect";
    clickHit.name=new Date().getTime();
    clickHit.style.top=(cordinates[1]-30)+"px";
    clickHit.style.left=cordinates[0]+"px";
    clickHit.style.position='absolute';
    document.body.appendChild(clickHit);
    checkUpgradesAffordable();
    playSound("sounds/coinClick.mp3");
}

function buyUpgrade(upgrade)
{
    var parts;
    var price;
    var text="";
    var tiles;

    for(var i=0;i<upgrades.length;i++)
    {
        price=upgrades[i].childNodes[7].textContent.split(" ");
        parts=upgrades[i].childNodes[1].textContent.split(" ");
        if(upgrades[i].title===upgrade&&amountCoins>=parseFloat(price[0]))
        {
            amountCoins-=parseInt(price[0]);
            if(upgrades[i].childNodes[1].textContent.indexOf("x")!==-1)
            {
                price[0]=parseFloat(price[0],10)*parseFloat(price[1],10);
                price[0]=decimalRound(price[0],0);

                upgrades[i].childNodes[7].textContent=price[0]+" "+price[1];
                var y=0;
                while(parts[y].indexOf("x")===-1)
                {
                    text+=parts[y]+" ";
                    y++;
                }
                tiles=parts[y].split("");
                var value="";
                for(var z=1;z<tiles.length;z++){
                    value+=tiles[z]
                }
                value=parseInt(value)+1;
                text=text+"x"+value+" "+price[0]+" \u20BF";
                upgrades[i].childNodes[1].textContent=text;
            }
            switch(upgrades[i].childNodes[9].title)
            {
                case "1":
                    coinsPerSecondUpgradeParts[upgrades[i].title]+=coinsPerSecondAddUpgrade[upgrades[i].title];
                    coinsPerSecond+=coinsPerSecondAddUpgrade[upgrades[i].title];
                    coinsPerSecond=decimalRound(coinsPerSecond,2);
                    break;
                case "2":
                    coinsPerClick*=decimalRound(parseInt(upgrades[i].childNodes[9].textContent),1);
                    break;
                case "3":
                    tiles= upgrades[i].childNodes[9].textContent.split(" ");
                    coinsPerSecondAddUpgrade[tiles[1]]*=parseFloat(tiles[0]);
                    coinsPerSecond-=coinsPerSecondUpgradeParts[tiles[1]];
                    coinsPerSecondUpgradeParts[tiles[1]]*=parseFloat(tiles[0]);
                    coinsPerSecond+=coinsPerSecondUpgradeParts[tiles[1]];
                    break;
            }
            if(parseInt(price[1])===0)
            {
                document.getElementById("upgradeField").removeChild(upgrades[i]);
            }
            playSound("sounds/buySound.mp3");
            break;
        }
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
    var upgradePrices = document.getElementsByClassName("upgradePrice");
    for(var i=0;i< upgradePrices.length;i++)
    {
        var parts=upgradePrices[i].textContent.split(" ");
        if(amountCoins>=parseInt(parts[0]))
        {
            upgradePrices[i].parentElement.classList.add("affordable");
            upgradePrices[i].parentElement.classList.remove("notAffordable");
        }
        if(amountCoins<parseInt(parts[0]))
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
function getMousePosition(event){
    cordinates[0] = event.pageX;
    cordinates[1] = event.pageY;
}