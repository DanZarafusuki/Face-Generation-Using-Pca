var grid = []
const size_x = 94
const size_y = 125
const plot_x = 8
const plot_y = 8


const color_matching = ["#b117e8","#4cea15"]

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const displayWidth = canvas.clientWidth;
const displayHeight = canvas.clientHeight

const plot_x_adjusted = (displayWidth*plot_x)/752
const plot_y_adjusted = (displayHeight*plot_y)/1000


const face_swap_speed = 100
const update_speed = 1000

for (let i = 0; i < size_x; i++) {
    grid[i] = []
    for (let j = 0; j < size_y; j++) {
        grid[i][j] = 0
}
}
grid[-1] = []
grid[size_x] = []
for (let j = 0; j < size_y; j++) {
        grid[-1][j] = 0
        grid[size_x][j] = 0
}

for (let i = 0; i < size_x; i++) {
        grid[i][-1] = 0
        grid[i][size_y] = 0
}

const intervalId = setInterval(() => {
 //   update()
   // render()
}, update_speed);

const intervalIdfacesawp = setInterval(() => {
    update_face()
}, face_swap_speed);


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < size_x; i++) {
        for (let j = 0; j < size_y; j++) {
            print_plot(i,j)
        }
    }
}

function print_plot(i,j) {
    ctx.fillStyle = color_matching[grid[i][j]]
    ctx.fillRect(i*plot_x,j*plot_y,plot_x,plot_y);
}


function update_face(){
    switch_face(create_face())
}
function gameLoop(time) {
    // // time = high-resolution timestamp (ms)
    // let deltaTime = (time - lastTime) / 1000; // convert to seconds
    // lastTime = time;

    render();

    requestAnimationFrame(gameLoop);
}
 requestAnimationFrame(gameLoop);


///////////////////////// face generation. it is 125x94


const loadBin = async (url) => {
    const response = await fetch(url);
  
  if (!response.ok) {
    //alert(`Failed to load ${url}: ${response.status} ${response.statusText}`);
    return null;
  }

  const buffer = await response.arrayBuffer();
  const arr = new Float32Array(buffer);
  
  //alert(`Loaded ${url}: ${arr.length} floats, first value = ${arr[0]}`);
  return arr;
};

let mean, std, comps;

async function init() {
        //alert("start")
    mean = await loadBin('assets/face_pca/weights_mean.bin');              // length = 11750
       //alert("mean end")
    std  = await loadBin('assets/face_pca/weights_std.bin');               // length = 11750
       // alert("std")
    comps = await loadBin('assets/face_pca/eigenfaces_components.bin');    // length = 15 * 11750
        //alert("comps")
//

}

const WIDTH = 94;
const HEIGHT = 125;
const N_FEATURES = 11750;
const N_COMPONENTS = 20;

function create_face() {
    const flat = new Float32Array(N_FEATURES);

    const weights = new Float32Array(N_COMPONENTS);
    for (let i = 0; i < N_COMPONENTS; i++) {
        weights[i] = (Math.random() * 2 - 1) * std[i];
    }

    for (let j = 0; j < N_FEATURES; j++) {
        let val = 0;

        for (let i = 0; i < N_COMPONENTS; i++) {
            val += (weights[i] + mean[i]) * comps[i * N_FEATURES + j];
        }

        flat[j] = val;
    }
    return flat;
}


function switch_face(face){ 
    for (let col = 0; col < WIDTH; col++) {       // col = 0..93
        for (let row = 0; row < HEIGHT; row++) {  // row = 0..124
            grid[col][row] = face[col + row * WIDTH] < 0 ? 0 : 1;
        }
    }
}

init()