const entryText = document.getElementById("entry-text");
const entryDate = document.getElementById("entry-date");
const entryMood = document.getElementById("entry-mood");
const filterDate = document.getElementById("filter-date");
const filterMood = document.getElementById("filter-mood");
const entriesDiv = document.getElementById("entries");
const toggleBtn = document.getElementById("toggle-mode");

entryDate.valueAsDate = new Date();

// 🌙 Dark mode toggle
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ✅ Save multiple entries per day
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

// 📤 Load entries with optional date + mood filters
function loadEntries(dateFilter = "", moodFilter = "") {
  entriesDiv.innerHTML = "";
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");

  let filtered = entries;

  if (dateFilter) {
    filtered = filtered.filter((e) => e.date === dateFilter);
  }

  if (moodFilter) {
    filtered = filtered.filter((e) => e.mood === moodFilter);
  }

  if (filtered.length === 0) {
    entriesDiv.innerHTML = "<p>No entries found.</p>";
    return;
  }

  filtered.reverse().forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>${entry.date} — ${entry.mood}</strong>
      <p>${entry.text}</p>
      <button class="export-btn" onclick="exportEntry(${index})">Export as .txt</button>
    `;
    entriesDiv.appendChild(div);
  });
}

// 🧠 Mood/date filter logic
function filterEntries() {
  loadEntries(filterDate.value, filterMood.value);
}

function showAll() {
  filterDate.value = "";
  filterMood.value = "";
  loadEntries();
}

// 📄 Export text file
function exportEntry(displayIndex) {
  const all = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  const filtered = [...all].reverse();

  const entry = filtered[displayIndex];
  const content = entry.text;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `journal-${entry.date}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// 🔁 Load entries on page load
loadEntries();
