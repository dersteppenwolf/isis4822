dataViz.directive('lineChart', function ($parse, $window) {
    return {
        restrict: 'EA',
        template: "<svg width='800' height='200'></svg>",
        // https://stackoverflow.com/questions/20018507/angular-js-what-is-the-need-of-the-directive-s-link-function-when-we-already-ha
        link: function (scope, elem, attrs) {


            var exp = $parse(attrs.chartData);

            var dataset = exp(scope);
            var xScale, yScale, xAxisGen, yAxisGen, line;

            var rawSvg = elem.find('svg');
            var svg = d3.select(rawSvg[0]);

            var margin = { top: 20, right: 40, bottom: 10, left: 40 }
            var width = window.innerWidth - margin.left - margin.right 
            //var height = window.innerHeight - margin.top - margin.bottom; 
           // var width = 1024 - margin.left - margin.right
            var height = 300 - margin.top - margin.bottom;
            var radius = 3;

            var callDrawing = (d) => {
                //console.log(d);
                dataset = d;
                //console.log(dataset);
                if (dataset) {
                    setChartParameters();
                    redrawLineChart();
                }
            };

            ////////////////
            scope.$watchCollection(exp, function (newVal, oldVal) {
                try {
                    newVal.then(callDrawing);
                }
                catch (err) {
                    //already resolved
                    callDrawing(newVal);
                }
            });

            ////////////////

            function setChartParameters() {

                xScale = d3.scaleTime()
                    .domain(d3.extent(dataset, d => d["date"]))
                    .range([margin.left, width - margin.right])

                var maxScale = d3.max(dataset, d => d["count"]);

                yScale = d3.scaleLinear()
                    .domain([0, maxScale]).nice()
                    .range([height - margin.bottom, margin.top])

                xAxisGen = g => g
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(xScale).ticks(width / 45).tickSizeOuter(0))

                yAxisGen = g => g
                    .attr("transform", `translate(${margin.left - 20},0)`)
                    .call(d3.axisLeft(yScale))
                    .call(g => g.select(".domain").remove())
                    .call(g => g.select(".tick:last-of-type text").clone()
                        .attr("x", 3)
                        .attr("text-anchor", "start")
                        .attr("font-weight", "bold")
                        .text(dataset.count))

                line = d3.line()
                    .x(function (d) { return xScale(d.date); }) // set the x values for the line generator
                    .y(function (d) { return yScale(d.count); }) // set the y values for the line generator 
                    .curve(d3.curveMonotoneX)

            }



            function redrawLineChart() {
                svg = svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.append("g")
                    .attr("class", "x axis")
                    .call(xAxisGen);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxisGen);

                // gridlines in x axis function
                function make_x_gridlines() {
                    return d3.axisBottom(xScale)
                        .ticks(5)
                }

                // gridlines in y axis function
                function make_y_gridlines() {
                    return d3.axisLeft(yScale)
                        .ticks(10)
                }

                // add the X gridlines
                svg.append("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(0," + height + ")")
                    .call(make_x_gridlines()
                        .tickSize(-height)
                        .tickFormat("")
                    )

                // add the Y gridlines
                svg.append("g")
                    .attr("class", "grid")
                    .call(make_y_gridlines()
                        .tickSize(-width)
                        .tickFormat("")
                    )

                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line")
                    .attr("d", line);

                // 12. Appends a circle for each datapoint 
                svg.selectAll(".dot")
                    .data(dataset)
                    .enter().append("circle") // Uses the enter().append() method
                    .attr("class", "dot") // Assign a class for styling
                    .attr("cx", function (d) { return xScale(d.date) })
                    .attr("cy", function (d) { return yScale(d.count) })
                    .attr("r", radius)
                    .on("mouseover", handleMouseOver)
                    .on("mouseout", handleMouseOut);

                function handleMouseOver(d, i) {

                    d3.select(this)
                        .attr("r", radius * 2)
                        .attr("class", "dotPopups");

                    svg.append("text")
                        .attr("id", "t" + d.x + "-" + d.y + "-" + i)
                        .attr("x", function () { return xScale(d.date) - 30; })
                        .attr("y", function () { return yScale(d.count) - 17; })
                        .text(function () {
                            return [d.label + " : " + d.count];  // Value of the text
                        });
                }

                function handleMouseOut(d, i) {
                    d3.select(this)
                        .attr("r", radius)
                        .attr("class", "dot");

                    d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();
                }
            }


        }
    };
});






