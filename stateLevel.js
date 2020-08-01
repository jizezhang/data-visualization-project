

function plotTimeSeries(data, key, title, root) {
    let margin = {top: 30, bottom: 20, left: 60, right: 10}
    let height = 200
    let width = 500

    let svg = root.append("g").attr("class", "ts")
    let line = svg.append("div")
      .attr("class", "row")
      .append("svg")
      .attr("id", "ts-"+key)
      .attr("class", "ts")
      .attr("width", width)
      .attr("height", height)
    
    // let line = d3.select("#ts-" + key)
    let w = width - (margin.left + margin.right)
    let h = height - (margin.top + margin.bottom) 
    let yScale = d3.scaleLinear().domain([d3.min(data, d=> +d[key]), d3.max(data, d => +d[key])*1.1]).range([h, 0])
    let xScale = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.Date)))
        .range([0, w]);
    line.append("g")
        .attr("class", "taxis")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + yScale(0)) + ")")
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%m-%d")))

    line.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + margin.left +"," + margin.top + ")")
        .call(d3.axisLeft(yScale).tickFormat(d3.format(".2")))

    line.append("text")
        .attr("class", "ylabel")
        .style("text-anchor", "start") 
        .attr("x", margin.left-40)
        .attr("y", margin.top)          
        .attr("transform","rotate(-90," + (margin.left - 40) + "," + margin.top + ") translate(-" + (height/2 + 10) + ", 0)")
        .text("percentage");

    line.append("text")
        .attr("class", "title")
        .style("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 20)
        .text(title)
    
    let path = d3.line()
        .x(d => xScale(new Date(d.Date)))
        .y(d => yScale(+d[key]))

    line.append("g")
        .attr("transform", "translate(" + margin.left +"," + margin.top + ")").append("path")
        .datum(data)
        .attr("d", path)
        .attr("class", "line")

    const annotations = [
        {
            note: { 
            title: "Stay Home Period: " + data[0].stay_home_days + " days ", 
            lineType: "none", 
            align: "middle",
            wrap: 200 //custom text wrapping
            },
            subject: {
            height: height - margin.top - margin.bottom,
            width: xScale(new Date(data[0].stay_home_end_date)) - xScale(new Date(data[0].stay_home_start_date))
            },
            type: d3.annotationCalloutRect,
            y: margin.top,
            disable: ["connector"], // doesn't draw the connector
            //can pass "subject" "note" and "connector" as valid options
            dx: (xScale(new Date(data[0].stay_home_end_date)) - xScale(new Date(data[0].stay_home_start_date)))/2,
            data: {x: data[0].stay_home_start_date}
        }]
    
    if (data[0].stay_home_days > 0){
        const makeAnnotations = d3.annotation()
            .accessors({ 
            x: function(d){ return xScale(new Date(d.x))},
            y: function(d){ return yScale(d.y)}
            })
            .annotations(annotations)

        line.append("g")
            .attr("class", "annotation")
            .call(makeAnnotations)
    }
}