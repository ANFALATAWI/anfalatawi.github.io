/**
 * Visualizing and animating the graph of sorts.
 */

// Load data
const n = 100
let inputN = Math.floor(Math.random() * 100);   
let inputOP = inputN*inputN
let dataGraph = fillGraph(n)

// consts -------------------------------------------------
const tGraph = d3.transition().ease(d3.easeQuadOut).duration(100)

// Canvas setup -----------------------------------------
const MARGING = {LEFT:100, RIGHT:10, TOP:50, BOTTOM:100}
const WIDTHG = 400 - MARGING.LEFT - MARGING.RIGHT
const HEIGHTG = 400 - MARGING.TOP - MARGING.BOTTOM

const svgGraph = d3.select("#graph-area").append("svg")
  .attr("width", WIDTHG + MARGING.LEFT + MARGING.RIGHT)
  .attr("height", HEIGHTG + MARGING.TOP + MARGING.BOTTOM)

const gGraph = svgGraph.append("g")
    .attr("transform", `translate(${MARGING.LEFT}, ${MARGING.TOP})`)

const focus = gGraph.append("g")
    .attr("class", "focus")
// Scale definition ------------------------------------
const nExtent = d3.extent(dataGraph, d => d.n)
const opExtent = d3.extent(dataGraph, d => d.op)

const xScaleG = d3.scaleLinear()
    .domain(nExtent)
    .range([0, WIDTHG])

const yScaleG = d3.scaleLinear()
    .domain(opExtent)
    .range([HEIGHTG, 0])

// Axes definition ------------------------------------
const xAxis = d3.axisBottom(xScaleG)
const yAxis = d3.axisLeft(yScaleG)

gGraph.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${HEIGHTG})`)
    .call(xAxis)

gGraph.append("g")
    .attr("class", "y-axis")
    .call(yAxis)

// Label definition --------------------------------

// Initial run --------------------------------
// Setup
let linePath = gGraph.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke","#ba2d65")
    .attr("stroke-width", "3px")
    .attr("stroke-linecap", "round")

let xTip = focus.append("line")
    .attr("fill", "none")
    .attr("stroke","#5e35b1")
    .attr("opacity", "0.7")
    .attr("stroke-width", "2px")
    .attr("stroke-linecap", "round")
    .attr("stroke-dasharray", "3")
    .attr("transform", `translate(${xScaleG(inputN)},0)`)

let yTip = focus.append("line")
    .attr("fill", "none")
    .attr("stroke","#5e35b1")
    .attr("opacity", "0.7")
    .attr("stroke-width", "2px")
    .attr("stroke-linecap", "round")
    .attr("stroke-dasharray", "3")
    .attr("x1", 0)
    .attr("transform", `translate(${0},${yScaleG(inputOP)})`)

let pointTip = focus.append("circle")
    .attr("fill", "none")   
    .attr("opacity", "0.7")
    .attr("stroke-width", "2px")
    .attr("r", 5)
    .attr("transform", `translate(${xScaleG(inputN)},${yScaleG(inputOP)})`)


function main(){
    /**
     * Main entry for animation, called by button.
     * First, performs the algorithm, storing data structure states.
     * Then runs the algorithm animation every ms on every state.
     */
    // update scales, axes and ... 

    inputN = Math.floor(Math.random() * 100);   
    inputOP = inputN*inputN
    console.log("N: " + inputN)
    console.log("OP: " + inputOP)
    const line = d3.line()
    .x(d => xScaleG(d.n) )
    .y(d => yScaleG(d.op) )

    linePath.transition(tGraph)
        .attr("d", line(dataGraph))

    // Tooltip?
    
    xTip.transition(tGraph)
        .attr("y1", HEIGHTG) // of function
        .attr("y2", yScaleG(inputOP))
        .attr("transform", `translate(${xScaleG(inputN)},0)`)

    yTip.transition(tGraph)
        .attr("x1", 0)
        .attr("x2", xScaleG(inputN))
        .attr("transform", `translate(${0},${yScaleG(inputOP)})`)

    pointTip.transition(tGraph)
        .attr("fill", "#5e35b1")   
        .attr("transform", `translate(${xScaleG(inputN)},${yScaleG(inputOP)})`)

    // Run algorithm --------------------------------
    
}

function resetGraph(){
    /**
     * Resets animation to default values.
     */
    console.log("> Resetting...")
    focus.selectAll("*").remove()
    console.log("> Reset successful")
    // reftarctor 
    xTip = focus.append("line")
        .attr("fill", "none")
        .attr("stroke","#5e35b1")
        .attr("opacity", "0.7")
        .attr("stroke-width", "2px")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "3")
        .attr("y1", 0) // of function
        .attr("transform", `translate(${xScaleG(inputN)},0)`)

    yTip = focus.append("line")
        .attr("fill", "none")
        .attr("stroke","#5e35b1")
        .attr("opacity", "0.7")
        .attr("stroke-width", "2px")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "3")
        .attr("x1", 0)
        .attr("transform", `translate(${0},${yScaleG(inputOP)})`)

    pointTip = focus.append("circle")
        .attr("fill", "none")   
        .attr("opacity", "0.7")
        .attr("stroke-width", "2px")
        .attr("r", 5)
        .attr("transform", `translate(${xScaleG(inputN)},${yScaleG(inputOP)})`)

}

function fillGraph(n){
    /**
     * Returns array of efficiency metric 
     * Every state object contains 
     *  - i: length of data structure (int)
     *  - op number of operations for data structure (min)
    */
    
    let efficiency = new Array(n).fill().map((_, i) => ({ n: i, op: i*i }));
    efficiency.splice(0,1) // removing item with i = 0
    console.log("> Efficiency array:")
    console.log(efficiency)

    return efficiency
}

/* --------------------------------
    TODO:
    - Rescale for mobile
    - Create an RTL version
    - Centre drawings on screen
    - Merge into blog

    Efficiency
    - Visualize the efficiency graph
    - Updated by real-time values - This is a stupid suggestion
    - Have one graph for efficiency, switching data inputs.
    - Animate the changing graph ✨
    - First draw line then additional tools

    fill()
    - Should be abstract to implement either algo by name or by equation

    
    (selection) (bubble) (binary)

    ops
    |
    |
    |
    |
    |
    ------------------------------- n
*/