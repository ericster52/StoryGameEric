// Each scene has some story text and a list of choices.
// The existing functions below display scenes, energy, and inventory.
const startingLocation = new URLSearchParams(window.location.search).get("location");
let currentScene = ["cottage", "tidepools", "shipwreck"].includes(startingLocation)
  ? startingLocation
  : "prologue";

// These keep repeated visits from using energy more than once.
let helpedEli = false;
let usedTunnel = false;
let usedOutsideStairs = false;

const scenes = {
  prologue: {
    title: "The Last Light",
    character: "Introduction / Prologue",
    text: `Narrator:
The storm began just before sunset. By midnight, the power across the island had gone out, and the lighthouse was dark.

You are the newest volunteer at the island's small history museum. Earlier that evening, the lighthouse keeper, Mara Vale, left you a note:

Mara's note:
“If the light goes out, find the brass key. The old lantern room must be opened before the storm reaches the shore. Don't trust the bell.”

A flash of lightning reveals a figure standing on the lighthouse balcony. Then the figure disappears.

You grab your raincoat and step into the storm.`,
    choices: [
      { text: "Go to the Keeper's Cottage", nextScene: "cottage" },
      { text: "Search the Tide Pools", nextScene: "tidepools" },
      { text: "Head toward the Shipwreck", nextScene: "shipwreck" }
    ]
  },

  cottage: {
    title: "The Keeper's Cottage",
    character: "Location 1",
    text: `The cottage door swings open in the wind. Inside, papers cover a desk, and a lantern flickers beside a half-finished cup of tea.

Narrator:
A muddy footprint crosses the wooden floor. On the desk, you find a page torn from Mara's journal.

Journal page:
“The light is not broken. Someone turned it off from inside the lantern room. The key is still where I left it—unless the sea has taken it.”

A radio crackles.

Mara:
“Hello? Can anyone hear me? I'm near the old bell tower. The signal keeps cutting out. Whatever you do, don't ring the bell.”

A crash comes from somewhere outside.`,
    choices: [
      {
        text: "Search the desk for clues",
        action: function () {
          if (!inventory.includes("island map")) pickUpItem("island map");
        },
        nextScene: "desk"
      },
      { text: "Follow the muddy footprints toward the Bell Tower", nextScene: "bellTower" },
      { text: "Leave and go to the Tide Pools", nextScene: "tidepools" }
    ]
  },

  desk: {
    title: "The Island Map",
    character: "Narrator",
    text: `You find a small map of the island. The lighthouse is marked with a circle. Beneath it, Mara wrote: “The key opens more than a door.”`,
    choices: [
      { text: "Follow the footprints toward the Bell Tower", nextScene: "bellTower" },
      { text: "Look for the key at the Tide Pools", nextScene: "tidepools" }
    ]
  },

  tidepools: {
    title: "The Tide Pools",
    character: "Location 2",
    text: `The tide pools shine under flashes of lightning. Waves crash over the rocks, and seawater rushes between them.

Narrator:
You spot something metallic caught between two rocks. As you reach for it, a wave surges over your boots.`,
    choices: [
      {
        text: "Reach into the water and grab it",
        action: function () {
          if (inventory.includes("brass key")) {
            updateScene("keyAlreadyFound");
          } else {
            pickUpItem("brass key");
            updateHealth(-10);
            updateScene("keyFound");
          }
        }
      },
      {
        text: "Look for a safer way around the rocks",
        action: function () {
          if (!inventory.includes("red cloth")) pickUpItem("red cloth");
        },
        nextScene: "safePath"
      },
      {
        text: "Leave the tide pools and head to the Shipwreck",
        action: function () { updateScene(helpedEli ? "emptyWreck" : "shipwreck"); }
      }
    ]
  },

  keyFound: {
    title: "The Brass Key",
    character: "Narrator",
    text: `You pull out a brass key. Its handle is shaped like a small sun.

As soon as you pick up the key, the lighthouse flashes once, even though its lamp should be dark.

The cold water costs you 10 energy. On the path out, a strip of red cloth flutters from a rock toward the bell tower.`,
    choices: [
      { text: "Follow the red cloth toward the Bell Tower", nextScene: "bellTower" },
      {
        text: "Go to the Shipwreck",
        action: function () { updateScene(helpedEli ? "emptyWreck" : "shipwreck"); }
      }
    ]
  },

  keyAlreadyFound: {
    title: "Back at the Tide Pools",
    character: "Narrator",
    text: "You already have the brass key. There is no reason to reach into the cold water again.",
    choices: [
      { text: "Follow the shore toward the Bell Tower", nextScene: "bellTower" },
      { text: "Go to the Cliff Path and Sea Cave", nextScene: "cliffPath" },
      {
        text: "Go to the Shipwreck",
        action: function () { updateScene(helpedEli ? "emptyWreck" : "shipwreck"); }
      }
    ]
  },

  safePath: {
    title: "A Safer Path",
    character: "Narrator",
    text: `You find a dry path between the rocks. A strip of red cloth is caught on a sharp piece of stone. It may have come from someone's coat.`,
    choices: [
      { text: "Follow the red cloth toward the Bell Tower", nextScene: "bellTower" },
      {
        text: "Go to the Shipwreck",
        action: function () { updateScene(helpedEli ? "emptyWreck" : "shipwreck"); }
      },
      { text: "Return to the water to look for the key", nextScene: "tidepools" }
    ]
  },

  shipwreck: {
    title: "The Shipwreck",
    character: "Location 3",
    text: `The wreck lies at the edge of the shore, half-buried in sand. Its broken mast points toward the dark lighthouse.

Narrator:
A voice calls from inside the wreck.

Eli:
“Hey! Over here! I'm stuck!”

You climb through the torn side of the ship and find Eli, a young islander, trapped beneath a fallen beam.

Eli:
“I was looking for Mara. I heard the bell ring, then the lighthouse went dark. Someone ran toward the cliffs.”`,
    choices: [
      {
        text: "Help Eli lift the beam",
        action: function () {
          if (!helpedEli) {
            updateHealth(-10);
            helpedEli = true;
          }
        },
        nextScene: "eliHelped"
      },
      { text: "Ask Eli what he knows before helping", nextScene: "eliAsked" },
      { text: "Leave Eli and continue toward the Cliff Path", nextScene: "cliffPath" }
    ]
  },

  eliAsked: {
    title: "Eli's Warning",
    character: "Eli",
    text: `Eli explains that the bell tower connects to an old tunnel beneath the lighthouse.

“I don't know why someone would ring the bell. But Mara always said it was a warning. If you hear it again, don't follow it.”`,
    choices: [
      {
        text: "Help Eli and go together to the Cliff Path",
        action: function () {
          if (!helpedEli) {
            updateHealth(-10);
            helpedEli = true;
          }
        },
        nextScene: "eliHelped"
      },
      { text: "Leave Eli and head to the Cliff Path alone", nextScene: "cliffPath" }
    ]
  },

  eliHelped: {
    title: "Eli Is Free",
    character: "Eli and Narrator",
    text: `Together, you lift the beam. Eli stands and brushes sand from his jacket.

Eli:
“Thanks. I saw someone carrying a lantern near the caves. If you're looking for the key, the keeper used to hide things in the rocks.”

Narrator:
Eli joins you and points toward the Cliff Path. Lifting the beam costs you 10 energy.`,
    choices: [
      { text: "Go with Eli to the Cliff Path", nextScene: "eliLeaves" }
    ]
  },

  emptyWreck: {
    title: "Back at the Shipwreck",
    character: "Narrator",
    text: "The beam has been lifted, and the wreck is empty. You already helped Eli get free. The cliff path leads toward the sea cave.",
    choices: [
      { text: "Go to the Cliff Path", nextScene: "cliffPath" },
      { text: "Return to the Tide Pools", nextScene: "tidepools" }
    ]
  },

  eliLeaves: {
    title: "Along the Cliffs",
    character: "Narrator",
    text: `You and Eli reach the sea cave. A lantern glows inside.

“I'll check the upper path,” Eli says. He slips away into the rain as you enter the cave.`,
    choices: [
      { text: "Follow the lantern light into the cave", nextScene: "cliffPath" }
    ]
  },

  bellTower: {
    title: "The Bell Tower",
    character: "Location 4",
    text: `The bell tower leans over the cliffs. Its wooden door is open, and the bell swings gently in the wind.

Narrator:
A figure stands at the top of the stairs. You recognize Mara's yellow raincoat—but you can't see the person's face.

Mara:
“You came. Good. The lighthouse needs its key.”

The bell begins to swing harder, though no one touches it.`,
    choices: [
      { text: "Call out, “Mara, prove it's really you.”", nextScene: "questionFigure" },
      { text: "Climb the stairs and help the figure", nextScene: "towerStairs" },
      { text: "Step outside and inspect the tower", nextScene: "inspectTower" }
    ]
  },

  questionFigure: {
    title: "The Figure in the Tower",
    character: "Figure and Narrator",
    text: `The figure pauses.

Figure:
“You don't have time for questions. The light must be lit.”

Narrator:
You notice the figure's boots are dry, even though the storm has soaked everything outside.`,
    choices: [
      { text: "Refuse to follow the figure and go to the Cliff Path", nextScene: "cliffPath" },
      { text: "Follow the figure toward the Lighthouse", nextScene: "followFigure" }
    ]
  },

  towerStairs: {
    title: "At the Top of the Stairs",
    character: "Narrator",
    text: `You climb toward the yellow raincoat. Before you can help, the figure turns away.

“Come to the lighthouse,” the figure says, slipping down a narrow back stair. The bell swings above your head.`,
    choices: [
      { text: "Follow the figure toward the Lighthouse", nextScene: "followFigure" },
      { text: "Leave the tower and take the Cliff Path", nextScene: "cliffPath" }
    ]
  },

  followFigure: {
    title: "A Figure in the Rain",
    character: "Narrator",
    text: `You follow the figure toward the lighthouse, but it disappears around a bend in the cliff path.

Below the path, a lantern glows in a sea cave. You hear Mara calling from inside.`,
    choices: [
      { text: "Enter the sea cave and find Mara", nextScene: "cliffPath" }
    ]
  },

  inspectTower: {
    title: "The Broken Bell Rope",
    character: "Narrator",
    text: `You find a broken rope attached to the bell. Someone has pulled it recently. Beneath the rope is another note in Mara's handwriting:

Mara's note:
“If the bell rings, someone wants you away from the lighthouse.”

You head toward the Cliff Path.`,
    choices: [
      { text: "Continue to the Cliff Path", nextScene: "cliffPath" }
    ]
  },

  cliffPath: {
    title: "The Cliff Path and Sea Cave",
    character: "Location 5",
    text: `The path narrows along the cliffs. Below, waves crash against the rocks. A small opening in the cliff leads into a sea cave.

Narrator:
Inside the cave, you find Mara sitting beside a lantern. She looks tired but unharmed.

Mara:
“I'm glad you found me. Someone locked me out of the lighthouse and rang the bell to draw people away.”`,
    choices: [
      { text: "Tell Mara about the figure in the bell tower", nextScene: "maraFigure" },
      { text: "Ask Mara why the lighthouse matters so much", nextScene: "maraLight" },
      {
        text: "Show Mara the brass key, if you found it",
        action: function () { updateScene(inventory.includes("brass key") ? "maraKey" : "maraNoKey"); }
      }
    ]
  },

  maraFigure: {
    title: "That Wasn't Mara",
    character: "Mara",
    text: `Mara's face goes pale.

“That wasn't me. The tower has been empty for years.”`,
    choices: [
      { text: "Ask why the lighthouse matters", nextScene: "maraLight" },
      {
        text: "Talk to Mara about the brass key",
        action: function () { updateScene(inventory.includes("brass key") ? "maraKey" : "maraNoKey"); }
      }
    ]
  },

  maraLight: {
    title: "A Boat in the Storm",
    character: "Mara and Narrator",
    text: `Mara looks toward the storm outside.

Mara:
“The light guides boats away from the rocks. If it stays dark, the fishing boat out there may not make it back.”

A distant horn sounds from the ocean.`,
    choices: [
      {
        text: "Talk to Mara about the brass key",
        action: function () { updateScene(inventory.includes("brass key") ? "maraKey" : "maraNoKey"); }
      }
    ]
  },

  maraKey: {
    title: "A Chance to Light the Lamp",
    character: "Mara",
    text: `Mara recognizes the brass key immediately.

“You found it. Then we still have a chance to light the lamp.”`,
    choices: [
      { text: "Go with Mara to the Lighthouse", nextScene: "lighthouse" },
      { text: "Search the cave for another entrance", nextScene: "caveTunnel" },
      { text: "Return to the Tide Pools", nextScene: "tidepools" }
    ]
  },

  maraNoKey: {
    title: "Another Way Inside",
    character: "Mara",
    text: `Mara searches her coat pockets and shakes her head.

“The key must be near the shore. Without it, we'll have to find another way into the lantern room.”`,
    choices: [
      { text: "Go with Mara to the Lighthouse", nextScene: "lighthouse" },
      { text: "Search the cave for another entrance", nextScene: "caveTunnel" },
      { text: "Return to the Tide Pools to look for the key", nextScene: "tidepools" }
    ]
  },

  caveTunnel: {
    title: "The Cave Tunnel",
    character: "Narrator",
    text: "You find a narrow tunnel that leads to the lighthouse's lower level. It is dark and slippery, but it may be the only way inside.",
    choices: [
      {
        text: "Take the tunnel with Mara",
        action: function () {
          if (!usedTunnel) {
            updateHealth(-10);
            usedTunnel = true;
          }
        },
        nextScene: "lowerTunnel"
      },
      { text: "Go to the Lighthouse's main entrance", nextScene: "lighthouse" },
      { text: "Return to the Tide Pools to look for the key", nextScene: "tidepools" }
    ]
  },

  lighthouse: {
    title: "The Lighthouse",
    character: "Location 6",
    text: `The lighthouse rises above the island, its windows dark against the storm. You and Mara reach the entrance as thunder rolls overhead.

Mara:
“The lantern room is at the top. We need to get there before the boat reaches the rocks.”

If the door is locked, you can return to the Tide Pools for the key or use the lower tunnel through the sea cave.`,
    choices: [
      { text: "Use the brass key, if you have it", action: unlockDoor },
      {
        text: "Try the lower entrance through the sea cave",
        action: function () {
          if (!usedTunnel) {
            updateHealth(-10);
            usedTunnel = true;
          }
        },
        nextScene: "lowerTunnel"
      },
      {
        text: "Climb the outside stairs to the lantern room",
        action: function () {
          if (!usedOutsideStairs) {
            updateHealth(-10);
            usedOutsideStairs = true;
          }
        },
        nextScene: "outsideStairs"
      },
      { text: "Return to the Tide Pools to look for the key", nextScene: "tidepools" }
    ]
  },

  solution: {
    title: "Inside the Lighthouse",
    character: "Narrator and Mara",
    text: `The key fits the lighthouse door. It turns with a loud click.

Narrator:
Inside, you find a staircase spiraling up into darkness. At the top, the lantern room is cold and silent.

Mara:
“The lamp needs to be turned by hand. I'll prepare the fuel. You start the mechanism.”`,
    choices: [
      { text: "Approach the lamp", nextScene: "lanternRoom" }
    ]
  },

  lowerTunnel: {
    title: "Beneath the Lighthouse",
    character: "Narrator",
    text: `You arrive beneath the lighthouse stairs. The stone passage is flooded to your knees. The first trip through the cold water costs 10 energy.

A shadow moves above you. Someone is already inside the lighthouse.`,
    choices: [
      { text: "Call out to Mara", nextScene: "callMara" },
      { text: "Move quietly up the stairs", nextScene: "quietStairs" },
      { text: "Return through the tunnel and find another way in", nextScene: "lighthouse" }
    ]
  },

  callMara: {
    title: "Mara Answers",
    character: "Mara",
    text: `“I'm here,” Mara calls from the passage behind you. “Stay close. We need to reach the lamp.”

Together, you climb the staircase toward the lantern room.`,
    choices: [
      { text: "Enter the lantern room", nextScene: "lanternRoom" }
    ]
  },

  quietStairs: {
    title: "Up the Dark Staircase",
    character: "Narrator",
    text: "You move quietly up the stairs. Mara follows with her lantern. The shadow slips through the doorway at the top.",
    choices: [
      { text: "Enter the lantern room", nextScene: "lanternRoom" }
    ]
  },

  outsideStairs: {
    title: "The Outside Stairs",
    character: "Narrator",
    text: "You grip the wet railing and climb against the wind. Mara follows close behind. The first climb costs 10 energy. At the top, a side door opens into the lantern room.",
    choices: [
      { text: "Enter the lantern room", nextScene: "lanternRoom" },
      { text: "Return to the main entrance", nextScene: "lighthouse" }
    ]
  },

  lanternRoom: {
    title: "The Lantern Room",
    character: "Final Choice",
    text: `At the top of the lighthouse, the great lamp waits in the center of the room. Rain lashes the windows. Far out at sea, a boat's lights struggle against the waves.

A shadow stands beside the lamp.

Stranger:
“If you light it, the island will never be safe again.”

Mara:
“Don't listen. The light is what keeps people safe.”`,
    choices: [
      { text: "Light the lamp", nextScene: "endingLight" },
      {
        text: "Ask the stranger who they are",
        action: function () {
          if (!helpedEli) {
            scenes.endingSecret.text = scenes.endingSecret.text.replace(
              "It is Eli.",
              "It is Eli. He managed to free himself from the wreck and reach the tower."
            );
          }
        },
        nextScene: "endingSecret"
      },
      { text: "Leave the lamp dark and go after the stranger", nextScene: "endingStorm" }
    ]
  },

  endingLight: {
    title: "The Light Returns",
    character: "Ending 1",
    text: `Narrator:
You pull the lever. The mechanism groans, then turns. The lamp bursts into life, sending a bright beam across the water.

The boat changes course and steers away from the rocks.

The shadow at the window vanishes.

Mara:
“You did it. The island is safe tonight.”

Narrator:
By morning, the storm has passed. The lighthouse stands bright above the shore. You still don't know who tried to stop you, but you know the light will be watched more carefully from now on.

Ending: The lighthouse is saved.`,
    choices: [
      { text: "Play again", action: function () { window.location.href = "game.html"; } }
    ]
  },

  endingSecret: {
    title: "The Secret in the Tower",
    character: "Ending 2",
    text: `Narrator:
The stranger lowers their hood. It is Eli.

Eli:
“I'm sorry. I thought if the lighthouse stayed dark, the town would finally close it. The cliffs are dangerous, and people keep risking their lives to reach it.”

Mara:
“You could have told us. A boat is still out there.”

Together, you light the lamp. The beam reaches the water just in time to guide the boat home.

Narrator:
The next day, the islanders meet to decide how to protect the lighthouse and the people who live near it. Eli stays to help repair the bell tower.

Ending: The truth comes out, and the island begins to change.`,
    choices: [
      { text: "Play again", action: function () { window.location.href = "game.html"; } }
    ]
  },

  endingStorm: {
    title: "Lost in the Storm",
    character: "Ending 3",
    text: `Narrator:
The shadow slips through the doorway and disappears down the stairs. You follow, but the lighthouse shakes in the wind. A crash echoes below.

By the time you return to the lantern room, the boat has vanished into the storm.

At dawn, the waves are calm, but no one knows where the boat went.

Mara:
“We'll keep searching. And next time, we'll be ready.”

Narrator:
The lighthouse remains dark. The island is quiet, but the mystery of the missing light is far from over.

Ending: The storm takes the final choice out of your hands.`,
    choices: [
      { text: "Play again", action: function () { window.location.href = "game.html"; } }
    ]
  }
};

// --------------------------------------------------
// UPDATE SCENES
// Read through the comments below to see what this section does
//
// TO CUSTOMIZE THIS SECTION
// 1) add a new const variable for each new field you added above
// Make sure to match the ids used in your mock up with the fields 
// 2) set the .textContent of each variable to the corresponding field in the scene object
// Use sceneTitle as a model
// --------------------------------------------------

// First, we create variables to hold the references to the HTML elements
// Technically you could just use document.getElementById('id-name') 
// in the function itself, but that would be very wordy 
// and make the code harder to read
const sceneTitle = document.getElementById("scene-title");
const sceneText = document.getElementById("scene-text");
const choicesContainer = document.getElementById("choices-container");
const characterName = document.getElementById("character-name");

// Then, we create a function to update the scene,
function updateScene(sceneName) {

  //This update the variable currentScene with the new scene passed as a parameter
  currentScene = sceneName;

  //This accesses the scene object based on the scene name
  const scene = scenes[sceneName];

  // Here, for each html element, you change the textContent to match
  // the appropriate text from the scene object
  sceneTitle.textContent = scene.title;
  sceneText.textContent = scene.text;
  characterName.textContent = scene.character;

  // Clear the old buttons before creating new ones
  choicesContainer.innerHTML = "";

  // Loop through each choice in the scene, connecting an action and nextScene if included
  scene.choices.forEach(function (choice) {
    const button = document.createElement("button");

    button.textContent = choice.text;

    button.addEventListener("click", function () {
      if (choice.action) {
        choice.action();
      }

      if (choice.nextScene) {
        updateScene(choice.nextScene);
      }
    });

    choicesContainer.appendChild(button);
  });
}

// This updates the screen with the current scene
updateScene(currentScene);


// --------------------------------------------------
// HEALTH
// Read through the comments below to see what this section does
//
// TO CUSTOMIZE THIS SECTION
// Either customize the name from health to steps, stress, etc...
// OR
// create a copy of each step for each additional state you want to track throughout the game
// --------------------------------------------------

// Create a variable for health
let health = 100;

// Display current health
const healthDisplay = document.getElementById("health-display");

// Create a function to update health 
function updateHealth(amount) {
  health += amount;
  healthDisplay.textContent = health;
}

// This refreshes the health display
updateHealth(0);

// --------------------------------------------------
// INVENTORY
// Read through the comments below to see what this section does
//
// For now, you are probably leaving this section as is. 
// --------------------------------------------------

// Create a variable for inventory
let inventory = [];

// Display current inventory
const inventoryDisplay = document.querySelector("#inventory-display");
const messageDisplay = document.getElementById("message-display");

// Create a function to update inventory 
function pickUpItem(itemName) {
    // Add itemName to the inventory array
    // Show the updated inventory on the page
  inventory.push(itemName);
  inventoryDisplay.textContent = inventory.join(", ");
}

// --------------------------------------------------
// CONDITIONAL 
// Depending on how you want to implement the conditional logic, you may 
// simply adjust the names below or you may need to expand upon this section
// --------------------------------------------------

// Create a function that checks if the inventory contains one item and if so shows the win condition scene.
function unlockDoor() {
  if (inventory.includes("brass key")) {
    updateScene("solution");
  } else {
    messageDisplay.textContent = "The door is locked.";
  }
}


// Clear old feedback before a new choice runs.
choicesContainer.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    messageDisplay.textContent = "";
  }
}, true);

// Keep keyboard users at the start of the new scene.
choicesContainer.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    sceneTitle.focus();
  }
});