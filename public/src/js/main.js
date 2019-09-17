const command = document.getElementById("kör-btn");
const input = document.getElementById("input-text");
const answer = document.getElementById("response");

let currentItem;
let hpBar = document.getElementById("hp-bar");
let hpText = document.getElementById("hp-text");
let isDead = false;
var resTimer = 5;

let lowLevelCap = 11;

//DRAW THE MAP TILES
const rows = 12;
const columns = rows;
const tileHeight = 19 / columns;
const tileWidth = 35;

/* Coordinates */
let x = document.getElementById("x");
let y = document.getElementById("y");

var map = document.getElementById("map");
let createRow = function(id) {
    var row = document.createElement("div");
    row.classList.add("row");
    row.classList.add("map-row");
    row.id = id;
    map.appendChild(row);
}

let createColumn = function(id, cid) {
    var row = document.getElementById(id);
    var column = document.createElement("div");
    column.classList.add("col");
    column.classList.add("map-tile");
    row.appendChild(column);
}

for (let x = 0; x < rows; x++) {
    createRow("row-" + x);
    for (let y = 0; y < columns; y++) {
        createColumn("row-" + x, "cell-" + y);
    }
}

console.log(tileWidth * x + "px");

document.getElementById("coordinates").style.top = tileWidth * rows + 15 + "px";
document.getElementById("coordinates").style.width = tileWidth * rows + "px";
document.getElementById("coordinates").style.height = "20px";
document.getElementById("coordinates").style.paddingLeft = rows * 4 + "px";
//FINISHED DRAWING THE MAP TILES

//Draw random map environments
/*Forest*/
var mapRows = document.getElementsByClassName("map-row");
var mapCells = document.getElementsByClassName("map-tile");


//Boolean to check if we're engaged with an enemy.
let conflict = false;

//The character
const character = {
    attributes: {
        armor: random(2),
        stamina: 11,
        strength: 17,
        agility: 10,
        spirit: 8,
        intelligence: 8
    },
    position: {
        row: random(rows),
        column: random(columns)
    },
    gear: {
        helmet: "",
        shoulderpads: "",
        breastplate: "",
        belt: "",
        legs: "",
        feet: "",
        weapon: ""
    },
    name: "Adamski",
    damage: 10,
    currentHP: 0,
    maxHP: 0,
    maxExperience: 400,
    experience: 0,
    currentLevel: 1,
    backpack: {
        food: [

        ],
        armor: [

        ],
        weapon: [

        ],
        currency: {
            gold: 0,
            silver: 0,
            copper: 0
        }
    },
    inventory: {
        weapon: {
            equipped: false,
            name: "",
            rarity: "",
            rarityColor: "",
            damage: "",
        }
    }
}

//Character formulas
character.maxHP = Math.ceil((10 * character.attributes.stamina) + (character.maxHP * 1.5));
character.currentHP = character.maxHP;
document.getElementById("hp-text").innerHTML = character.currentHP + "/" + character.maxHP;

//NPCs

const salesman = {
    name: "Wandering salesman",
    dialogue: [
        "Selling items",
        "Buying items"
    ],
    position: {
        row: random(rows - 2),
        column: random(rows - 2)
    },
    mapcolor: "#ff8000",
}

let npcs = [

];

for (let i = 0; i < npcs.length; i++) {

}

//FIND NPC ON MAP
updateNPCPosition();

function updateNPCPosition() {
    /* All the rows & columns to an array */
    var r = document.getElementById("row-" + salesman.position.row);
    var c = r.childNodes;
    /*
    Update the position every movement
    */
    c[salesman.position.column].style.background = salesman.mapcolor;

    y.innerHTML = "Y: " + character.position.row;
    x.innerHTML = "X: " + character.position.column;
}

//Enemies
const wolf = {
    attributes: {
        stamina: randomMobLevel(6),
        strength: randomMobLevel(6),
        agility: randomMobLevel(6),
        intelligence: randomMobLevel(6),
        spirit: randomMobLevel(6)
    },
    position: {
        row: random(rows - 2),
        column: random(columns - 2)
    },
    level: randomMobLevel(lowLevelCap),
    name: "Wolf",
    maxHP: 0,
    hp: 0,
    damage: 0,
    experience: (character.currentLevel * 5) + 45
};

const pig = {
    attributes: {
        stamina: randomMobLevel(6),
        strength: randomMobLevel(6),
        agility: randomMobLevel(6),
        intelligence: randomMobLevel(6),
        spirit: randomMobLevel(6)
    },
    position: {
        row: random(rows - 2),
        column: random(columns - 2)
    },
    level: randomMobLevel(lowLevelCap),
    name: "Pig",
    maxHP: 0,
    hp: 0,
    damage: 0,
    experience: (character.currentLevel * 5) + 45
};

const spider = {
    attributes: {
        stamina: randomMobLevel(6),
        strength: randomMobLevel(6),
        agility: randomMobLevel(6),
        intelligence: randomMobLevel(6),
        spirit: randomMobLevel(6)
    },
    position: {
        row: random(rows - 2),
        column: random(columns - 2)
    },
    level: randomMobLevel(lowLevelCap),
    name: "Spider",
    maxHP: 0,
    hp: 0,
    damage: 0,
    experience: (character.currentLevel * 5) + 45
};

//Enemies in an array
let enemies = [
    wolf,
    pig,
    spider
];

//Enemy formulas
for (let i = 0; i < enemies.length; i++) {
    enemies[i].damage = randomMobLevel(3) + (enemies[i].attributes.strength / 3.5) * 1.5;
    enemies[i].maxHP = Math.ceil((10 * enemies[i].attributes.stamina) + (enemies[i].maxHP * 1.5));
    enemies[i].hp = enemies[i].maxHP;
}

/*Dynamically change colors of the enemies on the minimap,
  based on the enemies level*/
function colors(enemy) {
    let enemyColors = [
        //Level 0-2
        "#add8e6",
        //Level 3-5
        "#00FF00",
        //Level 6-8
        "#ffa500",
        //Default
        "#ff0000"
    ];

    switch (enemy.attributes.level) {
        case 0:
        case 1:
        case 2:
            return enemyColors[0];
        case 3:
        case 4:
        case 5:
            return enemyColors[1];
        case 6:
        case 7:
        case 8:
            return enemyColors[2];
        default:
            return enemyColors[3];

    }
}

//FIND PLAYER ON MAP
var updateCharacterPosition = function() {
    /* All the rows & columns to an array */
    var r = document.getElementById("row-" + character.position.row);
    var c = r.childNodes;
    /*
    Update the position every movement
    */
    c[character.position.column].style.background = "#484848";
    y.innerHTML = "Y: " + character.position.row;
    x.innerHTML = "X: " + character.position.column;
}

//FIND ENEMIES ON MAP
var updateEnemyPosition = function() {
    for (let i = 0; i < enemies.length; i++) {
        var enemyTile = getEnemyTile(enemies[i]);
        enemyTile.style.background = colors(enemies[i]);
    }
}

//Enemy wander
setInterval(function() {
    if (!conflict) {
        for (let i = 0; i < enemies.length; i++) {
            var enemyTile = getEnemyTile(enemies[i]);
            enemyTile.style.background = "#eee";
            enemyTile.innerHTML = "";
            if (enemies[i].position.row !== 0 && enemies[i].position.row !== rows - 1) {
                enemies[i].position.row += Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (enemies[i].position.row == 0) {
                enemies[i].position.row += 1;
            } else if (enemies[i].position.row == rows - 1) {
                enemies[i].position.row -= 1;
            }
            if (enemies[i].position.column !== 0 && enemies[i].position.column !== columns - 1) {
                enemies[i].position.column += Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } else if (enemies[i].position.column == columns - 1) {
                enemies[i].position.column -= 1;
            } else if (enemies[i].position.column == 0) {
                enemies[i].position.column += 1;
            }
            updateEnemyPosition();
        }
    }
}, 5000);

//Reset the color if we're moving away from it.
function resetColor() {
    var r = document.getElementById("row-" + character.position.row);
    var c = r.childNodes;
    c[character.position.column].style.background = "#eee";
}

//Get enemy tile
function getEnemyTile(enemy) {
    var r = document.getElementById("row-" + enemy.position.row);
    var c = r.childNodes;
    return c[enemy.position.column];
}

//Create notifications
for (let i = 0; i < enemies.length; i++) {
    var notificationDiv = document.createElement("div");
    var notificationButton = document.createElement("button");
    var notificationText = document.createElement("p");
    var enemyDesc = document.createElement("p");
    notificationDiv.id = "notification_" + i;
    notificationDiv.className = "alert alert-dismissable alert-info";
    notificationButton.id = "notification-button_" + i;
    notificationButton.className = "close";
    notificationButton.innerHTML = "&times;";
    notificationText.id = "notification-text_" + i;
    notificationText.className = "mb-0";
    notificationText.innerHTML = "There is a " + enemies[i].name + " nearby.";
    enemyDesc.id = "enemydesc_" + i;
    enemyDesc.className = "mb-0";
    enemyDesc.innerHTML = "Level: " + enemies[i].level;
    notificationDiv.appendChild(notificationButton);
    notificationDiv.appendChild(notificationText);
    notificationDiv.appendChild(enemyDesc);
    document.getElementById("notification-col").appendChild(notificationDiv);
    document.getElementById("notification_" + i).style.position = "absolute";
    document.getElementById("notification_" + i).style.width = "200px";
    document.getElementById("notification_" + i).style.top = "-100px";
    document.getElementById("notification_" + i).style.margin = "0 auto";
}

//Enemy notifications
function enemyNotifications() {
    var enemyPositionsRow = [];
    var enemyPositionsCol = [];

    for (let i = 0; i < enemies.length; i++) {
        enemyPositionsRow.push(enemies[i].position.row);
        enemyPositionsCol.push(enemies[i].position.column);
    }

    for (let i = 0; i < enemies.length; i++) {
        if (document.getElementById("notification_" + i).style.opacity == 0) {
            var enemyX = Math.abs(enemies[i].position.row);
            var enemyY = Math.abs(enemies[i].position.column);

            if (Math.abs(enemyX - character.position.row) < 4 &&
                Math.abs(enemyY - character.position.column) < 4) {
                notificationText.innerHTML = "There is a " + enemies[i].name + " nearby.";
                enemyDesc.innerHTML = "Level: " + enemies[i].level;
                document.getElementById("notification_" + i).style.top = 1 + "px";
                document.getElementById("notification_" + i).style.opacity = 1;
                document.getElementById("notification-button_" + i).addEventListener("click", function() {
                    document.getElementById("notification_" + i).style.top = "-100px";
                });
                setTimeout(function() {
                    document.getElementById("notification_" + i).style.opacity = 0;
                    document.getElementById("notification_" + i).style.top = "-100px";
                }, 2000);
            }
        }
    }
}


//Initializing the positions on the map

updateEnemyPosition();
updateCharacterPosition();

//Check for conflict
window.setInterval(function() {
    if (conflict) {
        $(".character-screen").removeClass("d-none");
    }
}, 100);

//Key movement
//Hide character screen
$(document).keydown(function(e) {
    if (e.keyCode == 73) {
        if (characterStats.classList.contains("d-none")) {
            characterStats.classList.remove("d-none");
        } else {
            characterStats.classList.add("d-none");
        }
    }
    //Game mechanics
    if (!conflict) {
        if (!isDead) {
            enemyNotifications();
        }
        resetColor();
        if (e.keyCode == 27) {
            if ($(".character-screen").hasClass("d-none")) {
                $(".character-screen").removeClass("d-none");
                $("#menu").addClass("d-none");
            } else {
                $(".character-screen").addClass("d-none");
                $("#menu").removeClass("d-none");
            }
        }
        //Movement handler
        switch (e.keyCode) {
            //UP
            case 87:
                if (character.position.row !== 0) {
                    move(-1, 0);
                }
                break;
                //DOWN
            case 83:
                if (character.position.row !== rows - 1) {
                    move(1, 0);
                }
                break;
                //LEFT
            case 65:
                if (character.position.column !== 0) {
                    move(0, -1);
                }
                break;
                //RIGHT
            case 68:
                if (character.position.column !== rows - 1) {
                    move(0, 1);
                }
                break;
        }
        if (!isDead) {
            checkEnemyPositions();
        }
        updateNPCPosition();
        updateCharacterPosition();
    }
});

//Small function to return a boolean if the word we enter matches our target word.
function checkWordMatch(word, matchning) {
    return word == matchning;
}

/*Update the row & column positions in the character object.
  Which are the variables in which the map updates from.*/
function move(goX, goY) {
    character.position.row += goX;
    character.position.column += goY;
}

//Function to check if we've engaged with an enemy, also to handle the engaging part.
function checkEnemyPositions() {
    for (let i = 0; i < enemies.length; i++) {
        if (JSON.stringify(character.position.row) == JSON.stringify(enemies[i].position.row) &&
            JSON.stringify(character.position.column) == JSON.stringify(enemies[i].position.column)) {
            conflict = true;
            answer.innerHTML = "There's an enemy at this position, what do you wish to do?";
            document.getElementById("fly").classList.remove("d-none");
            document.getElementById("slåss").classList.remove("d-none");

            document.getElementById("fly").onclick = function() {
                conflict = false;
                answer.innerHTML = "You fled from the enemy.";
                document.getElementById("fly").classList.add("d-none");
                document.getElementById("slåss").classList.add("d-none");
            }

            document.getElementById("slåss").onclick = function() {
                document.getElementById("enemy-div").classList.remove("d-none");
                document.getElementById("enemy-hp-text").innerHTML = enemies[i].hp + "/" + enemies[i].maxHP;
                document.getElementById("enemy-info").innerHTML = enemies[i].name + ", Level " + enemies[i].level;
                answer.innerHTML = "You've engaged in battle with " + enemies[i].name;
                document.getElementById("fly").classList.add("d-none");
                document.getElementById("slåss").classList.add("d-none");
                document.getElementById("attackera-btn").classList.remove("d-none");
                document.getElementById("skydda-btn").classList.remove("d-none");
                fight(enemies[i]);
            }
        }

        function fight(enemy) {
            setInterval(function() {
                if (enemy.hp < 1) {
                    winBattle(enemy);
                }
                if (character.currentHP < 1) {
                    characterDeath();
                }
            }, 100);
            document.getElementById("attackera-btn").onclick = function() {
                if (enemy.hp > 0) {
                    enemy.hp -= random(character.damage);
                    document.getElementById("enemy-hp-text").innerHTML = enemy.hp + "/" + enemy.maxHP;
                    character.currentHP -= random(enemy.damage);
                    setCharacterHP(character.currentHP);
                }
            }
            document.getElementById("skydda-btn").onclick = function() {}
        }
    }
}

function winBattle(enemy) {
    if (random(5) == 2) {
        var foodItem = new item({
            itemType: "food"
        });
        if (foodItem.itemType == "food") {
            character.backpack.food.push(foodItem);
        }
        displayItem(foodItem);
        document.getElementById("response-loot").innerHTML = enemy.name + " dropped " + foodItem.name + ".";
    } else {
        document.getElementById("response-loot").innerHTML = "";
    }

    if (random(1) == 0) {
        var weaponItem = new item({
            itemType: "weapon"
        });
        if (weaponItem.itemType == "weapon") {
            character.backpack.weapon.push(weaponItem);
        }
        displayItem(weaponItem);
        document.getElementById("response-loot").innerHTML += enemy.name + " dropped " + weaponItem.name + ".";
    }

    checkCurrency(
        character.backpack.currency.copper += 260,
        character.backpack.currency.copper,
        character.backpack.currency.silver,
        character.backpack.currency.gold
    );

    document.getElementById("response-xp").classList.remove("d-none");
    document.getElementById("response-loot").classList.remove("d-none");
    answer.innerHTML = "You've defeated " + enemy.name + " in battle.";
    document.getElementById("response-xp").innerHTML = "You gained " + enemy.experience + " experience.";
    conflict = false;
    increaseExperience(enemy.experience);
    document.getElementById("enemy-div").classList.add("d-none");
    document.getElementById("attackera-btn").classList.add("d-none");
    document.getElementById("skydda-btn").classList.add("d-none");
    document.getElementById("continue-btn").classList.remove("d-none");
    resetEnemy(enemy);
    document.getElementById("continue-btn").addEventListener("click", function() {
        answer.innerHTML = "";
        document.getElementById("response-xp").classList.add("d-none");
        document.getElementById("response-loot").classList.add("d-none");
        document.getElementById("continue-btn").classList.add("d-none");
    });
}

var resetEnemy = function(enemy) {
    var enemyTile = getEnemyTile(enemy);
    enemyTile.background = "#eee";
    enemy.position.row = random(10);
    enemy.position.column = random(10);
    enemy.hp = enemy.maxHP;
    updateEnemyPosition();
}

var healthColors = [
    //RED
    "#ff0000",
    //GREEN
    "#228B22",
    //YELLOW
    "#FF7F50"
]

//Random roll 0 to chosen length
function random(length) {
    var random = Math.floor(Math.random() * length);
    return random;
}

//Mob level has to be above 0
function randomMobLevel(levelRange) {
    var random = Math.floor(Math.random() * levelRange) + 1;
    return random;
}

function setCharacterHP(HP) {
    hpText.innerHTML = character.currentHP + "/" + character.maxHP;
    $("#hp-text").animate({
        color: healthColors[0]
    }, 250, function() {

        //YELLOW
        if (character.currentHP < character.maxHP / 1.5) {
            $("#hp-text").css({
                color: healthColors[2]
            });
            //RED
        }
        if (character.currentHP < character.maxHP / 3) {
            $("#hp-text").css({
                color: healthColors[0]
            });
            //GREEN
        } else {
            $("#hp-text").css({
                color: healthColors[1]
            });
        }
    });
}

function characterDeath() {
    conflict = false;
    $(".map").removeClass("d-none");
    $("#attackera-btn").addClass("d-none");
    $("#skydda-btn").addClass("d-none");
    $("#enemy-div").addClass("d-none");
    hpText.innerHTML = "0/" + character.maxHP;
    map.style.filter = "invert(100%)";
    isDead = true;
    document.getElementById("response").innerHTML = "You've died.";
}

/* Experience handling */
// Increase experience after battle.
//Setting up the Experience variables
const experienceBar = document.getElementById("experience-bar");
const experienceText = document.getElementById("experience-text");
var levelText = document.getElementById("current-level");
var experienceGained = 0;

function increaseExperience(experienceAmount) {
    experienceGained = experienceAmount;
    while (experienceAmount > 0) {
        character.experience++;
        experienceAmount--;
        if (character.experience >= character.maxExperience) {
            character.experience = 0;
            levelUp();
        }
    }
    updateXpBar();
}

function updateXpBar() {
    $("#experience-bar").progressbar({
        value: parseInt(character.experience),
        max: parseInt(character.maxExperience)
    });
    experienceText.innerHTML = character.experience + "/" + character.maxExperience;
}

function setExperience(experienceAmount) {
    character.experience = experienceAmount;
    updateXpBar();
}

// Handle level up.
function levelUp() {
    //Handle experience
    character.currentLevel++;
    levelText.innerHTML++;

    //Extra difficulty factor that starts at 29 and increases by level.
    var difficulty = function(level) {
        if (level <= 28) {
            return 0;
        } else if (level == 29) {
            return 1;
        } else if (level == 30) {
            return 3;
        } else if (level == 31) {
            return 6;
        } else if (level >= 32 && level <= 59) {
            return 5 * (character.currentLevel - 30);
        }
    };

    //Basic amount of XP earned for killing a mob of equal level.
    var mobXP = function(level) {
        return 45 + (5 * level);
    }

    //Extra difficulty reduction factor.
    var reductionFactor = function(level) {
        if (level <= 10) {
            return 1;
        } else if (level <= 11 && level <= 27) {
            return (1 - (level - 10) / 100);
        } else if (level <= 28 && level <= 59) {
            return .82;
        } else if (level <= 60) {
            return 1;
        }
    }

    character.maxExperience = ((8 * character.currentLevel) + difficulty(character.currentLevel)) * mobXP(character.currentLevel) * reductionFactor(character.currentLevel);

    $("#hp-text").css({
        color: healthColors[1]
    });

    //Handle attributes
    character.maxHP *= Math.floor((character.currentLevel / 2));
    character.currentHP = character.maxHP;
    hpText.innerHTML = character.currentHP + "/" + character.maxHP;
    updateXpBar();
}

function setLevel(level) {
    levelText.innerHTML = character.currentLevel;
}

//Handle inventory
/*Setup inventory based on the amount of inventoryslots*/
let inventoryslotsX = 4;
let inventoryslotsY = 4;
let inventoryWidth = "305px";
let inventoryHeight = "385px";
let inventory = document.createElement('div');

document.body.appendChild(inventory);

function createInventoryRow(rid) {
    var inventoryRow = document.createElement("div");
    inventoryRow.classList.add("row");
    inventoryRow.classList.add("inventory-row");
    inventoryRow.id = rid;
    inventory.appendChild(inventoryRow);
}

function createInventoryCol(rid) {
    var inventoryCol = document.createElement("div");
    var inventoryRow = document.getElementById(rid);
    inventoryCol.classList.add("col");
    inventoryCol.classList.add("inventory-slot");
    inventoryCol.classList.add("empty")
    inventoryRow.appendChild(inventoryCol);
}

for (let i = 0; i < inventoryslotsX; i++) {
    createInventoryRow("inventoryRow-" + i);
    for (let j = 0; j < inventoryslotsY; j++) {
        createInventoryCol("inventoryRow-" + i);
    }
}

var allSlots = document.getElementsByClassName("inventory-slot");

for (let i = 0; i < allSlots.length; i++) {
    allSlots[i].id = "inventoryCol-" + i;
    allSlots[i].classList.add("empty");
}

var currencyRow = document.createElement("div");
currencyRow.classList.add("row");
currencyRow.style.float = "right";
currencyRow.style.paddingRight = "15px";
inventory.appendChild(currencyRow);

var currencyColGold = document.createElement("div");
currencyColGold.classList.add("col-4");
currencyColGold.style.paddingTop = "13px";
var currencyColSilver = document.createElement("div");
currencyColSilver.classList.add("col-4");
currencyColSilver.style.paddingTop = "13px";
var currencyColCopper = document.createElement("div");
currencyColCopper.classList.add("col-4");
currencyColCopper.style.paddingTop = "13px";

currencyRow.appendChild(currencyColGold);
currencyRow.appendChild(currencyColSilver);
currencyRow.appendChild(currencyColCopper);

var goldSlot = document.createElement("div");
goldSlot.style.height = "24px";
goldSlot.style.width = "24px";
goldSlot.style.paddingRight = "24px";
goldSlot.style.display = "flex";
var goldImg = document.createElement("img");
goldImg.src = "../../images/Gold.png";
var goldText = document.createElement("p");
goldText.style.margin = 0;
goldText.style.paddingRight = "5px";
goldText.style.color = "#fff";
goldText.innerHTML = character.backpack.currency.gold;
goldSlot.appendChild(goldText);
goldSlot.appendChild(goldImg);
currencyColGold.appendChild(goldSlot);

var silverSlot = document.createElement("div");
silverSlot.style.height = "24px";
silverSlot.style.width = "24px";
silverSlot.style.display = "flex";
var silverImg = document.createElement("img");
silverImg.src = "../../images/Silver.png";
var silverText = document.createElement("p");
silverText.style.margin = 0;
silverText.style.paddingRight = "5px";
silverText.style.color = "#fff";
silverText.innerHTML = character.backpack.currency.silver;
silverSlot.appendChild(silverText);
silverSlot.appendChild(silverImg);
currencyColSilver.appendChild(silverSlot);

var copperSlot = document.createElement("div");
copperSlot.style.height = "24px";
copperSlot.style.width = "24px";
copperSlot.style.display = "flex";
var copperImg = document.createElement("img");
copperImg.src = "../../images/Copper.png";
var copperText = document.createElement("p");
copperText.style.margin = 0;
copperText.style.paddingRight = "5px";
copperText.style.color = "#fff";
copperText.innerHTML = character.backpack.currency.copper;
copperSlot.appendChild(copperText);
copperSlot.appendChild(copperImg);
currencyColCopper.appendChild(copperSlot);

var inventoryHeader = document.createElement("p");
inventoryHeader.classList.add("inventory-header");
inventory.appendChild(inventoryHeader);
inventoryHeader.innerHTML = "Inventory";
inventory.style.height = inventoryHeight;
inventory.style.width = inventoryWidth;
inventory.style.position = "absolute";
inventory.style.bottom = "-330px";
inventory.style.padding = "50px 20px 10px 20px";
inventory.style.transition = "all .5s ease-in-out";

inventory.addEventListener("mouseenter", function() {
    inventory.style.bottom = "0";
});

inventory.addEventListener("mouseleave", function() {
    inventory.style.bottom = "-330px";
});

var backpackIcon = document.createElement("img");
backpackIcon.src = "../../images/Backpack.png";
backpackIcon.style.width = "32px";
backpackIcon.style.width = "32px";
backpackIcon.position = "absolute";
inventoryHeader.appendChild(backpackIcon);

/*Handle loot drops*/
/*Item colors*/
var items = {
    names: {
        food: {
            fruit: [
                "Banana",
                "Apple",
                "Lemon",
                "Pear",
                "Strawberry"
            ],
            meat: [
                "Drumstick",
                "Fish",
                "Steak"
            ]
        },
        gear: {
            weapons: {
                swords: [
                    "Wooden Sword",
                    "Stone Sword",
                    "Iron Sword"
                ]
            }
        }
    },
    rarities: [
        "common",
        "uncommon",
        "rare",
        "epic",
        "legendary"
    ],
    rarityColors: [
        //Common
        "#bdbdbd",
        //Uncommon
        "#9ed691",
        //Rare
        "#6f77ae",
        //Epic
        "#bf6add",
        //Legendary
        "#e79f6e"
    ],
    images: {
        food: {
            fruit: [
                "url('../../images/Banana.png')",
                "url('../../images/Apple.png')",
                "url('../../images/Lemon.png')",
                "url('../../images/Pear.png')",
                "url('../../images/Strawberry.png')"
            ],
            meat: [
                "url('../../images/Drumstick.png')",
                "url('../../images/Fish.png')",
                "url('../../images/Steak.png')",
            ]
        },
        gear: {
            weapons: {
                swords: [
                    "url('../../images/Sword_wooden.png')",
                    "url('../../images/Sword_stone.png')",
                    "url('../../images/Sword_diamond.png')",
                ]
            }
        }
    }
};

var item = function(options) {
    var options = options || {};
    this.itemType = options.itemType;
    switch (this.itemType) {
        case "food":
            this.dragging = false;
            this.rarity = items.rarities[randomRarityFood()];
            this.rarityColor = items.rarityColors[items.rarities.indexOf(this.rarity)];
            if (random(2) == 1) {
                this.name = items.names.food.fruit[random(items.names.food.fruit.length)];
            } else {
                this.name = items.names.food.meat[random(items.names.food.meat.length)];
            }
            this.saturation = randomSaturation(this.rarity);

            switch (this.name) {
                case "Banana":
                    this.image = items.images.food.fruit[0];
                    break;
                case "Apple":
                    this.image = items.images.food.fruit[1];
                    break;
                case "Lemon":
                    this.image = items.images.food.fruit[2];
                    break;
                case "Pear":
                    this.image = items.images.food.fruit[3];
                    break;
                case "Strawberry":
                    this.image = items.images.food.fruit[4];
                    break;
                case "Drumstick":
                    this.image = items.images.food.meat[0];
                    break;
                case "Fish":
                    this.image = items.images.food.meat[1];
                    break;
                case "Steak":
                    this.image = items.images.food.meat[2];
                    break;
            }

            this.eat = function(inventorySlot, inventoryItem) {
                //Update characters current HP based on the foods saturation
                if (character.currentHP < character.maxHP) {
                    character.currentHP += this.saturation;
                    this.saturation = 0;
                    if (character.currentHP > character.maxHP) {
                        character.currentHP = character.maxHP;
                    }

                    setCharacterHP(character.currentHP);

                    //Remove the item from the visible inventory
                    inventoryItem.remove();
                    inventorySlot.classList.remove("occupied");
                    //Make the inventory slot empty
                    inventorySlot.classList.add("empty");

                    //Remove the item from the characters backpack
                    for (let i = 0; i < character.backpack.food.length; i++) {
                        if (character.backpack.food[i].name == this.name) {
                            character.backpack.food.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            this.tooltip = function(inventoryItem) {
                var tooltip = document.createElement("div");
                var tooltipHeader = document.createElement("p");
                var tooltipRarity = document.createElement("p");
                var tooltipDesc = document.createElement("p");
                tooltip.classList.add("d-none");
                tooltip.style.height = "200px";
                tooltip.style.width = "200px";
                tooltip.style.background = "rgba(0, 0, 0, 0.7)";
                tooltip.style.border = "1px solid #555";
                tooltip.style.zIndex = "1000";
                tooltip.style.position = "absolute";
                tooltip.style.padding = "10px 0 0 10px";
                tooltip.style.borderRadius = "7px";
                tooltip.style.top = "-215px";

                tooltipHeader.classList.add("tooltip-header");
                tooltipRarity.classList.add("tooltip-rarity");
                tooltipDesc.classList.add("tooltip-desc");
                tooltip.appendChild(tooltipHeader);
                tooltip.appendChild(tooltipRarity);
                tooltip.appendChild(tooltipDesc);
                inventoryItem.appendChild(tooltip);
                if (!this.dragging) {
                    tooltip.classList.remove("d-none");
                }
                tooltipHeader.innerHTML = this.name;
                tooltipHeader.style.color = this.rarityColor;
                tooltipRarity.innerHTML = this.itemType;
                tooltipRarity.style.color = "#fff";
                tooltipDesc.innerHTML = "Saturation: " + this.saturation;
                tooltipDesc.style.color = "#fff";
                inventoryItem.addEventListener("mouseleave", function() {
                    tooltip.classList.add("d-none");
                });
            }
            break;
        case "weapon":
            var rarityNumber = randomRarityWeapon();
            this.rarity = items.rarities[rarityNumber];
            this.damage = random(10) * (rarityNumber / 2);
            this.rarityColor = items.rarityColors[items.rarities.indexOf(this.rarity)];
            this.value = random(15) * (rarityNumber / 2);
            if (random(2) == 1) {
                this.name = items.names.gear.weapons.swords[random(items.names.gear.weapons.swords.length)];
            } else {
                this.name = items.names.gear.weapons.swords[random(items.names.gear.weapons.swords.length)];
            }

            switch (this.name) {
                case "Wooden Sword":
                    this.image = items.images.gear.weapons.swords[0];
                    break;
                case "Stone Sword":
                    this.image = items.images.gear.weapons.swords[1];
                    break;
                case "Iron Sword":
                    this.image = items.images.gear.weapons.swords[2];
                    break;
            }

            this.equip = function(inventorySlot, inventoryItem) {

            }

            this.sell = function(inventorySlot, inventoryItem) {
                //Remove the item from the visible inventory
                inventoryItem.remove();
                inventorySlot.classList.remove("occupied");
                //Make the inventory slot empty
                inventorySlot.classList.add("empty");
                character.backpack.currency.copper += this.value;
                //Remove the item from the characters backpack
                for (let i = 0; i < character.backpack.weapon.length; i++) {
                    if (character.backpack.weapon[i].name == this.name) {
                        character.backpack.weapon.splice(i, 1);
                        break;
                    }
                }
                console.log(character.backpack.currency.copper);
            }

            this.tooltip = function(inventoryItem) {
                var tooltip = document.createElement("div");
                var tooltipHeader = document.createElement("p");
                var tooltipRarity = document.createElement("p");
                var tooltipDesc = document.createElement("p");

                tooltip.classList.add("d-none");
                tooltip.style.height = "200px";
                tooltip.style.width = "200px";
                tooltip.style.background = "rgba(0, 0, 0, 0.8)";
                tooltip.style.border = "1px solid #555";
                tooltip.style.zIndex = "1000";
                tooltip.style.position = "absolute";
                tooltip.style.padding = "10px 0 0 10px";
                tooltip.style.borderRadius = "7px";
                tooltip.style.top = "-215px";

                tooltipHeader.classList.add("tooltip-header");
                tooltipHeader.style.color = this.rarityColor;
                tooltipRarity.classList.add("tooltip-rarity");
                tooltipDesc.classList.add("tooltip-desc");
                tooltip.appendChild(tooltipHeader);
                tooltip.appendChild(tooltipRarity);
                tooltip.appendChild(tooltipDesc);
                inventory.appendChild(tooltip);
                if (!this.dragging) {
                    tooltip.classList.remove("d-none");
                }
                inventoryItem.appendChild(tooltip);
                tooltipHeader.innerHTML = this.name;
                tooltipRarity.innerHTML = this.itemType;
                tooltipRarity.style.color = "#fff";
                tooltipDesc.style.color = "#fff";
                tooltipDesc.innerHTML = "Damage: " + this.damage;
                inventoryItem.addEventListener("mouseleave", function() {
                    tooltip.classList.add("d-none");
                });
            }
            break;
    }
}

function randomRarityFood() {
    var index;
    index = Math.floor(Math.random() * 2);
    return index;
}

function randomRarityWeapon() {
    var index;
    index = Math.floor(Math.random() * 5);
    return index;
}

function randomSaturation(rarity) {
    switch (rarity) {
        case "common":
            return Math.floor(Math.random() * 20) + 10;
        case "uncommon":
            return Math.floor(Math.random() * 30) + 20;
        case "rare":
            return Math.floor(Math.random() * 60) + 30;
        case "epic":
            return Math.floor(Math.random() * 100) + 60;
        case "legendary":
            return Math.floor(Math.random() * 300) + 100;
    }
}

let itemNumber = 0;

document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    if (event.target.classList.contains("empty")) {
        event.target.classList.remove("empty");
        event.target.classList.add("occupied");
        var data = event.dataTransfer.getData("div");
        event.target.appendChild(document.getElementById(data));
    }
});

function displayItem(item) {
    for (let x = 0; x < allSlots.length; x++) {
        var inventorySlot = document.getElementById("inventoryCol-" + x);
        if (inventorySlot.classList.contains("empty")) {
            itemNumber++;
            inventorySlot.style.zIndex = 999;
            var inventoryItem = document.createElement("div");
            inventoryItem.id = "item-" + itemNumber + "-" + item.itemType;
            inventoryItem.style.height = "58px";
            inventoryItem.style.width = "62px";
            inventoryItem.style.marginLeft = "-15px";
            inventoryItem.style.zIndex = 1000;
            inventoryItem.style.backgroundImage = item.image;
            inventoryItem.style.backgroundSize = "cover";
            inventoryItem.style.backgroundPosition = "center";
            inventoryItem.style.border = "2px solid " + item.rarityColor;

            inventorySlot.appendChild(inventoryItem);

            inventoryItem.setAttribute('draggable', true);

            inventoryItem.addEventListener("dragstart", function(event) {
                item.dragging = true;
                inventorySlot.classList.remove("occupied");
                inventorySlot.classList.add("empty");
                event.dataTransfer.setData("div", event.target.id);
                event.target.style.opacity = .4;
            });

            inventoryItem.addEventListener("drag", function(event) {

            });

            inventoryItem.addEventListener("dragend", function() {
                item.dragging = false;
                event.target.style.opacity = 1;
            });

            inventorySlot.classList.remove("empty");
            inventorySlot.classList.add("occupied");

            inventoryItem.addEventListener("click", function(e) {
                if (item.itemType == "food") {
                    item.eat(inventorySlot, inventoryItem);
                } else if (item.itemType == "weapon") {
                    item.equip(inventorySlot, inventoryItem);
                    if (Math.abs(salesman.position.row - character.position.row) < 2 &&
                        Math.abs(salesman.position.column - character.position.column) < 2) {
                        if (item.itemType == "weapon") {
                            item.sell(inventorySlot, inventoryItem);
                            checkCurrency(
                                item.value,
                                character.backpack.currency.copper,
                                character.backpack.currency.silver,
                                character.backpack.currency.gold
                            );
                        }
                    }
                }
            });

            inventoryItem.addEventListener("mouseenter", function() {
                item.tooltip(inventoryItem);
            });

            break;
        }
    }
}

function checkCurrency(amountGained, copper, silver, gold) {
    while (amountGained > 0) {
        amountGained--;
        copper++;
        if (copper > 99) {
            silver++;
            copper = 0;
        }
        if (silver > 99) {
            gold++;
            silver = 0;
        }
    }

    goldText.innerHTML = gold;
    silverText.innerHTML = silver;
    copperText.innerHTML = copper;
}

//Finished setting up inventory

//Character stats visuals
var characterStats = document.createElement("div");
characterStats.classList.add("d-none");
characterStats.style.height = "330px";
characterStats.style.width = "300px";
characterStats.style.background = "#333";
characterStats.style.padding = "15px 0 0 15px";
characterStats.style.borderRadius = "7px";
document.body.appendChild(characterStats);

var armorText = character.attributes.armor;
var staminaText = character.attributes.stamina;
var strengthText = character.attributes.strength;
var agilityText = character.attributes.agility;
var spiritText = character.attributes.spirit;
var intelligenceText = character.attributes.intelligence;

var armorTextStat = document.createElement("p");
armorTextStat.style.fontSize = "24px";
armorTextStat.style.color = "#fff";
armorTextStat.innerHTML = "Armor: " + armorText;

var staminaTextStat = document.createElement("p");
staminaTextStat.style.fontSize = "24px";
staminaTextStat.style.color = "#fff";
staminaTextStat.innerHTML = "Stamina: " + staminaText;

var strengthTextStat = document.createElement("p");
strengthTextStat.style.fontSize = "24px";
strengthTextStat.style.color = "#fff";
strengthTextStat.innerHTML = "Strength: " + strengthText;

var agilityTextStat = document.createElement("p");
agilityTextStat.style.fontSize = "24px";
agilityTextStat.style.color = "#fff";
agilityTextStat.innerHTML = "Agility: " + agilityText;

var spiritTextStat = document.createElement("p");
spiritTextStat.style.fontSize = "24px";
spiritTextStat.style.color = "#fff";
spiritTextStat.innerHTML = "Spirit: " + spiritText;

var intelligenceTextStat = document.createElement("p");
intelligenceTextStat.style.fontSize = "24px";
intelligenceTextStat.style.color = "#fff";
intelligenceTextStat.innerHTML = "Intelligence: " + intelligenceText;

characterStats.appendChild(armorTextStat);
characterStats.appendChild(staminaTextStat);
characterStats.appendChild(strengthTextStat);
characterStats.appendChild(agilityTextStat);
characterStats.appendChild(spiritTextStat);
characterStats.appendChild(intelligenceTextStat);

function updateCharacterStats() {
    var armorText = character.attributes.armor;
    var staminaText = character.attributes.stamina;
    var strengthText = character.attributes.strength;
    var agilityText = character.attributes.agility;
    var spiritText = character.attributes.spirit;
    var intelligenceText = character.attributes.intelligence;

    armorTextStat.innerHTML = "Defense: " + armorText;
    staminaTextStat.innerHTML = "Stamina: " + staminaText;
    strengthTextStat.innerHTML = "Strength: " + strengthText;
    agilityTextStat.innerHTML = "Agility: " + agilityText;
    spiritTextStat.innerHTML = "Spirit: " + spiritText;
    intelligenceTextStat.innerHTML = "Intelligence: " + intelligenceText;
}