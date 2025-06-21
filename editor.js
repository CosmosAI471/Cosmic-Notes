let drawing = false;
let ctx = null;
let currentCanvas = null;

function loadEditor() {
  const noteType = localStorage.getItem("note_type") || "blank";
  createNewPage(noteType);
}

function createNewPage(template) {
  const noteArea = document.getElementById("note-area");

  const page = document.createElement("div");
  page.className = "a4-page";

  page.dataset.pageId = "page_" + Date.now(); // unique ID for page
  noteArea.appendChild(page);

  if (template === "gallery") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = e => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(e.target.files[0]);
      img.className = "resizable";
      makeResizable(img);
      page.appendChild(img);
    };
    input.click();
  }
}

function addText() {
  const div = document.createElement("div");
  div.contentEditable = true;
  div.innerText = "Type here...";
  div.className = "draggable editable-box";
  makeDraggable(div);
  document.querySelector(".a4-page:last-child").appendChild(div);
}

function startDrawing() {
  currentCanvas = document.createElement("canvas");
  currentCanvas.width = 800;
  currentCanvas.height = 1100;
  currentCanvas.className = "draw-canvas";
  ctx = currentCanvas.getContext("2d");

  currentCanvas.onmousedown = () => drawing = true;
  currentCanvas.onmouseup = () => drawing = false;
  currentCanvas.onmousemove = e => {
    if (!drawing) return;
    const rect = currentCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  document.querySelector(".a4-page:last-child").appendChild(currentCanvas);
}

function stopDrawing() {
  drawing = false;
  if (ctx) ctx.beginPath(); // reset path
}

function addSticky() {
  const colors = ["#ffeb3b", "#f48fb1", "#80deea"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const note = document.createElement("div");
  note.className = "draggable sticky editable-box";
  note.contentEditable = true;
  note.style.background = color;
  note.innerText = "Sticky Note";

  makeDraggable(note);
  document.querySelector(".a4-page:last-child").appendChild(note);
}

function uploadFile() {
  document.getElementById("file-input").click();
}

function handleUpload(event) {
  const file = event.target.files[0];
  const page = document.querySelector(".a4-page:last-child");

  if (file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.className = "resizable";
    makeResizable(img);
    page.appendChild(img);
  } else {
    const fileBox = document.createElement("div");
    fileBox.className = "draggable file-box";
    fileBox.innerText = `📁 ${file.name}`;
    makeDraggable(fileBox);
    page.appendChild(fileBox);
  }
}

function recordVoice() {
  alert("🎤 Voice recording feature coming soon!");
}

function showTutorial() {
  document.getElementById("tutorial-modal").classList.remove("hidden");
}

function hideTutorial() {
  document.getElementById("tutorial-modal").classList.add("hidden");
}

function makeDraggable(el) {
  el.onmousedown = function (e) {
    e.preventDefault();
    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      el.style.left = pageX - shiftX + 'px';
      el.style.top = pageY - shiftY + 'px';
      el.style.position = 'absolute';
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);
    el.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
    };
  };
}

function makeResizable(el) {
  el.style.resize = "both";
  el.style.overflow = "auto";
  el.style.maxWidth = "100%";
}

function addPage() {
  createNewPage("blank");
}

function saveNotes() {
  const pages = document.querySelectorAll(".a4-page");
  const saved = [];

  pages.forEach(page => {
    let pageData = {
      html: page.innerHTML,
      id: page.dataset.pageId
    };
    saved.push(pageData);
  });

  localStorage.setItem("saved_notes", JSON.stringify(saved));
  alert("✅ Notes saved!");
}

function loadNotes() {
  const saved = JSON.parse(localStorage.getItem("saved_notes") || "[]");

  if (saved.length === 0) {
    alert("❌ No saved notes found.");
    return;
  }

  document.getElementById("note-area").innerHTML = "";
  saved.forEach(pageData => {
    const page = document.createElement("div");
    page.className = "a4-page";
    page.dataset.pageId = pageData.id;
    page.innerHTML = pageData.html;

    // re-apply behavior
    page.querySelectorAll(".draggable").forEach(el => makeDraggable(el));
    page.querySelectorAll(".resizable").forEach(el => makeResizable(el));

    document.getElementById("note-area").appendChild(page);
  });

  alert("✅ Notes loaded!");
}
