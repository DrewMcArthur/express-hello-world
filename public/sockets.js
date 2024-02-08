const socket = io();

let messagesEl = document.getElementById("messages");

function getEmoji(kind) {
  const options = [
    "🌱",
    "🌿",
    "🍀",
    "🍄",
    "🍃",
    "💐",
    "🌷",
    "🌹",
    "🌼",
    "💐",
    "🌷",
    "🌹",
    "🌼",
    "🌸",
    "🌺",
    "🪷",
    "🪻",
    "🌻",
    "💐",
    "🌷",
    "🌹",
    "🌼",
    "💐",
    "🌷",
    "🌹",
    "🌼",
    "🌸",
    "🌺",
    "🪷",
    "🪻",
    "🌻",
    "💐",
    "🌷",
    "🌹",
    "🌼",
    "💐",
    "🌷",
    "🌹",
    "🌼",
    "🌸",
    "🌺",
    "🪷",
    "🪻",
    "🌻",
    "💐",
    "🌷",
    "🌹",
    "🌼",
    "💐",
    "🌷",
    "🌹",
    "🌼",
    "🌸",
    "🌺",
    "🪷",
    "🪻",
    "🌻",
  ];
  const index = kind % options.length;
  return options[index];
}

function addFlower(flower) {
  const emoji = getEmoji(flower.kind);
  messagesEl.innerHTML += `<div class='flower' style='left: ${flower.location.x}px; top: ${flower.location.y}px;'>${emoji}</div>`;
}

socket.on("connect", () => {
  console.log("connected");
  socket.emit("msg", "from client");
});

socket.on("initial_flowers", (flowers) => {
  console.log("initial_flowers: ", flowers);
  flowers.forEach((flower) => {
    addFlower(flower);
  });
});

socket.on("num_connected", (n) => {
  console.log("num_connected: ", n);
  document.getElementById("nConnections").innerHTML = n;
});

socket.on("new_flower", (flower) => {
  console.log("new_flower: ", flower);
  addFlower(flower);
});

document.getElementById("clear").addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("clear");
});

document.addEventListener("click", (e) => {
  console.log("Click!:", e);
  if (e.target == document.getElementById("clear")) return;
  data = { x: e.x, y: e.y };
  socket.emit("click", data);
});

socket.on("clear", () => {
  messagesEl.innerHTML = "";
});
