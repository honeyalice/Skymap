var config = {
    width: 200,
    location: false,
    interactive: false,
    controls: false,
    projection: "airy",
    datapath: "../data/",
    lines: {
      graticule: { show: false },
      equatorial: { show: false },
      ecliptic: { show: false },
      galactic: { show: false },
      supergalactic: { show: false }
    },
    planets: {
      show: false,
    },
    background: {
      fill: 'black',
      stroke: "#ffffff",
      opacity: 1,
      width: 1,
    },
    constellations: {
      show: false,
      names: false,
      lines: true,
      lineStyle: { stroke: "#cccccc", width: 0.5, opacity: 0.6 },
      bounds: false,
      boundStyle: { stroke: "#ccff00", width: 1.0, opacity: 0.8, dash: [4,4] }
    },
    mw: {
      show: true,
      style: { fill: "#ffffff", opacity: "0.15" }
    },
    stars: {
      show: true,
      limit: 5,
      names: false,
      colors: false,
      style: { fill: "#ffffff", opacity: 1 },
      designation: false,
      propername: false,
      size: 2,
      exponent: -0.28,
      data: "stars.6.json"
    },
    dsos:{
      show: false,
    }
  };

  Celestial.display(config);




  var map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var marker = L.marker([0, 0]).addTo(map);

  function updateMap(lat, lng, zoom = 10) {
    map.flyTo([lat, lng], zoom, {
      duration: 1.5, // Duration of the animation in seconds
      easeLinearity: 0.5, // Easing function used for the animation
});
     marker.setLatLng([lat, lng]);
}

function formatCoords(lat, lng) {
    // Determine the cardinal directions
    let latDirection = lat >= 0 ? "N" : "S";
    let lngDirection = lng >= 0 ? "E" : "W";

    // Format the latitude and longitude values to absolute and fix them to 4 decimal places
    let formattedLat = Math.abs(lat).toFixed(6) + "°" + latDirection;
    let formattedLng = Math.abs(lng).toFixed(6) + "°" + lngDirection;

    // Combine the formatted latitude and longitude
    return `${formattedLat} ${formattedLng}`;
}

  

  document.getElementById("location-input").addEventListener("input", function() {
    var query = this.value;
    if (query.length > 2) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${'AIzaSyC79MpQsFPmVSHXmWPkCzeOpAv5JZXZb04'}`)
        .then(response => response.json())
        .then(data => {
          var suggestions = document.getElementById("location-suggestions");
          suggestions.innerHTML = "";

          if (data.results && data.results.length > 0) {
            data.results.forEach(item => {
              var li = document.createElement("li");
              li.textContent = item.formatted_address;
              li.addEventListener("click", function() {
                document.getElementById("location-input").value = item.formatted_address;
                document.getElementById("location-name").textContent = item.formatted_address;
                suggestions.innerHTML = "";
                var lat = item.geometry.location.lat;
                var lng = item.geometry.location.lng;
                document.getElementById("location-coords").textContent = formatCoords(lat, lng);
                Celestial.skyview({ "location": [lat, lng] });
                updateMap(lat, lng, 10);
              });
              suggestions.appendChild(li);
            });
          } else {
            console.log("No location suggestions found.");
          }
        });
    }
  });

  document.getElementById("date-input").addEventListener("change", function() {
    var date = new Date(this.value);
    var options = { month: 'long', day: 'numeric', year: 'numeric' };
    var formattedDate = date.toLocaleString('en-US', options);
    document.getElementById("date").textContent = formattedDate;


    Celestial.skyview({ "date": date });

  });

  document.getElementById("custom-text").addEventListener('input', function() {
    var customText = this.value;
    if (customText !== "") {
      document.getElementById("customtext").innerHTML = customText;
    } else {
     document.getElementById("customtext").innerHTML = "Start typing :)";
    }
  });
  document.getElementById("custom-name").addEventListener('input', function() {
    var customText = this.value;
    if (customText !== "") {
      document.getElementById("name").innerHTML = customText;
    } else {
     document.getElementById("name").innerHTML = "Start typing :)";
    }
  });


  document.getElementById("constellation-lines-toggle").addEventListener("change", function() {
var showConstellationLines = this.checked;
config.constellations.lines = showConstellationLines;
Celestial.apply(config);
});

document.getElementById("background-color-picker").addEventListener("input", function() {
var backgroundColor = this.value;
config.background.fill = backgroundColor;
Celestial.apply(config);
});


// Function to update poster background color
function updatePosterBackgroundColor() {
    var backgroundColor = document.getElementById("poster-background-color-picker").value;
    document.querySelector(".poster-background").style.backgroundColor = backgroundColor;
    document.querySelector(".poster-frame").style.borderColor = backgroundColor;

  }
  // Attach event listeners to the color inputs
  document.getElementById("poster-background-color-picker").addEventListener("input", updatePosterBackgroundColor);
  

  function updatePosterFontColor() {
    var backgroundColor = document.getElementById("font-color-picker").value;
    document.getElementById("celestial-info").style.color = backgroundColor;

  }
  // Attach event listeners to the color inputs
  document.getElementById("font-color-picker").addEventListener("input", updatePosterFontColor);
  

document.getElementById("milky-way-toggle").addEventListener("change", function() {
var showMilkyWay = this.checked;
config.mw.show = showMilkyWay;
Celestial.apply(config);
});

function changeFontStyle(selectElement) {
    var selectedFont = document.getElementById("input-font").value; // Get the selected font from the dropdown
    var selectedFontSize = document.getElementById("input-font-size").value;

    document.getElementById("customtext").style.fontFamily = selectedFont; // Apply the font
    document.getElementById("customtext").style.fontSize = selectedFontSize;

  }
  

  function saveAsImage() {
    const findEl = document.getElementById('celestial-poster');
    const scale = 8; // Set the scale factor to 2 to double the resolution
  
    html2canvas(findEl, {
      scale: scale, // Use the scale factor in the html2canvas options
      useCORS: true // Enable CORS to ensure proper image rendering
    }).then((canvas) => {
      const dataURL = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG format with high quality
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.download = "celestialmap.jpg";
      link.href = dataURL;
      link.click();
      link.remove();
    });
  }