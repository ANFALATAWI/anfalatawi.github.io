/**
 * Visualizing and animating Selection Sort
 */

// Load data
let states = fill()
let data = states[0].state
let userInput
// consts -------------------------------------------------
const t = d3.transition()//.duration(1000)
let count = 1
let flag = true
let duration = 500
let i = 0
let interval 
let firstStep = true
let xScale, fontScale , color 
// Canvas setup -----------------------------------------
const MARGIN = {LEFT:10, RIGHT:10, TOP:0, BOTTOM:100}
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 250 - MARGIN.TOP - MARGIN.BOTTOM

let margin_above = 20

const squareHeight = 20
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

setScales()

// Additional setup elements --------------------------------
const i_label = g.append("text")
.attr("class", "upper-label")
.attr("transform", `translate(${0}, ${(-xScale.bandwidth() / 2) - margin_above})`)

const j_label = g.append("text")
.attr("class", "lower-label")

i_label.text("i")
    .attr("font-size","40px")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "auto")
    .attr("id" ,"italic")
    .attr("x", d => xScale.bandwidth()/2)
    .attr("y", (HEIGHT/2) + (xScale.bandwidth() / 2))

j_label.text("min")
    .attr("font-size","40px")
    .attr("fill", "#ff94c2")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("id" ,"italic")
    .attr("x", d => xScale.bandwidth()/2)
    .attr("y", (HEIGHT/2) + (xScale.bandwidth()) + 20)

const bg = svg.append("rect")
    .attr("x",  0) // i < state.length - 1? xScale[i+1] - : WIDTH
    .attr("y", (HEIGHT/2) - 4)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("width", 0)// width - how many sorted elements
    .attr("height", xScale.bandwidth() + (xScale.bandwidth() * 0.1))
    .attr("fill", "none")
    .attr("transform", `translate(${MARGIN.LEFT}, 0)`)
    

// Initial run --------------------------------
$(document).ready(function(){
    console.log("Ready")
    update(states[0])

    $("#play-button").on("click", () => {
        console.log("Button clicked")
      main()
    })

    $("#reset-button").on("click", () => {
        reset()
    })
    
    $("#next-button").on("click", () => {
        next()
    })

    $("#sort-button").on("click", () => {
        main()
    })

    $("#try-button").on("click", () => {
        userInput = $("#array-input").val().split(",").map(x=>+x)
        // todo: validate user inputN
        // interval.stop()
        // states = fill(userInput)
        // setScales()
        // update(states[0]) // Display initial state before sorting
        reset()
    })

  })

function main(){
    /**
     * Main entry for animation, called by button.
     * First, performs the algorithm, storing data structure states.
     * Then, runs the algorithm animation every ms on every state.
     */

    let ms = 3000

    // Run algorithm --------------------------------
    if (firstStep)
        states = selection(states[0].state)


    // Run interval --------------------------------
    interval = d3.interval(() => {
        if (count == states.length) {
            console.log("Animation ending...")
            interval.stop()
            return;
        }
        update(states[count])
        count++
    }, ms)

    update(states[count])
        count++
}

function next(){
    /**
    * Runs one step of the animation only
    */

    if (firstStep){
        states = selection(states[0].state)
        firstStep = false
    }

    if (count == states.length)
    {
        
    }
    else
    {
        update(states[count])
        count++
    }
}

function update(data_input){
    /**
     * Updates the state of the sketch, animating one state of the array at a time.
     * Most drawing & animating happens here.
     */

    console.log("> Updating the sketch...")

    let state = data_input.state
    let i = data_input.i
    let min = data_input.min

    console.log("Data Input:")
    console.log(data_input)
    
    // Update scales
    xScale.domain(state)
    xScale.range([0, WIDTH])

    bg.lower()
    bg.transition(t)
        .ease(d3.easeQuadOut)
        .duration(duration)
        .attr("x",  xScale(state[i < state.length - 1? i+1 : 0]) - 4) // i < state.length - 1? xScale[i+1] - : WIDTH
        .attr("y", (HEIGHT/2) - 4)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("width", WIDTH - xScale(state[i < state.length - 1? i+1 : 0]) + 8)// width - how many sorted elements
        .attr("height", xScale.bandwidth() + (xScale.bandwidth() * 0.1))
        .attr("fill", i < state.length - 1? "#ff94c2" : "none" ) // change `min` text to the same color. maybe gray? blue : "#2196f3"
        .delay(1500)

    // Data Points ---
    const nodes = g.selectAll("rect")
    .data(state, d => d) // index by item

    nodes.exit()
        .transition(t)
            .attr("fill", "gray")
            .attr("width", 0)
            .attr("x", WIDTH)

    nodes.enter().append("rect")
    .attr("x", d => xScale(d))
    .attr("y", HEIGHT/2)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("width", xScale.bandwidth)
    .attr("height", xScale.bandwidth )
    .attr("fill", d => d3.interpolatePurples(color(d)))
    // .attr("fill", "#f06292") // make the colors scale as length increases
    .merge(nodes)
        .transition(t)
        .duration(duration)
        .attr("x", d => xScale(d))
        .attr("y", HEIGHT/2)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("width", xScale.bandwidth)
        .attr("height", xScale.bandwidth)
        .attr("stroke-width", "2")
        .transition(t)
            .duration(3000)
            .ease(d3.easeCubicIn)
            .attr("stroke", (d, i) => { // todo: slow this down
                if (i < data_input.i || data_input.i  == state.length - 1)
                    return "#2196f3"
                else
                    return "none"
            })
        .delay(function(i){return(i*10)})


    const nodesText = g.selectAll("text")
        .data(state, d => d) // draw by index
    
    nodesText.exit()
        .transition(t)
            .attr("fill", "white")
            .attr("width", 0)
            .attr("x", WIDTH)
            .attr("font-size", "0px")

    nodesText.enter().append("text")
        .text(d => d)
        .attr("font-size",fontScale(state.length) + "px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "Rubik")
        .attr("x", d => (xScale(d) + xScale.bandwidth()/2))
        .attr("y", (HEIGHT/2) + (xScale.bandwidth() / 2))
        .merge(nodesText)
            .transition(t)
            .duration(duration)
            .text(d => d)
            .attr("font-size",fontScale(state.length) + "px")
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-family", "Rubik")
            .attr("x", d => (xScale(d) + xScale.bandwidth()/2))
            .attr("y", (HEIGHT/2) + (xScale.bandwidth() / 2))
            
    
    i_label.transition(t)
        .ease(d3.easeQuadOut)
        .duration(duration)
        .attr("font-size","40px")
        .attr("fill", "black")
        .attr("x", (xScale(state[data_input.i]) + xScale.bandwidth()/2))
        .attr("y", (HEIGHT/2) + (xScale.bandwidth() / 2))
        .delay(1000)
    
    j_label.transition(t)
    .ease(d3.easeQuadOut)
        .duration(duration)
        .attr("font-size","40px")
        .attr("fill", "#ff94c2")
        .attr("x", (xScale(state[data_input.min]) + xScale.bandwidth()/2))
        .delay(2000) // moving this label after 1.5 s the previous animation

}

function selection(arr){
    /**
     * Returns states of arr during each iteration of selection sort.
    */

    let states = []
    let min = 0
    let j = 0
    let i = 0

    for ( i = 0; i < arr.length - 1; i++){
        min = i
        for ( j = i+1 ; j < arr.length ; j++){
            if (arr[j] < arr[min]){
                min = j
            }
        }
        let temp = {
            state: [... arr],
            i: i,
            min: min
        }
        states.push(temp)
        var b = arr[i];
        arr[i] = arr[min];
        arr[min] = b;
        
    }
    let temp = {
        state: [... arr],
        i: i,
        min: min
    }
    states.push(temp)

    return states
}

function reset(){
    /**
     * Resets animation to default values.
     */
    console.log("> Resetting...")
    if (interval)
        interval.stop()
    states = []
    states = fill(userInput)
    setScales()
    update(states[0])
    firstStep = true
    count = 0
    console.log("> Reset successful")
}

function fill(userInput = [3, 2, 5, 7, 0, 1]){
    /**
     * Returns states array containing state objects.
     * Every state object contains:
     *  - array of numbers (int[])
     *  - i position (int)
     *  - min position (min)
    */

   console.log("> Filling user input : " + userInput)
    const states = [
        {state: [... userInput],
        i: 0,
        min: 0
    }
    ]
    return states
}

function setScales(){
    
    data = states[0].state
    console.log("> Setting Scales with data: " + data)

    xScale = d3.scaleBand()
        // .domain(labels)
        .domain(data)
        .range([0, WIDTH])
        .paddingInner(0.1)
        .paddingOuter(0)

    fontScale = d3.scaleLinear()
        .domain([3,20])
        .range([70,18])

    color = d3.scaleLinear()
        .domain([Math.min(...data), Math.max(...data)])
        .range([0.1,0.8])

}
/* --------------------------------
    TODO
    - Change outline colour - done
    - center text in boxes - done
    - make font proportional to array size -> scale! - done
        scale len(data) -> pixel values
    - round rect corners - done
    - Padding(pink) should be a % of scale around all edges
    - Remove delay in initial run (all items should move together) if (smthn) delay = 0 else smthn

    Next
    - Interval delay each loop iteration
    or
    - Save states and delay in transition. - done
    - Here, transition delay can be an input for speeding up / slowing down animation

    - Change color of nodes that are moving states then change the color background
    - Add pointers for comparison - done
    - Add arrows under and above
    - Outline what is sorted ( before index i) - done
    - first update indices and then delay then update array - done
    - When is is done it should reset (call reset) - done
    - Add steps: one step is an interval
    - Fix "too late; already running" in animation timing
    - Rescale for mobile
    - Create an RTL version
    - min & bg should appear after run only -- imp

    Efficiency
    - Visualize the efficiency graph
    - Updated by real-time values - This is a stupid suggestion
    - Have one graph for efficiency, switching data inputs.
    - Animate the changing graph ✨

    (selection) (bubble) (binary)

    ops
    |
    |
    |
    |
    |
    ------------------------------- n
*/