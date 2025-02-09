var mymap = L.map("mapid").setView([27.7618, 0.3828], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(mymap);
var markers = [];
var heatLayer;
var addressElements = [];
var initialData = [];
var hideTimeout;
function showImagePreview(src) {
  clearTimeout(hideTimeout);
  previewImg.src = src;
  imagePreview.style.display = "block";
}
function hideImagePreview() {
  hideTimeout = setTimeout(function () {
    imagePreview.style.display = "none";
  }, 500);
}
document
  .getElementById("imagePreview")
  .addEventListener("mouseover", function () {
    clearTimeout(hideTimeout);
  });
document
  .getElementById("imagePreview")
  .addEventListener("mouseout", function () {
    hideImagePreview();
  });
function visualizeData(apiData) {
  document.getElementById("showHistogramButton").disabled = false;
  initialData = apiData;
  var addressList = document.getElementById("addressList");
  addressList.innerHTML = "";
  markers = [];
  var heatmapData = [];
  let minScore = Infinity;
  let maxScore = -Infinity;
  var baseHues = [];
  var baseHue;
  let addressElements = [];
  apiData.forEach(function (imageData) {
    Object.values(imageData).forEach(function (data) {
      data.geo_predictions.forEach(function (prediction) {
        minScore = Math.min(minScore, prediction.score);
        maxScore = Math.max(maxScore, prediction.score);
      });
    });
  });
  apiData.forEach(function (imageData, objectIndex) {
    var imagePath = Object.keys(imageData)[0];
    var fileName = imagePath.split("/").pop();
    var serverRelativeImagePath = "images/" + fileName;

    let counter = 0;
    do {
      baseHue = Math.random() * 360;
      counter++;
    } while (baseHues.some((hue) => Math.abs(hue - baseHue) < 33) && counter < 50);
    baseHues.push(baseHue);
    var objectHue = baseHue % 360;
    Object.values(imageData).forEach(function (data) {
      data.geo_predictions.forEach(function (prediction, index) {
        var lat = prediction.coordinates[0];
        var lon = prediction.coordinates[1];
        var address = prediction.address;
        var color = `hsl(${objectHue}, 100%, 50%)`;
        var markerHtmlStyles = `
                                background-color: ${color};
                                width: 15px;
                                height: 15px;
                                display: block;
                                position: relative;
                                transform: translate(-25%, -25%);
                                border-radius: 50%;
                                border: 2px solid black;
                                box-shadow: 0 0 13px rgba(0, 0, 0, 0.23);
                            `;
        var markerColor = color;
        var icon = L.divIcon({
          className: "custom-icon",
          iconAnchor: [5, 5],
          html: `<div style="${markerHtmlStyles}" class="marker-icon" id="marker-${objectIndex}-${index}"></div>`,
        });
        var marker = L.marker([lat, lon], { icon: icon })
          .addTo(mymap)
          .bindTooltip(
            `
                                    <div>
                                        <strong>Filename:</strong> ${fileName}<br/>
                                        <strong>Address:</strong> ${address}<br/>
                                        <strong>Confidence:</strong> ${prediction.score}
                                    </div>
                                    `,
            {
              permanent: false,
              direction: "auto",
            }
          )
          .on("click", function () {
            mymap.setView([lat, lon], 19);
          })
          .on("mouseover", function () {
            showImagePreview(serverRelativeImagePath);
            var iconElement = document.getElementById(
              `marker-${objectIndex}-${index}`
            );
            if (iconElement) {
              iconElement.style.backgroundColor = "black";
            }
          })
          .on("mouseout", function () {
            hideImagePreview();
            var iconElement = document.getElementById(
              `marker-${objectIndex}-${index}`
            );
            if (iconElement) {
              iconElement.style.backgroundColor = markerColor;
            }
          });
        markers.push({
          marker,
          address,
          elementId: `marker-${objectIndex}-${index}`,
        });

        var addressElement = document.createElement("div");
        addressElement.innerHTML = `<b>File Name:</b> ${fileName}<br>
                            <b>Address:</b> ${address}<br>
                            <b>Prediction Score:</b> ${prediction.score}`;
        addressElement.className = "address-item";
        addressElement.dataset.address = address.toLowerCase();
        addressElement.dataset.fileName = fileName;
        addressElement.dataset.score = prediction.score;
        addressElement.dataset.markerId = `marker-${objectIndex}-${index}`;
        addressElement.marker = marker;
        addressElement.onmouseover = function () {
          showImagePreview(serverRelativeImagePath);
          this.marker.openTooltip();
          var iconElement = document.getElementById(
            `marker-${objectIndex}-${index}`
          );
          if (iconElement) {
            iconElement.style.backgroundColor = "black";
          }
        };
        addressElement.onmouseout = function () {
          hideImagePreview();
          this.marker.closeTooltip();
          var iconElement = document.getElementById(
            `marker-${objectIndex}-${index}`
          );
          if (iconElement) {
            iconElement.style.backgroundColor = markerColor;
          }
        };
        addressElement.onclick = function () {
          mymap.setView([lat, lon], 19);
        };
        addressList.appendChild(addressElement);

        const finalScore =
          (prediction.score - minScore) / (maxScore - minScore);
        heatmapData.push([lat, lon, finalScore]);
      });
    });
  });
  if (heatLayer) {
    mymap.removeLayer(heatLayer);
  }
  heatLayer = L.heatLayer(heatmapData, {
    radius: 43,
    blur: 15,
    max: 1.0,
    gradient: { 0.4: "blue", 0.6: "lime", 1: "red" },
  }).addTo(mymap);
  var minScoreTwo = Math.min(...heatmapData.map((item) => item[2]));
  var maxScoreTwo = Math.max(...heatmapData.map((item) => item[2]));
  function scoreToPercentage(score) {
    return ((score - minScoreTwo) / (maxScoreTwo - minScoreTwo)) * 100;
  }
  function getColor(d) {
    return d > 75 ? "red" : d > 50 ? "lime" : d > 25 ? "blue" : "#FFEDA0";
  }
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 25, 50, 75, 100],
      labels = [],
      from,
      to;
    div.id = "legend";
    div.innerHTML = "<h3>Heatmap Legend</h3>";
    div.innerHTML += "<h4>Overall Certainty</h4>";
    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];
      labels.push(
        '<i style="background:' +
          getColor(from + 1) +
          '; width: 10px; height: 10px; display: inline-block;"></i> ' +
          from +
          "%" +
          (to ? "&ndash;" + to + "%" : "+")
      );
    }
    div.innerHTML += labels.join("<br>");
    return div;
  };
  if (!document.getElementById("legend")) {
    legend.addTo(mymap);
  }
}
function sortAndDisplayAddresses(sortType) {
  addressElements = [...document.querySelectorAll(".address-item")];
  var addressList = document.getElementById("addressList");
  while (addressList.firstChild) {
    addressList.removeChild(addressList.firstChild);
  }
  if (sortType === "scoreAsc") {
    addressElements.sort((a, b) => {
      const scoreA = parseFloat(a.dataset.score);
      const scoreB = parseFloat(b.dataset.score);
      return scoreA < scoreB ? -1 : scoreA > scoreB ? 1 : 0;
    });
  } else if (sortType === "nameAsc") {
    addressElements.sort((a, b) => {
      const nameA = a.dataset.fileName;
      const nameB = b.dataset.fileName;
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
  }
  addressElements.forEach((element) => addressList.appendChild(element));
}
document.getElementById("sortOptions").addEventListener("change", function () {
  sortAndDisplayAddresses(this.value);
});
document.getElementById("loadButton").addEventListener("click", function () {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var apiData = JSON.parse(e.target.result);
      mymap.eachLayer(function (layer) {
        if (!layer._url) mymap.removeLayer(layer);
      });
      visualizeData(apiData);
    };
    reader.readAsText(file);
  } else {
    alert("Please select a JSON file first.");
  }
});
document.getElementById("searchInput").addEventListener("input", function (e) {
  var searchTerm = e.target.value.toLowerCase();
  markers.forEach(function (item) {
    var markerContent = item.marker.getTooltip().getContent().toLowerCase();
    if (markerContent.includes(searchTerm)) {
      item.marker._icon.style.display = "block";
    } else {
      item.marker._icon.style.display = "none";
    }
  });
  var addressItems = document.querySelectorAll(".address-item");
  addressItems.forEach(function (item) {
    var itemContent = item.innerText.toLowerCase();
    if (itemContent.includes(searchTerm)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});
function showHistogram(data) {
  document.getElementById("mapid").style.display = "none";
  document.getElementById("visualization").style.display = "block";
  document.getElementById("visualization").innerHTML = "";
  document.getElementById("addressList").style.display = "none";
  var visualizationElement = document.getElementById("visualization");
  var visualizationWidth = visualizationElement.offsetWidth;
  var visualizationHeight = 500;
  var scores = [];
  data.forEach(function (imageData) {
    Object.values(imageData).forEach(function (details) {
      details.geo_predictions.forEach(function (prediction) {
        scores.push(prediction.score);
      });
    });
  });
  var svg = d3
    .select("#visualization")
    .append("svg")
    .attr("width", visualizationWidth)
    .attr("height", visualizationHeight);
  var margin = { top: 10, right: 30, bottom: 50, left: 80 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var maxScore = d3.max(scores);
  var x = d3
    .scaleLinear()
    .domain([0, maxScore + 0.005])
    .range([0, width]);
  var bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(20))(scores);
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(bins, function (d) {
        return d.length;
      }),
    ])
    .range([height, 0]);
  var colorScale = d3.scaleSequential(d3.interpolateBlues).domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]);
  var bar = g
    .selectAll(".bar")
    .data(bins)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function (d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    });
  bar
    .append("rect")
    .attr("x", 1)
    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
    .attr("height", function (d) {
      return height - y(d.length);
    })
    .attr("fill", function (d) {
      return colorScale(d.length);
    })
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "orange");
      tooltip.style("visibility", "visible").text("Count: " + d.length);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function (event, d) {
      d3.select(this).attr("fill", colorScale(d.length));
      tooltip.style("visibility", "hidden");
    });
  bar
    .append("text")
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
    .attr("text-anchor", "middle")
    .style("fill", "#fff")
    .style("font-size", "12px")
    .text(function (d) {
      return d.length;
    });
  var xAxis = g
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));
  xAxis
    .append("text")
    .attr("fill", "#000")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Confidence Scores");
  var yAxis = g
    .append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).tickSizeOuter(0));
  yAxis
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Frequency");
  g.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
    .attr("opacity", 0.3)
    .selectAll("line")
    .attr("stroke", "darkgray")
    .attr("stroke-dasharray", "2,2");
  g.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height).tickFormat(""))
    .attr("opacity", 0.3)
    .selectAll("line")
    .attr("stroke", "darkgray")
    .attr("stroke-dasharray", "2,2");
  var tooltip = d3.select(".tooltip");
  if (tooltip.empty()) {
    tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("padding", "10px")
      .style("background", "rgba(0, 0, 0, 0.75)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .style("font-size", "14px")
      .style("text-align", "center");
  }
  var zoom = d3
    .zoom()
    .scaleExtent([1, 5])
    .translateExtent([
      [-margin.left, -margin.top],
      [width + margin.right, height + margin.bottom],
    ])
    .on("zoom", zoomed);
  svg.call(zoom);
  function zoomed(event) {
    g.attr("transform", event.transform);
    xAxis.call(d3.axisBottom(x).scale(event.transform.rescaleX(x)));
    yAxis.call(d3.axisLeft(y).scale(event.transform.rescaleY(y)));
  }
}
function showMap() {
  document.getElementById("mapid").style.display = "block";
  document.getElementById("visualization").style.display = "none";
  document.getElementById("addressList").style.display = "block";
  document.getElementById("sortOptions").disabled = false;
  document.getElementById("searchInput").disabled = false;
}
document.getElementById("showMapButton").addEventListener("click", function () {
  showMap();
});
document
  .getElementById("showHistogramButton")
  .addEventListener("click", function () {
    showHistogram(initialData);
    document.getElementById("sortOptions").disabled = true;
    document.getElementById("searchInput").disabled = true;
  });
showMap();
