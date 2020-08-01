let margin = {top: 40, bottom: 50, left: 60, right: 10}
let height = 400
let width = 500

function plotStayHome(data_all, key, cScale, xlabel, ylabel, title, measure="Daily_Case_1m") {
    let data = data_all.filter(d => d[key] > 0)
    d3.select("#mobility")
      .append("div")
      .attr("class", "row")
      .append("svg")
      .attr("id", "mb-" + key)
      .attr("width", width)
      .attr("height", height)

    let plot = d3.select("#mb-"+key)
    let w = width - (margin.left + margin.right)
    let h = height - (margin.top + margin.bottom) 
    let xScale = d3.scaleLinear().domain(d3.extent(data, d=> +d[key])).range([0, w])
    let yScale = d3.scaleLinear().domain(d3.extent(data, d=> +d[measure])).range([h, 0])

    plot.append("g")
        .attr("transform", "translate(" + margin.left + "," + (yScale(0) + margin.top) + ")")
        .call(d3.axisBottom(xScale)
        .tickFormat(d3.format(".2")))
            
    plot.append("g")
        .attr("transform", "translate(" + margin.left +"," + margin.top + ")")
        .call(d3.axisLeft(yScale)
        .tickFormat(d3.format(".4")))

    plot.append("text")
        .attr("class", "ylabel")
        .style("text-anchor", "start") 
        .attr("x", margin.left-40)
        .attr("y", margin.top)          
        .attr("transform","rotate(-90," + (margin.left - 40) + "," + margin.top + ") translate(-" + (height/2 + 10) + ", 0)")
        .text(ylabel);

    plot.append("text")
        .attr("class", "xlabel")
        .style("text-anchor", "middle") 
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 4)          
        .text(xlabel);

    plot.append("text")
        .attr("class", "title")
        .style("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 30)
        .text(title)

    let div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    plot.append("g").attr("transform", "translate(" + margin.left +"," + margin.top + ")")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", d=> d.state)
        .attr("cx", d => xScale(+d[key]))
        .attr("cy", d => yScale(+d[measure]))
        .attr("r", 4)
        .style("fill", d => cScale(+d.Daily_Case_1m))
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d.State + '<br/> daily per 1million : ' + d3.format(".2")(d[measure]))	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
        })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
    });
}