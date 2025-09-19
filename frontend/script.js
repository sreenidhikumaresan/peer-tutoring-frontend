// =================================================================
// CONFIGURATION
// =================================================================

// IMPORTANT: This is your live backend URL.
const backendUrl = 'https://pse10-backend-api.victoriouscoast-a723bfc3.centralindia.azurecontainerapps.io';

// Helper: Get URL query parameter
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// =================================================================
// LOGIN / LOGOUT / AUTOFILL
// (These can still use localStorage for user's own details)
// =================================================================

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

// =================================================================
// SUBMIT FUNCTIONS (Now use the backend API)
// =================================================================

// SUBMIT: LEARN REQUEST
function submitLearn() {
  const topic = document.getElementById('learnTopic')?.value?.trim();
  const filename = document.getElementById('learnFile')?.files[0]?.name || '';

  if (!topic || !filename) {
    alert('Please enter a topic and choose a file.');
    return;
  }

  const learnRequestData = {
    topic: topic,
    fileName: filename,
    // You could also add the user's name/number here if needed
    // userName: localStorage.getItem('userName')
  };

  // NEW: Send data to the backend instead of localStorage
  fetch(`${backendUrl}/api/learn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(learnRequestData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Backend response:', data);
    alert('Learning request submitted!');
    window.location.href = 'profile.html?view=learn';
  })
  .catch(error => {
    console.error('Error submitting learn request:', error);
    alert('Failed to submit request. Please try again.');
  });
}

// SUBMIT: TUTOR OFFER
function submitTutor() {
  const name = document.getElementById('tutorName')?.value?.trim();
  const number = document.getElementById('tutorNumber')?.value?.trim();
  const time = document.getElementById('tutorTime')?.value?.trim();

  if (!name || !number || !time) {
    alert('Please fill Name, Number and Schedule & Timing.');
    return;
  }

  const tutorOfferData = {
    name: name,
    number: number,
    schedule: time,
  };

  // NEW: Send data to the backend instead of localStorage
  fetch(`${backendUrl}/api/tutor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tutorOfferData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Backend response:', data);
    alert('Tutor details submitted!');
    window.location.href = 'profile.html?view=tutor';
  })
  .catch(error => {
    console.error('Error submitting tutor offer:', error);
    alert('Failed to submit offer. Please try again.');
  });
}

// =================================================================
// LOAD PROFILE (Now loads from the backend API)
// =================================================================

function loadProfile() {
  // Fill user info from localStorage
  const name = localStorage.getItem('userName') || '';
  const number = localStorage.getItem('userNumber') || '';
  const profileNameEl = document.getElementById('profileName');
  const profileNumberEl = document.getElementById('profileNumber');
  if (profileNameEl) profileNameEl.innerText = name;
  if (profileNumberEl) profileNumberEl.innerText = number;

  // NEW: Fetch learn requests and tutor offers from the backend
  const learnList = document.getElementById('learnRequestsList');
  const tutorList = document.getElementById('tutorOffersList');
  const activeLearningCount = document.getElementById('activeLearningCount');
  const activeTutorCount = document.getElementById('activeTutorCount');

  // Fetch and display learn requests
  if (learnList) {
    fetch(`${backendUrl}/api/learn`)
      .then(response => response.json())
      .then(requests => {
        if (activeLearningCount) activeLearningCount.innerText = requests.length;
        learnList.innerHTML = '';
        requests.forEach((req, idx) => {
          const li = document.createElement('li');
          li.innerText = `${idx + 1}. ${req.topic} — ${req.fileName}`;
          learnList.appendChild(li);
        });
      });
  }

  // Fetch and display tutor offers
  if (tutorList) {
    fetch(`${backendUrl}/api/tutor`)
      .then(response => response.json())
      .then(offers => {
        if (activeTutorCount) activeTutorCount.innerText = offers.length;
        tutorList.innerHTML = '';
        offers.forEach((offer, idx) => {
          const li = document.createElement('li');
          li.innerText = `${idx + 1}. ${offer.name} — ${offer.number} — ${offer.schedule}`;
          tutorList.appendChild(li);
        });
      });
  }

  // Show/hide sections based on URL parameter (this logic remains the same)
  const view = getQueryParam('view');
  const learnSection = document.getElementById('learnSection');
  const tutorSection = document.getElementById('tutorSection');

  if (view === 'learn') {
    if (learnSection) learnSection.style.display = 'block';
    if (tutorSection) tutorSection.style.display = 'none';
  } else if (view === 'tutor') {
    if (learnSection) learnSection.style.display = 'none';
    if (tutorSection) tutorSection.style.display = 'block';
  } else {
    if (learnSection) learnSection.style.display = 'block';
    if (tutorSection) tutorSection.style.display = 'block';
  }
}