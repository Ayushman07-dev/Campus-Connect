/* ===== CampusConnect – script.js =====
   Single-page app using hash routing and localStorage.
   Routes: #/  #/events  #/event/ID  #/register/ID  #/saved  #/dashboard
*/
(function () {
  'use strict';

  /* ---------- Data ---------- */
  const CATEGORIES = ['Hackathon', 'Workshop', 'Internship', 'Cultural', 'Sports', 'Seminar'];
  const CAT_BLURB = {
    Hackathon: 'Build in teams, win prizes',
    Workshop: 'Hands-on skill sessions',
    Internship: 'Drives and openings',
    Cultural: 'Fests, clubs and auditions',
    Sports: 'Trials and tournaments',
    Seminar: 'Talks by experts and alumni'
  };

  // Fixed December 2026 demo dates for ESE submission. d/dl are offsets from Dec 1, 2026.
  const RAW_EVENTS = [
    { id: 1, title: 'CodeSprint 24-Hour Hackathon', category: 'Hackathon', organizer: 'ACM Student Chapter', d: 19, dl: 16, time: '9:00 AM', venue: 'Main Auditorium', mode: 'Offline', seats: 120, taken: 78, fee: 'Free', eligibility: 'All branches, teams of 2–4 students', desc: 'Build a working prototype in 24 hours around a real campus problem. Mentors from industry will review your project, and the top three teams win cash prizes and internship interview slots.', highlights: ['Teams of 2 to 4 members', 'Mentor check-ins every 6 hours', 'Food and refreshments provided', 'Certificates for all participants'] },
    { id: 2, title: 'Intro to Generative AI with Python', category: 'Workshop', organizer: 'AI/ML Club', d: 11, dl: 8, time: '2:00 PM', venue: 'Computer Lab 3', mode: 'Offline', seats: 60, taken: 41, fee: 'Free', eligibility: 'Open to all years. Basic Python knowledge helps.', desc: 'A beginner-friendly session on calling language models from Python, writing good prompts and building a small chatbot. Bring your laptop; we will share the starter code beforehand.', highlights: ['Live coding demo', 'Prompt engineering basics', 'Build a small chatbot', 'Starter notebook shared after the session'] },
    { id: 3, title: 'TechNova Summer Internship Drive', category: 'Internship', organizer: 'Training & Placement Cell', d: 24, dl: 20, time: '10:00 AM', venue: 'Online (Google Meet)', mode: 'Online', seats: 200, taken: 132, fee: 'Free', eligibility: 'B.Tech 3rd year, CGPA 7.0 or above', desc: 'TechNova is hiring summer interns for web, data and cloud roles. The drive includes an online aptitude test followed by technical interviews. Selected students receive a monthly stipend.', highlights: ['Paid 8-week internship', 'Roles in web, data and cloud', 'Online test plus two interview rounds', 'Pre-placement offer for top performers'] },
    { id: 4, title: 'Rang 2026 Cultural Fest Auditions', category: 'Cultural', organizer: 'Cultural Committee', d: 17, dl: 14, time: '4:00 PM', venue: 'Open Air Theatre', mode: 'Offline', seats: 150, taken: 96, fee: 'Free', eligibility: 'All students', desc: 'Auditions for dance, singing, drama and stand-up slots at the annual cultural fest. Prepare a performance of up to five minutes.', highlights: ['Dance, music, drama and stand-up', 'Five minutes per act', 'Selected acts perform at the main stage', 'Backstage volunteers also needed'] },
    { id: 5, title: 'Inter-College Cricket Trials', category: 'Sports', organizer: 'Sports Council', d: 14, dl: 11, time: '6:30 AM', venue: 'College Ground', mode: 'Offline', seats: 80, taken: 64, fee: 'Free', eligibility: 'All students with a valid college ID', desc: 'Trials to select the college cricket squad for the upcoming inter-college tournament. Bring your own kit if you have one; basic equipment will be available.', highlights: ['Batting, bowling and fielding tests', 'Squad of 15 will be selected', 'Coaching by the sports officer', 'Bring ID card and sports shoes'] },
    { id: 6, title: 'Careers in Data Science: Alumni Talk', category: 'Seminar', organizer: 'Alumni Cell', d: 9, dl: 6, time: '11:00 AM', venue: 'Seminar Hall B', mode: 'Hybrid', seats: 180, taken: 87, fee: 'Free', eligibility: 'All years, especially CSE and IT', desc: 'Two alumni working as data scientists share how they got their first role, which skills mattered and what they would do differently. Q&A follows the talk.', highlights: ['Real interview experiences', 'Skills roadmap for 2nd and 3rd years', 'Open Q&A with alumni', 'Online link shared after registration'] },
    { id: 7, title: 'UI/UX Design Sprint', category: 'Workshop', organizer: 'Design Club', d: 21, dl: 17, time: '10:00 AM', venue: 'Design Studio, Block C', mode: 'Offline', seats: 40, taken: 29, fee: '₹100', eligibility: 'Open to all branches, no experience needed', desc: 'Go from a rough idea to a clickable prototype in one day using Figma. You will work in pairs on a real student problem and present to a panel.', highlights: ['Figma basics', 'User research in 30 minutes', 'Pair design challenge', 'Portfolio-ready prototype'] },
    { id: 8, title: 'Google Summer of Code Prep Session', category: 'Seminar', organizer: 'Open Source Cell', d: 7, dl: 4, time: '5:00 PM', venue: 'Online (Zoom)', mode: 'Online', seats: 150, taken: 58, fee: 'Free', eligibility: 'Students comfortable with Git and any programming language', desc: 'Learn how to pick an organisation, write a proposal and make your first open source contribution. A past participant will walk through a successful proposal.', highlights: ['How to choose a project', 'Proposal writing tips', 'First pull request walkthrough', 'Recording shared with attendees'] },
    { id: 9, title: 'Research Intern Openings: CSE Department Labs', category: 'Internship', organizer: 'Department of CSE', d: 27, dl: 22, time: '12:00 PM', venue: 'CSE Department Office', mode: 'Offline', seats: 25, taken: 11, fee: 'Free', eligibility: 'B.Tech 2nd and 3rd year, CGPA 7.5 or above', desc: 'Faculty-led labs in machine learning, networks and IoT are looking for student researchers. Interns work 8 hours per week and can earn a co-authorship on publications.', highlights: ['Work with a faculty mentor', 'Flexible weekly hours', 'Possible paper co-authorship', 'Counts towards project credits'] },
    { id: 10, title: 'Photography Walk and Exhibition', category: 'Cultural', organizer: 'Photography Club', d: 16, dl: 12, time: '7:00 AM', venue: 'Campus Gardens', mode: 'Offline', seats: 50, taken: 22, fee: 'Free', eligibility: 'All students. Phone cameras are welcome.', desc: 'A morning photo walk around the campus followed by an exhibition of the best shots. Members will share quick tips on framing and light.', highlights: ['Guided photo walk', 'Tips on light and framing', 'Best photos exhibited', 'Open to phone and DSLR users'] },
    { id: 11, title: 'Inter-Branch Badminton Tournament', category: 'Sports', organizer: 'Sports Council', d: 13, dl: 9, time: '3:00 PM', venue: 'Indoor Stadium', mode: 'Offline', seats: 64, taken: 40, fee: '₹50', eligibility: 'Singles and doubles, one team per branch per category', desc: 'Knockout tournament across all branches with singles and doubles categories. Winners receive trophies and certificates.', highlights: ['Singles and doubles', 'Knockout format', 'Trophies for winners', 'Shuttles provided'] },
    { id: 12, title: 'Smart India Hackathon: Internal Round', category: 'Hackathon', organizer: 'Innovation Cell', d: 26, dl: 21, time: '9:00 AM', venue: 'Innovation Lab', mode: 'Offline', seats: 90, taken: 54, fee: 'Free', eligibility: 'Teams of 6 including at least one female member', desc: 'The internal screening round to select college teams for the national Smart India Hackathon. Present your solution to a faculty panel.', highlights: ['Pick a problem statement', 'Pitch to a faculty panel', 'Top teams represent the college', 'Mentor sessions before the round'] },
    { id: 13, title: 'Resume and LinkedIn Clinic', category: 'Workshop', organizer: 'Training & Placement Cell', d: 29, dl: 25, time: '3:30 PM', venue: 'Seminar Hall A', mode: 'Offline', seats: 100, taken: 100, fee: 'Free', eligibility: 'Final year students', desc: 'One-to-one resume reviews and LinkedIn profile tips from the placement team. Registration for this session has closed.', highlights: ['10-minute resume review', 'LinkedIn headline and summary tips', 'ATS-friendly formatting', 'Registration closed'] }
  ];

  const DAY = 86400000;
  const today = new Date('2026-12-01T00:00:00');
  const EVENTS = RAW_EVENTS.map(function (e) {
    return Object.assign({}, e, {
      date: new Date(today.getTime() + e.d * DAY),
      deadline: new Date(today.getTime() + e.dl * DAY)
    });
  });

  /* ---------- Storage ---------- */
  const KEYS = { saved: 'cc_saved', regs: 'cc_regs', profile: 'cc_profile' };
  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function store(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage may be unavailable */ }
  }
  let saved = load(KEYS.saved, []);
  let regs = load(KEYS.regs, []);
  let profile = load(KEYS.profile, {});

  /* ---------- Helpers ---------- */
  const app = document.getElementById('app');
  const esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  const byId = function (id) { return EVENTS.find(function (e) { return e.id === Number(id); }); };
  const isSaved = function (id) { return saved.indexOf(Number(id)) !== -1; };
  const regFor = function (id) { return regs.find(function (r) { return r.eventId === Number(id); }); };
  const isClosed = function (e) { return e.dl < 0; };
  const fmtShort = function (d) { return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); };
  const fmtLong = function (d) { return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); };
  const monthOf = function (d) { return d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(); };

  function deadlineLabel(e) {
    if (e.dl < 0) return 'Registration closed';
    if (e.dl === 0) return 'Closes today';
    if (e.dl === 1) return 'Closes tomorrow';
    return 'Register by ' + fmtShort(e.deadline);
  }
  function deadlineClass(e) { return e.dl < 0 ? 'closed' : (e.dl <= 2 ? 'urgent' : ''); }
  function seatsLeft(e) { return Math.max(0, e.seats - e.taken - (regFor(e.id) ? 1 : 0)); }

  const ICON = {
    bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>'
  };

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }

  /* ---------- Reusable pieces ---------- */
  function saveButton(e, withLabel) {
    const on = isSaved(e.id);
    if (withLabel) {
      return '<button type="button" class="btn btn-ghost btn-block ' + (on ? 'on' : '') + '" data-save="' + e.id + '" aria-pressed="' + on + '">' +
        ICON.bookmark + '<span class="save-label">' + (on ? 'Saved' : 'Save event') + '</span></button>';
    }
    return '<button type="button" class="icon-btn ' + (on ? 'on' : '') + '" data-save="' + e.id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove from saved' : 'Save event') + '">' + ICON.bookmark + '</button>';
  }

  function registerLink(e, block) {
    const cls = 'btn' + (block ? ' btn-block' : '');
    if (regFor(e.id)) return '<a class="' + cls + ' is-done" href="#/dashboard">Registered ✓</a>';
    if (isClosed(e)) return '<span class="' + cls + ' is-disabled" aria-disabled="true">Registration closed</span>';
    if (seatsLeft(e) <= 0) return '<span class="' + cls + ' is-disabled" aria-disabled="true">Full</span>';
    return '<a class="' + cls + '" href="#/register/' + e.id + '">Register</a>';
  }

  function cardHtml(e) {
    return '<article class="card" style="--cat:var(--c-' + e.category + ')">' +
      '<div class="card-body">' +
        '<div class="card-top">' +
          '<div class="date-block" aria-hidden="true"><small>' + monthOf(e.date) + '</small><b>' + e.date.getDate() + '</b></div>' +
          '<div><h3><a href="#/event/' + e.id + '">' + esc(e.title) + '</a></h3><span class="tag">' + e.category + '</span></div>' +
        '</div>' +
        '<ul class="meta">' +
          '<li>' + ICON.clock + '<span>' + fmtShort(e.date) + ', ' + esc(e.time) + '</span></li>' +
          '<li>' + ICON.pin + '<span>' + esc(e.venue) + '</span></li>' +
          '<li>' + ICON.user + '<span>' + esc(e.organizer) + '</span></li>' +
        '</ul>' +
        '<span class="deadline ' + deadlineClass(e) + '">' + deadlineLabel(e) + '</span>' +
      '</div>' +
      '<div class="card-actions">' + registerLink(e, false) + '<a class="btn btn-ghost" href="#/event/' + e.id + '">Details</a>' + saveButton(e, false) + '</div>' +
    '</article>';
  }

  function rowHtml(e, extra) {
    return '<div class="row" style="--cat:var(--c-' + e.category + ')">' +
      '<div class="grow"><h3><a href="#/event/' + e.id + '">' + esc(e.title) + '</a>' + (extra && extra.status ? '<span class="status">' + extra.status + '</span>' : '') + '</h3>' +
      '<p>' + fmtShort(e.date) + ', ' + esc(e.time) + ' · ' + esc(e.venue) + '</p>' +
      (extra && extra.note ? '<p>' + extra.note + '</p>' : '<p><span class="deadline ' + deadlineClass(e) + '">' + deadlineLabel(e) + '</span></p>') + '</div>' +
      '<div class="actions">' + (extra && extra.actions ? extra.actions : '') + '</div></div>';
  }

  function emptyHtml(title, text, btn) {
    return '<div class="empty"><h3>' + title + '</h3><p>' + text + '</p>' + (btn || '') + '</div>';
  }

  /* ---------- Views ---------- */
  function viewHome() {
    const soon = EVENTS.filter(function (e) { return e.dl >= 0; }).sort(function (a, b) { return a.dl - b.dl; }).slice(0, 4);
    const open = EVENTS.filter(function (e) { return !isClosed(e); }).length;
    const upcoming = EVENTS.filter(function (e) { return !isClosed(e); }).sort(function (a, b) { return a.d - b.d; }).slice(0, 6);

    const board = soon.map(function (e) {
      const label = e.dl === 0 ? 'today' : (e.dl === 1 ? 'day left' : 'days left');
      return '<a class="notice" href="#/event/' + e.id + '"><div class="days ' + (e.dl <= 1 ? 'hot' : '') + '">' + (e.dl === 0 ? '!' : e.dl) + '<small>' + label + '</small></div>' +
        '<div><b>' + esc(e.title) + '</b><span class="sub">' + e.category + ' · ' + esc(e.venue) + '</span></div></a>';
    }).join('');

    const tiles = CATEGORIES.map(function (c) {
      const n = EVENTS.filter(function (e) { return e.category === c && !isClosed(e); }).length;
      return '<a class="cat-tile" style="--cat:var(--c-' + c + ')" href="#/events" data-cat="' + c + '"><b>' + c + '</b><span>' + n + ' open · ' + CAT_BLURB[c] + '</span></a>';
    }).join('');

    return '<section class="hero"><div class="wrap hero-grid">' +
      '<div><h1>Every campus event and opportunity, in one place.</h1>' +
      '<p class="lead">Stop digging through WhatsApp groups and notice boards. Search hackathons, workshops, internships and more, then save them and register in a minute.</p>' +
      '<form class="search-bar" id="heroSearch" role="search"><label for="heroQ" class="sr" style="position:absolute;left:-999px">Search events</label>' +
      '<input id="heroQ" type="search" placeholder="Search events, clubs or keywords" autocomplete="off"><button class="btn btn-yellow" type="submit">Search</button></form>' +
      '<div class="hero-stats"><div><strong>' + open + '</strong><span>events open now</span></div><div><strong>' + CATEGORIES.length + '</strong><span>categories</span></div><div><strong>' + saved.length + '</strong><span>saved by you</span></div></div></div>' +
      '<aside class="board" aria-label="Registrations closing soon"><h2>Closing soon</h2><p>Register before these deadlines pass.</p>' + board + '</aside>' +
      '</div></section>' +

      '<section class="section"><div class="wrap"><div class="section-head"><div><h2>Browse by category</h2><p>Jump straight to what you care about.</p></div></div><div class="cat-grid">' + tiles + '</div></div></section>' +

      '<section class="section"><div class="wrap"><div class="section-head"><div><h2>Coming up on campus</h2><p>The next events on the calendar.</p></div><a class="btn btn-ghost" href="#/events">See all events</a></div><div class="cards">' + upcoming.map(cardHtml).join('') + '</div></div></section>' +

      '<section class="section"><div class="wrap"><div class="section-head"><h2>How it works</h2></div><div class="steps">' +
      '<div class="step"><h3>Find</h3><p>Search by keyword or filter by category to see only what fits you.</p></div>' +
      '<div class="step"><h3>Save</h3><p>Bookmark events to decide later. Your saved list stays on this device.</p></div>' +
      '<div class="step"><h3>Register</h3><p>Fill one short form and track every registration on your dashboard.</p></div>' +
      '</div></div></section>';
  }

  /* Events page keeps its filter state while you move around */
  const filters = { q: '', cat: 'All', sort: 'date', openOnly: false };

  function viewEvents() {
    const chips = ['All'].concat(CATEGORIES).map(function (c) {
      const n = c === 'All' ? EVENTS.length : EVENTS.filter(function (e) { return e.category === c; }).length;
      return '<button type="button" class="chip" data-chip="' + c + '">' + c + '<small>' + n + '</small></button>';
    }).join('');
    return '<div class="wrap"><div class="page-head"><h1 style="font-size:clamp(2rem,4vw,2.8rem)">Events and opportunities</h1>' +
      '<p>Search and filter everything happening on campus.</p></div>' +
      '<div class="toolbar"><div class="field"><label for="q" style="position:absolute;left:-999px">Search events</label>' +
      '<input type="search" id="q" placeholder="Search by title, club, venue or keyword" autocomplete="off" value="' + esc(filters.q) + '"></div>' +
      '<label for="sort" style="position:absolute;left:-999px">Sort events</label>' +
      '<select id="sort"><option value="date">Sort: Event date</option><option value="deadline">Sort: Deadline</option><option value="title">Sort: Title A–Z</option></select>' +
      '<label class="check"><input type="checkbox" id="openOnly"> Hide closed</label></div>' +
      '<div class="chips" role="group" aria-label="Filter by category">' + chips + '</div>' +
      '<p class="result-count" id="count" aria-live="polite"></p>' +
      '<div id="results"></div></div><div style="height:2rem"></div>';
  }

  function updateResults() {
    const q = filters.q.trim().toLowerCase();
    let list = EVENTS.filter(function (e) {
      if (filters.cat !== 'All' && e.category !== filters.cat) return false;
      if (filters.openOnly && isClosed(e)) return false;
      if (!q) return true;
      return (e.title + ' ' + e.category + ' ' + e.organizer + ' ' + e.venue + ' ' + e.desc + ' ' + e.mode).toLowerCase().indexOf(q) !== -1;
    });
    list.sort(function (a, b) {
      if (filters.sort === 'title') return a.title.localeCompare(b.title);
      if (filters.sort === 'deadline') return a.dl - b.dl;
      return a.d - b.d;
    });
    const box = document.getElementById('results');
    if (!box) return;
    document.getElementById('count').textContent = list.length + (list.length === 1 ? ' event found' : ' events found');
    box.innerHTML = list.length
      ? '<div class="cards">' + list.map(cardHtml).join('') + '</div>'
      : emptyHtml('No events match your search', 'Try a different keyword or clear the filters to see everything.', '<button type="button" class="btn" data-clear>Clear filters</button>');
    document.querySelectorAll('[data-chip]').forEach(function (c) {
      const on = c.getAttribute('data-chip') === filters.cat;
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on);
    });
  }

  function viewDetail(id) {
    const e = byId(id);
    if (!e) return viewNotFound();
    const left = seatsLeft(e);
    const pct = Math.min(100, Math.round(((e.seats - left) / e.seats) * 100));
    return '<div class="wrap"><div class="crumbs"><a href="#/events">← Back to events</a></div>' +
      '<div class="detail-grid" style="--cat:var(--c-' + e.category + ')"><div>' +
      '<div class="detail-hero"><span class="tag">' + e.category + '</span><h1>' + esc(e.title) + '</h1><p class="muted" style="margin:0">Organised by ' + esc(e.organizer) + '</p>' +
      '<dl class="info-grid">' +
      '<div><dt>Date</dt><dd>' + fmtLong(e.date) + '</dd></div><div><dt>Time</dt><dd>' + esc(e.time) + '</dd></div>' +
      '<div><dt>Venue</dt><dd>' + esc(e.venue) + '</dd></div><div><dt>Mode</dt><dd>' + e.mode + '</dd></div>' +
      '<div><dt>Fee</dt><dd>' + esc(e.fee) + '</dd></div><div><dt>Register by</dt><dd>' + fmtLong(e.deadline) + '</dd></div></dl></div>' +
      '<div class="panel"><h3>About this event</h3><p style="margin:0">' + esc(e.desc) + '</p></div>' +
      '<div class="panel"><h3>What to expect</h3><ul>' + e.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="panel"><h3>Who can join</h3><p style="margin:0">' + esc(e.eligibility) + '</p></div></div>' +
      '<aside class="side" aria-label="Registration"><h3>' + (isClosed(e) ? 'Registration closed' : 'Reserve your spot') + '</h3>' +
      '<span class="deadline ' + deadlineClass(e) + '">' + deadlineLabel(e) + '</span>' +
      '<p style="margin:1rem 0 0"><strong>' + left + '</strong> of ' + e.seats + ' seats left</p><div class="seats"><i style="width:' + pct + '%"></i></div><p class="muted" style="font-size:.85rem">' + pct + '% filled</p>' +
      registerLink(e, true) + saveButton(e, true) + '</aside></div></div>';
  }

  const BRANCHES = ['CSE', 'CSE (AI/ML)', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'];
  const YEARS = ['1st year', '2nd year', '3rd year', '4th year'];

  function viewRegister(id) {
    const e = byId(id);
    if (!e) return viewNotFound();
    if (regFor(e.id)) return viewSuccess(e, regFor(e.id), true);
    if (isClosed(e) || seatsLeft(e) <= 0) {
      return '<div class="wrap" style="padding:2rem 0">' + emptyHtml('Registration is not available', 'This event is closed or full. Browse other events that are still open.', '<a class="btn" href="#/events">Browse events</a>') + '</div>';
    }
    const opt = function (arr, val, ph) {
      return '<option value="">' + ph + '</option>' + arr.map(function (x) { return '<option' + (val === x ? ' selected' : '') + '>' + x + '</option>'; }).join('');
    };
    return '<div class="wrap"><div class="crumbs"><a href="#/event/' + e.id + '">← Back to event details</a></div>' +
      '<div class="page-head" style="padding-top:.5rem"><h1 style="font-size:clamp(1.8rem,4vw,2.5rem)">Register for this event</h1><p>It takes about a minute. All fields are required.</p></div>' +
      '<div class="form-wrap"><form class="form-card" id="regForm" novalidate data-event="' + e.id + '"><div class="form-grid">' +
      '<div><label class="lbl" for="name">Full name</label><input type="text" id="name" name="name" autocomplete="name" value="' + esc(profile.name) + '"><p class="error" data-err="name"></p></div>' +
      '<div><label class="lbl" for="email">College email</label><input type="email" id="email" name="email" autocomplete="email" value="' + esc(profile.email) + '"><p class="error" data-err="email"></p></div>' +
      '<div><label class="lbl" for="enroll">Enrollment number</label><input type="text" id="enroll" name="enroll" value="' + esc(profile.enroll) + '"><p class="hint">Letters and numbers, 6 to 15 characters</p><p class="error" data-err="enroll"></p></div>' +
      '<div><label class="lbl" for="phone">Mobile number</label><input type="tel" id="phone" name="phone" autocomplete="tel" inputmode="numeric" value="' + esc(profile.phone) + '"><p class="hint">10 digits, starting with 6 to 9</p><p class="error" data-err="phone"></p></div>' +
      '<div><label class="lbl" for="branch">Branch</label><select id="branch" name="branch">' + opt(BRANCHES, profile.branch, 'Select your branch') + '</select><p class="error" data-err="branch"></p></div>' +
      '<div><label class="lbl" for="year">Year</label><select id="year" name="year">' + opt(YEARS, profile.year, 'Select your year') + '</select><p class="error" data-err="year"></p></div>' +
      '<div class="full"><label class="check"><input type="checkbox" id="agree" name="agree"> I confirm these details are correct and I will attend.</label><p class="error" data-err="agree"></p></div>' +
      '<div class="full"><button class="btn" type="submit">Confirm registration</button></div></div></form>' +
      '<aside class="summary-card" style="--cat:var(--c-' + e.category + ')"><span class="tag">' + e.category + '</span><h3 style="margin-top:.7rem">' + esc(e.title) + '</h3>' +
      '<p>' + fmtLong(e.date) + '</p><p>' + esc(e.time) + ' · ' + esc(e.venue) + '</p><p>Fee: ' + esc(e.fee) + '</p><p style="margin:0">' + deadlineLabel(e) + '</p></aside></div></div>';
  }

  function viewSuccess(e, r, already) {
    return '<div class="wrap"><div class="success"><div class="tick" aria-hidden="true">✓</div>' +
      '<h1 style="font-size:2rem">' + (already ? 'You are already registered' : 'You are registered!') + '</h1>' +
      '<p class="muted">' + esc(e.title) + '<br>' + fmtLong(e.date) + ', ' + esc(e.time) + '<br>' + esc(e.venue) + '</p>' +
      '<p>Your reference number</p><p><span class="ref">' + esc(r.ref) + '</span></p>' +
      '<div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:1.2rem"><a class="btn" href="#/dashboard">Go to dashboard</a><a class="btn btn-ghost" href="#/events">Browse more events</a></div></div></div>';
  }

  function viewSaved() {
    const list = saved.map(byId).filter(Boolean);
    return '<div class="wrap"><div class="page-head"><h1 style="font-size:clamp(2rem,4vw,2.8rem)">Saved events</h1><p>Events you bookmarked to look at later.</p></div>' +
      (list.length ? '<div class="cards">' + list.map(cardHtml).join('') + '</div>'
        : emptyHtml('Nothing saved yet', 'Tap the bookmark icon on any event to keep it here.', '<a class="btn" href="#/events">Find events</a>')) +
      '</div><div style="height:2rem"></div>';
  }

  function viewDashboard() {
    const myRegs = regs.map(function (r) { return { r: r, e: byId(r.eventId) }; }).filter(function (x) { return x.e; }).sort(function (a, b) { return a.e.d - b.e.d; });
    const mySaved = saved.map(byId).filter(Boolean);
    const closingSoon = mySaved.filter(function (e) { return e.dl >= 0 && e.dl <= 7 && !regFor(e.id); }).sort(function (a, b) { return a.dl - b.dl; });
    const name = profile.name ? profile.name.split(' ')[0] : 'there';

    const regRows = myRegs.map(function (x) {
      return rowHtml(x.e, {
        status: 'Confirmed',
        note: 'Reference ' + esc(x.r.ref) + ' · Registered ' + fmtShort(new Date(x.r.at)),
        actions: '<a class="btn btn-ghost btn-sm" href="#/event/' + x.e.id + '">View</a><button type="button" class="btn btn-danger btn-sm" data-cancel="' + x.e.id + '">Cancel</button>'
      });
    }).join('');

    const savedRows = mySaved.map(function (e) {
      return rowHtml(e, {
        actions: (regFor(e.id) ? '<span class="status">Registered</span>' : (isClosed(e) ? '' : '<a class="btn btn-sm" href="#/register/' + e.id + '">Register</a>')) +
          '<button type="button" class="btn btn-ghost btn-sm" data-save="' + e.id + '" aria-label="Remove ' + esc(e.title) + ' from saved">Remove</button>'
      });
    }).join('');

    return '<div class="wrap"><div class="page-head"><h1 style="font-size:clamp(2rem,4vw,2.8rem)">Hi ' + esc(name) + ', here is your dashboard</h1><p>Track what you registered for and what you saved.</p></div>' +
      '<div class="stats"><div class="stat hl"><b>' + myRegs.length + '</b><span>Registered events</span></div><div class="stat"><b>' + mySaved.length + '</b><span>Saved events</span></div><div class="stat"><b>' + closingSoon.length + '</b><span>Saved events closing within 7 days</span></div></div>' +
      '<div class="section-head"><h2>My registrations</h2></div>' +
      (regRows ? '<div class="list">' + regRows + '</div>' : emptyHtml('No registrations yet', 'Register for an event and it will show up here with its reference number.', '<a class="btn" href="#/events">Browse events</a>')) +
      '<div class="section-head" style="margin-top:2.5rem"><h2>Saved events</h2><a href="#/saved">Open saved page</a></div>' +
      (savedRows ? '<div class="list">' + savedRows + '</div>' : emptyHtml('No saved events', 'Save events you are interested in and decide later.', '<a class="btn btn-ghost" href="#/events">Find events</a>')) +
      '<div class="dash-actions"><button type="button" class="btn btn-danger btn-sm" data-reset>Clear my saved events and registrations</button></div></div><div style="height:2rem"></div>';
  }

  function viewNotFound() {
    return '<div class="wrap" style="padding:3rem 0">' + emptyHtml('Page not found', 'That page or event does not exist.', '<a class="btn" href="#/">Go home</a>') + '</div>';
  }

  /* ---------- Router ---------- */
  const TITLES = { home: 'Home', events: 'Events', event: 'Event details', register: 'Register', saved: 'Saved events', dashboard: 'Dashboard' };

  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const name = parts[0] || 'home';
    const arg = parts[1];
    let html;
    switch (name) {
      case 'home': html = viewHome(); break;
      case 'events': html = viewEvents(); break;
      case 'event': html = viewDetail(arg); break;
      case 'register': html = viewRegister(arg); break;
      case 'saved': html = viewSaved(); break;
      case 'dashboard': html = viewDashboard(); break;
      default: html = viewNotFound();
    }
    app.innerHTML = html;
    document.title = (TITLES[name] || 'Not found') + ' – CampusConnect';
    if (name === 'events') {
      document.getElementById('sort').value = filters.sort;
      document.getElementById('openOnly').checked = filters.openOnly;
      updateResults();
    }
    const navKey = (name === 'event' || name === 'register') ? 'events' : name;
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      const on = a.getAttribute('data-nav') === navKey;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    closeMenu();
    window.scrollTo(0, 0);
    updateBadge();
  }

  function updateBadge() {
    const b = document.getElementById('savedBadge');
    b.textContent = saved.length;
    b.hidden = saved.length === 0;
  }

  function currentName() { return location.hash.replace(/^#\/?/, '').split('/')[0] || 'home'; }

  /* ---------- Actions ---------- */
  function toggleSave(id) {
    id = Number(id);
    const idx = saved.indexOf(id);
    if (idx === -1) { saved.push(id); toast('Saved to your list'); }
    else { saved.splice(idx, 1); toast('Removed from saved'); }
    store(KEYS.saved, saved);
    updateBadge();
    const page = currentName();
    if (page === 'saved' || page === 'dashboard') { const y = window.scrollY; route(); window.scrollTo(0, y); return; }
    document.querySelectorAll('[data-save="' + id + '"]').forEach(function (btn) {
      const on = isSaved(id);
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on);
      const lbl = btn.querySelector('.save-label');
      if (lbl) lbl.textContent = on ? 'Saved' : 'Save event';
      else btn.setAttribute('aria-label', on ? 'Remove from saved' : 'Save event');
    });
  }

  function cancelRegistration(id) {
    const e = byId(id);
    if (!window.confirm('Cancel your registration for "' + e.title + '"?')) return;
    regs = regs.filter(function (r) { return r.eventId !== Number(id); });
    store(KEYS.regs, regs);
    toast('Registration cancelled');
    route();
  }

  function validate(f) {
    const v = {
      name: f.name.value.trim(), email: f.email.value.trim(), enroll: f.enroll.value.trim(),
      phone: f.phone.value.trim(), branch: f.branch.value, year: f.year.value, agree: f.agree.checked
    };
    const err = {};
    if (!v.name) err.name = 'Enter your full name.';
    else if (!/^[A-Za-z][A-Za-z .'-]{2,}$/.test(v.name)) err.name = 'Use at least 3 letters. Numbers are not allowed.';
    if (!v.email) err.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) err.email = 'Enter a valid email, like name@college.edu.';
    if (!v.enroll) err.enroll = 'Enter your enrollment number.';
    else if (!/^[A-Za-z0-9]{6,15}$/.test(v.enroll)) err.enroll = 'Use 6 to 15 letters or numbers, with no spaces.';
    if (!v.phone) err.phone = 'Enter your mobile number.';
    else if (!/^[6-9]\d{9}$/.test(v.phone)) err.phone = 'Enter a 10-digit number starting with 6, 7, 8 or 9.';
    if (!v.branch) err.branch = 'Select your branch.';
    if (!v.year) err.year = 'Select your year.';
    if (!v.agree) err.agree = 'Tick the box to confirm.';
    return { v: v, err: err };
  }

  function showErrors(form, err) {
    form.querySelectorAll('[data-err]').forEach(function (p) {
      const k = p.getAttribute('data-err');
      p.textContent = err[k] || '';
      const input = form.elements[k];
      if (input && input.classList) input.classList.toggle('invalid', !!err[k]);
      if (input) input.setAttribute('aria-invalid', err[k] ? 'true' : 'false');
    });
  }

  function submitRegistration(form) {
    const e = byId(form.getAttribute('data-event'));
    const res = validate(form);
    showErrors(form, res.err);
    const keys = Object.keys(res.err);
    if (keys.length) { form.elements[keys[0]].focus(); toast('Please fix the highlighted fields'); return; }
    if (regFor(e.id)) { route(); return; }
    const ref = 'CC-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    const r = { eventId: e.id, ref: ref, at: Date.now(), name: res.v.name, email: res.v.email, enroll: res.v.enroll, phone: res.v.phone, branch: res.v.branch, year: res.v.year };
    regs.push(r);
    store(KEYS.regs, regs);
    profile = { name: res.v.name, email: res.v.email, enroll: res.v.enroll, phone: res.v.phone, branch: res.v.branch, year: res.v.year };
    store(KEYS.profile, profile);
    app.innerHTML = viewSuccess(e, r, false);
    window.scrollTo(0, 0);
    toast('Registration confirmed');
  }

  /* ---------- Events ---------- */
  function closeMenu() {
    document.getElementById('mainNav').classList.remove('open');
    const b = document.getElementById('menuBtn');
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-label', 'Open menu');
  }

  document.addEventListener('click', function (ev) {
    const t = ev.target;
    const el = function (sel) { return t.closest ? t.closest(sel) : null; };
    let m;
    if ((m = el('[data-save]'))) { ev.preventDefault(); toggleSave(m.getAttribute('data-save')); return; }
    if ((m = el('[data-cancel]'))) { cancelRegistration(m.getAttribute('data-cancel')); return; }
    if ((m = el('[data-chip]'))) { filters.cat = m.getAttribute('data-chip'); updateResults(); return; }
    if ((m = el('[data-cat]'))) { filters.cat = m.getAttribute('data-cat'); filters.q = ''; return; }
    if (el('[data-clear]')) {
      filters.q = ''; filters.cat = 'All'; filters.openOnly = false; filters.sort = 'date';
      route(); return;
    }
    if (el('[data-reset]')) {
      if (window.confirm('This will remove all your saved events and registrations. Continue?')) {
        saved = []; regs = []; store(KEYS.saved, saved); store(KEYS.regs, regs);
        toast('Your data has been cleared'); route();
      }
      return;
    }
    if (el('#menuBtn')) {
      const nav = document.getElementById('mainNav');
      const open = nav.classList.toggle('open');
      const b = document.getElementById('menuBtn');
      b.setAttribute('aria-expanded', open);
      b.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  });

  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'q') { filters.q = ev.target.value; updateResults(); }
    else if (ev.target.id === 'sort') { filters.sort = ev.target.value; updateResults(); }
    else if (ev.target.id === 'openOnly') { filters.openOnly = ev.target.checked; updateResults(); }
  });

  document.addEventListener('submit', function (ev) {
    if (ev.target.id === 'heroSearch') {
      ev.preventDefault();
      filters.q = document.getElementById('heroQ').value; filters.cat = 'All';
      location.hash = '#/events';
    } else if (ev.target.id === 'regForm') {
      ev.preventDefault();
      submitRegistration(ev.target);
    }
  });

  window.addEventListener('hashchange', route);
  route();
})();
