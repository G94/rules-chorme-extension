const DEFAULT_SETTINGS = {
  enabled: false,
  height: 80,
  color: "#ffd54f",
  opacity: 0.6,
  imageUrl: ""
};

let ruler = null;
let lastY = 0;

const createRuler = () => {
  ruler = document.createElement("div");
  ruler.id = "reading-ruler-extension";
  ruler.style.position = "fixed";
  ruler.style.left = "0";
  ruler.style.top = "0";
  ruler.style.width = "100%";
  ruler.style.pointerEvents = "none";
  ruler.style.zIndex = "2147483647";
  ruler.style.boxShadow = "0 0 0 9999px rgba(0,0,0,0.15)";
  ruler.style.borderTop = "2px solid rgba(0,0,0,0.15)";
  ruler.style.borderBottom = "2px solid rgba(0,0,0,0.15)";

  const marker = document.createElement("div");
  marker.style.position = "absolute";
  marker.style.right = "24px";
  marker.style.top = "50%";
  marker.style.transform = "translateY(-50%)";
  marker.style.width = "14px";
  marker.style.height = "14px";
  marker.style.borderRadius = "50%";
  marker.style.background = "rgba(0, 0, 0, 0.4)";
  marker.style.boxShadow = "0 0 0 4px rgba(255, 255, 255, 0.6)";

  ruler.appendChild(marker);
  document.documentElement.appendChild(ruler);
};

const applySettings = (settings) => {
  if (!ruler) {
    return;
  }

  ruler.style.height = `${settings.height}px`;
  ruler.style.background = settings.imageUrl
    ? `center / cover no-repeat url(${settings.imageUrl})`
    : settings.color;
  ruler.style.opacity = settings.opacity.toString();
};

const updatePosition = (clientY) => {
  if (!ruler) {
    return;
  }

  const y = Math.max(0, Math.min(window.innerHeight, clientY));
  lastY = y;
  const height = ruler.getBoundingClientRect().height;
  const top = Math.max(0, Math.min(window.innerHeight - height, y - height / 2));
  ruler.style.top = `${top}px`;
};

const toggleRuler = (enabled, settings) => {
  if (!enabled) {
    if (ruler) {
      ruler.remove();
      ruler = null;
    }
    return;
  }

  if (!ruler) {
    createRuler();
  }

  applySettings(settings);
  updatePosition(lastY || window.innerHeight / 2);
};

chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  toggleRuler(settings.enabled, settings);
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") {
    return;
  }

  const updated = { ...DEFAULT_SETTINGS };
  Object.keys(changes).forEach((key) => {
    updated[key] = changes[key].newValue;
  });

  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    toggleRuler(settings.enabled, { ...settings, ...updated });
  });
});

window.addEventListener("mousemove", (event) => {
  if (!ruler) {
    return;
  }
  updatePosition(event.clientY);
});

window.addEventListener("scroll", () => {
  if (!ruler) {
    return;
  }
  updatePosition(lastY);
});
