/**
 * 
 */

let states = fill()
let data = states[0].state

// consts -------------------------------------------------
const t = d3.transition()//.duration(1000)
let count = 1
let flag = true
let duration = 500
let i = 0
var interval 
let firstStep = true

// Canvas setup -----------------------------------------
const MARGIN = {LEFT:10, RIGHT:10, TOP:10, BOTTOM:100}
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

let margin_above = 20

const squareHeight = 20
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// Scale definition ------------------------------------
// const labels = data.map(d => d.label)
const xScale = d3.scaleBand()
    // .domain(labels)
    .domain(data)
    .range([0, WIDTH])
    .paddingInner(0.1)
    .paddingOuter(0)

const fontScale = d3.scaleLinear()
    .domain([3,20])
    .range([70,18])

const color = d3.scaleLinear()
    .domain([Math.min(...data), Math.max(...data)])
    .range([0.1,0.8])

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
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("id" ,"italic")
    .attr("x", d => xScale.bandwidth()/2)
    .attr("y", (HEIGHT/2) + (xScale.bandwidth()) + 20)

// Initial run --------------------------------
update(states[0])

function main(){
    /**
     * Main entry for animation, called by button.
     * First, performs the algorithm, storing data structure states.
     * Then runs the algorithm animation every ms on every state.
     */

    let ms = 3000

    // Run algorithm --------------------------------
    if (firstStep)
        states = selection(states[0].state)
    
    update(states[count])

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
}

function next(){
    if (firstStep){
        // sort 

        firstStep = false
    }

    states = selection(states[0].state)
    update(states[count])
    count++
}

function update(data_input){
    console.log("******** Inside update")

    let state = data_input.state

    console.log("Data Input:")
    console.log(data_input)
    
    // Update scales
    xScale.domain(state)
    xScale.range([0, WIDTH])

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
                if (i < data_input.i )
                    return "#f06292"
                else
                    return ""
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
        .attr("fill", "black")
        .attr("x", (xScale(state[data_input.min]) + xScale.bandwidth()/2))
        .delay(1500) // moving this label after 1.5 s the previous animation

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
    console.log("RESETING ----")
    interval.stop()
    states = []
    states = fill()
    update(states[0])
    firstStep = true
    count = 0
    console.log("AFTER RESET ----")

    
}

function fill(){
    /**
     * Returns states array containing state objects.
     * Every state object contains 
     *  - array of numbers (int[])
     *  - i position (int)
     *  - min position (min)
    */
   
    // let data = ['a','b','c'] // len:3
    // const data = ['a','b','c','d','e','f'] // len:6
    // const data = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'] // len:15
    // const data = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o', 'p', 'q', 'r', 's', 't'] // len:20
    // data = [3,2,5,7,0]
    let data = [89, 45, 68, 90, 29, 34, 17]

    const states = [
        {state: data,
        i: 0,
        min: 0
    }
    ]

    return states
}

/* --------------------------------
    TODO
    - Change outline colour - done
    - center text in boxes - done
    - make font proportional to array size -> scale! - done
        scale len(data) -> pixel values
    - round rect corners - done

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
    Efficiency
    - Visualize the efficiency graph
    - Updated by real-time values

*/