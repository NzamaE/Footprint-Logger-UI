const activityCategories = {
  food: [
    "meat consumption", 
    "dairy consumption", 
    "food waste", 
    "rice consumption", 
    "vegetable consumption"
  ],
  transport: [
    "car travel", 
    "flights", 
    "public transport", 
    "motorbike travel"
  ],
  energy: [
    "electricity use", 
    "heating", 
    "cooling", 
    "natural gas", 
    "water heating"
  ],
  waste: [
    "plastic use",
    "paper use",
    "landfill trash"
  ],
  water: [
    "water usage",
    "shower time",
    "dishwasher use"
  ],
  shopping: [
    "clothing purchases",
    "electronics purchases",
    "fast fashion"
  ],
  digital: [
    "streaming video",
    "social media use",
    "cloud storage"
  ],
  home: [
    "light usage",
    "appliance use",
    "smart device standby"
  ],
  other: []
};



const emissionFactors = {
  // Transport
  "car travel": 0.2,
  "flights": 0.15,
  "public transport": 0.05,
  "motorbike travel": 0.12,

  // Food
  "meat consumption": 5,
  "dairy consumption": 2.5,
  "food waste": 1.2,
  "rice consumption": 2.7,
  "vegetable consumption": 0.4,

  // Energy
  "electricity use": 0.5,
  "heating": 2.1,
  "cooling": 1.7,
  "natural gas": 2.8,
  "water heating": 1.3,

  // Waste
  "plastic use": 6,         // per kg
  "paper use": 1.1,
  "landfill trash": 3.2,

  // Water
  "water usage": 0.002,     // per liter
  "shower time": 0.1,       // per minute
  "dishwasher use": 1.5,    // per cycle

  // Shopping
  "clothing purchases": 30,     // per item
  "electronics purchases": 100, // per device
  "fast fashion": 20,           // per item

  // Digital
  "streaming video": 0.2,       // per hour
  "social media use": 0.1,      // per hour
  "cloud storage": 2.5,         // per TB/month

  // Home
  "light usage": 0.05,          // per hour
  "appliance use": 0.4,         // per hour
  "smart device standby": 0.01  // per hour
};

// Handle the addition of custom activity
function addCustomActivity(activityName, category, emissionFactor) {
  // Check if the category exists, if not, create it
  if (!activityCategories[category]) {
    activityCategories[category] = [];
  }
  // Add custom activity to the category
  activityCategories[category].push(activityName);
  
  // Add custom emission factor for the activity
  emissionFactors[activityName] = emissionFactor;
  console.log(`Custom activity "${activityName}" added to category "${category}" with emission factor: ${emissionFactor}`);
}

// Get the category for a given activity
function getActivityCategory(activity) {
  for (let category in activityCategories) {
    if (activityCategories[category].includes(activity)) {
      return category;
    }
  }
  return null; // If no category is found
}

// Core emissions data storage
let emissionsData = {
  food: 0,
  transport: 0,
  energy: 0,
  waste: 0,
  water: 0,
  shopping: 0,
  digital: 0,
  home: 0,
  other: 0
};

// Function to calculate emissions based on activity and quantity
function calculateEmissions(activity, quantity) {
  if (emissionFactors[activity]) {
    return emissionFactors[activity] * quantity;
  }
  return 0; // If no emissions factor is found
}


let emissionsByActivity = {}; // To store emissions per activity

// Function to add emissions and update the emissionsData object
function addEmissions(activity, quantity) {
  const category = getActivityCategory(activity);
  const emissions = calculateEmissions(activity, quantity);

  if (category) {
    emissionsData[category] += emissions;

    // Update per-activity emissions
    if (!emissionsByActivity[activity]) {
      emissionsByActivity[activity] = 0;
    }
    emissionsByActivity[activity] += emissions;

    console.log(`Activity: ${activity}`);
    console.log(`Quantity: ${quantity}`);
    console.log(`Category: ${category}`);
    console.log(`Emissions added: ${emissions} kg CO₂`);
    console.log("Updated emissions data:", emissionsData);
    console.log("Updated activity data:", emissionsByActivity);
    console.log('-------------------------');
  } else {
    console.log(`Activity "${activity}" not recognized or categorized.`);
  }
}

// Destroy previous bar chart before redrawing
let barChartInstance = null;


function updateCategoryBarChart(category) {
  if (!category || !activityCategories[category]) return;

  const labels = [];
  const values = [];

  activityCategories[category].forEach(activity => {
    if (emissionsByActivity[activity]) {
      labels.push(activity);
      values.push(emissionsByActivity[activity]);
    }
  });

  if (barChartInstance) {
    barChartInstance.destroy();
  }

  barChartInstance = new Chart("myBarChart", {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        backgroundColor: labels.map(() => getRandomColor()),
        data: values
      }]
    },
    options: {
      title: {
        display: true,
        text: `Emissions Breakdown: ${category.charAt(0).toUpperCase() + category.slice(1)}`
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "kg CO₂"
          }
        }
      }
    }
  });



    // Scroll smoothly to the bar chart canvas:
  const barChartElement = document.getElementById('myBarChart');
  if (barChartElement) {
    barChartElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



// Load user-input data from localStorage
const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];

storedActivities.forEach(({ activity, quantity }) => {
  addEmissions(activity, quantity);
});



                // 20 times charged

console.log(emissionsData); // Final emissions data





function populateCategoryDropdown() {
  const dropdown = document.getElementById("categoryFilter");
  Object.keys(activityCategories).forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    dropdown.appendChild(option);
  });
}

populateCategoryDropdown();










var xValues = Object.keys(emissionsData);   // ['food', 'transport', 'energy', 'other']
var yValues = Object.values(emissionsData); // [10, 11, 5, 0] or whatever your app calculates

var barColors = [
  "#b91d47", // food
  "#00aba9", // transport
  "#2b5797", // energy
  "#e8c3b9", // waste
  "#1e7145", // water
  "#f39c12", // shopping
  "#8e44ad", // digital
  "#16a085", // home
  "#7f8c8d"  // other
];


new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: "Your Carbon Emissions by Category (kg CO₂)"
    }
  }
});




storedActivities.forEach(({ activity, quantity }) => {
  addEmissions(activity, quantity);
});

// Calculate the running total of emissions
const totalEmissions = Object.values(emissionsData).reduce((acc, val) => acc + val, 0);

// Store in localStorage
localStorage.setItem("totalEmissions", totalEmissions.toFixed(2));

// Optional: Log it
console.log("Running Total Emissions:", totalEmissions.toFixed(2), "kg CO₂");


// Get stored total emissions
const total = localStorage.getItem("totalEmissions");
if (total && document.getElementById("emissionsValue")) {
  document.getElementById("emissionsValue").textContent = total;
}
