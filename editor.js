let drawing = false;
let currentCanvas, ctx;

function loadEditor() {
  const noteType = localStorage.getItem("note_type") || "blank";

  const area = document.getElementById("note-area");

  // Create an A4 size page
  const page = document.createElement("div");
  page.className = "a4-page";

  if (noteType === "blank") {
    page.innerHTML = ''; // nothing
  } else if (noteType === "gallery") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = e => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(e.target.files[0]);
      img.style.width = "100%";
      page.appendChild(img);
    };
    input.click();
  } else if (noteType === "live") {
    alert("📸 Open your camera in the mobile browser and upload manually (camera APIs vary by browser)");
  }

  area.appendChild(page);
}

function addText() {
  const text = document.createElement("div");
  text.contentEditable = true;
  text.innerText = "Type here...";
  text.className = "draggable";
  makeDraggable(text);
  document.querySelector(".a4-page").appendChild(text);
}

function startDrawing() {
  currentCanvas = document.createElement("canvas");
  currentCanvas.width = 800;
  currentCanvas.height = 1100;
  currentCanvas.className = "draw-canvas";
  ctx = currentCanvas.getContext("2d");

  currentCanvas.addEventListener("mousedown", () => drawing = true);
  currentCanvas.addEventListener("mouseup", () => drawing = false);
  currentCanvas.addEventListener("mousemove", draw);

  document.querySelector(".a4-page").appendChild(currentCanvas);
}

function stopDrawing() {
  drawing = false;
}

function draw(e) {
  if (!drawing) return;
  const rect = currentCanvas.getBoundingClientRect();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 2, 0, Math.PI * 2);
  ctx.fill();
}

function addSticky() {
  const colors = ["#ffeb3b", "#f48fb1", "#80deea"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const note = document.createElement("div");
  note.className = "sticky";
  note.contentEditable = true;
  note.style.background = color;
  note.innerText = "Sticky Note";

  makeDraggable(note);
  document.querySelector(".a4-page").appendChild(note);
}

function uploadFile() {
  document.getElementById("file-input").click();
}

function handleUpload(event) {
  const file = event.target.files[0];
  if (file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.width = "100%";
    document.querySelector(".a4-page").appendChild(img);
  } else {
    const div = document.createElement("div");
    div.innerText = "📁 " + file.name;
    div.className = "file-box";
    makeDraggable(div);
    document.querySelector(".a4-page").appendChild(div);
  }
}

function recordVoice() {
  alert("🎤 Voice recording is browser-limited. Use a mobile browser to try.");
  // We'll add this with `MediaRecorder` API later if you want
}

function showTutorial() {
  document.getElementById("tutorial-modal").classList.remove("hidden");
}

function hideTutorial() {
  document.getElementById("tutorial-modal").classList.add("hidden");
}

function makeDraggable(el) {
  el.style.position = "absolute";
  el.onmousedown = function (e) {
    e.preventDefault();
    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      el.style.left = pageX - shiftX + 'px';
      el.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);
    el.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      el.onmouseup = null;
    };
  };
}
