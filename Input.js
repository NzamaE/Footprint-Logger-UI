// Define the units used for each tracked activity
const actUnits = {
  // Food-related
  "meat consumption": "servings",
  "dairy consumption": "servings",
  "food waste": "servings",
  "rice consumption": "servings",
  "vegetable consumption": "servings",

  // Transportation
  "car travel": "km",
  "flights": "km",
  "public transport": "km",
  "motorbike travel": "km",

  // Energy usage
  "electricity use": "kWh",
  "heating": "kWh",
  "cooling": "kWh",
  "natural gas": "kWh",
  "water heating": "kWh",

  // Waste materials
  "plastic use": "kg",
  "paper use": "kg",
  "landfill trash": "kg",

  // Water and appliance use
  "shower time": "minutes",
  "dishwasher use": "minutes",

  // Shopping habits
  "clothing purchases": "items",
  "electronics purchases": "items",
  "fast fashion": "items",

  // Digital activities
  "streaming video": "hours",
  "social media use": "hours",
  "cloud storage": "hours",

  // Home devices
  "light usage": "hours",
  "appliance use": "hours",
  "smart device standby": "hours"
};

// Track totals
let totEmissions = 0;
let totActivities = 0;

// Load stored activity data from localStorage when the page loads
window.onload = function () {
  const savedActivities = JSON.parse(localStorage.getItem("activities")) || [];

  savedActivities.forEach(entry => {
    totEmissions += entry.emissions || 0; // Assumes each entry has an 'emissionActivities += 1;
  });

  updateStatsDisplay();
  updateQuantityUnit(); // Set the unit label on page load
};

// Map activity names to broader categories
function getActivityCategory(activity) {
  const categoryMap = {
    food: [
      "meat consumption", "dairy consumption", "food waste", "rice consumption", "vegetable consumption"
    ],
    transport: [
      "car travel", "flights", "public transport", "motorbike travel"
    ],
    energy: [
      "electricity use", "heating", "cooling", "natural gas", "water heating"
    ],
    waste: [
      "plastic use", "paper use", "landfill trash"
    ],
    water: [
      "shower time", "dishwasher use"
    ],
    shopping: [
      "clothing purchases", "electronics purchases", "fast fashion"
    ],
    digital: [
      "streaming video", "social media use", "cloud storage"
    ],
    home: [
      "light usage", "appliance use", "smart device standby"
    ]
  };

  for (let category in categoryMap) {
    if (categoryMap[category].includes(activity)) {
      return category;
    }
  }
  return "other";
}

// Show or hide custom activity inputs and update the unit label
function updateQuantityUnit() {
  const selectedActivity = document.getElementById("activity").value;
  const unitLabel = document.getElementById("unitLabel");
  const customInputs = document.getElementById("customActivityInputs");

  if (selectedActivity === "other") {
    customInputs.style.display = "block";
    unitLabel.textContent = "units";
  } else {
    customInputs.style.display = "none";
    unitLabel.textContent = actUnits[selectedActivity] || "units";
  }
}

// Handle form submission and save activity
function submitData() {
  const selectedActivity = document.getElementById("activity").value;
  const quantity = parseFloat(document.getElementById("quantity").value);

  if (isNaN(quantity) || quantity <= 0) return; // Invalid input

  let activityName = selectedActivity;
  let category = null;

  if (selectedActivity === "other") {
    activityName = document.getElementById("customActivityName").value.trim();
    category = document.getElementById("category").value;

    if (!activityName || !category) return; // Missing custom info
  } else {
    category = getActivityCategory(activityName);
  }

  const newActivity = {
    activity: activityName,
    category: category,
    quantity: quantity,
    emissions: 0 // Default for now — can be calculated later
  };

  // Save to localStorage
  const allActivities = JSON.parse(localStorage.getItem("activities")) || [];
  allActivities.push(newActivity);
  localStorage.setItem("activities", JSON.stringify(allActivities));

  // Clear form fields
  document.getElementById("quantity").value = "";
  if (selectedActivity === "other") {
    document.getElementById("customActivityName").value = "";
  }

  console.log("Stored activities:", allActivities);
}

// Display stats like total count and emissions
function updateStatsDisplay() {
  document.getElementById("activityCount").texActivities;
  document.getElementById("totEmissions").textContent = totEmissions.toFixed(2);
}
