const entryText = document.getElementById("entry-text");
const entryDate = document.getElementById("entry-date");
const entryMood = document.getElementById("entry-mood");
const filterDate = document.getElementById("filter-date");
const entriesDiv = document.getElementById("entries");
const toggleBtn = document.getElementById("toggle-mode");

entryDate.valueAsDate = new Date();

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function saveEntry() {
  const date = entryDate.value;
  const text = entryText.value.trim();
  const mood = entryMood.value;

  if (!text) return alert("Please write something!");

  const entry = { date, text, mood };
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  entries.push(entry);
  localStorage.setItem("journalEntries", JSON.stringify(entries));

  entryText.value = "";
  entryMood.value = "😊";
  loadEntries();
}

function loadEntries(filter = "") {
  entriesDiv.innerHTML = "";
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");

  const filtered = filter ? entries.filter(e => e.date === filter) : entries;

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
      <button class="export-btn" onclick="exportEntry(${index}, '${entry.date}')">Export as .txt</button>
    `;
    entriesDiv.appendChild(div);
  });
}

function filterEntries() {
  loadEntries(filterDate.value);
}

function showAll() {
  filterDate.value = "";
  loadEntries();
}

function exportEntry(index, date) {
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]").reverse();
  const content = entries[index].text;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `journal-${date}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

loadEntries();
