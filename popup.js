document.getElementById("activate").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: activateHoverTool,
  });
});

document.getElementById("copyColors").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyAllPageColors,
  });
});

// Functions injected into page
function activateHoverTool() {
  document.body.addEventListener("mouseover", (e) => {
    if (e.target) {
      const computedStyle = window.getComputedStyle(e.target);
      const font = computedStyle.fontFamily;
      const color = computedStyle.color;

      let tooltip = document.getElementById("inspector-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "inspector-tooltip";
        document.body.appendChild(tooltip);
      }
      tooltip.style.position = "fixed";
      tooltip.style.top = e.clientY + 10 + "px";
      tooltip.style.left = e.clientX + 10 + "px";
      tooltip.style.background = "#333";
      tooltip.style.color = "#fff";
      tooltip.style.padding = "5px 10px";
      tooltip.style.borderRadius = "5px";
      tooltip.style.fontSize = "12px";
      tooltip.style.zIndex = 9999;
      tooltip.innerText = `Font: ${font}\nColor: ${color}`;
    }
  });

  document.body.addEventListener("mouseout", () => {
    const tooltip = document.getElementById("inspector-tooltip");
    if (tooltip) tooltip.remove();
  });
}

function copyAllPageColors() {
  const allElements = document.querySelectorAll("*");
  const colors = new Set();
  allElements.forEach((el) => {
    const style = window.getComputedStyle(el);
    colors.add(style.color);
    colors.add(style.backgroundColor);
  });

  const colorsList = Array.from(colors).filter(
    (c) => c && c !== "rgba(0, 0, 0, 0)"
  );
  navigator.clipboard
    .writeText(colorsList.join("\n"))
    .then(() => {
      alert("Page colors copied to clipboard!");
    })
    .catch((err) => {
      alert("Failed to copy colors: " + err);
    });
}
