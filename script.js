const addNoteBtn = document.getElementById('add-note-btn');
const modal = document.getElementById('template-modal');

addNoteBtn.onclick = () => {
  modal.classList.toggle('hidden');
};

function selectTemplate(type) {
  modal.classList.add('hidden');

  let note = document.createElement('div');
  note.className = 'note-card';

  if (type === 'blank') {
    note.innerHTML = `<textarea placeholder="Write here..." style="width:100%; height:100%;"></textarea>`;
  } else if (type === 'gallery') {
    note.innerHTML = `
      <input type="file" accept="image/*" onchange="previewImage(event, this)">
      <img style="width:100%; margin-top:5px;">
    `;
  } else if (type === 'live') {
    note.innerHTML = `
      <button onclick="captureLivePhoto(this)">📷 Take Photo</button>
      <video autoplay playsinline width="100%" style="display:none;"></video>
      <canvas style="width:100%; display:none;"></canvas>
    `;
  }

  document.getElementById('notes-container').appendChild(note);
}

function previewImage(event, input) {
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    input.nextElementSibling.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function captureLivePhoto(button) {
  const noteCard = button.closest('.note-card');
  const video = noteCard.querySelector('video');
  const canvas = noteCard.querySelector('canvas');

  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.style.display = 'block';
    video.srcObject = stream;
    setTimeout(() => {
      canvas.style.display = 'block';
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      video.srcObject.getTracks().forEach(track => track.stop());
      video.style.display = 'none';
    }, 2000);
  });
}
