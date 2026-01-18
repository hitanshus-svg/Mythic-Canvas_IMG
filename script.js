const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let currentColor = "#000000";
let currentBrushSize = 5;
let history = [];
let step = -1;

function init() {
    canvas.width = 1000; 
    canvas.height = 600;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    saveState();
}

function startPosition(e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
    if (!isDrawing) return;

    ctx.lineWidth = currentBrushSize;
    ctx.strokeStyle = currentColor;
    
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

function stopPosition() {
    if (isDrawing == true) {
        saveState();
    }
    isDrawing = false;
}


function saveState() {
    if (step < history.length - 1) {
        history = history.slice(0, step + 1);
    }
    history.push(canvas.toDataURL());
    step++;
}

function undoAction() {
    if (step > 0) {
        step--;
        renderStep();
    }
}

function redoAction() {
    if (step < history.length - 1) {
        step++;
        renderStep();
    }
}

function renderStep() {
    const canvasPic = new Image();
    canvasPic.src = history[step];
    canvasPic.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasPic, 0, 0);
    };
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopPosition);
canvas.addEventListener("mouseleave", stopPosition);


document.getElementById("colorPicker").addEventListener("input", (e) => {
    currentColor = e.target.value;
    ctx.globalCompositeOperation = "source-over"; 
});

document.getElementById("brushSize").addEventListener("input", (e) => {
    currentBrushSize = parseInt(e.target.value);
});

document.getElementById("eraser").onclick = () => {
    ctx.globalCompositeOperation = "destination-out";
};

document.getElementById("brush").onclick = () => {
    ctx.globalCompositeOperation = "source-over";
};  

document.getElementById("clear").onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
};


document.getElementById("undo").onclick = undoAction;
document.getElementById("redo").onclick = redoAction;

document.getElementById("download").onclick = () => {
    const link = document.createElement("a");
    link.download = "my_artwork.png";
    link.href = canvas.toDataURL();
    link.click();
};

// Save button
document.getElementById("save").onclick = () => {
  const savedData = canvas.toDataURL();
  localStorage.setItem("myCanvas", savedData);
  alert("Canvas saved!");
};

// Load button
document.getElementById("load").onclick = () => {
  const savedData = localStorage.getItem("myCanvas");
  if (!savedData) {
    alert("No saved canvas found!");
    return;
  }

  const img = new Image();
  img.src = savedData;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
};


// Image upload functionality 
const imageInput = document.getElementById("imgupload");

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return; 

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

init();
