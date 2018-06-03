var data = {
    "videocards": [
        {"name": "Geforce 8800 GTX", "price": 10, "costincrease": 1.4, "targetproperty": "coinsPerSecond", "targetincrease": 0.1},
        {"name": "Radeon HD 4870", "price": 70, "costincrease": 1.4, "targetproperty": "coinsPerSecond", "targetincrease": 0.5},
        {"name": "GTX 280", "price": 175, "costincrease": 1.4, "targetproperty": "coinsPerSecond", "targetincrease": 1},
        {"name": "GTX 295", "price": 300, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 1.5},
        {"name": "GTX 480", "price": 750, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 3},
        {"name": "GTX 570", "price": 1500, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 5},
        {"name": "GTX 580", "price": 3500, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 10},
        {"name": "GTX 690", "price": 12500, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 30},
        {"name": "Radeon R9 295X2", "price": 30000, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 50},
        {"name": "GTX Titan Z", "price": 70000, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 100},
        {"name": "GTX Titan X", "price": 245000, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 250},
        {"name": "RX Vega 56", "price": 600000, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 550},
        {"name": "RX Vega 64", "price": 800000, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 850},
        {"name": "GTX 1080 Ti", "price": 1000000, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 1000},
        {"name": "GTX 1180", "price": 1200000, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 1250},
        {"name": "GTX Titan V", "price": 1500000, "costincrease": 1.5, "targetproperty": "coinsPerSecond","targetincrease": 1500},
        {"name": "GTX Titan Y", "price": 3500000, "costincrease": 1.5, "targetproperty": "coinsPerSecond", "targetincrease": 3000}
    ],
    "upgrades": [
        {"name": "Eisenspitzhacke", "price": 2000, "targetproperty": "coinsPerClick", "targetmultiplier": 2, "description": "Eine abgenutzte Eisenhacke aus einer alten Mine. \n Verdoppelt die Anzahl der Coins pro Click."},
        {"name": "Beidseitige Eisenspitzhacke", "price": 5000, "targetproperty": "coinsPerClick", "targetmultiplier": 2, "description": "Noch eine abgenutzte Eisenhacke aus einer alten Mine. \n Verdoppelt die Anzahl der Coins pro Click."},
        {"name": "Goldspitzhacke", "price": 10000, "targetproperty": "coinsPerClick", "targetmultiplier": 4, "description": "So ein Blödsinn eine Spitzhacke aus Gold zu bauen \n Vervierfacht die Anzahl der Coins pro Click."},
        {"name": "Beidseitige Goldspitzhacke", "price": 20000, "targetproperty": "coinsPerClick", "targetmultiplier": 4, "description": "WTF Noch eine Spitzhacke aus Gold .... \n Vervierfacht die Anzahl der Coins pro Click."},
        {"name": "Diamantspitzhacke", "price": 40000, "targetproperty": "coinsPerClick", "targetmultiplier": 8, "description": "Herzlichen Glückwunsch. \n Nun ist das Diamantvorkommen der Erde zu 50% aufgebraucht. \n Verachtfacht die Anzahl der Coins pro Click."},
        {"name": "Beidseitige Diamantspitzhacke", "price": 80000, "targetproperty": "coinsPerClick", "targetmultiplier": 8, "description": "Herzlichen Glückwunsch. \n Nun ist das Diamantvorkommen der Erde komplett aufgebraucht. \n Verachtfacht die Anzahl der Coins pro Click."},
        {"name": "AutoLoot", "price": 1000, "targetproperty": "autoloot", "targetmultiplier": 1, "description": "Für bequeme Menschen oder für Speedrunner oder so ähnlich."}
    ],
    "overclocks": [
        {"name": "Overclock Geforce 8800 GTX", "price": 30, "targetCard": "Geforce 8800 GTX"},
        {"name": "Overclock Radeon HD 4870", "price": 180, "targetCard": "Radeon HD 4870"},
        {"name": "Overclock GTX 280", "price": 200, "targetCard": "GTX 280"},
        {"name": "Overclock GTX 295", "price": 500, "targetCard": "GTX 295"},
        {"name": "Overclock GTX 480", "price": 1750, "targetCard": "GTX 480"},
        {"name": "Overclock GTX 570", "price": 6550, "targetCard": "GTX 570"},
        {"name": "Overclock GTX 580", "price": 6550, "targetCard": "GTX 580"},
        {"name": "Overclock GTX 690", "price": 19500, "targetCard": "GTX 690"},
        {"name": "Overclock Radeon R9 295X2", "price": 35000, "targetCard": "Radeon R9 295X2"},
        {"name": "Overclock GTX Titan Z", "price": 55000, "targetCard": "GTX Titan Z"},
        {"name": "Overclock GTX Titan X", "price": 140000, "targetCard": "GTX Titan X"},
        {"name": "Overclock RX Vega 56", "price": 125000, "targetCard": "RX Vega 56"},
        {"name": "Overclock RX Vega 64", "price": 500000, "targetCard": "RX Vega 64"},
        {"name": "Overclock GTX 1080 Ti", "price": 1000000, "targetCard": "GTX 1080 Ti"},
        {"name": "Overclock GTX 1180", "price": 1250000, "targetCard": "GTX 1180"},
        {"name": "Overclock GTX Titan V", "price": 1800000, "targetCard": "GTX Titan V"},
        {"name": "Overclock GTX Titan Y", "price": 2500000, "targetCard": "GTX Titan Y"}
    ],
    "events": [
        {"name": "Bitcoin Rush", "target":"all", "operand":8, "duration":60,"image":"images/bitcoin.png"}
    ],
    "changelog":[
        {"version":0.5,"text":"test"},
        {"version":0.501,"text":"test"},
        {"version":0.502,"text":"test"},
        {"version":0.503,"text":"test"},
        {"version":0.51,"text":"test"}
    ]
};