
// Units for each activity
const activityUnits = {
  "meat consumption": "servings",
  "dairy consumption": "servings", 
    "food waste": "servings", 
    "rice consumption": "servings", 
    "vegetable consumption": "servings",

  "car travel": "km",
  "flights": "km", 
    "public transport": "km", 
    "motorbike travel": "km",

  "electricity use": "kWh",
  "heating": "kWh", 
    "cooling": "kWh", 
    "natural gas": "kWh", 
    "water heating": "kWh",

  "plastic use": "kg",
  "paper use": "kg",
    "landfill trash": "kg",

  "shower time": "minutes",
  "shower time": "minutes",
    "dishwasher use": "minutes",

  "clothing purchases": "items",
  "electronics purchases": "items",
    "fast fashion": "items",


  "streaming video": "hours",
  "social media use": "hours",
    "cloud storage": "hours",

  "light usage": "hours",
  "appliance use": "hours",
    "smart device standby": "hours"
};

let totalEmissions = 0;
let totalActivities = 0;

// Load from localStorage on page load
window.onload = function () {
  const stored = JSON.parse(localStorage.getItem("activities")) || [];
  stored.forEach(entry => {
    totalEmissions += entry.emissions;
    totalActivities += 1;
  });
  updateStats();
  updateQuantityUnit(); // on initial load
};


function getActivityCategory(activity) {
  const categories = {
    food: ["meat consumption"],
    transport: ["car travel"],
    energy: ["electricity use"],
    waste: ["plastic use"],
    water: ["shower time"],
    shopping: ["clothing purchases"],
    digital: ["streaming video"],
    home: ["light usage"]
  };

  for (let cat in categories) {
    if (categories[cat].includes(activity)) return cat;
  }
  return "other";
}


// Show/hide custom fields based on selection
function updateQuantityUnit() {
  const activity = document.getElementById("activity").value;
  const unitLabel = document.getElementById("unitLabel");
  const customInputs = document.getElementById("customActivityInputs");

  if (activity === "other") {
    customInputs.style.display = "block";
    unitLabel.textContent = "units";
  } else {
    customInputs.style.display = "none";
    unitLabel.textContent = activityUnits[activity] || "units";
  }
}

function submitData() {
  const activitySelect = document.getElementById("activity").value;
  const quantity = parseFloat(document.getElementById("quantity").value);
  if (isNaN(quantity) || quantity <= 0) return;

  let activityName = activitySelect;
  let category = null;

  if (activitySelect === "other") {
    activityName = document.getElementById("customActivityName").value.trim();
    category = document.getElementById("category").value;
    if (!activityName || !category) return;
  } else {
    category = getActivityCategory(activityName);
  }

  const activityData = {
    activity: activityName,
    category: category,
    quantity: quantity,
    emissions: 0 // Optional placeholder — you can calculate real emissions later
  };

  // Update running totals immediately
  totalActivities += 1;
  totalEmissions += activityData.emissions || 0;

  // Save to localStorage
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.push(activityData);
  localStorage.setItem("activities", JSON.stringify(activities));

  // Reset input
  document.getElementById("quantity").value = "";
  if (activitySelect === "other") {
    document.getElementById("customActivityName").value = "";
  }

  // Update stats display immediately
  updateStats();

  console.log("Stored activities:", activities);
}


// Update stats on page
function updateStats() {
  document.getElementById("activityCount").textContent = totalActivities;
  document.getElementById("totalEmissions").textContent = totalEmissions.toFixed(2);
}


