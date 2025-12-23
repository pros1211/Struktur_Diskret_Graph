/* --- SETUP CONFIG SCROLL --- */
const startBtn = document.getElementById("start");
const simSection = document.getElementById("simulation-section");

if (startBtn && simSection) {
  startBtn.addEventListener("click", () => {
    simSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* --- 1. CONFIG PARTICLES --- */
tsParticles.load("tsparticles", {
  background: { color: { value: "#222831" } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" },
      // mode grab membuat garis ke mouse
      onHover: { enable: true, mode: "grab" },
      resize: true,
    },
    modes: {
      push: { quantity: 4 },
      grab: { distance: 200, line_linked: { opacity: 1 } },
    },
  },
  particles: {
    color: { value: "#FFA500" },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1.3,
      direction: "none",
      outModes: { default: "bounce" },
    },
    number: { density: { enable: true, area: 800 }, value: 70 },
    opacity: { value: 0.5 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
});

const width = window.innerWidth;
const height = window.innerHeight;
const radius_Interference = 150;

let nodes = [];
let links = [];
let nodeIdCounter = 0;
// svg container untuk graph
const svg = d3
  .select("#visual-container")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%");

const gLink = svg.append("g").attr("class", "links");
const gNode = svg.append("g").attr("class", "nodes");
// simulation d3
const simulation = d3
  .forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-100))
  .force("collide", d3.forceCollide().radius(20))
  .on("tick", ticked);

svg.on("click", function (event) {
  if (event.target.closest(".orbit-sidebar")) return;

  if (event.target.tagName === "circle") return;

  const [x, y] = d3.pointer(event);
  addNode(x, y);
});

function addNode(x, y) {
  const newNode = {
    id: nodeIdCounter++,
    label: String.fromCharCode(65 + nodeIdCounter - 1),
    x: x,
    y: y,
    fx: x,
    fy: y,
  };
  nodes.push(newNode);

  recalculateLinks();
  updateGraph();

  updateList();
}

function recalculateLinks() {
  links = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      const distanceX = nodeA.x - nodeB.x;
      const distanceY = nodeA.y - nodeB.y;
      const totalDist = Math.sqrt(
        distanceX * distanceX + distanceY * distanceY
      );

      if (totalDist < radius_Interference) {
        links.push({ source: nodeA, target: nodeB, distance: totalDist });
      }
    }
  }
}

function ticked() {
  gLink
    .selectAll("line")
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  gNode.selectAll(".node").attr("transform", (d) => `translate(${d.x},${d.y})`);
}

function updateGraph() {
  // Update Links
  gLink
    .selectAll("line")
    .data(links, (d) => `${d.source.id}-${d.target.id}`)
    .join("line")
    .attr("class", "link")
    .attr("stroke", "#45A29E")
    .attr("stroke-width", 2)
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  // Update Nodes
  gNode
    .selectAll(".node")
    .data(nodes, (d) => d.id)
    .join((enter) => {
      const g = enter.append("g").attr("class", "node");

      // node
      g.append("circle")
        .attr("r", 15)
        .attr("fill", "#1F2833")
        .attr("stroke", "#FF5722")
        .attr("stroke-width", 2);

      // Label node
      g.append("text")
        .attr("dy", -20)
        .attr("text-anchor", "middle")
        .style("fill", "white") // Warna teks putih
        .style("font-family", "sans-serif")
        .text((d) => d.label);

      //  Drag
      g.call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

      return g;
    })
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  simulation.nodes(nodes);
  simulation.alpha(0.3).restart();
}

// --- DRAG EVENTS ---
function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;

  const coordInfo = document.getElementById("coordInfo");
  if (coordInfo)
    coordInfo.innerText = `X: ${Math.round(d.x)}, Y: ${Math.round(d.y)}`;

  recalculateLinks();
  updateGraph();
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = event.x;
  d.fy = event.y;
}

function updateList() {
  const list = document.getElementById("router-list");
  const counter = document.getElementById("counter");

  if (!list) return;
  list.innerHTML = "";

  if (counter) counter.innerText = nodes.length;

  nodes.forEach((node) => {
    const li = document.createElement("li");
    li.style.padding = "5px";
    li.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
    li.style.color = "white";
    li.innerHTML = `<b>${node.label}</b> <small>(${Math.round(
      node.x
    )}, ${Math.round(node.y)})</small>`;
    list.appendChild(li);
  });
}
