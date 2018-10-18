dataViz.directive('lineChart', function ($parse,  $log) {
    return {
        restrict: 'EA',
        template: "<svg></svg>",
        // https://stackoverflow.com/questions/20018507/angular-js-what-is-the-need-of-the-directive-s-link-function-when-we-already-ha
        link: function (scope, elem, attrs) {

            var exp = $parse(attrs.chartData);

            scope.dataset = exp(scope);
            var xScale, yScale, xAxisGen, yAxisGen, line;

            var rawSvg = elem.find('svg');
            var svg = d3.select(rawSvg[0]);

            var margin = { top: 20, right: 40, bottom: 10, left: 20 }
            var width = window.innerWidth - margin.left - margin.right
            //var height = window.innerHeight - margin.top - margin.bottom; 
            // var width = 1024 - margin.left - margin.right
            var height = 300 - margin.top - margin.bottom;
            var radius = 3;


            // on window resize, re-render d3 canvas
            window.onresize = function () {
                $log.log("onresize");
                width = window.innerWidth - margin.left - margin.right;
                $log.log(width);
                return scope.$apply();
            };
            

            ////////////////
            scope.$watch(exp, function (newVal, oldVal) {
                $log.log("watchCollection");
                try {
                    $log.log("to resolve");
                    newVal.then(render);
                }
                catch (err) {
                    //already resolved
                    $log.log("already resolved");
                    render(newVal);
                }
            });


           

            ////////////////


            function render(data) {

                $log.log("render");

                scope.dataset = data;

                $log.log(width);

                xScale = d3.scaleTime()
                    .domain(d3.extent(scope.dataset, d => d["date"]))
                    .range([margin.left, width - margin.right])


                var maxScale = d3.max(scope.dataset, d => d["count"]);

                yScale = d3.scaleLinear()
                    .domain([0, maxScale]).nice()
                    .range([height - margin.bottom, margin.top])

                line = d3.line()
                    .x(function (d) { return xScale(d.date); }) // set the x values for the line generator
                    .y(function (d) { return yScale(d.count); }) // set the y values for the line generator 
                    .curve(d3.curveMonotoneX)

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
                        .text(scope.dataset.count))

                svg = svg
                    .attr("width", width + margin.left + margin.right)
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
                    .datum(scope.dataset)
                    .attr("class", "line")
                    .attr("d", line);

                // 12. Appends a circle for each datapoint 
                svg.selectAll(".dot")
                    .data(scope.dataset)
                    .enter().append("circle")
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






