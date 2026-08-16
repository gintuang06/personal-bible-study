/* ==================================================================
   BIBLE STUDY WORKSPACE — MAIN.JS
   Structure:
     1. Data
     2. DOM references
     3. Rendering functions
     4. Event handlers
     5. LocalStorage / IndexedDB functions
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

  viewTabs: document.querySelectorAll(".view-tab"),
  views: {
    workspace: document.getElementById("view-workspace"),
    journal: document.getElementById("view-journal"),
    library: document.getElementById("view-library")
  },

  // Study workspace
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

  // Journal
  newEntryBtn: document.getElementById("new-entry-btn"),
  journalEntryList: document.getElementById("journal-entry-list"),
  journalTitleInput: document.getElementById("journal-title-input"),
  journalEntryDate: document.getElementById("journal-entry-date"),
  journalEditorTextarea: document.getElementById("journal-editor-textarea"),
  saveJournalBtn: document.getElementById("save-journal-btn"),
  deleteJournalBtn: document.getElementById("delete-journal-btn"),

  // Library
  uploadDropzone: document.getElementById("upload-dropzone"),
  fileUploadInput: document.getElementById("file-upload-input"),
  libraryList: document.getElementById("library-list"),
  libraryCount: document.getElementById("library-count")
};

/* ==================================================================
   APPLICATION STATE
================================================================== */

const state = {
  currentBook: null,
  currentChapter: null,
  selectedVerseRef: null,   // e.g. "John 1:1"
  activeJournalEntryId: null
};

/* ==================================================================
   3. RENDERING FUNCTIONS
================================================================== */

// ---------------- Header ----------------

function renderCurrentDate() {
  const today = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  dom.currentDate.textContent = today.toLocaleDateString("en-US", options);
}

function setSaveStatus(isSaved) {
  dom.saveStatus.textContent = isSaved ? "Saved" : "Unsaved";
  dom.saveStatus.classList.toggle("unsaved", !isSaved);
}

// ---------------- View switching ----------------

function renderActiveView(viewName) {
  Object.entries(dom.views).forEach(([name, el]) => {
    el.classList.toggle("active", name === viewName);
  });
  dom.viewTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewName);
  });
}

// ---------------- Study workspace ----------------

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

// ---------------- Journal ----------------

function formatEntryTimestamp(isoString) {
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  };
  return date.toLocaleString("en-US", options);
}

function renderJournalEntryList() {
  const entries = loadJournalEntries().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  dom.journalEntryList.innerHTML = "";

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "journal-empty-list";
    empty.textContent = "No entries yet. Click + NEW to start writing.";
    dom.journalEntryList.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "journal-entry-item";
    if (entry.id === state.activeJournalEntryId) {
      item.classList.add("active");
    }

    const titleEl = document.createElement("span");
    titleEl.className = "journal-entry-item-title";
    titleEl.textContent = entry.title || "Untitled Entry";

    const dateEl = document.createElement("span");
    dateEl.className = "journal-entry-item-date";
    dateEl.textContent = formatEntryTimestamp(entry.createdAt);

    const snippetEl = document.createElement("span");
    snippetEl.className = "journal-entry-item-snippet";
    snippetEl.textContent = entry.content
      ? entry.content.replace(/\s+/g, " ").trim()
      : "(empty entry)";

    item.appendChild(titleEl);
    item.appendChild(dateEl);
    item.appendChild(snippetEl);

    item.addEventListener("click", () => handleJournalEntrySelect(entry.id));
    dom.journalEntryList.appendChild(item);
  });
}

function renderJournalEditor(entry) {
  if (!entry) {
    dom.journalTitleInput.value = "";
    dom.journalTitleInput.disabled = true;
    dom.journalEntryDate.textContent = "No entry selected";
    dom.journalEditorTextarea.value = "";
    dom.journalEditorTextarea.disabled = true;
    dom.saveJournalBtn.disabled = true;
    dom.deleteJournalBtn.disabled = true;
    return;
  }

  dom.journalTitleInput.value = entry.title || "";
  dom.journalTitleInput.disabled = false;
  dom.journalEntryDate.textContent = formatEntryTimestamp(entry.createdAt);
  dom.journalEditorTextarea.value = entry.content || "";
  dom.journalEditorTextarea.disabled = false;
  dom.saveJournalBtn.disabled = false;
  dom.deleteJournalBtn.disabled = false;
}

// ---------------- Library ----------------

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatFileDate(isoString) {
  const date = new Date(isoString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

async function renderLibraryList() {
  const documents = await getAllDocuments();
  documents.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  dom.libraryList.innerHTML = "";
  dom.libraryCount.textContent = `${documents.length} file${documents.length === 1 ? "" : "s"}`;

  if (documents.length === 0) {
    const empty = document.createElement("li");
    empty.className = "library-empty";
    empty.textContent = "No documents yet. Add a file above to build your library.";
    dom.libraryList.appendChild(empty);
    return;
  }

  documents.forEach((doc) => {
    const item = document.createElement("li");
    item.className = "library-item";

    const info = document.createElement("div");
    info.className = "library-item-info";

    const name = document.createElement("span");
    name.className = "library-item-name";
    name.textContent = doc.name;

    const meta = document.createElement("span");
    meta.className = "library-item-meta";
    meta.textContent = `${doc.type || "FILE"} · ${formatFileSize(doc.size)} · ${formatFileDate(doc.dateAdded)}`;

    info.appendChild(name);
    info.appendChild(meta);

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "VIEW";
    viewBtn.addEventListener("click", () => handleViewDocument(doc));

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "DOWNLOAD";
    downloadBtn.addEventListener("click", () => handleDownloadDocument(doc));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-danger";
    deleteBtn.textContent = "DELETE";
    deleteBtn.addEventListener("click", () => handleDeleteDocument(doc.id));

    item.appendChild(info);
    item.appendChild(viewBtn);
    item.appendChild(downloadBtn);
    item.appendChild(deleteBtn);

    dom.libraryList.appendChild(item);
  });
}

/* ==================================================================
   4. EVENT HANDLERS
================================================================== */

// ---------------- View tabs ----------------

function handleViewTabClick(viewName) {
  renderActiveView(viewName);
}

// ---------------- Study workspace ----------------

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

function handleChapterChange() {
  const chapter = Number(dom.chapterSelect.value);
  state.currentChapter = chapter;
  state.selectedVerseRef = null;
  renderScripture(state.currentBook, chapter);
  renderNotesPanel(null);
}

function handleVerseSelect(verseRef) {
  state.selectedVerseRef = verseRef;

  document.querySelectorAll(".verse-line").forEach((line) => {
    line.classList.toggle("selected", line.dataset.ref === verseRef);
  });

  renderNotesPanel(verseRef);
}

function handleBookSearch() {
  renderBookList(dom.bookSearch.value);
}

function handleSaveNote() {
  if (!state.selectedVerseRef) return;
  saveNote(state.selectedVerseRef, dom.notesTextarea.value);
  setSaveStatus(true);
}

function handleClearNote() {
  if (!state.selectedVerseRef) return;
  dom.notesTextarea.value = "";
  deleteNote(state.selectedVerseRef);
  setSaveStatus(true);
}

// ---------------- Journal ----------------

function handleNewJournalEntry() {
  const entry = {
    id: `entry-${Date.now()}`,
    title: "Untitled Entry",
    content: "",
    createdAt: new Date().toISOString()
  };

  const entries = loadJournalEntries();
  entries.push(entry);
  saveJournalEntries(entries);

  state.activeJournalEntryId = entry.id;
  renderJournalEntryList();
  renderJournalEditor(entry);
  dom.journalTitleInput.focus();
  setSaveStatus(true);
}

function handleJournalEntrySelect(entryId) {
  state.activeJournalEntryId = entryId;
  const entries = loadJournalEntries();
  const entry = entries.find((item) => item.id === entryId);
  renderJournalEntryList();
  renderJournalEditor(entry);
}

function handleSaveJournalEntry() {
  if (!state.activeJournalEntryId) return;

  const entries = loadJournalEntries();
  const index = entries.findIndex((item) => item.id === state.activeJournalEntryId);
  if (index === -1) return;

  entries[index].title = dom.journalTitleInput.value.trim() || "Untitled Entry";
  entries[index].content = dom.journalEditorTextarea.value;
  saveJournalEntries(entries);

  renderJournalEntryList();
  setSaveStatus(true);
}

function handleDeleteJournalEntry() {
  if (!state.activeJournalEntryId) return;

  const entries = loadJournalEntries().filter(
    (item) => item.id !== state.activeJournalEntryId
  );
  saveJournalEntries(entries);

  state.activeJournalEntryId = null;
  renderJournalEntryList();
  renderJournalEditor(null);
  setSaveStatus(true);
}

// ---------------- Library ----------------

async function handleFilesAdded(fileList) {
  const files = Array.from(fileList);
  for (const file of files) {
    await addDocument(file);
  }
  await renderLibraryList();
  setSaveStatus(true);
}

function handleUploadInputChange(event) {
  handleFilesAdded(event.target.files);
  event.target.value = ""; // allow re-uploading the same file later
}

function handleDropzoneDragOver(event) {
  event.preventDefault();
  dom.uploadDropzone.classList.add("drag-over");
}

function handleDropzoneDragLeave() {
  dom.uploadDropzone.classList.remove("drag-over");
}

function handleDropzoneDrop(event) {
  event.preventDefault();
  dom.uploadDropzone.classList.remove("drag-over");
  if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
    handleFilesAdded(event.dataTransfer.files);
  }
}

function handleViewDocument(doc) {
  const url = URL.createObjectURL(doc.blob);
  window.open(url, "_blank", "noopener");
  // Release the object URL after a delay to allow the new tab to load it.
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function handleDownloadDocument(doc) {
  const url = URL.createObjectURL(doc.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = doc.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function handleDeleteDocument(id) {
  await deleteDocument(id);
  await renderLibraryList();
  setSaveStatus(true);
}

// ---------------- Shared ----------------

function handleUnsavedInput() {
  setSaveStatus(false);
}

/* ==================================================================
   5. LOCALSTORAGE / INDEXEDDB FUNCTIONS
================================================================== */

const STORAGE_KEYS = {
  notesPrefix: "bibleStudyWorkspace.note.",
  journalEntries: "bibleStudyWorkspace.journalEntries"
};

// ---- Verse notes (localStorage — small text, per-verse) ----

function saveNote(verseRef, text) {
  const key = STORAGE_KEYS.notesPrefix + verseRef;
  if (text.trim() === "") {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, text);
  }
}

function loadNote(verseRef) {
  return localStorage.getItem(STORAGE_KEYS.notesPrefix + verseRef);
}

function deleteNote(verseRef) {
  localStorage.removeItem(STORAGE_KEYS.notesPrefix + verseRef);
}

// ---- Journal entries (localStorage — array of entry objects) ----

function loadJournalEntries() {
  const raw = localStorage.getItem(STORAGE_KEYS.journalEntries);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Could not parse journal entries:", error);
    return [];
  }
}

function saveJournalEntries(entries) {
  localStorage.setItem(STORAGE_KEYS.journalEntries, JSON.stringify(entries));
}

// ---- Document library (IndexedDB — handles larger files like PDFs) ----

const DB_NAME = "BibleStudyWorkspaceDB";
const DB_VERSION = 1;
const DOCS_STORE = "documents";

let dbInstance = null;

function openDatabase() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DOCS_STORE)) {
        db.createObjectStore(DOCS_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => reject(request.error);
  });
}

async function addDocument(file) {
  const db = await openDatabase();
  const record = {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    type: (file.type || file.name.split(".").pop() || "FILE").toUpperCase(),
    size: file.size,
    dateAdded: new Date().toISOString(),
    blob: file
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOCS_STORE, "readwrite");
    tx.objectStore(DOCS_STORE).add(record);
    tx.oncomplete = () => resolve(record);
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllDocuments() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOCS_STORE, "readonly");
    const request = tx.objectStore(DOCS_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function deleteDocument(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOCS_STORE, "readwrite");
    tx.objectStore(DOCS_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ==================================================================
   6. INITIALIZATION
================================================================== */

function attachEventListeners() {
  // View tabs
  dom.viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => handleViewTabClick(tab.dataset.view));
  });

  // Study workspace
  dom.bookSearch.addEventListener("input", handleBookSearch);
  dom.chapterSelect.addEventListener("change", handleChapterChange);
  dom.saveNoteBtn.addEventListener("click", handleSaveNote);
  dom.clearNoteBtn.addEventListener("click", handleClearNote);
  dom.notesTextarea.addEventListener("input", handleUnsavedInput);

  // Journal
  dom.newEntryBtn.addEventListener("click", handleNewJournalEntry);
  dom.saveJournalBtn.addEventListener("click", handleSaveJournalEntry);
  dom.deleteJournalBtn.addEventListener("click", handleDeleteJournalEntry);
  dom.journalEditorTextarea.addEventListener("input", handleUnsavedInput);
  dom.journalTitleInput.addEventListener("input", handleUnsavedInput);

  // Library
  dom.fileUploadInput.addEventListener("change", handleUploadInputChange);
  dom.uploadDropzone.addEventListener("dragover", handleDropzoneDragOver);
  dom.uploadDropzone.addEventListener("dragleave", handleDropzoneDragLeave);
  dom.uploadDropzone.addEventListener("drop", handleDropzoneDrop);
}

async function init() {
  renderCurrentDate();
  attachEventListeners();

  // Study workspace: default to John 1 so it shows content immediately.
  renderBookList();
  renderNotesPanel(null);
  handleBookSelect("John");
  if (SCRIPTURE_DATA["John"] && SCRIPTURE_DATA["John"][1]) {
    dom.chapterSelect.value = "1";
    state.currentChapter = 1;
    renderScripture("John", 1);
  }

  // Journal: restore saved entries.
  renderJournalEntryList();
  renderJournalEditor(null);

  // Library: restore saved documents from IndexedDB.
  await renderLibraryList();

  setSaveStatus(true);
}

document.addEventListener("DOMContentLoaded", init);
