const theoryData = {
  intro: `
    <h1>Hello, I'm Orbit!</h1>
    <p>
        Wireless networks are the backbone of modern connectivity. However, ensuring optimal performance is challenging due to invisible forces like <strong>Co-Channel Interference</strong>. This occurs when multiple access points compete for the same frequency channel while positioned too close to one another.
    </p>
    <div class="highlight-box">
        <strong>ORBIT</strong> is a web-based simulation tool designed to help you visualize, position, and optimize WiFi channels—specifically for the crowded 2.4GHz frequency.
    </div>
    <p>
        Through this interactive simulation, you will learn how to configure your network topology to minimize signal clashes and maximize efficiency.
    </p>`,
  interference: `<h1>Deep Dive: Signal Interference</h1>
    
    <p>
        The 2.4GHz spectrum is technically defined from 2.412 GHz to 2.484 GHz. Think of it as a narrow highway divided into 11 lanes (channels). However, unlike a real highway where lanes are painted with clear lines, radio waves differ significantly:
    </p>

    <h3 style="color: #ff8d22ff; margin-top: 20px; font-size: 1.2rem;">1. The Math of Overlap (ACI)</h3>
    <p>
        Each Wi-Fi channel requires <strong>20-22 MHz</strong> of bandwidth to transmit data effectively. However, the channels are spaced only <strong>5 MHz</strong> apart. 
        <br>
        <em>The result?</em> Massive congestion. If you drive a truck (Channel 1) that is 22 meters wide on a lane that is only 5 meters wide, you will inevitably crash into cars in lanes 2, 3, 4, and 5. This is called <strong>Adjacent-Channel Interference (ACI)</strong>, which raises background noise and corrupts data packets.
    </p>

    <h3 style="color: #ff8d22ff; margin-top: 20px; font-size: 1.2rem;">2. The Waiting Game (CCI)</h3>
    <p>
        Even worse is <strong>Co-Channel Interference (CCI)</strong>. This happens when multiple routers use the exact same channel (e.g., both on Channel 6).
        <br>
        Wi-Fi works like a "Walkie-Talkie"—only one device can talk at a time. If Router A hears Router B talking on the same channel, Router A must <strong>wait</strong> until the air is clear. This creates a digital traffic jam, causing high latency (lag).
    </p>

    <div class="highlight-box">
        <strong>The Solution:</strong> To avoid both ACI (Noise) and CCI (Traffic Jams), we use the "Non-Overlapping Rule". 
        In the 2.4GHz band, channels <strong>1, 6, and 11</strong> are the only combination that does not touch each other.
    </div>`,
  graph: `<h1>Graph Coloring Theory</h1>
<p>
    To solve the interference puzzle, we apply a mathematical concept called <strong>Graph Coloring</strong>. In this model, we translate the physical world into a logical graph:
</p>
<ul style="margin-bottom: 20px; line-height: 1.8;" class="highlight-box">
    <li><strong>Nodes (Circles):</strong> Represent the Routers/Access Points.</li>
    <li><strong>Edges (Lines):</strong> Represent the interference link. If two nodes are connected, they are too close and will interfere.</li>
    <li><strong>Colors:</strong> Represent the WiFi Channels.</li>
</ul>
<p>
    The goal is simple but challenging: <em>Assign a color (channel) to each node so that no two connected nodes share the same color.</em>
</p>`,
  optimize: `
        <h1>The DSATUR Algorithm</h1>
        <p>
            We use the <strong>DSATUR (Degree of Saturation)</strong> algorithm to assign channels automatically.
            It works by prioritizing the "most difficult" routers first—those surrounded by many neighbors 
            with different channels already assigned.
        </p>
        <h3 style="color: #FF5722; margin-top: 25px; font-size: 1.2rem;">How It Works (Step-by-Step)</h3>
    
        <ul style="margin-bottom: 20px; line-height: 1.8; list-style: none; padding-left: 0;">
          <li style="margin-bottom: 15px;">
            <strong style="color: #FFCCBC;">1. Find the "Loudest" Spot (Saturation):</strong>
            <br>
            TThis algorithm searches for the router that is already surrounded by the most <em>different</em> channels. This router is in the "most critical state" because its channel options are nearly exhausted, so it needs to be colored first!
          </li>
          <li style="margin-bottom: 15px;">
            <strong style="color: #FFCCBC;">2. Tie-Breaker (Degree):</strong>
            <br>
            If two routers are equally critical, DSATUR picks the one with the most neighbors. Why? Because fixing the "most popular" router stabilizes the largest part of the network.
          </li>
          <li>
            <strong style="color: #FFCCBC;">3. Smart Assignment:</strong>
            <br>
            Once a target router is selected, the algorithm doesn't just randomly select a color. It calculates the <strong>Interference Weight</strong> and selects the "quietest" available channel (usually 1, 6, or 11) to minimize overlap.
          </li>
        </ul>
        <p>
            This heuristic approach ensures we minimize the total interference in the network efficiently.
        </p>`,
};
const tabs = document.querySelectorAll(".tab-item");
const contentDisplay = document.querySelector(".content-area");
function loadContent(tabKey) {
  const contentHtml = theoryData[tabKey];
  contentDisplay.innerHTML = contentHtml;
  contentDisplay.style.animation = "none";
  contentDisplay.offsetHeight;
  contentDisplay.style.animation = "fadeIn 0.5s ease-out";
}
tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    tabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    const key = this.getAttribute("data-tab");
    loadContent(key);
  });
});
loadContent("intro");
