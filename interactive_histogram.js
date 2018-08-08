// !preview r2d3 data=data, dependencies = c('d3-jetpack'), container = 'div', css = 'style.css'
//
// r2d3: https://rstudio.github.io/r2d3
//
const starting_bins = 30;
const viz_height = height - 70;


function make_histogram(data, num_bins){
  const data_min = d3.min(data);
  const data_max = d3.max(data);
  const num_thresholds = num_bins - 1;
  const data_width = data_max - data_min;
  const bin_width = data_width/(num_thresholds);
  const bin_width_pixels = x(data_min + bin_width) - x(data_min);
  const threshold_start = data_min + bin_width/2;
  const bin_thresholds = d3.range(num_thresholds + 1).map(i => threshold_start + (bin_width*i));
  
  let previous_threshold = threshold_start - bin_width;
  let hist = [];
  for(let i = 0; i<num_thresholds + 1; i++){
    const current_threshold = bin_thresholds[i];
    // how many vals fall between this and last threshold?
    const num_in_bin = data.filter(d => d < current_threshold && d > previous_threshold).length;
    hist.push({
      lower: previous_threshold,
      upper: current_threshold,
      size: num_in_bin,
    });
    previous_threshold = current_threshold;
    
  }
  
  return({
    bin_width,
    threshold_start: bin_thresholds[0],
    bins: hist
  })
}

const slider = div.append('input')
 .at({
   type: 'range',
   min: 2,
   max: 100,
   value: starting_bins,
 })
 
 .st({
    width: "100%",
    height: "15px",
    borderRadius: "5px",   
    background: "#d3d3d3",
    outline: "none",
    opacity: 0.7,
    transition: "opacity .2s",
 });

const bin_counter = div.append('h2');

const svg = div.append('svg')
  .at({
    height: viz_height,
    width: width
  });
  
const margin = ({top: 20, right: 20, bottom: 30, left: 40});

const data_vec = data.map(d => d.x);
const data_min = d3.min(data_vec);
const data_max = d3.max(data_vec);


const x = d3.scaleLinear()
  .domain(d3.extent(data_vec)).nice()
  .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
  .range([viz_height - margin.bottom, margin.top]);

const xAxis = g => g
  .attr("transform", `translate(0,${viz_height - margin.bottom})`)
  .call(d3.axisBottom(x).tickSizeOuter(0))
  .call(g => g.append("text")
    .at({
      x: width - margin.right,
      y: -4,
      fill: "#000",
      fontWeight: "bold",
      textAnchor: "end",
    })
    .text(data.x));

const histogram = svg.append("g")
    .attr("fill", "steelblue");
    
svg.append("g").call(xAxis);

function drawHist(num_bins){
  
  const {bins, threshold_start, bin_width} = make_histogram(data_vec, num_bins);
  const bin_width_pixels = x(threshold_start + bin_width) - x(threshold_start);
  
  bin_counter.text(`Bins = ${num_bins}`);

  y.domain([0, d3.max(bins, d => d.size)]).nice();
   
  const bars = histogram.selectAll("rect")
    .data(bins);
  
  bars.exit().remove();
  
  bars.enter().append("rect")
      .at({
        x: d => x(d.lower) - bin_width_pixels/2,
        y: d => y(d.size),
        width: bin_width_pixels,
        height: d => y(0) - y(d.size)
      });
      
  bars
   .at({
      x: d => x(d.lower) - bin_width_pixels/2,
      y: d => y(d.size),
      width: bin_width_pixels,
      height: d => y(0) - y(d.size)
    });
}

slider.on('input', function(){
   drawHist(this.value);
 });

drawHist(starting_bins);
