// ---------------------------
// script.js (replace current file)
// ---------------------------

// Helper: get URL query param
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/* -----------------------
   LOGIN / LOGOUT / AUTOFILL
   (keep these if other pages call them)
   ----------------------- */
function login() {
  const name = document.getElementById('name')?.value?.trim();
  const number = document.getElementById('number')?.value?.trim();
  if (name && number) {
    localStorage.setItem('userName', name);
    localStorage.setItem('userNumber', number);
    window.location.href = 'menu.html';
  } else {
    alert('Please enter your details');
  }
}

function logout() {
  // keep requests persistent; only remove user identity
  localStorage.removeItem('userName');
  localStorage.removeItem('userNumber');
  window.location.href = 'index.html';
}

function autoFillTutorForm() {
  const name = localStorage.getItem('userName') || '';
  const number = localStorage.getItem('userNumber') || '';
  if (document.getElementById('tutorName')) document.getElementById('tutorName').value = name;
  if (document.getElementById('tutorNumber')) document.getElementById('tutorNumber').value = number;
}

/* -----------------------
   SUBMIT: LEARN REQUEST
   Expects:
     - input id="learnTopic"
     - file input id="learnFile"
   ----------------------- */
function submitLearn() {
  const topicEl = document.getElementById('learnTopic');
  const fileEl = document.getElementById('learnFile');

  const topic = topicEl ? topicEl.value.trim() : '';
  const filename = (fileEl && fileEl.files && fileEl.files.length) ? fileEl.files[0].name : '';

  if (!topic || !filename) {
    alert('Please enter a topic and choose a file.');
    return;
  }

  const learnRequests = JSON.parse(localStorage.getItem('learnRequests')) || [];
  learnRequests.push({
    topic: topic,
    fileName: filename,
    submittedAt: new Date().toISOString()
  });
  localStorage.setItem('learnRequests', JSON.stringify(learnRequests));

  alert('Learning request submitted!');
  // Redirect to profile page and show Learn section
  window.location.href = 'profile.html?view=learn';
}

/* -----------------------
   SUBMIT: TUTOR OFFER
   Expects:
     - input id="tutorName"
     - input id="tutorNumber"
     - input id="tutorTime"
   ----------------------- */
function submitTutor() {
  const nameEl = document.getElementById('tutorName');
  const numberEl = document.getElementById('tutorNumber');
  const timeEl = document.getElementById('tutorTime');

  const name = nameEl ? nameEl.value.trim() : '';
  const number = numberEl ? numberEl.value.trim() : '';
  const time = timeEl ? timeEl.value.trim() : '';

  if (!name || !number || !time) {
    alert('Please fill Name, Number and Schedule & Timing.');
    return;
  }

  const tutorOffers = JSON.parse(localStorage.getItem('tutorOffers')) || [];
  tutorOffers.push({
    name: name,
    number: number,
    schedule: time,
    submittedAt: new Date().toISOString()
  });
  localStorage.setItem('tutorOffers', JSON.stringify(tutorOffers));

  alert('Tutor details submitted!');
  // Redirect to profile page and show Tutor section
  window.location.href = 'profile.html?view=tutor';
}

/* -----------------------
   LOAD PROFILE (called on profile page load)
   - fills name/number
   - shows counts
   - displays only the section requested via ?view=learn or ?view=tutor
   - if no view param, shows both
   ----------------------- */
function loadProfile() {
  // put user info
  const name = localStorage.getItem('userName') || '';
  const number = localStorage.getItem('userNumber') || '';
  const profileNameEl = document.getElementById('profileName');
  const profileNumberEl = document.getElementById('profileNumber');
  if (profileNameEl) profileNameEl.innerText = name;
  if (profileNumberEl) profileNumberEl.innerText = number;

  // get stored arrays
  const learnRequests = JSON.parse(localStorage.getItem('learnRequests')) || [];
  const tutorOffers = JSON.parse(localStorage.getItem('tutorOffers')) || [];

  // update counts
  const activeLearningCount = document.getElementById('activeLearningCount');
  const activeTutorCount = document.getElementById('activeTutorCount');
  if (activeLearningCount) activeLearningCount.innerText = learnRequests.length;
  if (activeTutorCount) activeTutorCount.innerText = tutorOffers.length;

  // fill lists
  const learnList = document.getElementById('learnRequestsList');
  const tutorList = document.getElementById('tutorOffersList');

  if (learnList) {
    learnList.innerHTML = '';
    learnRequests.forEach((req, idx) => {
      const li = document.createElement('li');
      // show topic + file name + optional time
      li.innerText = `${idx+1}. ${req.topic} — ${req.fileName}`;
      learnList.appendChild(li);
    });
  }

  if (tutorList) {
    tutorList.innerHTML = '';
    tutorOffers.forEach((offer, idx) => {
      const li = document.createElement('li');
      li.innerText = `${idx+1}. ${offer.name} — ${offer.number} — ${offer.schedule}`;
      tutorList.appendChild(li);
    });
  }

  // show/hide sections according to query param
  const view = getQueryParam('view'); // 'learn' or 'tutor' or null
  const learnSection = document.getElementById('learnSection');
  const tutorSection = document.getElementById('tutorSection');

  if (view === 'learn') {
    if (learnSection) learnSection.style.display = 'block';
    if (tutorSection) tutorSection.style.display = 'none';
  } else if (view === 'tutor') {
    if (learnSection) learnSection.style.display = 'none';
    if (tutorSection) tutorSection.style.display = 'block';
  } else {
    // show both by default
    if (learnSection) learnSection.style.display = 'block';
    if (tutorSection) tutorSection.style.display = 'block';
  }
}

// Make available if other pages expect DOMContentLoaded behavior
document.addEventListener('DOMContentLoaded', function() {
  // if profile page is loaded and the body onload didn't call loadProfile for some reason,
  // we still want lists to be filled when script executes.
  if (document.body && document.body.getAttribute('onload') === 'loadProfile()') {
    // loadProfile will be called by onload; do nothing here.
  }
});

/*
function login() {
  const name = document.getElementById('name').value.trim();
  const number = document.getElementById('number').value.trim();
  if(name && number) {
    localStorage.setItem('userName', name);
    localStorage.setItem('userNumber', number);
    window.location.href = "menu.html";
  } else {
    alert("Please enter your details");
  }
}

function logout() {
  localStorage.removeItem('userName');
  localStorage.removeItem('userNumber');
  window.location.href = "index.html";
}

function submitTutor() {
  alert("Tutor details submitted!");
  window.location.href = "menu.html";
}

function submitLearn() {
  const topic = document.getElementById('learnTopic').value.trim();
  const file = document.getElementById('learnFile').files.length;
  if(topic && file) {
    alert("Learning request submitted!");
    window.location.href = "menu.html";
  } else {
    alert("Please enter a topic and choose a file.");
  }
}

function loadProfile() {
  document.getElementById('profileName').innerText = localStorage.getItem('userName') || '';
  document.getElementById('profileNumber').innerText = localStorage.getItem('userNumber') || '';
}

function autoFillTutorForm() {
  document.getElementById('tutorName').value = localStorage.getItem('userName') || '';
  document.getElementById('tutorNumber').value = localStorage.getItem('userNumber') || '';
}
// script.js

// Save Learn Request
function saveLearnRequest(event) {
    event.preventDefault();
    const courseName = document.getElementById("learnCourse").value.trim();
    if (!courseName) return;

    let learnRequests = JSON.parse(localStorage.getItem("learnRequests")) || [];
    learnRequests.push(courseName);
    localStorage.setItem("learnRequests", JSON.stringify(learnRequests));

    document.getElementById("learnCourse").value = "";
    alert("Learn request added!");
    loadProfile(); // update without refresh
}

// Save Tutor Offer
function saveTutorOffer(event) {
    event.preventDefault();
    const courseName = document.getElementById("tutorCourse").value.trim();
    if (!courseName) return;

    let tutorOffers = JSON.parse(localStorage.getItem("tutorOffers")) || [];
    tutorOffers.push(courseName);
    localStorage.setItem("tutorOffers", JSON.stringify(tutorOffers));

    document.getElementById("tutorCourse").value = "";
    alert("Tutor offer added!");
    loadProfile(); // update without refresh
}

// Load Profile Data
function loadProfile() {
    const learnList = document.getElementById("learnRequestsList");
    const tutorList = document.getElementById("tutorOffersList");

    if (learnList) {
        learnList.innerHTML = "";
        let learnRequests = JSON.parse(localStorage.getItem("learnRequests")) || [];
        learnRequests.forEach((course, index) => {
            let li = document.createElement("li");
            li.textContent = `${index + 1}. ${course}`;
            learnList.appendChild(li);
        });
    }

    if (tutorList) {
        tutorList.innerHTML = "";
        let tutorOffers = JSON.parse(localStorage.getItem("tutorOffers")) || [];
        tutorOffers.forEach((course, index) => {
            let li = document.createElement("li");
            li.textContent = `${index + 1}. ${course}`;
            tutorList.appendChild(li);
        });
    }
}

// Run loadProfile on profile page load
document.addEventListener("DOMContentLoaded", loadProfile);*/
