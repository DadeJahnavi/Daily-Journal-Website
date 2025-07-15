const entryText = document.getElementById("entry-text");
const entryDate = document.getElementById("entry-date");
const entryMood = document.getElementById("entry-mood");
const filterDate = document.getElementById("filter-date");
const filterMood = document.getElementById("filter-mood");
const entriesDiv = document.getElementById("entries");
const toggleBtn = document.getElementById("toggle-mode");

entryDate.valueAsDate = new Date();

// Dark mode toggle
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Save entry
function saveEntry() {
  const date = entryDate.value;
  const text = entryText.value.trim();
  const mood = entryMood.value;

  if (!text) return alert("Please write something!");

  const newEntry = { date, text, mood };
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  entries.push(newEntry);
  localStorage.setItem("journalEntries", JSON.stringify(entries));

  entryText.value = "";
  entryMood.value = "😊";
  loadEntries();
}

// Load entries with optional filters
function loadEntries(dateFilter = "", moodFilter = "") {
  entriesDiv.innerHTML = "";
  const allEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  let filtered = allEntries;

  if (dateFilter) filtered = filtered.filter(e => e.date === dateFilter);
  if (moodFilter) filtered = filtered.filter(e => e.mood === moodFilter);
  if (filtered.length === 0) {
    entriesDiv.innerHTML = "<p>No entries found.</p>";
    return;
  }

  filtered.reverse().forEach((entry, i) => {
    const indexInAll = allEntries.findIndex(e => e.date === entry.date && e.text === entry.text && e.mood === entry.mood);
    const div = document.createElement("div");
    div.className = "entry";
    div.setAttribute("data-mood", entry.mood);

    div.innerHTML = `
      <strong>${entry.date} — ${entry.mood}</strong>
      <p>${entry.text}</p>
      <button class="export-btn" onclick="exportEntry(${indexInAll})">Export as .txt</button>
      <button class="delete-btn" onclick="deleteEntry(${indexInAll})">Delete</button>
    `;

    entriesDiv.appendChild(div);
  });
}

function filterEntries() {
  loadEntries(filterDate.value, filterMood.value);
}

function showAll() {
  filterDate.value = "";
  filterMood.value = "";
  loadEntries();
}

function exportEntry(index) {
  const all = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  const entry = all[index];
  const blob = new Blob([entry.text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `journal-${entry.date}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function deleteEntry(index) {
  const all = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  all.splice(index, 1);
  localStorage.setItem("journalEntries", JSON.stringify(all));
  loadEntries();
}

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  loadEntries();
});
