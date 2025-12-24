const startBtn = document.getElementById("start");
const simSection = document.getElementById("simulation-section");

if (startBtn && simSection) {
  startBtn.addEventListener("click", () => {
    simSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

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
// function for input
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

// update graph
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
const channelColors = {
  1: "#FF0000", // Merah (Ch 1)
  2: "#FF4500",
  3: "#FF8C00",
  4: "#FFA500",
  5: "#FFD700",
  6: "#00FF00", // Hijau (Ch 6)
  7: "#00FA9A",
  8: "#00CED1",
  9: "#1E90FF",
  10: "#0000FF",
  11: "#8A2BE2", // ch 11
};
function getInterferenceWeight(ch1, ch2) {
  if (!ch1 || !ch2) return 0;
  const diff = Math.abs(ch1 - ch2);
  // weight difference of distance of the channel
  if (diff === 0) return 1.0; //very bad
  if (diff === 1) return 0.8;
  if (diff === 2) return 0.5;
  if (diff === 3) return 0.2;
  if (diff === 4) return 0.1;
  return 0.0; // perfect
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// TSC-DSATUR algorithm for coloring
async function runDSATUR() {
  if (nodes.length === 0) {
    alert("Please add Router First");
    return;
  }
  const calcBtn = document.getElementById("calculate");
  const originalText = calcBtn.innerText;
  calcBtn.disabled = true;
  calcBtn.innerText = "Processing...";
  calcBtn.style.opacity = "0.7";
  // initialize stat for every router
  nodes.forEach((node) => {
    // channel wifi null
    node.channel = null;
    // number of neighbor node colored
    node.saturation = 0;
    // number of neighbor
    node.degree = 0;
  });
  links.forEach((link) => {
    link.source.degree = (link.source.degree || 0) + 1;
    link.target.degree = (link.target.degree || 0) + 1;
  });
  // filter every node that never colored
  const uncolored = () => nodes.filter((n) => n.channel === null);
  while (uncolored().length > 0) {
    // select node with the biggest number of neighbor
    let selectedNode = uncolored().sort((a, b) => {
      if (b.saturation !== a.saturation) return b.saturation - a.saturation;
      return b.degree - a.degree;
    })[0];
    // animation for each coloring
    gNode
      .selectAll("circle")
      .filter((d) => d.id === selectedNode.id)
      .attr("stroke", "#FFFF00")
      .attr("stroke-width", 5)
      .attr("r", 20);

    await sleep(500);
    // loop for channel 1 to 11
    let bestChannel = 1;
    let minInterference = Infinity;
    for (let ch = 1; ch <= 11; ch++) {
      let currentInterference = 0;
      // list every neighbor for selected node
      const neighbors = links
        .filter(
          (l) =>
            l.source.id === selectedNode.id || l.target.id === selectedNode.id
        )
        .map((l) => (l.source.id === selectedNode.id ? l.target : l.source));
      // calculate interference for each neighbor to selected node
      neighbors.forEach((neighbor) => {
        if (neighbor.channel !== null) {
          currentInterference += getInterferenceWeight(ch, neighbor.channel);
        }
      });

      if (currentInterference < minInterference) {
        minInterference = currentInterference;
        bestChannel = ch;
      }
    }
    selectedNode.channel = bestChannel;
    selectedNode.totalInterference = minInterference;
    updateGraphColors();
    await sleep(500);
    // UPDATE SATURATION DEGREE for each neighbor
    const neighbors = links
      .filter(
        (l) =>
          l.source.id === selectedNode.id || l.target.id === selectedNode.id
      )
      .map((l) => (l.source.id === selectedNode.id ? l.target : l.source));

    neighbors.forEach((neighbor) => {
      // calculate unique number of neighbor colored
      const neighborOfNeighbor = links
        .filter(
          (l) => l.source.id === neighbor.id || l.target.id === neighbor.id
        )
        .map((l) => (l.source.id === neighbor.id ? l.target : l.source));

      const uniqueColors = new Set(
        neighborOfNeighbor.map((n) => n.channel).filter((c) => c !== null)
      );
      neighbor.saturation = uniqueColors.size;
    });
  }
  showResultModal();
  calcBtn.disabled = false;
  calcBtn.innerText = originalText;
  calcBtn.style.opacity = "1";
}
// update color graph
function updateGraphColors() {
  gNode
    .selectAll("circle")
    .transition()
    .duration(300)
    .attr("fill", (d) => (d.channel ? channelColors[d.channel] : "#1F2833"))
    .attr("r", 15)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);
}
// function minimize table
function toggleMinimize() {
  const panel = document.getElementById("result-table");
  const btn = document.querySelector(".min-btn");

  // Toggle class CSS
  panel.classList.toggle("minimized");

  if (panel.classList.contains("minimized")) {
    btn.innerHTML = "+";
  } else {
    btn.innerHTML = "−";
  }
}
// close table function
function closeTable() {
  document.getElementById("result-table").style.display = "none";
}
// table function
function showResultModal() {
  const modal = document.getElementById("result-table");
  const tbody = document.getElementById("resultBody");
  tbody.innerHTML = "";

  nodes.forEach((node) => {
    const row = document.createElement("tr");

    const bg = channelColors[node.channel];
    const textColor =
      node.channel === 5 || node.channel === 11 ? "white" : "black";

    row.innerHTML = `
            <td><b>${node.label}</b></td>
            <td><span class="channel-badge" style="background:${bg}; color:${textColor}">Channel ${
      node.channel
    }</span></td>
            <td>${node.totalInterference.toFixed(1)}</td>
        `;
    tbody.appendChild(row);
  });

  modal.style.display = "block";
  modal.classList.remove("minimized");
  document.querySelector(".min-btn").innerHTML = "−";
}

document.getElementById("calculate").addEventListener("click", runDSATUR);
