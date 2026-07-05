/* =========================================
   SURVEY & RESEARCH SPA DASHBOARD LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ once: true, duration: 650, offset: 80 });

  // 1. DATA: FIELD VISITS
  const fieldVisits = [
    {
      id: 1,
      title: "Visit 1",
      location: "MVP Government School, Jonnada",
      village: "Jonnada",
      date: "23-06-2026",
      desc: "Health and hygiene awareness programme conducted for school students focusing on personal hygiene, sanitation, and disease prevention.",
      image: "images/photo-1.png",
      mentor: "S Neeraja",
      teamStrength: 7,
      present: 7,
      absent: 0,
      activities: "Interactive session on handwashing techniques, distribution of soap kits, presentation on daily hygiene routines.",
      problems: "Lack of continuous water supply in school washrooms, students unaware of proper handwashing steps.",
      ideas: "Propose a water storage tank specifically for washrooms, create visual posters above sinks.",
      observations: "Students were highly enthusiastic but lacked practical resources at home.",
      learnings: "Visual aids and practical demonstrations are much more effective than verbal lectures for children.",
      conclusion: "The session successfully planted the seed of personal hygiene. Follow-up required to ensure continued practice."
    },
    {
      id: 2,
      title: "Visit 2",
      location: "Sri Rama Primary Health Clinic, Jonnada",
      village: "Jonnada",
      date: "24-06-2026",
      desc: "Interaction with healthcare professionals regarding preventive healthcare, sanitation, immunization, and community health awareness.",
      image: "images/survey-1 (4).png",
      mentor: "S Neeraja",
      teamStrength: 7,
      present: 7,
      absent: 0,
      activities: "Interviewed clinic staff, reviewed local disease data, discussed community outreach strategies.",
      problems: "High influx of seasonal flu and water-borne diseases due to poor village drainage.",
      ideas: "Organize a joint village cleanup drive with the clinic staff and local youth.",
      observations: "The clinic is well-equipped but understaffed. Most patients come for curative rather than preventive care.",
      learnings: "Community trust in the local clinic is high, making it the perfect hub for awareness campaigns.",
      conclusion: "Collaborating with local healthcare workers amplifies the reach and credibility of our hygiene messaging."
    },
    {
      id: 3,
      title: "Visit 3",
      location: "Meher Krupa Pradhamika Arogya Kendram",
      village: "Jonnada",
      date: "25-06-2026",
      desc: "Survey conducted to understand rural healthcare services, disease prevention, sanitation, and health awareness activities.",
      image: "images/survey-1 (5).png",
      mentor: "S Neeraja",
      teamStrength: 7,
      present: 6,
      absent: 1,
      activities: "Conducted 50+ patient surveys, analyzed sanitation facilities at the center, distributed informational pamphlets.",
      problems: "Poor waste segregation at the center, lack of waiting area hygiene.",
      ideas: "Donate color-coded dustbins and train the janitorial staff on waste segregation.",
      observations: "Patients spend a long time waiting, providing a captive audience for health education videos.",
      learnings: "Infrastructure gaps often force people into unhygienic practices despite their awareness.",
      conclusion: "Improving infrastructure is just as important as raising awareness."
    },
    {
      id: 4,
      title: "Visit 4",
      location: "Chintalavalasa Grama Sachivalayam",
      village: "Chintalavalasa",
      date: "27-06-2026",
      desc: "Studied sanitation, waste management, drinking water supply, and government welfare schemes related to public health.",
      image: "images/survey-2.png",
      mentor: "S Neeraja",
      teamStrength: 7,
      present: 7,
      absent: 0,
      activities: "Met with the Panchayat Secretary, reviewed water purification plant logs, surveyed nearby households.",
      problems: "The central water purification plant frequently breaks down. Open drains in several streets.",
      ideas: "Implement a community-funded maintenance model for the water plant.",
      observations: "Government schemes exist on paper but implementation is delayed due to funding bottlenecks.",
      learnings: "Local governance plays the most critical role in sustained community health.",
      conclusion: "Advocacy and continuous follow-up with local authorities are essential for long-term impact."
    },
    {
      id: 5,
      title: "Visit 5",
      location: "Bodduvari Junction, Santha Pet",
      village: "Santha Pet",
      date: "29-06-2026",
      desc: "Surveyed residential areas regarding waste disposal, drainage, drinking water, sanitation, and personal hygiene practices.",
      image: "images/survey-3.png",
      mentor: "S Neeraja",
      teamStrength: 7,
      present: 7,
      absent: 0,
      activities: "Door-to-door surveys of 120 households, distributed chlorine tablets, checked water storage methods.",
      problems: "Stagnant water near houses breeding mosquitoes. Improper storage of drinking water.",
      ideas: "Launch a 'Dry Day' campaign once a week to empty all stagnant water containers.",
      observations: "Most families boil water only during the rainy season, not year-round.",
      learnings: "Behavioral change requires linking hygiene practices to immediate economic benefits (less money spent on doctors).",
      conclusion: "Targeted, seasonal awareness campaigns might yield better compliance."
    },
    {
      id: 6,
      title: "Visit 6",
      location: "Boddavalasa Commercial Area",
      village: "Boddavalasa",
      date: "30-06-2026",
      desc: "Surveyed commercial establishments to assess shop cleanliness, sanitation practices, and waste management.",
      image: "images/photo-1.png",
      mentor: "S Neeraja",
      teamStrength: 7,
      present: 7,
      absent: 0,
      activities: "Interviewed 45 shop owners, inspected food stalls for hygiene, assessed market waste disposal.",
      problems: "Food vendors lack access to clean running water. Huge amount of plastic waste dumped behind the market.",
      ideas: "Work with the market association to install a communal wash station and ban single-use plastics.",
      observations: "Economic priorities completely overshadow hygiene concerns among vendors.",
      learnings: "Hygiene solutions for commercial areas must be low-cost and highly convenient.",
      conclusion: "A collaborative approach with market leaders is necessary to enforce cleanliness standards."
    },
    {
      id: 7,
      title: "Visit 7",
      location: "Chelavuru",
      village: "Chelavuru",
      date: "01-07-2026",
      desc: "Conducted household surveys and community awareness activities on hygiene, safe drinking water, and environmental cleanliness.",
      image: "images/photo-1.png",
      mentor: "S Neeraja",
      teamStrength: 7,
      present: 6,
      absent: 1,
      activities: "Evening community gathering, street play on malaria prevention, surveyed 80 marginalized households.",
      problems: "Zero access to private toilets in a specific hamlet. High reliance on an contaminated pond.",
      ideas: "Draft a petition to the local MLA for immediate sanctioning of community toilets under Swachh Bharat.",
      observations: "The community is highly receptive to street plays and interactive media.",
      learnings: "Entertainment-Education (Edutainment) is the most powerful tool for rural awareness.",
      conclusion: "Creative messaging leaves a lasting impact compared to traditional surveys."
    },
    {
      id: 8,
      title: "Visit 8",
      location: "Regubilli",
      village: "Regubilli",
      date: "02-07-2026",
      desc: "Final community survey focusing on household hygiene, sanitation, waste disposal, and community participation in cleanliness.",
      image: "images/survey-1 (4).png",
      mentor: "S Neeraja",
      teamStrength: 7,
      present: 7,
      absent: 0,
      activities: "Final data collection, focus group discussions with village elders, consolidated feedback.",
      problems: "Overall fatigue with surveys without seeing tangible on-ground changes.",
      ideas: "Ensure that the final report is shared with the village Panchayat along with actionable steps.",
      observations: "Elders hold significant influence over community sanitation practices.",
      learnings: "Top-down influence (from elders to youth) works well for enforcing community rules.",
      conclusion: "The project provided profound insights into the gap between awareness and implementation. Continuous engagement is key."
    }
  ];

  // 2. DATA: SURVEY FORMS
  const surveyForms = [];
  const villages = ["Jonnada", "Santha Pet", "Boddavalasa", "Chelavuru", "Regubilli"];
  for(let i=1; i<=24; i++) {
    surveyForms.push({
      id: `CSP-${1000+i}`,
      village: villages[Math.floor(Math.random() * villages.length)],
      date: `2${Math.floor(Math.random()*9)+1}-06-2026`,
      image: `images/${["photo-1.png", "survey-1 (4).png", "survey-1 (5).png", "survey-2.png", "survey-3.png"][i%5]}`,
      uploadedBy: "Team Alpha"
    });
  }

  // 3. DATA: QUESTIONS
  const questionsData = [
    { q: "Do you wash your hands with soap before meals?", y: 78, n: 12, s: 10 },
    { q: "Do you use boiled or purified drinking water?", y: 65, n: 25, s: 10 },
    { q: "Do you have access to a private household toilet?", y: 85, n: 15, s: 0 },
    { q: "Do you segregate dry and wet waste?", y: 30, n: 60, s: 10 },
    { q: "Are you aware of mosquito-borne diseases like Dengue?", y: 92, n: 8, s: 0 },
    { q: "Do you consume fresh fruits and vegetables daily?", y: 55, n: 20, s: 25 }
  ];

  // 4. GENERATE FIELD VISITS
  const visitsGrid = document.getElementById('visits-grid');
  const timelineWrap = document.getElementById('visits-timeline');
  if(visitsGrid && timelineWrap) {
    let visitsHTML = '';
    let timelineHTML = '';
    
    fieldVisits.forEach((v, index) => {
      // Grid Card
      visitsHTML += `
        <div class="col" data-aos="fade-up" data-aos-delay="${(index%4)*100}">
          <div class="card glass-card h-100 tilt-card overflow-hidden" style="border: 1px solid var(--border);">
            <div style="height: 200px; overflow: hidden; position: relative;">
              <span class="badge bg-accent text-white position-absolute top-0 start-0 m-3 z-3">Completed</span>
              <img src="${v.image}" class="w-100 h-100 object-fit-cover" style="transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e9ecef%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23495057%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EImage%3C%2Ftext%3E%3C%2Fsvg%3E'">
            </div>
            <div class="card-body p-4 d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="text-accent fw-bold text-uppercase" style="font-size:0.85rem;">${v.title}</span>
                <span class="text-muted" style="font-size:0.85rem;"><i class="fa-regular fa-calendar me-1"></i> ${v.date}</span>
              </div>
              <h4 class="h4 mb-2 text-truncate" title="${v.location}">${v.location}</h4>
              <p class="text-muted small mb-3"><i class="fa-solid fa-location-dot me-1"></i> ${v.village}</p>
              <p class="mb-4" style="font-size: 0.95rem; flex-grow: 1;">${v.desc}</p>
              <button class="btn btn-outline w-100 btn-view-visit" data-id="${v.id}">View Complete Report</button>
            </div>
          </div>
        </div>
      `;

      // Timeline Item
      timelineHTML += `
        <div class="timeline-v-item" data-aos="fade-up">
          <div class="timeline-v-dot"></div>
          <div class="timeline-v-content">
            <span class="text-accent fw-bold">${v.title} &bull; ${v.date}</span>
            <h4 class="h5 mt-2">${v.location}</h4>
            <p class="text-muted mb-3 small">${v.desc}</p>
            <button class="btn btn-sm btn-solid btn-view-visit" data-id="${v.id}">Details</button>
          </div>
        </div>
      `;
    });
    visitsGrid.innerHTML = visitsHTML;
    timelineWrap.innerHTML = timelineHTML;
    if (window.AOS) AOS.refresh();
  }

  // 5. VISIT MODAL LOGIC
  const visitModal = document.getElementById('visitModal');
  const closeVisitBtn = document.getElementById('closeVisitBtn');
  const mvPrevBtn = document.getElementById('mvPrevBtn');
  const mvNextBtn = document.getElementById('mvNextBtn');
  let currentVisitId = 1;

  function openVisitModal(id) {
    const visit = fieldVisits.find(v => v.id === id);
    if(!visit || !visitModal) return;
    currentVisitId = id;

    document.getElementById('mvTitle').innerText = `${visit.title} - ${visit.village}`;
    document.getElementById('mvImage').src = visit.image;
    document.getElementById('mvDate').innerText = visit.date;
    document.getElementById('mvLocation').innerText = visit.location;
    document.getElementById('mvMentor').innerText = visit.mentor;
    document.getElementById('mvTeam').innerText = visit.teamStrength;
    document.getElementById('mvPresent').innerText = visit.present;
    document.getElementById('mvAbsent').innerText = visit.absent;
    
    document.getElementById('mvActivities').innerText = visit.activities;
    document.getElementById('mvProblems').innerText = visit.problems;
    document.getElementById('mvIdeas').innerText = visit.ideas;
    document.getElementById('mvObservations').innerText = visit.observations;
    document.getElementById('mvLearnings').innerText = visit.learnings;
    document.getElementById('mvConclusion').innerText = visit.conclusion;

    // Generate mini gallery
    let galHtml = '';
    for(let i=1; i<=2; i++) {
      galHtml += `<div class="masonry-item"><img src="images/${["photo-1.png", "survey-1 (4).png", "survey-1 (5).png", "survey-2.png", "survey-3.png"][(id+i)%5]}" class="img-fluid rounded shadow-sm" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e9ecef%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23495057%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EGallery%3C%2Ftext%3E%3C%2Fsvg%3E'"></div>`;
    }
    const modalGallery = document.getElementById('mvGallery');
    if (modalGallery) modalGallery.innerHTML = galHtml;

    if (mvPrevBtn) mvPrevBtn.disabled = id === 1;
    if (mvNextBtn) mvNextBtn.disabled = id === fieldVisits.length;

    visitModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scroll
  }

  function closeVisit() {
    if (!visitModal) return;
    visitModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  visitModal?.addEventListener('click', (e) => {
    if (e.target === visitModal) closeVisit();
  });

  document.body.addEventListener('click', (e) => {
    if(e.target.closest('.btn-view-visit')) {
      const id = parseInt(e.target.closest('.btn-view-visit').getAttribute('data-id'));
      openVisitModal(id);
    }
  });

  if(closeVisitBtn) closeVisitBtn.addEventListener('click', closeVisit);
  if(mvPrevBtn) mvPrevBtn.addEventListener('click', () => openVisitModal(currentVisitId - 1));
  if(mvNextBtn) mvNextBtn.addEventListener('click', () => openVisitModal(currentVisitId + 1));

  // 6. GENERATE SURVEY FORMS GALLERY
  const surveyMasonry = document.getElementById('survey-masonry');
  function renderSurveyForms(filter = 'all') {
    if(!surveyMasonry) return;
    let html = '';
    surveyForms.forEach((s) => {
      if(filter === 'all' || s.village === filter) {
        html += `
          <div class="masonry-item card p-3 glass-card text-center" data-aos="zoom-in" data-image="${s.image}">
            <img src="${s.image}" class="img-fluid rounded mb-3 cursor-zoom lightbox-trigger" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e9ecef%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23495057%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EForm%3C%2Ftext%3E%3C%2Fsvg%3E'">
            <h5 class="h5 mb-1">${s.id}</h5>
            <p class="text-muted small mb-2">${s.village} &bull; ${s.date}</p>
            <div class="d-flex justify-content-center gap-2">
              <button type="button" class="btn btn-sm btn-outline btn-form-view" data-image="${s.image}"><i class="fa-solid fa-eye"></i> View</button>
              <button type="button" class="btn btn-sm btn-solid btn-form-download" data-image="${s.image}"><i class="fa-solid fa-download"></i> DL</button>
            </div>
          </div>
        `;
      }
    });
    surveyMasonry.innerHTML = html;
  }
  renderSurveyForms();
  if (window.AOS) AOS.refresh();

  // Survey form actions
  surveyMasonry?.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.btn-form-view');
    const downloadBtn = e.target.closest('.btn-form-download');
    const card = e.target.closest('.masonry-item');
    const image = card?.getAttribute('data-image');

    if (viewBtn && image) {
      if (!lightboxImg || !lightboxOverlay) return;
      lightboxImg.src = image;
      lightboxOverlay.classList.add('active');
      return;
    }

    if (downloadBtn && image) {
      const anchor = document.createElement('a');
      anchor.href = image;
      anchor.download = image.split('/').pop();
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      return;
    }
  });

  // Filter Buttons
  const filterTags = document.querySelectorAll('.filter-tag');
  filterTags.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterTags.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderSurveyForms(e.target.getAttribute('data-filter'));
      if (window.AOS) AOS.refresh();
    });
  });

  // 7. GENERATE QUESTIONS
  const questionsGrid = document.getElementById('questions-grid');
  if(questionsGrid) {
    let qHtml = '';
    questionsData.forEach((q, i) => {
      qHtml += `
        <div class="col-lg-6" data-aos="fade-up" data-aos-delay="${(i%2)*100}">
          <div class="card p-4 h-100">
            <h4 class="h5 mb-3">${i+1}. ${q.q}</h4>
            
            <div class="d-flex justify-content-between text-success mb-1 small fw-bold"><span>Yes</span><span>${q.y}%</span></div>
            <div class="progress mb-3" style="height: 10px;"><div class="progress-bar bg-success" style="width: ${q.y}%"></div></div>
            
            <div class="d-flex justify-content-between text-danger mb-1 small fw-bold"><span>No</span><span>${q.n}%</span></div>
            <div class="progress mb-3" style="height: 10px;"><div class="progress-bar bg-danger" style="width: ${q.n}%"></div></div>
            
            <div class="d-flex justify-content-between text-warning mb-1 small fw-bold"><span>Sometimes / NA</span><span>${q.s}%</span></div>
            <div class="progress" style="height: 10px;"><div class="progress-bar bg-warning" style="width: ${q.s}%"></div></div>
          </div>
        </div>
      `;
    });
    questionsGrid.innerHTML = qHtml;
  }

  // 8. CHART.JS INITIALIZATION
  // Common Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };
  
  const accent = '#4E7A52';
  const primary = '#2C3E2E';
  const warning = '#F2A65A';
  const danger = '#C85A5A';
  const info = '#5A9FC8';

  // 1. Gender Pie
  const ctxGender = document.getElementById('chartGenderPie');
  const chartsReady = typeof Chart !== 'undefined';
  const showChartFallback = (canvas) => {
    const wrap = canvas?.closest('.chart-container');
    if (wrap) wrap.innerHTML = '<div class="text-muted text-center" style="padding:3rem 1rem;">Chart library unavailable. Summary values are shown below.</div>';
  };

  if(ctxGender && chartsReady) {
    new Chart(ctxGender, {
      type: 'pie',
      data: { labels: ['Male', 'Female'], datasets: [{ data: [55, 45], backgroundColor: [primary, accent] }] },
      options: chartOptions
    });
  } else if (ctxGender) showChartFallback(ctxGender);

  // 2. Health Awareness Doughnut
  const ctxAwareness = document.getElementById('chartAwareness');
  if(ctxAwareness && chartsReady) {
    new Chart(ctxAwareness, {
      type: 'doughnut',
      data: { labels: ['High', 'Moderate', 'Low'], datasets: [{ data: [30, 50, 20], backgroundColor: [accent, warning, danger] }] },
      options: chartOptions
    });
  } else if (ctxAwareness) showChartFallback(ctxAwareness);

  // 3. Hygiene Score Radar
  const ctxRadar = document.getElementById('chartRadar');
  if(ctxRadar && chartsReady) {
    new Chart(ctxRadar, {
      type: 'radar',
      data: { 
        labels: ['Hand Washing', 'Clean Water', 'Sanitation', 'Waste Disposal', 'Nutrition'], 
        datasets: [{ label: 'Average Score', data: [80, 65, 85, 40, 55], backgroundColor: 'rgba(78, 122, 82, 0.2)', borderColor: accent, pointBackgroundColor: primary }] 
      },
      options: chartOptions
    });
  } else if (ctxRadar) showChartFallback(ctxRadar);

  // 4. Village Bar
  const ctxVBar = document.getElementById('chartVillageBar');
  if(ctxVBar && chartsReady) {
    new Chart(ctxVBar, {
      type: 'bar',
      data: { 
        labels: villages, 
        datasets: [{ label: 'Surveys Conducted', data: [85, 95, 75, 110, 85], backgroundColor: accent, borderRadius: 6 }] 
      },
      options: chartOptions
    });
  } else if (ctxVBar) showChartFallback(ctxVBar);

  // 5. Daily Progress Line
  const ctxLine = document.getElementById('chartLine');
  if(ctxLine && chartsReady) {
    new Chart(ctxLine, {
      type: 'line',
      data: { 
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8'], 
        datasets: [{ label: 'Forms Collected', data: [40, 55, 60, 45, 70, 65, 80, 35], borderColor: primary, tension: 0.4, fill: true, backgroundColor: 'rgba(44, 62, 46, 0.1)' }] 
      },
      options: chartOptions
    });
  } else if (ctxLine) showChartFallback(ctxLine);

  // 6. Waste Management Horizontal Bar
  const ctxHBar = document.getElementById('chartHBar');
  if(ctxHBar && chartsReady) {
    new Chart(ctxHBar, {
      type: 'bar',
      data: { 
        labels: ['Open Dumping', 'Burning', 'Municipality Collection', 'Composting'], 
        datasets: [{ label: '% of Households', data: [45, 30, 20, 5], backgroundColor: [danger, warning, accent, primary], borderRadius: 6 }] 
      },
      options: { ...chartOptions, indexAxis: 'y' }
    });
  } else if (ctxHBar) showChartFallback(ctxHBar);

  // 7. Water Source Stacked Bar
  const ctxStacked = document.getElementById('chartStacked');
  if(ctxStacked && chartsReady) {
    new Chart(ctxStacked, {
      type: 'bar',
      data: { 
        labels: villages, 
        datasets: [
          { label: 'Tap Water', data: [40, 50, 30, 20, 35], backgroundColor: info },
          { label: 'Borewell', data: [30, 20, 40, 60, 45], backgroundColor: warning },
          { label: 'Pond/Open Well', data: [10, 5, 20, 15, 10], backgroundColor: danger }
        ] 
      },
      options: { ...chartOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
    });
  } else if (ctxStacked) showChartFallback(ctxStacked);

  // 9. ANIMATED COUNTERS
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 2000; 
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        
        const timer = setInterval(() => {
          current += Math.ceil(target / 50); 
          if (current >= target) {
            counter.innerText = target;
            clearInterval(timer);
          } else {
            counter.innerText = current;
          }
        }, stepTime);
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));

  // 10. LIGHTBOX LOGIC
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.body.addEventListener('click', (e) => {
    if(e.target.classList.contains('lightbox-trigger')) {
      if (!lightboxImg || !lightboxOverlay) return;
      lightboxImg.src = e.target.src;
      lightboxOverlay.classList.add('active');
    }
  });
  if(lightboxClose) lightboxClose.addEventListener('click', () => lightboxOverlay.classList.remove('active'));
  if(lightboxOverlay) lightboxOverlay.addEventListener('click', (e) => {
    if(e.target === lightboxOverlay) lightboxOverlay.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVisit();
      if (lightboxOverlay) lightboxOverlay.classList.remove('active');
      closeLogin();
    }
  });

  // 11. ADMIN LOGIN LOGIC
  const adminLoginModal = document.getElementById('adminLoginModal');
  const loginCloseBtn = document.getElementById('loginCloseBtn');
  const doLoginBtn = document.getElementById('doLoginBtn');
  const navAdminLoginBtn = document.getElementById('nav-admin-login-btn');
  const navAdminLogoutBtn = document.getElementById('nav-admin-logout-btn');
  const drawerAdminLoginBtn = document.getElementById('drawer-admin-login-btn');
  const drawerAdminLogoutBtn = document.getElementById('drawer-admin-logout-btn');
  const loginError = document.getElementById('loginError');

  function openLogin() { adminLoginModal?.classList.add('active'); }
  function closeLogin() { adminLoginModal?.classList.remove('active'); if (loginError) loginError.style.display = 'none'; }
  if (location.hash === '#admin-dashboard') {
    window.setTimeout(openLogin, 300);
  }

  adminLoginModal?.addEventListener('click', (e) => {
    if (e.target === adminLoginModal) closeLogin();
  });

  if(navAdminLoginBtn) navAdminLoginBtn.addEventListener('click', (e) => { e.preventDefault(); openLogin(); });
  if(drawerAdminLoginBtn) drawerAdminLoginBtn.addEventListener('click', (e) => { e.preventDefault(); openLogin(); });
  if(loginCloseBtn) loginCloseBtn.addEventListener('click', closeLogin);

  if(doLoginBtn) {
    doLoginBtn.addEventListener('click', () => {
      const u = document.getElementById('adminUser').value;
      const p = document.getElementById('adminPass').value;
      if(u === 'admin' && p === 'admin123') {
        document.body.classList.remove('guest-mode');
        document.body.classList.add('logged-in');
        closeLogin();
        // Smooth scroll to dashboard
        document.getElementById('admin-dashboard')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        if (loginError) loginError.style.display = 'block';
      }
    });
  }

  function doLogout(e) {
    e.preventDefault();
    document.body.classList.add('guest-mode');
    document.body.classList.remove('logged-in');
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  if(navAdminLogoutBtn) navAdminLogoutBtn.addEventListener('click', doLogout);
  if(drawerAdminLogoutBtn) drawerAdminLogoutBtn.addEventListener('click', doLogout);

  // 12. GLOBAL SEARCH SIMULATION
  const globalSearch = document.getElementById('global-search');
  if(globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      // Filter Survey Forms
      if(surveyMasonry) {
        const items = surveyMasonry.querySelectorAll('.masonry-item');
        items.forEach(item => {
          const text = item.innerText.toLowerCase();
          item.style.display = text.includes(q) ? 'block' : 'none';
        });
      }
      // Filter Field Visits
      if(visitsGrid) {
        const cards = visitsGrid.querySelectorAll('.col');
        cards.forEach(card => {
          const text = card.innerText.toLowerCase();
          card.style.display = text.includes(q) ? 'block' : 'none';
        });
      }
    });
  }

});

