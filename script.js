document.addEventListener("DOMContentLoaded", function () {
  // LEFT Sidebar
  const burgerBtn = document.querySelector('.burgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeSidebar');

  if (burgerBtn && sidebar && overlay && closeBtn) {
    burgerBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('active');
    });
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // RIGHT (Settings) Sidebar
  const openRightSidebar = document.getElementById('openRightSidebar');
  const rightSidebar = document.getElementById('rightSidebar');
  const closeRightSidebar = document.getElementById('closeRightSidebar');
  const rightOverlay = document.getElementById('rightOverlay');

  if (openRightSidebar && rightSidebar && closeRightSidebar && rightOverlay) {
    openRightSidebar.addEventListener('click', () => {
      rightSidebar.classList.add('open');
      rightOverlay.classList.add('active');
    });
    closeRightSidebar.addEventListener('click', () => {
      rightSidebar.classList.remove('open');
      rightOverlay.classList.remove('active');
    });
    rightOverlay.addEventListener('click', () => {
      rightSidebar.classList.remove('open');
      rightOverlay.classList.remove('active');
    });
  }

  // RIGHT (Search) Sidebar
  const openSearchSidebar = document.getElementById('openSearchSidebar');
  const searchSidebar = document.getElementById('searchSidebar');
  const closeSearchSidebar = document.getElementById('closeSearchSidebar');
  const searchOverlay = document.getElementById('searchOverlay');

  if (openSearchSidebar && searchSidebar && closeSearchSidebar && searchOverlay) {
    openSearchSidebar.addEventListener('click', () => {
      searchSidebar.classList.add('open');
      searchOverlay.classList.add('active');
    });
    closeSearchSidebar.addEventListener('click', () => {
      searchSidebar.classList.remove('open');
      searchOverlay.classList.remove('active');
    });
    searchOverlay.addEventListener('click', () => {
      searchSidebar.classList.remove('open');
      searchOverlay.classList.remove('active');
    });
  }
});

// Hero section search Bar
const searchBox = document.querySelector(".search-box");
const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("focus", () => {
  searchBox.classList.add("active");
});

searchInput.addEventListener("blur", () => {
  setTimeout(() => {
    searchBox.classList.remove("active");
  }, 200);
});




// -------- Homepage Surah List --------
const surahGrid = document.getElementById("surahGrid");
const juzGrid = document.getElementById("juzGrid");
const revGrid = document.getElementById("revGrid");
const sortBtn = document.getElementById("sortBtn");
const sortIcon = document.getElementById("sortIcon");

let surahData = [];
let ascending = true;

// Fetch Surahs
async function fetchSurahs() {
  if (!surahGrid) return;
  try {
    const res = await fetch("https://api.alquran.cloud/v1/surah");
    const json = await res.json();
    surahData = json.data.map(s => ({
      id: s.number,
      name: s.englishName,
      translation: s.englishNameTranslation || s.englishName,
      ayahs: s.numberOfAyahs + " Ayahs",
      arabic: s.name
    }));
    renderSurahs();
    return surahData; // ✅ return for juz
  } catch (err) {
    surahGrid.innerHTML = "<div class='alert alert-warning'>Error loading surahs</div>";
    return [];
  }
}


function renderIntoGrid(containerEl, list) {
  containerEl.innerHTML = "";
  list.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="surah-card" onclick="window.location.href='surah.html?id=${item.id}'">
        <div class="surah-number">${item.id}</div>
        <div class="surah-meta">
          <p class="surah-title">${item.name}</p>
          <p class="surah-translation">${item.translation}</p>
        </div>
        <div class="surah-arabic">
          ${item.arabic}
          <p class="surah-ayahs">${item.ayahs}</p>
        </div>
      </div>
    `;
    containerEl.appendChild(col);
  });
}

function renderSurahs() {
  const list = sortList(surahData, ascending);
  renderIntoGrid(surahGrid, list);
}

function sortList(list, asc = true) {
  return [...list].sort((a, b) => asc ? a.id - b.id : b.id - a.id);
}

if (sortBtn) {
  sortBtn.addEventListener("click", () => {
    ascending = !ascending;
    sortBtn.firstChild.textContent = (ascending ? 'ASCENDING ' : 'DESCENDING ');
    sortIcon.className = ascending ? "bi bi-chevron-up ms-2" : "bi bi-chevron-down ms-2";
    renderSurahs();
  });
}

// -------- Juz List --------
async function fetchJuzs() {
  if (!juzGrid) return;
  try {
    const res = await fetch("https://api.quran.com/api/v4/juzs");
    const json = await res.json();

    juzGrid.innerHTML = "";
    json.juzs.forEach(juz => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4"; // ✅ 3-column layout

      // Surahs list from verse_mapping keys
      const surahNumbers = Object.keys(juz.verse_mapping).map(n => parseInt(n));

      let surahCards = "";
      surahNumbers.forEach(num => {
        const surah = surahData.find(s => s.id === num);
        if (surah) {
          surahCards += `
            <div class="surah-card mb-3" onclick="window.location.href='surah.html?id=${surah.id}'">
              <div class="surah-number">${surah.id}</div>
              <div class="surah-meta">
                <p class="surah-title">${surah.name}</p>
                <p class="surah-translation">${surah.translation}</p>
              </div>
              <div class="surah-arabic">
                ${surah.arabic}
                <p class="surah-ayahs">${surah.ayahs}</p>
              </div>
            </div>
          `;
        }
      });

      col.innerHTML = `
        <div class="juz-block p-3 border rounded shadow-sm h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">Juz ${juz.juz_number}</h5>
            <a href="juz.html?id=${juz.juz_number}" class="btn btn-sm btn-success">Read Juz</a>
          </div>
          ${surahCards}
        </div>
      `;
      juzGrid.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    juzGrid.innerHTML = "<div class='alert alert-warning'>Error loading Juz</div>";
  }
}



// -------- Revelation Order --------
async function fetchRevelation() {
  if (!revGrid) return;
  try {
    const res = await fetch("https://api.quran.com/api/v4/chapters?order=revelation");
    const json = await res.json();
    console.log("Revelation API Response:", json); // Debugging

    revGrid.innerHTML = "";
    json.chapters.forEach(s => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="surah-card" onclick="window.location.href='surah.html?id=${s.id}'">
          <div class="surah-number">#${s.revelation_order}</div>
          <div class="surah-meta">
            <p class="surah-title">${s.name_simple}</p>
            <p class="surah-translation">${s.translated_name.name}</p>
          </div>
          <div class="surah-arabic">${s.name_arabic}</div>
        </div>
      `;
      revGrid.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    revGrid.innerHTML = "<div class='alert alert-warning'>Error loading Revelation Order</div>";
  }
}




// -------- Surah Detail Page --------
const params = new URLSearchParams(window.location.search);
let surahId = parseInt(params.get("id") || 1);

async function loadSurah(id) {
  if (!document.getElementById("surahTitle")) return;
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
    const data = await res.json();
    const surah = data.data;
    document.getElementById("surahTitle").textContent = `${surah.englishName}`;

    // Translation
    const resTrans = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.asad`);
    const dataTrans = await resTrans.json();

    let transHtml = "";
    let readHtml = "";
    dataTrans.data.ayahs.forEach((ayah, i) => {
      transHtml += `<div class="ayah-block"><span class="badge bg-secondary me-2">${i + 1}</span>${ayah.text}</div>`;
    });

    surah.ayahs.forEach((ayah, i) => {
      readHtml += `<div class="ayah-block quran-arabic"><span class="badge bg-success me-2">${i + 1}</span>${ayah.text}</div>`;
    });

    document.getElementById("translationContent").innerHTML = transHtml;
    document.getElementById("readingContent").innerHTML = readHtml;

    // Audio
    document.getElementById("playAudio").setAttribute("href", `https://verses.quran.com/${id}/audio.mp3`);

    // Navigation
    document.getElementById("prevSurah").onclick = () => window.location.href = `surah.html?id=${id - 1}`;
    document.getElementById("nextSurah").onclick = () => window.location.href = `surah.html?id=${id + 1}`;

  } catch (err) {
    document.getElementById("translationContent").innerHTML = "<div class='alert alert-danger'>Error loading surah.</div>";
  }
}


// -------- Init Calls --------
(async function init() {
  await fetchSurahs();   // ✅ Pehle surahs load honge
  await fetchJuzs();     // ✅ Ab juz load hoga, aur duplicate ni hoga
  fetchRevelation();
  loadSurah(surahId);
})();



let currentSurah = 1;
const pageSize = 10; // har page par kitni ayahs dikhani hain (aap badal sakte ho)

// Load Surah Function
async function loadSurah(id) {
  if (!document.getElementById("surahTitle")) return;
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
    const data = await res.json();
    const surah = data.data;

    // Update title
    document.getElementById("surahTitle").textContent = surah.englishName;
    currentSurah = id;

    // Translation
    const resTrans = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.asad`);
    const dataTrans = await resTrans.json();

    let transHtml = "";
    let readHtml = "";

    // ✅ Surah Arabic Name at top
transHtml = `<h4 class="text-center mb-4 fw-bold surah-arabic-name">${surah.name}</h4>`;

// ✅ Bismillah only once, under Surah name
if (id !== 1 && id !== 9) {
  transHtml += `<p class="quran-arabic text-center fs-4 mb-4">
    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
  </p>`;
}

// ✅ Ab ayahs ka loop chalega (isme Bismillah nahi repeat hogi)
let totalPages = Math.ceil(dataTrans.data.ayahs.length / pageSize);
for (let page = 0; page < totalPages; page++) {
  transHtml += `<div class="page-block mb-5">`;

  let start = page * pageSize;
  let end = Math.min(start + pageSize, dataTrans.data.ayahs.length);

  for (let i = start; i < end; i++) {
    transHtml += `
      <div class="ayah-block mb-4">
        <div class="quran-arabic text-end mb-2" dir="rtl">
          <span class="badge bg-success ms-2">${i + 1}</span>
          ${surah.ayahs[i]?.text || ""}
        </div>
        <div class="translation text-start">
          <span class="badge bg-secondary me-2">${i + 1}</span>
          ${dataTrans.data.ayahs[i].text}
        </div>
      </div>
    `;
  }

  transHtml += `<div class="text-center mt-3"><small>Page ${page + 1} of ${totalPages}</small></div>`;
  transHtml += `</div>`;
}


    readHtml = `<h4 class="text-center mb-4 fw-bold surah-arabic-name">${surah.name}</h4>`;

// ✅ Bismillah only once, under Surah name
if (id !== 1 && id !== 9) {
  readHtml += `<p class="quran-arabic text-center fs-4 mb-4">
    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
  </p>`;
}

totalPages = Math.ceil(surah.ayahs.length / pageSize);
for (let page = 0; page < totalPages; page++) {
  readHtml += `
    <div class="page-block mb-5">
      <div class="quran-reading mx-auto text-center" style="max-width:600px;">
        <p class="quran-arabic fs-3" dir="rtl" style="line-height:2;">
  `;

  let start = page * pageSize;
  let end = Math.min(start + pageSize, surah.ayahs.length);

  for (let i = start; i < end; i++) {
    readHtml += `${surah.ayahs[i].text} <span class="badge bg-light text-dark">${i + 1}</span> `;
  }

  readHtml += `</p></div>`;
  readHtml += `<div class="text-center mt-3 fs-6"><small>${page + 1}</small></div>`;
  readHtml += `</div>`;
}


    // Inject content
    document.getElementById("translationContent").innerHTML = transHtml;
    document.getElementById("readingContent").innerHTML = readHtml;

  } catch (err) {
    document.getElementById("translationContent").innerHTML =
      "<div class='alert alert-danger'>Error loading surah.</div>";
  }
}

// ✅ Buttons
document.getElementById("prevSurah").addEventListener("click", () => {
  if (currentSurah > 1) loadSurah(currentSurah - 1);
});

document.getElementById("nextSurah").addEventListener("click", () => {
  if (currentSurah < 114) loadSurah(currentSurah + 1);
});


// ✅ Init
loadSurah(currentSurah);





// ✅ Reading Tab – paragraph style (centered, max 500px)
readHtml = `<p dir="rtl">`;
surah.ayahs.forEach((ayah, i) => {
  readHtml += `${ayah.text} <span class="badge bg-light text-dark">${i + 1}</span> `;
});
readHtml += `</p>`;





