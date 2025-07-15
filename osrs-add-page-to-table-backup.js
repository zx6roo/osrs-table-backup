// Tool: OSRS Wiki LightTable Page Backup
// Description: Adds the current OSRS Wiki page and its lighttable highlight state to a localStorage backup.
// Tags: OSRS, wiki, localStorage, bookmarklet, JavaScript, data backup, lighttable
// ***DO NOT copy comments into bookmarklet ***

(() => {
  // Get existing rs:lightTable data from localStorage
  const rsData = JSON.parse(localStorage.getItem('rs:lightTable') || '{}');

  // Gather metadata about the current wiki page
  const pageId = String(mw.config.get("wgArticleId"));
  const pageName = mw.config.get("wgPageName");
  const url = window.location.href;
  const numTables = document.querySelectorAll("table.lighttable").length;

  // Attempt to find the matching lightTable key by counting dot segments
  let matchedKey = null;
  let highlightString = null;
  for (const [key, value] of Object.entries(rsData)) {
    const segmentCount = value.split('.').length;
    if (segmentCount === numTables) {
      matchedKey = key;
      highlightString = value;
      break;
    }
  }

  // Extract the table number from the first lighttable on the page
  const firstTable = document.querySelector("table.lighttable");
  let tableNo = "Unknown";
  if (firstTable) {
    const classWithNumber = Array.from(firstTable.classList).find(cls => /-\d+$/.test(cls));
    const match = classWithNumber?.match(/-(\d+)$/);
    tableNo = match ? match[1] : "Unknown";
  }

  // Build the new row of data to be saved
  const newRow = { pageId, pageName, url, tableNo, highlightString };

  // Load or initialise the backup store in localStorage
  let collected = [];
  try {
    collected = JSON.parse(localStorage.getItem("osrsTableBackup") || "[]");
  } catch (e) {}

  // Remove any existing entry for this page (deduplication)
  collected = collected.filter(row => row.pageId !== pageId);

  // Add the updated version
  collected.push(newRow);

  // Save the updated collection to localStorage
  localStorage.setItem("osrsTableBackup", JSON.stringify(collected));

  // Show confirmation popup (floating toast)
  const toast = document.createElement("div");
  toast.textContent = `✅ Saved: ${pageName}`;
  Object.assign(toast.style, {
    position: "fixed",
    top: "1.5em",
    right: "1.5em",
    background: "#222",
    color: "#fff",
    padding: "10px 18px",
    fontSize: "14px",
    fontFamily: "sans-serif",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
    zIndex: 9999,
    opacity: "0",
    transition: "opacity 0.3s ease-in-out",
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 2500);
})();
