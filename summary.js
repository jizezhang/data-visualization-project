let minRadius = 80
let maxRadius = 400

function drawSlidebar(data_all, startRank, endRank, rScale, cScale){
    let margin = 30
    let txt = d3.select("#summary")
        .append("p")
        
    txt.text("Top " + (startRank + 1) + " to " + (endRank + 1) + " States (click arc to see details)")
    
    let slider = d3.select("#summary")
        .append("svg")
        .attr("width", 700)
        .attr("height", 100)

    let sliderbar = d3.sliderBottom().min(1).max(51).width(slider.attr("width") - 2 * margin)
        .step(1)
        .ticks(20)
        .default([1, 31])
        .on("onchange", val => {
            d3.selectAll("#pie").remove() 

            startRank = parseInt(val[0]) - 1
            endRank = parseInt(val[1]) - 1
            txt.text("Top " + (startRank + 1) + " to " + (endRank + 1) + " States (click arc to see details)")
            plotSummary(data_all, startRank, endRank, rScale, cScale)
      })
    slider.append("g")
      .attr("transform", "translate(" + margin + ", " + 10 + ")")
      .call(sliderbar)
}

function plotSummary(data_all, startRank, endRank, rScale, cScale, measure="Case_1m"){

    data_all.sort((a, b) => d3.descending(+a.Case_1m, +b.Case_1m))
    data = data_all.slice(startRank, endRank)

    let aScale = d3.scaleLinear().domain([0, endRank - startRank]).range([0, 6.28])

    let addArc = d3.arc()
        .innerRadius(0)
        .outerRadius((d, i) => rScale(+d[measure]))
        .startAngle((d, i) => aScale(i))
        .endAngle((d, i) => aScale(i+1))

    let div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
            
    let pie = d3.select("#summary")
        .append("svg")
        .attr("id", "pie")
        .attr("width", 700)
        .attr("height", 800)
        .append("g")
        .attr("transform", "translate(" + (maxRadius - 100) + ", " + (maxRadius + 50) + ")")
    
    pie.selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "arcs")
        .attr("id", d => d.State)
        .attr("d", (d, i) => addArc(d, i))
        .attr("fill", (d, i) => cScale(+d.Daily_Case_1m))
        .on("mouseover", function(d) {		
            div.transition()		
            .duration(200)		
            .style("opacity", .9);		
            div	.html(d.State + '<br/> per 1million : ' + d3.format("~s")(d[measure]))	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
                    })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

    d3.selectAll(".arcs")
        .each(function(d, i) {
            let outerArc = /(^.+?)L/
            let newArc = outerArc.exec(d3.select(this).attr("d"))[1]
            newArc = newArc.replace(/,/g, ' ')
            pie.append("path")
              .attr("class", "hiddenArcs")
              .attr("id", "hiddenArc" + i)
              .attr("d", newArc)
              .style("fill", "none")
        })
   
    pie.selectAll("text")
        .data(data)
        .enter()
        .append("text")
          .attr("dy", "-10")
          .attr("class", "label")
        .append("textPath")
          .attr("startOffset", "50%")
          .style("text-anchor", "middle")
          .attr("xlink:href", (d, i) => "#hiddenArc" + i)
          .text(d => d.State)
}