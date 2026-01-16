const DEFAULT_SETTINGS = {
  enabled: false,
  height: 80,
  color: "#ffd54f",
  opacity: 0.6,
  imageUrl: ""
};

const toggle = document.getElementById("toggle");
const heightInput = document.getElementById("height");
const heightValue = document.getElementById("height-value");
const colorInput = document.getElementById("color");
const opacityInput = document.getElementById("opacity");
const opacityValue = document.getElementById("opacity-value");
const imageInput = document.getElementById("image");
const clearImageButton = document.getElementById("clear-image");

const updateHeightLabel = (value) => {
  heightValue.textContent = `${value}px`;
};

const updateOpacityLabel = (value) => {
  opacityValue.textContent = `${Math.round(value * 100)}%`;
};

const saveSettings = (partial) => {
  chrome.storage.sync.set(partial);
};

chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  toggle.checked = settings.enabled;
  heightInput.value = settings.height;
  colorInput.value = settings.color;
  opacityInput.value = settings.opacity;
  imageInput.value = settings.imageUrl;

  updateHeightLabel(settings.height);
  updateOpacityLabel(settings.opacity);
});

toggle.addEventListener("change", (event) => {
  saveSettings({ enabled: event.target.checked });
});

heightInput.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  updateHeightLabel(value);
  saveSettings({ height: value });
});

colorInput.addEventListener("input", (event) => {
  saveSettings({ color: event.target.value, imageUrl: "" });
  imageInput.value = "";
});

opacityInput.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  updateOpacityLabel(value);
  saveSettings({ opacity: value });
});

imageInput.addEventListener("change", (event) => {
  saveSettings({ imageUrl: event.target.value });
});

clearImageButton.addEventListener("click", () => {
  imageInput.value = "";
  saveSettings({ imageUrl: "" });
});
