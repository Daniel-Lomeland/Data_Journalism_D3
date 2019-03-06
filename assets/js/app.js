// Section: I

// Get the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// height of the graph
var height = width - width / 3.9;

// Spacing of Margin for graph
var margin = 10;

// space for placing words
var labelArea = 90;

// padding text for bottom and left axes
var tPadBot = 30;
var tPadLeft = 50;

// Actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Radius for each dot 
var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// Axes Labels

// a) bottom axes labels.
svg.append("g").attr("class", "xText");

var xText = d3.select(".xText");

// Width of the window changes.
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
    ((width - labelArea) / 2 + labelArea) +
    ", " +
    (height - margin - tPadBot) +
    ")"
  );
}
xTextRefresh();

// // Add the xText axis Labels 

xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

// b) Left Axis

var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// label for the axis left of the chart.
svg.append("g").attr("class", "yText");


var yText = d3.select(".yText");

//  window changes operation.
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// Add the yText axis Labels 

//  Obesity

yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

//  csv file.


d3.csv("assets/data/data.csv").then(function (data) {

  visualize(data);
});


function visualize(theData) {

  var curX = "poverty";
  var curY = "obesity";

  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // Tooltip 
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function (d) {
      console.log(d)
      // x key
      var theX;
      //State name.
      var theState = "<div>" + d.state + "</div>";

      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";

      if (curX === "poverty") {

        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {

        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }

      return theState  + theY + theX;
    });

  svg.call(toolTip);


  // Section: II 

  // min and max for x
  function xMinMax() {

    xMin = d3.min(theData, function (d) {
      return parseFloat(d[curX]) * 0.95;
    });

    xMax = d3.max(theData, function (d) {
      return parseFloat(d[curX]) * 1.05;
    });
  }

  // min and max for y
  function yMinMax() {

    yMin = d3.min(theData, function (d) {
      return parseFloat(d[curY]) * 0.95;
    });

    yMax = d3.max(theData, function (d) {
      return parseFloat(d[curY]) * 1.05;
    });
  }

  function labelChange(axis, clickedText) {

    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text active.
    clickedText.classed("inactive", false).classed("active", true);
  }

  // Section: III  Scatter Plot

  xMinMax();
  yMinMax();


  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);



  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  theCircles
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d[curX]);
    })
    .attr("cy", function (d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function (d) {
      return "stateCircle " + d.abbr;
    })
    
    // Hover 
    .on("mouseover", function (d) {
      // tooltip
      toolTip.show(d, this);

      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function (d) {

      toolTip.hide(d);

      d3.select(this).style("stroke", "#e3e3e3");
    });


  theCircles
    .append("text")
    .text(function (d) {
      return d.abbr;
    })
    .attr("dx", function (d) {
      return xScale(d[curX]);
    })
    .attr("dy", function (d) {

      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")

    .on("mouseover", function (d) {

      toolTip.show(d);

      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function (d) {

      toolTip.hide(d);

      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });


    
  d3.select(window).on("resize", resize);

  function resize() {

    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    svg.attr("width", width).attr("height", height);

    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    tickCount();

    xTextRefresh();
    yTextRefresh();

    crGet();

    d3
      .selectAll("circle")
      .attr("cy", function (d) {
        return yScale(d[curY]);
      })
      .attr("cx", function (d) {
        return xScale(d[curX]);
      })
      .attr("r", function () {
        return circRadius;
      });

    d3
      .selectAll(".stateText")
      .attr("dy", function (d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function (d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }
}