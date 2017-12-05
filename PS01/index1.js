var margin = {top:0, right: 70, bottom: 80, left: 10},
    outerWidth = 1000,
    outerHeight = 300,
    width1 = 1000 - margin.left - margin.right,
    height1 = 300;// - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .range([ 0, width1 ]).nice();

var y = d3.scaleLinear()
    .range([ height1, 0 ]).nice();

var xValue = "frequency",
        yValue = "nearby",
        rValue = "percentage",
        colorValue = "raw";


d3.csv("bcc.csv", function(data){
    data.forEach(function(d){
        d.frequency = +d.frequency;
        d.percentage = +d.percentage;
        d.nearby = +d.nearby;
    });
    console.log(data);
    var xMax = d3.max(data, function(d) { return d.frequency; }),
        xMin = d3.min(data, function(d) { return d.frequency; });
    if (xMin> 0 )
        xMin = 0;

        yMax = d3.max(data, function(d) { return d.nearby; }),
        yMin = d3.min(data, function(d) { return d.nearby; });
        if (yMin> 0 )
            yMin = 0;

   console.log(xMin);
    console.log(xMax);

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);
    var xAxis = d3.axisBottom(x)
        .tickSize(-height1);

    var yAxis = d3.axisLeft(y)
        .tickSize(-width1);

    var color1 ="rgb(95,189,211)",color2 ="rgb(0,0,0)" ;

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
            return xValue + ": " + d[xValue] + "<br>" + yValue + ": " + d[yValue] + "<br>" + rValue + ": " + d[rValue];
        });

    var zoomBeh = d3.zoom()
        //.x(x)
        //y(y)
        .scaleExtent([0.5, 1])
        .on("zoom", zoomed);

    var svg = d3.select("#bubble3")
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .style("overflow","visible")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    svg.call(tip);

    var view=svg.append("rect")
        .attr("width", width1)
        .attr("height", height1);

    var gX=svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height1+ ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width1)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text(xValue);

    var gY=svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left-20)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yValue);

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width1)
        .attr("height", height1);
    console.log("?");console.log(height1)

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width1)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height1 + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height1);

    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    objects.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .classed("dot", true)
        .attr("r", function (d) { return 235*d[rValue]; })
        .attr("transform", transform)
        .style("fill", function(d) {

            if(d.onoff=="on")
                return color1;
            return color2;
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

        function zoomed() {
            view.attr("transform", d3.event.transform);
            gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
            gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
        }

    function transform(d) {
            console.log(d[xValue]);
        console.log(x(d[xValue]));
        return "translate(" + x(d[xValue]) + "," + y(d[yValue]) + ")";
    }
});

