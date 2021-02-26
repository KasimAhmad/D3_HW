var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("/data/data.csv").then( function (fromdata) {

    console.log(fromdata); 

    fromdata.forEach(function (data) {
      data.poverty = +data.poverty;

      data.noHealthInsurance = +data.noHealthInsurance;

      data.attr = parseFloat(data.attr);

    });


  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(fromdata, d =>d.poverty)+2])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(fromdata, d => d.noHealthInsurance)])
  .range([height, 0]);

  var bottomaxis = d3.axisBottom(xLinearScale);
  var leftaxis = d3.axisLeft(yLinearScale);


  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`).call(bottomaxis);

  chartGroup.append("g").call(leftaxis);



  var circlesGroup = chartGroup.selectAll("circle")
    .data(fromdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.noHealthInsurance))
    .attr("r", 20)
    .attr("fill", "red")
    .attr("opacity", ".5")


    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(fromdata)
        .enter()
        .append("tspan")
            .attr("x", function(d) {
                return xLinearScale(d.poverty);
            })
            .attr("y", function(d) {
                return yLinearScale(d.noHealthInsurance);
            })
            .text(function(data) {
                return data.abbr
            });

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("(%) w/o Healthcare");
  
    chartGroup.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
      .classed("axis-text", true)
      .text("(%) in Poverty");
  });
  




