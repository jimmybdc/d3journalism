// Step 0: Set up our chart
//= ================================
var svgWidth = 800;
var svgHeight = 500;

var margin = { top: 40, right: 40, bottom: 40, left: 40 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart = svg.append("g");

// Append a div to the bodyj to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from the CSV file and execute everything below
d3.csv("data/data.csv", function(err, housing) {
  if (err) throw err;

  housing.forEach(function(data) {
    data.forRent = +data.forRent*100;
    data.ownerOccupied = +data.ownerOccupied*100;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // These variables store the minimum and maximum values in a column in data.csv
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // This function identifies the minimum and maximum values in a column in hairData.csv
  // and assign them to xMin and xMax variables, which will define the axis domain
  
    xMin = d3.min(housing, function(data) {
      return +data.forRent * 0.8;
    });

    xMax = d3.max(housing, function(data) {
      return +data.forRent * 1.1;
    });

    yMin = d3.min(housing, function(data) {
        return +data.ownerOccupied * 0.8;
      });

    yMax = d3.max(housing, function(data) {
      return +data.ownerOccupied * 1.1;
    });


  // Set the domain of an axis to extend from the min to the max value of the data column
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);

  // Initialize tooltip
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    // Define position
    .offset([80, -60])
    // The html() method allows us to mix JavaScript with HTML in the callback function
    .html(function(data) {
      var state = data.state;
      var forRent = +data.forRent*100;
      var ownerOccupied = +data.ownerOccupied*100;
      var labelForRent ="% Units for Rent: ";
      var labelOwnerOccupied ="% Unit Occupied by Owner: ";

      return state +
        "<br>" +
        labelForRent +
        forRent + 
        "%" +
        "<br>" +
        labelOwnerOccupied +
        ownerOccupied +
        "%" ;
    });

  // Create tooltip
  chart.call(toolTip);

  chart
    .selectAll("circle")
    .data(housing)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
      return xLinearScale(+data.forRent);
    })
    .attr("cy", function(data, index) {
      return yLinearScale(data.ownerOccupied);
    })
    .attr("r", "15")
    .attr("fill", "#E75480")
    // display tooltip on click
    .on("click", function(data) {
      toolTip.show(data);
    })
    // hide tooltip on mouseout
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Append an SVG group for the x-axis, then display the x-axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    // The class name assigned here will be used for transition effects
    .attr("class", "x-axis")
    .call(bottomAxis);

  // Append a group for y-axis, then display it
  chart.append("g").call(leftAxis);

  // Append y-axis label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left-5)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "ownerOccupied")
    .text("% of Units Owner Occupied");

  // Append x-axis labels
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + (width / 2)+ " ," + (height + margin.top) + ")"
    )
    .attr("class", "axis-text")
    .attr("data-axis-name", "forRent")
    .text("% of Units Available for Rent");

   
});
