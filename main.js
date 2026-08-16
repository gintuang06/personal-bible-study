/* ==================================================================
   BIBLE STUDY WORKSPACE — MAIN.JS
   Structure:
     1. Data
     2. DOM references
     3. Rendering functions
     4. Event handlers
     5. LocalStorage functions
     6. Initialization
================================================================== */

/* ==================================================================
   1. DATA
================================================================== */

// Full canonical list of Bible books, used to populate left panel navigation.
const BIBLE_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
  "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation"
];

// Sample scripture text (public domain, King James Version) used to
// demonstrate functionality. Only a handful of books/chapters are
// populated; every other book shows a "not yet available" message.
// Structure: SCRIPTURE_DATA[book][chapterNumber] = [ "verse text", ... ]
const SCRIPTURE_DATA = {
  "Genesis": {
    1: [
      "In the beginning God created the heaven and the earth.",
      "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      "And God said, Let there be light: and there was light.",
      "And God saw the light, that it was good: and God divided the light from the darkness.",
      "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
      "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.",
      "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.",
      "And God called the firmament Heaven. And the evening and the morning were the second day.",
      "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.",
      "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good."
    ],
    2: [
      "Thus the heavens and the earth were finished, and all the host of them.",
      "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.",
      "And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.",
      "These are the generations of the heavens and of the earth when they were created, in the day that the LORD God made the earth and the heavens."
    ]
  },
  "Psalms": {
    23: [
      "The LORD is my shepherd; I shall not want.",
      "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
      "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
      "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever."
    ]
  },
  "Matthew": {
    5: [
      "And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:",
      "And he opened his mouth, and taught them, saying,",
      "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
      "Blessed are they that mourn: for they shall be comforted.",
      "Blessed are the meek: for they shall inherit the earth.",
      "Blessed are they which do hunger and thirst after righteousness: for they shall be filled."
    ]
  },
  "John": {
    1: [
      "In the beginning was the Word, and the Word was with God, and the Word was God.",
      "The same was in the beginning with God.",
      "All things were made by him; and without him was not any thing made that was made.",
      "In him was life; and the life was the light of men.",
      "And the light shineth in darkness; and the darkness comprehended it not.",
      "There was a man sent from God, whose name was John.",
      "The same came for a witness, to bear witness of the Light, that all men through him might believe.",
      "He was not that Light, but was sent to bear witness of that Light.",
      "That was the true Light, which lighteth every man that cometh into the world.",
      "He was in the world, and the world was made by him, and the world knew him not."
    ],
    3: [
      "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:",
      "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.",
      "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.",
      "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      "For God sent not his Son into the world to condemn the world; but that the world through him might be saved."
    ]
  },
  "Romans": {
    8: [
      "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
      "For the law of the Spirit of life in Christ Jesus hath made me free from the law of sin and death.",
      "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      "For whom he did foreknow, he also did predestinate to be conformed to the image of his Son, that he might be the firstborn among many brethren."
    ]
  }
};

/* ==================================================================
   2. DOM REFERENCES
================================================================== */

const dom = {
  saveStatus: document.getElementById("save-status"),
  currentDate: document.getElementById("current-date"),

  bookSearch: document.getElementById("book-search"),
  bookList: document.getElementById("book-list"),
  chapterSelectRow: document.getElementById("chapter-select-row"),
  chapterSelect: document.getElementById("chapter-select"),

  scriptureBook: document.getElementById("scripture-book"),
  scriptureChapter: document.getElementById("scripture-chapter"),
  verseContainer: document.getElementById("verse-container"),

  notesReference: document.getElementById("notes-reference"),
  notesTextarea: document.getElementById("notes-textarea"),
  saveNoteBtn: document.getElementById("save-note-btn"),
  clearNoteBtn: document.getElementById("clear-note-btn"),

  journalTextarea: document.getElementById("journal-textarea"),
  saveJournalBtn: document.getElementById("save-journal-btn"),
  clearJournalBtn: document.getElementById("clear-journal-btn")
};

/* ==================================================================
   APPLICATION STATE
================================================================== */

const state = {
  currentBook: null,
  currentChapter: null,
  selectedVerseRef: null // e.g. "John 1:1"
};

/* ==================================================================
   3. RENDERING FUNCTIONS
================================================================== */

// Render today's date into the header, in "August 15, 2026" style.
function renderCurrentDate() {
  const today = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  dom.currentDate.textContent = today.toLocaleDateString("en-US", options);
}

// Render the left-panel book list, optionally filtered by a search term.
function renderBookList(filterText = "") {
  dom.bookList.innerHTML = "";
  const query = filterText.trim().toLowerCase();
  const matches = BIBLE_BOOKS.filter((book) =>
    book.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "no-match";
    emptyItem.textContent = "No books match your search.";
    dom.bookList.appendChild(emptyItem);
    return;
  }

  matches.forEach((book) => {
    const item = document.createElement("li");
    item.textContent = book;
    item.dataset.book = book;
    if (book === state.currentBook) {
      item.classList.add("active");
    }
    item.addEventListener("click", () => handleBookSelect(book));
    dom.bookList.appendChild(item);
  });
}

// Populate the chapter dropdown for the currently selected book.
function renderChapterSelect(book) {
  const chapters = SCRIPTURE_DATA[book] ? Object.keys(SCRIPTURE_DATA[book]) : [];

  if (chapters.length === 0) {
    dom.chapterSelectRow.hidden = true;
    return;
  }

  dom.chapterSelectRow.hidden = false;
  dom.chapterSelect.innerHTML = "";

  chapters
    .sort((a, b) => Number(a) - Number(b))
    .forEach((chapterNumber) => {
      const option = document.createElement("option");
      option.value = chapterNumber;
      option.textContent = `Chapter ${chapterNumber}`;
      dom.chapterSelect.appendChild(option);
    });
}

// Render the scripture heading and verse list for the current book/chapter.
function renderScripture(book, chapter) {
  dom.scriptureBook.textContent = book;
  dom.scriptureChapter.textContent = chapter ? `Chapter ${chapter}` : "";
  dom.verseContainer.innerHTML = "";

  const chapterData =
    SCRIPTURE_DATA[book] && SCRIPTURE_DATA[book][chapter];

  if (!chapterData) {
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = SCRIPTURE_DATA[book]
      ? "Select a chapter above to view its verses."
      : `Sample text for ${book} is not included in this demo. Try Genesis, Psalms, Matthew, John, or Romans.`;
    dom.verseContainer.appendChild(message);
    return;
  }

  chapterData.forEach((verseText, index) => {
    const verseNumber = index + 1;
    const verseRef = `${book} ${chapter}:${verseNumber}`;

    const verseLine = document.createElement("p");
    verseLine.className = "verse-line";
    verseLine.dataset.ref = verseRef;

    const numberSpan = document.createElement("span");
    numberSpan.className = "verse-number";
    numberSpan.textContent = verseNumber;

    verseLine.appendChild(numberSpan);
    verseLine.appendChild(document.createTextNode(verseText));

    if (verseRef === state.selectedVerseRef) {
      verseLine.classList.add("selected");
    }

    verseLine.addEventListener("click", () => handleVerseSelect(verseRef));
    dom.verseContainer.appendChild(verseLine);
  });
}

// Render the notes panel for a given verse reference (or a cleared state).
function renderNotesPanel(verseRef) {
  if (!verseRef) {
    dom.notesReference.textContent = "None";
    dom.notesTextarea.value = "";
    dom.notesTextarea.disabled = true;
    dom.saveNoteBtn.disabled = true;
    dom.clearNoteBtn.disabled = true;
    return;
  }

  dom.notesReference.textContent = verseRef;
  dom.notesTextarea.disabled = false;
  dom.saveNoteBtn.disabled = false;
  dom.clearNoteBtn.disabled = false;
  dom.notesTextarea.value = loadNote(verseRef) || "";
}

// Update the "Saved" / "Unsaved" indicator in the header.
function setSaveStatus(isSaved) {
  dom.saveStatus.textContent = isSaved ? "Saved" : "Unsaved";
  dom.saveStatus.classList.toggle("unsaved", !isSaved);
}

/* ==================================================================
   4. EVENT HANDLERS
================================================================== */

// Handle a click on a book in the left panel.
function handleBookSelect(book) {
  state.currentBook = book;
  state.selectedVerseRef = null;

  renderBookList(dom.bookSearch.value);
  renderChapterSelect(book);

  const availableChapters = SCRIPTURE_DATA[book]
    ? Object.keys(SCRIPTURE_DATA[book]).sort((a, b) => Number(a) - Number(b))
    : [];
  const firstChapter = availableChapters.length > 0 ? Number(availableChapters[0]) : null;

  state.currentChapter = firstChapter;
  if (firstChapter) {
    dom.chapterSelect.value = String(firstChapter);
  }

  renderScripture(book, firstChapter);
  renderNotesPanel(null);
}

// Handle a change in the chapter dropdown.
function handleChapterChange() {
  const chapter = Number(dom.chapterSelect.value);
  state.currentChapter = chapter;
  state.selectedVerseRef = null;
  renderScripture(state.currentBook, chapter);
  renderNotesPanel(null);
}

// Handle a click on a verse within the scripture viewer.
function handleVerseSelect(verseRef) {
  state.selectedVerseRef = verseRef;

  // Update selection highlight without a full re-render.
  document.querySelectorAll(".verse-line").forEach((line) => {
    line.classList.toggle("selected", line.dataset.ref === verseRef);
  });

  renderNotesPanel(verseRef);
}

// Handle the book search input.
function handleBookSearch() {
  renderBookList(dom.bookSearch.value);
}

// Handle saving the current note.
function handleSaveNote() {
  if (!state.selectedVerseRef) return;
  saveNote(state.selectedVerseRef, dom.notesTextarea.value);
  setSaveStatus(true);
}

// Handle clearing the current note.
function handleClearNote() {
  if (!state.selectedVerseRef) return;
  dom.notesTextarea.value = "";
  deleteNote(state.selectedVerseRef);
  setSaveStatus(true);
}

// Handle saving the journal entry.
function handleSaveJournal() {
  saveJournal(dom.journalTextarea.value);
  setSaveStatus(true);
}

// Handle clearing the journal entry.
function handleClearJournal() {
  dom.journalTextarea.value = "";
  deleteJournal();
  setSaveStatus(true);
}

// Mark unsaved whenever the user types in a textarea.
function handleUnsavedInput() {
  setSaveStatus(false);
}

/* ==================================================================
   5. LOCALSTORAGE FUNCTIONS
================================================================== */

const STORAGE_KEYS = {
  notesPrefix: "bibleStudyWorkspace.note.",
  journal: "bibleStudyWorkspace.journal"
};

// Save a note for a specific verse reference.
function saveNote(verseRef, text) {
  const key = STORAGE_KEYS.notesPrefix + verseRef;
  if (text.trim() === "") {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, text);
  }
}

// Load a saved note for a specific verse reference.
function loadNote(verseRef) {
  return localStorage.getItem(STORAGE_KEYS.notesPrefix + verseRef);
}

// Delete a saved note for a specific verse reference.
function deleteNote(verseRef) {
  localStorage.removeItem(STORAGE_KEYS.notesPrefix + verseRef);
}

// Save the daily journal entry.
function saveJournal(text) {
  localStorage.setItem(STORAGE_KEYS.journal, text);
}

// Load the saved daily journal entry.
function loadJournal() {
  return localStorage.getItem(STORAGE_KEYS.journal) || "";
}

// Delete the saved daily journal entry.
function deleteJournal() {
  localStorage.removeItem(STORAGE_KEYS.journal);
}

/* ==================================================================
   6. INITIALIZATION
================================================================== */

function attachEventListeners() {
  dom.bookSearch.addEventListener("input", handleBookSearch);
  dom.chapterSelect.addEventListener("change", handleChapterChange);

  dom.saveNoteBtn.addEventListener("click", handleSaveNote);
  dom.clearNoteBtn.addEventListener("click", handleClearNote);
  dom.notesTextarea.addEventListener("input", handleUnsavedInput);

  dom.saveJournalBtn.addEventListener("click", handleSaveJournal);
  dom.clearJournalBtn.addEventListener("click", handleClearJournal);
  dom.journalTextarea.addEventListener("input", handleUnsavedInput);
}

function init() {
  renderCurrentDate();
  renderBookList();
  renderNotesPanel(null);
  attachEventListeners();

  // Restore the journal entry automatically on load.
  dom.journalTextarea.value = loadJournal();

  // Default to John 1 so the workspace shows content immediately.
  handleBookSelect("John");
  if (SCRIPTURE_DATA["John"] && SCRIPTURE_DATA["John"][1]) {
    dom.chapterSelect.value = "1";
    state.currentChapter = 1;
    renderScripture("John", 1);
  }

  setSaveStatus(true);
}

document.addEventListener("DOMContentLoaded", init);
