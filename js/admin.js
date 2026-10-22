/**
 * G.P. Pharmacy College — Admin CMS Dashboard
 */
(function () {
  const NAV = [
    { id: 'dashboard', icon: '◆', label: 'Dashboard' },
    { group: 'Edit website', items: [
      { id: 'website-homepage', icon: '⌂', label: 'Homepage' },
      { id: 'website-about', icon: 'ⓘ', label: 'About' },
      { id: 'website-courses', icon: '☰', label: 'Courses' },
      { id: 'website-faculty', icon: '◉', label: 'People' },
      { id: 'website-gallery', icon: '▣', label: 'Gallery' },
      { id: 'website-contact', icon: '☎', label: 'Contact' },
    ]},
    { group: 'Campus updates', items: [
      { id: 'notices', icon: '!', label: 'Notices' },
      { id: 'events', icon: '◷', label: 'Events' },
      { id: 'news', icon: '≡', label: 'News' },
      { id: 'achievements', icon: '★', label: 'Achievements' },
    ]},
    { group: 'Admissions & careers', items: [
      { id: 'admissions', icon: '▸', label: 'Admissions' },
      { id: 'placements', icon: '◇', label: 'Placements / Recruiters' },
      { id: 'applications', icon: '☐', label: 'Applications' },
      { id: 'research', icon: '🔬', label: 'Research' },
    ]},
    { id: 'users', icon: '◎', label: 'Users', adminOnly: true },
  ];

  const TITLES = {
    dashboard: 'Dashboard',
    'website-homepage': 'Homepage',
    'website-about': 'About',
    'website-courses': 'Courses',
    'website-faculty': 'People',
    'website-gallery': 'Gallery',
    'website-contact': 'Contact',
    admissions: 'Admissions',
    notices: 'Notices',
    events: 'Events',
    news: 'News',
    placements: 'Placements / Recruiters',
    research: 'Research',
    achievements: 'Achievements',
    applications: 'Applications',
    users: 'Users',
  };

  const SUBTITLES = {
    dashboard: 'Overview and shortcuts',
    'website-homepage': 'Hero, story, campus photos, programs, people, careers',
    'website-about': 'College story, vision, leadership',
    'website-courses': 'Program pages and course details',
    'website-faculty': 'Faculty directory and profiles',
    'website-gallery': 'Campus photo and video gallery',
    'website-contact': 'Address, phones, and office hours',
    admissions: 'Counselling code, fees, documents',
    notices: 'Public notices and alerts',
    events: 'Upcoming campus events',
    news: 'News articles on the website',
    placements: 'Stats, recruiter names, job openings',
    research: 'Research page and publications',
    achievements: 'Student achievements',
    applications: 'Admission form submissions',
    users: 'CMS staff accounts',
  };

  let currentRoute = 'dashboard';
  let editingId = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    GPCMS.initAsync().then(() => {
      bindLogin();
      bindGlobal();
      return GPCMS.validateSession?.();
    }).then(session => {
      if (session) showApp();
      else showLogin();
    });
  }

  function showLogin() {
    document.getElementById('cmsLogin').hidden = false;
    document.getElementById('cmsApp').hidden = true;
    closeMobileMenu();
  }

  function showApp() {
    document.getElementById('cmsLogin').hidden = true;
    document.getElementById('cmsApp').hidden = false;
    const session = GPCMS.getSession();
    const badge = document.getElementById('userBadge');
    if (badge) {
      badge.textContent = `${session.name} · ${session.role}`;
      badge.title = session.email || '';
    }
    buildSidebar(session);
    route(location.hash.slice(1) || 'dashboard');
    window.addEventListener('hashchange', () => route(location.hash.slice(1) || 'dashboard'));
  }

  function bindLogin() {
    const form = document.getElementById('loginForm');
    const submitBtn = form?.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = document.getElementById('loginError');
      const lock = GPSecurity?.isLoginLocked?.();
      if (lock?.locked) {
        const mins = Math.ceil((lock.until - Date.now()) / 60000);
        err.textContent = `Too many failed attempts. Try again in ${mins} minute(s).`;
        err.classList.add('is-visible');
        return;
      }

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in…';
      }

      let session = null;
      try {
        session = await GPCMS.login(email, password);
      } catch {
        err.textContent = 'Could not reach the CMS server. Confirm the site is running, then try again.';
        err.classList.add('is-visible');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign in';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign in';
      }

      if (session?.error === 'locked') {
        const mins = Math.ceil((session.until - Date.now()) / 60000);
        err.textContent = `Too many failed attempts. Try again in ${mins} minute(s).`;
        err.classList.add('is-visible');
        return;
      }

      if (session) {
        err.classList.remove('is-visible');
        document.getElementById('loginPassword').value = '';
        showApp();
      } else {
        const lockAfter = GPSecurity?.isLoginLocked?.();
        if (lockAfter?.locked) {
          const mins = Math.ceil((lockAfter.until - Date.now()) / 60000);
          err.textContent = `Too many failed attempts. Try again in ${mins} minute(s).`;
        } else if (!email || !password) {
          err.textContent = 'Enter your staff email and password to continue.';
        } else {
          err.textContent = 'Sign-in failed. Check your email and password, or ask IT to reset access.';
        }
        err.classList.add('is-visible');
      }
    });
  }

  function setMobileMenu(open) {
    const sidebar = document.getElementById('cmsSidebar');
    const scrim = document.getElementById('cmsSidebarScrim');
    const toggle = document.getElementById('menuToggle');
    sidebar?.classList.toggle('is-open', open);
    document.body.classList.toggle('cms-menu-open', open);
    if (scrim) scrim.hidden = !open;
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }

  function closeMobileMenu() {
    setMobileMenu(false);
  }

  function bindGlobal() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
      GPCMS.logout();
      showLogin();
    });
    document.getElementById('menuToggle').addEventListener('click', () => {
      const open = !document.getElementById('cmsSidebar').classList.contains('is-open');
      setMobileMenu(open);
    });
    document.getElementById('cmsSidebarScrim')?.addEventListener('click', closeMobileMenu);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cmsModalOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'cmsModalOverlay') closeModal();
    });
    document.getElementById('exportBtn').addEventListener('click', () => {
      const blob = new Blob([GPCMS.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `gp-cms-backup-${Date.now()}.json`;
      a.click();
      toast('Backup exported', 'success');
    });

    const importInput = document.getElementById('importInput');
    document.getElementById('importBtn')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          if (!confirm('Import will replace all CMS content in this browser. Continue?')) return;
          GPCMS.importJSON(reader.result);
          toastSaved('Content imported');
          route(currentRoute);
        } catch {
          toast('Invalid backup file', 'error');
        } finally {
          importInput.value = '';
        }
      };
      reader.readAsText(file);
    });
  }

  function bindMediaFields() {
    CMSMedia?.bindImageFields(document.getElementById('cmsContent'));
    CMSMedia?.bindImageFields(document.getElementById('modalBody'));
  }

  function imgField(opts) {
    return CMSMedia?.renderImageField(opts) || `<div class="cms-field"><label>${esc(opts.label)}</label><input name="${escAttr(opts.name)}" value="${escAttr(opts.value || '')}"></div>`;
  }

  function buildSidebar(session) {
    const nav = document.getElementById('cmsNav');
    nav.innerHTML = NAV.map(item => {
      if (item.group) {
        const links = item.items.map(sub => `
          <button type="button" class="cms-nav__link cms-nav__link--sub" data-route="${sub.id}">
            <span class="cms-nav__icon" aria-hidden="true">${sub.icon}</span>${esc(sub.label)}
          </button>`).join('');
        return `<div class="cms-nav__group"><div class="cms-nav__group-label">${esc(item.group)}</div>${links}</div>`;
      }
      if (item.adminOnly && session.role !== 'admin') return '';
      return `<button type="button" class="cms-nav__link" data-route="${item.id}">
        <span class="cms-nav__icon" aria-hidden="true">${item.icon}</span>${esc(item.label)}
      </button>`;
    }).join('');

    nav.querySelectorAll('[data-route]').forEach(btn => {
      btn.addEventListener('click', () => {
        location.hash = btn.dataset.route;
        closeMobileMenu();
      });
    });
  }

  function route(id) {
    if (!GPCMS.getSession()) {
      showLogin();
      return;
    }
    if (!TITLES[id]) id = 'dashboard';
    currentRoute = id;
    document.getElementById('pageTitle').textContent = TITLES[id];
    const sub = document.getElementById('pageSubtitle');
    if (sub) sub.textContent = SUBTITLES[id] || '';
    document.querySelectorAll('[data-route]').forEach(el => {
      el.classList.toggle('is-active', el.dataset.route === id);
    });

    const renderers = {
      dashboard: renderDashboard,
      'website-homepage': renderHomepage,
      'website-about': renderAbout,
      'website-courses': () => renderPrograms('website.courses', 'programs'),
      'website-faculty': () => renderPrograms('website.faculty', 'members', 'Faculty Member'),
      'website-gallery': () => renderGallery(),
      'website-contact': renderContact,
      admissions: renderAdmissions,
      notices: () => renderList('notices', noticeFields),
      events: () => renderList('events', eventFields),
      news: () => renderList('news', newsFields),
      placements: renderPlacements,
      research: renderResearch,
      achievements: () => renderList('achievements', achievementFields),
      applications: renderApplications,
      users: renderUsers,
    };

    const el = document.getElementById('cmsContent');
    el.innerHTML = '';
    (renderers[id] || renderDashboard)();
    bindMediaFields();
  }

  /* ─── Dashboard ─── */
  function renderDashboard() {
    const s = GPCMS.getStats();
    document.getElementById('cmsContent').innerHTML = `
      <div class="cms-welcome">
        <div>
          <h2 class="cms-welcome__title">Staff website console</h2>
          <p class="cms-welcome__text">Edit public pages, then use <strong>View site</strong> to confirm changes. Saves sync to the live site when the CMS API is running.</p>
        </div>
        <a class="cms-btn cms-btn--gold" href="/" target="_blank" rel="noopener">Open live site</a>
      </div>
      <div class="cms-stats">
        <div class="cms-stat"><strong>${s.notices}</strong><span>Published notices</span></div>
        <div class="cms-stat cms-stat--yellow"><strong>${s.events}</strong><span>Upcoming events</span></div>
        <div class="cms-stat"><strong>${s.news}</strong><span>News articles</span></div>
        <div class="cms-stat cms-stat--yellow"><strong>${s.applications}</strong><span>Applications</span></div>
        <div class="cms-stat"><strong>${s.achievements}</strong><span>Achievements</span></div>
        <div class="cms-stat cms-stat--yellow"><strong>${s.drafts}</strong><span>Draft items</span></div>
      </div>
      <div class="cms-panel">
        <div class="cms-panel__head"><h2>Quick manage</h2></div>
        <div class="cms-panel__body">
          <div class="cms-quick-grid">
            ${quickBtn('website-homepage', 'Homepage')}
            ${quickBtn('notices', 'Notices')}
            ${quickBtn('website-gallery', 'Gallery')}
            ${quickBtn('admissions', 'Admissions')}
            ${quickBtn('placements', 'Placements')}
            ${quickBtn('website-contact', 'Contact')}
            ${quickBtn('applications', 'Applications')}
            ${quickBtn('website-faculty', 'People')}
          </div>
        </div>
      </div>
      <div class="cms-panel cms-panel--spaced">
        <div class="cms-panel__head"><h2>Photos &amp; content guide</h2></div>
        <div class="cms-panel__body">${CMSMedia?.renderMediaGuide?.() || ''}</div>
      </div>
      <div class="cms-panel cms-panel--spaced">
        <div class="cms-panel__head"><h2>Recent applications</h2></div>
        <div class="cms-panel__body cms-table-wrap">
          ${renderAppsTable(GPCMS.getApplications().slice(0, 5))}
        </div>
      </div>`;
  }

  function quickBtn(route, label) {
    return `<button type="button" class="cms-quick-link" data-quick="${route}">${esc(label)}</button>`;
  }

  /* ─── Website: Homepage ─── */
  function renderHomepage() {
    const hp = GPCMS.getSection('website.homepage');
    const ha = hp.homeAbout || {};
    const cs = hp.campusShow || {};
    const ps = hp.programsShow || {};
    const people = hp.people || {};
    const outcomes = hp.outcomes || {};
    const campusItems = cs.items || [];
    const programItems = ps.items || [];
    const peopleSlots = people.slots || [];
    const outcomeItems = outcomes.items || [];

    document.getElementById('cmsContent').innerHTML = `
      ${publishBar(hp.published, 'website.homepage', 'published')}
      <p class="cms-section-note">Edit each homepage block below, then click its Save button. Changes appear on the live site after sync — use <a href="/" target="_blank" rel="noopener">View site</a> to check.</p>

      <nav class="cms-jump" aria-label="Homepage sections">
        <a href="#hp-hero">Hero &amp; announcement</a>
        <a href="#hp-about">About story</a>
        <a href="#hp-programs">Programs</a>
        <a href="#hp-campus">Campus photos</a>
        <a href="#hp-people">People</a>
        <a href="#hp-careers">Careers</a>
        <a href="#hp-tour">Approvals &amp; tour</a>
      </nav>

      <div class="cms-panel" id="hp-hero">
        <div class="cms-panel__head">
          <div>
            <p class="cms-panel__eyebrow">Homepage</p>
            <h2>Hero &amp; announcement</h2>
          </div>
        </div>
        <div class="cms-panel__body">
          <form id="cmsFormHero" class="cms-form">
            <div class="cms-field"><label>Badge (above brand)</label><input name="badge" value="${escAttr(hp.badge || '')}"><small>Shown on hero slides — e.g. approvals / counselling code</small></div>
            <div class="cms-field"><label>Main title</label><input name="title" value="${escAttr(hp.title || '')}"></div>
            <div class="cms-field"><label>Subtitle</label><textarea name="subtitle">${esc(hp.subtitle || '')}</textarea></div>
            <div class="cms-field"><label>Announcement bar</label><input name="announcement" value="${escAttr(hp.announcement || '')}"><small>Scrolling bar at the top of every page</small></div>
            ${CMSMedia?.renderSlidesField?.({ name: 'slides', label: 'Hero background photos', values: hp.slides || [] }) || `<div class="cms-field"><label>Hero Slides (one URL per line)</label><textarea name="slides" rows="4">${esc((hp.slides || []).join('\n'))}</textarea></div>`}
            <div class="cms-form__actions">
              <button type="submit" class="cms-btn cms-btn--primary">Save hero</button>
            </div>
          </form>
        </div>
      </div>

      <div class="cms-panel cms-panel--spaced" id="hp-about">
        <div class="cms-panel__head">
          <div>
            <p class="cms-panel__eyebrow">Homepage</p>
            <h2>About story</h2>
          </div>
        </div>
        <div class="cms-panel__body">
          <form id="cmsFormAbout" class="cms-form cms-form--wide">
            <div class="cms-form__row">
              <div class="cms-field"><label>Eyebrow</label><input name="aboutEyebrow" value="${escAttr(ha.eyebrow || '')}"></div>
              <div class="cms-field"><label>Photo badge</label><input name="aboutBadge" value="${escAttr(ha.badge || '')}"></div>
            </div>
            <div class="cms-field"><label>Title</label><input name="aboutTitle" value="${escAttr(ha.title || '')}"></div>
            <div class="cms-field"><label>Short facts (one per line)</label><textarea name="aboutFacts" rows="4">${esc((ha.facts || []).join('\n'))}</textarea></div>
            ${imgField({ name: 'aboutImage', label: 'Campus photo', value: ha.image || '' })}
            <div class="cms-form__row">
              <div class="cms-field"><label>Primary button text</label><input name="aboutCtaPrimary" value="${escAttr(ha.ctaPrimary || '')}"></div>
              <div class="cms-field"><label>Secondary button text</label><input name="aboutCtaSecondary" value="${escAttr(ha.ctaSecondary || '')}"></div>
            </div>
            <div class="cms-form__actions"><button type="submit" class="cms-btn cms-btn--primary">Save about story</button></div>
          </form>
        </div>
      </div>

      <div class="cms-panel cms-panel--spaced" id="hp-programs">
        <div class="cms-panel__head">
          <div>
            <p class="cms-panel__eyebrow">Homepage</p>
            <h2>Programs / courses</h2>
          </div>
        </div>
        <div class="cms-panel__body">
          <form id="cmsFormPrograms" class="cms-form cms-form--wide">
            <div class="cms-form__row">
              <div class="cms-field"><label>Eyebrow</label><input name="programsEyebrow" value="${escAttr(ps.eyebrow || '')}"></div>
              <div class="cms-field"><label>Section title</label><input name="programsTitle" value="${escAttr(ps.title || '')}"></div>
            </div>
            <div class="cms-field"><label>Lead text</label><textarea name="programsLead" rows="2">${esc(ps.lead || '')}</textarea></div>
            <div class="cms-form__row">
              <div class="cms-field"><label>CTA text</label><input name="programsCtaText" value="${escAttr(ps.ctaText || '')}"></div>
              <div class="cms-field"><label>CTA URL</label><input name="programsCtaHref" value="${escAttr(ps.ctaHref || '')}"></div>
            </div>
            ${programItems.map((item, i) => `
              <p class="cms-subhead">${esc(item.name || item.id || `Program ${i + 1}`)}</p>
              <input type="hidden" name="programId_${i}" value="${escAttr(item.id || '')}">
              <div class="cms-form__row">
                <div class="cms-field"><label>Name</label><input name="programName_${i}" value="${escAttr(item.name || '')}"></div>
                <div class="cms-field"><label>Duration</label><input name="programDuration_${i}" value="${escAttr(item.duration || '')}"></div>
              </div>
              <div class="cms-field"><label>Blurb (“what you’ll become”)</label><input name="programBlurb_${i}" value="${escAttr(item.blurb || '')}"></div>
              <div class="cms-form__row">
                ${imgField({ name: `programImage_${i}`, label: 'Photo', value: item.image || '' })}
                <div class="cms-field"><label>Link URL</label><input name="programHref_${i}" value="${escAttr(item.href || '')}" placeholder="courses.html#bpharm"></div>
              </div>
            `).join('')}
            <div class="cms-form__actions"><button type="submit" class="cms-btn cms-btn--primary">Save programs</button></div>
          </form>
        </div>
      </div>

      <div class="cms-panel cms-panel--spaced" id="hp-campus">
        <div class="cms-panel__head">
          <div>
            <p class="cms-panel__eyebrow">Homepage</p>
            <h2>Campus photos — Lab / Library / Hostel</h2>
          </div>
        </div>
        <div class="cms-panel__body">
          <form id="cmsFormCampus" class="cms-form cms-form--wide">
            <div class="cms-form__row">
              <div class="cms-field"><label>Eyebrow</label><input name="campusEyebrow" value="${escAttr(cs.eyebrow || '')}"></div>
              <div class="cms-field"><label>Section title</label><input name="campusTitle" value="${escAttr(cs.title || '')}"></div>
            </div>
            <div class="cms-field"><label>Lead text</label><textarea name="campusLead" rows="2">${esc(cs.lead || '')}</textarea></div>
            ${campusItems.map((item, i) => `
              <p class="cms-subhead">${esc(item.title || item.id || `Panel ${i + 1}`)}</p>
              <input type="hidden" name="campusId_${i}" value="${escAttr(item.id || '')}">
              <div class="cms-form__row">
                <div class="cms-field"><label>Title</label><input name="campusTitle_${i}" value="${escAttr(item.title || '')}"></div>
                <div class="cms-field"><label>Caption</label><input name="campusCaption_${i}" value="${escAttr(item.caption || '')}"></div>
              </div>
              ${imgField({ name: `campusImage_${i}`, label: 'Photo', value: item.image || '' })}
            `).join('')}
            <div class="cms-form__actions"><button type="submit" class="cms-btn cms-btn--primary">Save campus photos</button></div>
          </form>
        </div>
      </div>

      <div class="cms-panel cms-panel--spaced" id="hp-people">
        <div class="cms-panel__head">
          <div>
            <p class="cms-panel__eyebrow">Homepage</p>
            <h2>People strip</h2>
          </div>
        </div>
        <div class="cms-panel__body">
          <form id="cmsFormPeople" class="cms-form cms-form--wide">
            <div class="cms-form__row">
              <div class="cms-field"><label>Eyebrow</label><input name="peopleEyebrow" value="${escAttr(people.eyebrow || '')}"></div>
              <div class="cms-field"><label>Section title</label><input name="peopleTitle" value="${escAttr(people.title || '')}"></div>
            </div>
            <div class="cms-field"><label>Lead text</label><textarea name="peopleLead" rows="2">${esc(people.lead || '')}</textarea></div>
            ${peopleSlots.map((slot, i) => `
              <p class="cms-subhead">${esc(slot.id === 'chairman' ? 'Chairman' : slot.id === 'principal' ? 'Principal' : `Faculty slot ${i - 1}`)}</p>
              <input type="hidden" name="personId_${i}" value="${escAttr(slot.id || '')}">
              <div class="cms-form__row">
                <div class="cms-field"><label>Name</label><input name="personName_${i}" value="${escAttr(slot.name || '')}"></div>
                <div class="cms-field"><label>Role</label><input name="personRole_${i}" value="${escAttr(slot.role || '')}"></div>
              </div>
              <div class="cms-form__row">
                ${imgField({ name: `personImage_${i}`, label: 'Photo (leave blank for initials)', value: slot.image || '' })}
                <div class="cms-field"><label>Link URL</label><input name="personHref_${i}" value="${escAttr(slot.href || '')}" placeholder="about-principal.html"></div>
              </div>
            `).join('')}
            <p class="cms-subhead">“View directory” card</p>
            <div class="cms-form__row">
              <div class="cms-field"><label>Label</label><input name="moreLabel" value="${escAttr(people.moreLabel || '')}"></div>
              <div class="cms-field"><label>Caption</label><input name="moreCaption" value="${escAttr(people.moreCaption || '')}"></div>
            </div>
            <div class="cms-form__row">
              ${imgField({ name: 'moreImage', label: 'Card photo', value: people.moreImage || '' })}
              <div class="cms-field"><label>Link URL</label><input name="moreHref" value="${escAttr(people.moreHref || '')}"></div>
            </div>
            <div class="cms-form__actions"><button type="submit" class="cms-btn cms-btn--primary">Save people strip</button></div>
          </form>
        </div>
      </div>

      <div class="cms-panel cms-panel--spaced" id="hp-careers">
        <div class="cms-panel__head">
          <div>
            <p class="cms-panel__eyebrow">Homepage</p>
            <h2>Careers &amp; recruiters</h2>
          </div>
        </div>
        <div class="cms-panel__body">
          <form id="cmsFormOutcomes" class="cms-form cms-form--wide">
            <div class="cms-form__row">
              <div class="cms-field"><label>Eyebrow</label><input name="outcomesEyebrow" value="${escAttr(outcomes.eyebrow || '')}"></div>
              <div class="cms-field"><label>Section title</label><input name="outcomesTitle" value="${escAttr(outcomes.title || '')}"></div>
            </div>
            ${outcomeItems.map((item, i) => `
              <input type="hidden" name="outcomeId_${i}" value="${escAttr(item.id || '')}">
              <div class="cms-form__row">
                <div class="cms-field"><label>Label</label><input name="outcomeLabel_${i}" value="${escAttr(item.label || '')}"></div>
                <div class="cms-field"><label>Short description</label><input name="outcomeDesc_${i}" value="${escAttr(item.desc || '')}"></div>
              </div>
            `).join('')}
            <div class="cms-form__row">
              <div class="cms-field"><label>Link text</label><input name="outcomesLinkText" value="${escAttr(outcomes.linkText || '')}"></div>
              <div class="cms-field"><label>Link URL</label><input name="outcomesLinkHref" value="${escAttr(outcomes.linkHref || '')}"></div>
            </div>
            <div class="cms-field"><label>Recruiters strip label</label><input name="recruitersLabel" value="${escAttr(hp.recruitersLabel || '')}"><small>Recruiter names are edited under <strong>Placements / Recruiters</strong></small></div>
            <div class="cms-form__actions"><button type="submit" class="cms-btn cms-btn--primary">Save careers</button></div>
          </form>
        </div>
      </div>

      <div class="cms-panel cms-panel--spaced" id="hp-tour">
        <div class="cms-panel__head">
          <div>
            <p class="cms-panel__eyebrow">Homepage</p>
            <h2>Approvals &amp; campus tour (YouTube)</h2>
          </div>
        </div>
        <div class="cms-panel__body">
          <form id="cmsFormTour" class="cms-form cms-form--wide">
            <div class="cms-field"><label>Tour lead text</label><textarea name="tourLead" rows="2">${esc((hp.campusTour && hp.campusTour.lead) || '')}</textarea></div>
            <div class="cms-field"><label>YouTube URL</label><input name="youtubeUrl" value="${escAttr((hp.campusTour && hp.campusTour.youtubeUrl) || '')}" placeholder="https://www.youtube.com/watch?v=..."><small>Paste a full YouTube link. Leave blank to show the placeholder + Digital Campus fallback.</small></div>
            ${imgField({ name: 'tourFallback', label: 'Placeholder image', value: (hp.campusTour && hp.campusTour.fallbackImage) || '' })}
            <p class="cms-subhead">Approval badge PDF / page links</p>
            ${(hp.approvals || []).map((item, i) => `
              <input type="hidden" name="approvalId_${i}" value="${escAttr(item.id || '')}">
              <div class="cms-form__row">
                <div class="cms-field"><label>${esc(item.title || item.id || 'Badge')} title</label><input name="approvalTitle_${i}" value="${escAttr(item.title || '')}"></div>
                <div class="cms-field"><label>Subtitle</label><input name="approvalSubtitle_${i}" value="${escAttr(item.subtitle || '')}"></div>
              </div>
              <div class="cms-form__row">
                <div class="cms-field"><label>Page link</label><input name="approvalHref_${i}" value="${escAttr(item.href || '')}"></div>
                <div class="cms-field"><label>PDF URL (optional)</label><input name="approvalPdf_${i}" value="${escAttr(item.pdfUrl || '')}" placeholder="https://…/disclosure.pdf"></div>
              </div>
            `).join('')}
            <div class="cms-form__actions"><button type="submit" class="cms-btn cms-btn--primary">Save tour &amp; approvals</button></div>
          </form>
        </div>
      </div>`;

    document.getElementById('cmsFormHero').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const current = GPCMS.getSection('website.homepage');
      GPCMS.setSection('website.homepage', {
        ...current,
        badge: fd.get('badge'),
        title: fd.get('title'),
        subtitle: fd.get('subtitle'),
        announcement: fd.get('announcement'),
        slides: String(fd.get('slides')).split('\n').map(s => s.trim()).filter(Boolean),
      });
      toastSaved('Hero saved');
    });

    document.getElementById('cmsFormAbout').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const current = GPCMS.getSection('website.homepage');
      GPCMS.setSection('website.homepage', {
        ...current,
        homeAbout: {
          ...(current.homeAbout || {}),
          eyebrow: fd.get('aboutEyebrow'),
          badge: fd.get('aboutBadge'),
          title: fd.get('aboutTitle'),
          facts: lines(fd.get('aboutFacts')),
          image: fd.get('aboutImage'),
          ctaPrimary: fd.get('aboutCtaPrimary'),
          ctaSecondary: fd.get('aboutCtaSecondary'),
        },
      });
      toastSaved('About story saved');
    });

    document.getElementById('cmsFormCampus').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const current = GPCMS.getSection('website.homepage');
      const items = (current.campusShow?.items || []).map((item, i) => ({
        ...item,
        id: fd.get(`campusId_${i}`) || item.id,
        title: fd.get(`campusTitle_${i}`),
        caption: fd.get(`campusCaption_${i}`),
        image: fd.get(`campusImage_${i}`),
      }));
      GPCMS.setSection('website.homepage', {
        ...current,
        campusShow: {
          ...(current.campusShow || {}),
          eyebrow: fd.get('campusEyebrow'),
          title: fd.get('campusTitle'),
          lead: fd.get('campusLead'),
          items,
        },
      });
      toastSaved('Campus photos saved');
    });

    document.getElementById('cmsFormPrograms').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const current = GPCMS.getSection('website.homepage');
      const items = (current.programsShow?.items || []).map((item, i) => ({
        ...item,
        id: fd.get(`programId_${i}`) || item.id,
        name: fd.get(`programName_${i}`),
        duration: fd.get(`programDuration_${i}`),
        blurb: fd.get(`programBlurb_${i}`),
        image: fd.get(`programImage_${i}`),
        href: fd.get(`programHref_${i}`),
      }));
      GPCMS.setSection('website.homepage', {
        ...current,
        programsShow: {
          ...(current.programsShow || {}),
          eyebrow: fd.get('programsEyebrow'),
          title: fd.get('programsTitle'),
          lead: fd.get('programsLead'),
          ctaText: fd.get('programsCtaText'),
          ctaHref: fd.get('programsCtaHref'),
          items,
        },
      });
      toastSaved('Programs section saved');
    });

    document.getElementById('cmsFormPeople').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const current = GPCMS.getSection('website.homepage');
      const slots = (current.people?.slots || []).map((slot, i) => ({
        ...slot,
        id: fd.get(`personId_${i}`) || slot.id,
        name: fd.get(`personName_${i}`),
        role: fd.get(`personRole_${i}`),
        image: fd.get(`personImage_${i}`),
        href: fd.get(`personHref_${i}`),
      }));
      GPCMS.setSection('website.homepage', {
        ...current,
        people: {
          ...(current.people || {}),
          eyebrow: fd.get('peopleEyebrow'),
          title: fd.get('peopleTitle'),
          lead: fd.get('peopleLead'),
          slots,
          moreLabel: fd.get('moreLabel'),
          moreCaption: fd.get('moreCaption'),
          moreImage: fd.get('moreImage'),
          moreHref: fd.get('moreHref'),
        },
      });
      toastSaved('People strip saved');
    });

    document.getElementById('cmsFormOutcomes').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const current = GPCMS.getSection('website.homepage');
      const items = (current.outcomes?.items || []).map((item, i) => ({
        ...item,
        id: fd.get(`outcomeId_${i}`) || item.id,
        label: fd.get(`outcomeLabel_${i}`),
        desc: fd.get(`outcomeDesc_${i}`),
      }));
      GPCMS.setSection('website.homepage', {
        ...current,
        recruitersLabel: fd.get('recruitersLabel'),
        outcomes: {
          ...(current.outcomes || {}),
          eyebrow: fd.get('outcomesEyebrow'),
          title: fd.get('outcomesTitle'),
          items,
          linkText: fd.get('outcomesLinkText'),
          linkHref: fd.get('outcomesLinkHref'),
        },
      });
      toastSaved('Careers section saved');
    });

    document.getElementById('cmsFormTour')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const current = GPCMS.getSection('website.homepage');
      const approvals = (current.approvals || []).map((item, i) => ({
        ...item,
        id: fd.get(`approvalId_${i}`) || item.id,
        title: fd.get(`approvalTitle_${i}`),
        subtitle: fd.get(`approvalSubtitle_${i}`),
        href: fd.get(`approvalHref_${i}`),
        pdfUrl: fd.get(`approvalPdf_${i}`),
      }));
      GPCMS.setSection('website.homepage', {
        ...current,
        campusTour: {
          ...(current.campusTour || {}),
          lead: fd.get('tourLead'),
          youtubeUrl: fd.get('youtubeUrl'),
          fallbackImage: fd.get('tourFallback'),
        },
        approvals,
      });
      toastSaved('Tour & approvals saved');
    });
  }

  /* ─── Website: About ─── */
  function renderAbout() {
    const ab = GPCMS.getSection('website.about');
    const highlights = ab.highlights || [];
    const leadership = ab.leadership || [];
    document.getElementById('cmsContent').innerHTML = `
      ${publishBar(ab.published, 'website.about', 'published')}
      <div class="cms-panel"><div class="cms-panel__head"><h2>Hero &amp; Story</h2></div><div class="cms-panel__body">
        <form id="cmsForm" class="cms-form cms-form--wide">
          <div class="cms-form__row">
            <div class="cms-field"><label>Page Title</label><input name="heroTitle" value="${escAttr(ab.heroTitle)}"></div>
            <div class="cms-field"><label>Subtitle</label><input name="heroSubtitle" value="${escAttr(ab.heroSubtitle)}"></div>
          </div>
          <div class="cms-field"><label>Story Section Title</label><input name="storyTitle" value="${escAttr(ab.storyTitle || '')}"></div>
          <div class="cms-field"><label>Story — Paragraph 1</label><textarea name="storyP1">${esc(ab.storyP1)}</textarea></div>
          <div class="cms-field"><label>Story — Paragraph 2</label><textarea name="storyP2">${esc(ab.storyP2)}</textarea></div>
          <div class="cms-form__row">
            ${imgField({ name: 'image', label: 'Story Image', value: ab.image })}
            ${imgField({ name: 'vmImage', label: 'Vision/Mission Banner', value: ab.vmImage || '' })}
          </div>
          ${imgField({ name: 'ctaImage', label: 'CTA Banner Image', value: ab.ctaImage || '' })}
          <p style="font-weight:700;margin:1.25rem 0 0.5rem;color:var(--cms-text)">Chairman</p>
          <div class="cms-form__row">
            <div class="cms-field"><label>Name</label><input name="chairmanName" value="${escAttr(ab.chairman?.name || '')}"></div>
            <div class="cms-field"><label>Title</label><input name="chairmanTitle" value="${escAttr(ab.chairman?.title || '')}"></div>
          </div>
          <div class="cms-field"><label>Chairman Bio</label><textarea name="chairmanBio" rows="3">${esc(ab.chairman?.bio || '')}</textarea></div>
          ${imgField({ name: 'chairmanImage', label: 'Chairman Photo', value: ab.chairman?.image || '' })}
          <div class="cms-field"><label>Key Facts (one per line: Label | Value)</label><textarea name="keyFacts" rows="4">${esc((ab.keyFacts || []).map(f => `${f.label} | ${f.value}`).join('\n'))}</textarea></div>
          <div class="cms-form__row">
            <div class="cms-field"><label>Vision (one per line)</label><textarea name="vision" rows="5">${esc((ab.vision || []).join('\n'))}</textarea></div>
            <div class="cms-field"><label>Mission (one per line)</label><textarea name="mission" rows="5">${esc((ab.mission || []).join('\n'))}</textarea></div>
          </div>
          <button type="submit" class="cms-btn cms-btn--primary">Save About Page</button>
        </form>
      </div></div>
      ${aboutListPanel('Campus Highlights', highlights, 'highlights', 'Highlight')}
      ${aboutListPanel('Leadership Team', leadership, 'leadership', 'Leader')}`;

    document.getElementById('cmsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      GPCMS.setSection('website.about', {
        ...ab,
        published: ab.published,
        heroTitle: fd.get('heroTitle'),
        heroSubtitle: fd.get('heroSubtitle'),
        storyTitle: fd.get('storyTitle'),
        storyP1: fd.get('storyP1'),
        storyP2: fd.get('storyP2'),
        image: fd.get('image'),
        vmImage: fd.get('vmImage'),
        ctaImage: fd.get('ctaImage'),
        chairman: {
          name: fd.get('chairmanName'),
          title: fd.get('chairmanTitle'),
          bio: fd.get('chairmanBio'),
          image: fd.get('chairmanImage'),
        },
        keyFacts: parseKeyFacts(fd.get('keyFacts')),
        vision: lines(fd.get('vision')),
        mission: lines(fd.get('mission')),
        highlights: ab.highlights,
        leadership: ab.leadership,
      });
      toastSaved('About page saved');
    });

    bindAboutListActions('highlights', 'Highlight');
    bindAboutListActions('leadership', 'Leader');
  }

  function aboutListPanel(title, items, arrayKey, label) {
    return `<div class="cms-panel">
      <div class="cms-panel__head">
        <h2>${esc(title)} (${items.length})</h2>
        <button type="button" class="cms-btn cms-btn--primary cms-btn--sm" data-about-add="${arrayKey}">+ Add ${esc(label)}</button>
      </div>
      <div class="cms-panel__body cms-table-wrap">
        <table class="cms-table">
          <thead><tr><th>Title / Name</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${items.map(i => `
            <tr>
              <td><span class="cms-table__title">${esc(i.title || i.name)}</span></td>
              <td class="cms-table__meta">${esc(i.desc || i.role || '')}</td>
              <td>${badge(i.published)}</td>
              <td class="cms-actions">${rowActions('website.about', arrayKey, i.id, i.published)}</td>
            </tr>`).join('') || `<tr><td colspan="4" class="cms-empty">No items yet</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function bindAboutListActions(arrayKey, label) {
    const addBtn = document.querySelector(`[data-about-add="${arrayKey}"]`);
    addBtn?.addEventListener('click', () => openAboutItemForm(arrayKey, null, label));
    const panel = addBtn?.closest('.cms-panel');
    if (!panel) return;
    panel.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => {
      openAboutItemForm(arrayKey, b.dataset.edit, label);
    }));
    panel.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
      GPCMS.toggleInSection('website.about', arrayKey, b.dataset.toggle);
      route(currentRoute);
    }));
    panel.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => {
      if (confirm('Delete this item?')) {
        GPCMS.removeFromSection('website.about', arrayKey, b.dataset.delete);
        route(currentRoute);
      }
    }));
  }

  function openAboutItemForm(arrayKey, id, label) {
    const ab = GPCMS.getSection('website.about');
    const item = id ? ab[arrayKey].find(i => i.id === id) : {};
    const isLeader = arrayKey === 'leadership';
    openModal(id ? `Edit ${label}` : `Add ${label}`, `
      <form id="modalForm" class="cms-form">
        ${isLeader ? `
          <div class="cms-field"><label>Name</label><input name="name" required value="${escAttr(item.name || '')}"></div>
          <div class="cms-field"><label>Role / Title</label><input name="role" value="${escAttr(item.role || '')}"></div>
          <div class="cms-field"><label>Bio</label><textarea name="bio">${esc(item.bio || '')}</textarea></div>
          ${imgField({ name: 'image', label: 'Photo', value: item.image || '' })}
        ` : `
          <div class="cms-field"><label>Title</label><input name="title" required value="${escAttr(item.title || '')}"></div>
          <div class="cms-field"><label>Description</label><textarea name="desc">${esc(item.desc || '')}</textarea></div>
          ${imgField({ name: 'image', label: 'Image', value: item.image || '' })}
        `}
        <label class="cms-checkbox"><input type="checkbox" name="published" ${item.published !== false ? 'checked' : ''}> Published</label>
        <div class="cms-form__actions">
          <button type="submit" class="cms-btn cms-btn--primary">Save</button>
          <button type="button" class="cms-btn cms-btn--outline" id="modalCancel">Cancel</button>
        </div>
      </form>`);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    document.getElementById('modalForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const record = isLeader
        ? { name: fd.get('name'), role: fd.get('role'), bio: fd.get('bio'), image: fd.get('image'), published: fd.get('published') === 'on' }
        : { title: fd.get('title'), desc: fd.get('desc'), image: fd.get('image'), published: fd.get('published') === 'on' };
      if (id) GPCMS.updateInSection('website.about', arrayKey, id, record);
      else GPCMS.createInSection('website.about', arrayKey, record);
      closeModal();
      toastSaved('Saved');
      route(currentRoute);
    });
  }

  function parseKeyFacts(str) {
    return String(str || '').split('\n').map(line => {
      const parts = line.split('|').map(s => s.trim());
      if (parts.length < 2) return null;
      return { label: parts[0], value: parts.slice(1).join(' | ') };
    }).filter(Boolean);
  }

  /* ─── Website: Contact ─── */
  function renderContact() {
    const c = GPCMS.getSection('website.contact');
    document.getElementById('cmsContent').innerHTML = `
      ${publishBar(c.published, 'website.contact', 'published')}
      <div class="cms-panel"><div class="cms-panel__body">
        <form id="cmsForm" class="cms-form">
          <div class="cms-form__row">
            <div class="cms-field"><label>Page Title</label><input name="heroTitle" value="${escAttr(c.heroTitle)}"></div>
            <div class="cms-field"><label>Subtitle</label><input name="heroSubtitle" value="${escAttr(c.heroSubtitle)}"></div>
          </div>
          <div class="cms-field"><label>Address</label><textarea name="address">${esc(c.address)}</textarea></div>
          <div class="cms-field"><label>Principal</label><input name="principal" value="${escAttr(c.principal)}"></div>
          <div class="cms-field"><label>Phone Numbers (one per line)</label><textarea name="phones" rows="4">${esc((c.phones||[]).join('\n'))}</textarea></div>
          <div class="cms-form__row">
            <div class="cms-field"><label>Email</label><input name="email" type="email" value="${escAttr(c.email)}"></div>
            <div class="cms-field"><label>Office Hours</label><input name="hours" value="${escAttr(c.hours)}"></div>
          </div>
          <button type="submit" class="cms-btn cms-btn--primary">Save Contact</button>
        </form>
      </div></div>`;
    document.getElementById('cmsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      GPCMS.setSection('website.contact', {
        ...c, published: c.published,
        heroTitle: fd.get('heroTitle'), heroSubtitle: fd.get('heroSubtitle'),
        address: fd.get('address'), principal: fd.get('principal'),
        phones: lines(fd.get('phones')), email: fd.get('email'), hours: fd.get('hours'),
      });
      toastSaved('Contact saved');
    });
  }

  /* ─── Programs list (courses / faculty) ─── */
  function renderPrograms(sectionPath, arrayKey, addLabel) {
    const section = GPCMS.getSection(sectionPath);
    const items = section[arrayKey] || [];
    const label = addLabel || 'Program';
    document.getElementById('cmsContent').innerHTML = `
      ${publishBar(section.published, sectionPath, 'published')}
      <div class="cms-panel">
        <div class="cms-panel__head">
          <h2>${esc(label)}s (${items.length})</h2>
          <button type="button" class="cms-btn cms-btn--primary cms-btn--sm" id="addBtn">+ Add ${esc(label)}</button>
        </div>
        <div class="cms-panel__body cms-table-wrap">
          <table class="cms-table">
            <thead><tr><th>Name</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${items.map(i => `
              <tr>
                <td><span class="cms-table__title">${esc(i.name)}</span></td>
                <td class="cms-table__meta">${esc(i.duration || i.department || i.dept || i.designation || i.role || '')}</td>
                <td>${badge(i.published)}</td>
                <td class="cms-actions">${rowActions(sectionPath, arrayKey, i.id, i.published)}</td>
              </tr>`).join('') || `<tr><td colspan="4" class="cms-empty">No items yet</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
    document.getElementById('addBtn').addEventListener('click', () => openProgramForm(sectionPath, arrayKey, null, label));
    bindRowActions(sectionPath, arrayKey);
  }

  function openProgramForm(sectionPath, arrayKey, id, label) {
    const section = GPCMS.getSection(sectionPath);
    const item = id ? section[arrayKey].find(i => i.id === id) : {};
    const isFaculty = arrayKey === 'members';
    openModal(id ? `Edit ${label}` : `Add ${label}`, `
      <form id="modalForm" class="cms-form">
        <div class="cms-field"><label>Name</label><input name="name" required value="${escAttr(item.name || '')}"></div>
        ${isFaculty ? `
          <div class="cms-field"><label>Department</label><input name="department" value="${escAttr(item.department || item.dept || '')}"></div>
          <div class="cms-form__row">
            <div class="cms-field"><label>Degree / Qualification</label><input name="qualification" value="${escAttr(item.qualification || '')}"></div>
            <div class="cms-field"><label>Designation</label><input name="designation" value="${escAttr(item.designation || '')}"></div>
          </div>
          <div class="cms-field"><label>Department filter key</label><input name="deptSlug" value="${escAttr(item.deptSlug || '')}" placeholder="e.g. pharmaceutics, analysis"></div>
        ` : `
          <div class="cms-form__row">
            <div class="cms-field"><label>Duration</label><input name="duration" value="${escAttr(item.duration || '')}"></div>
            <div class="cms-field"><label>Intake</label><input name="intake" type="number" value="${item.intake || ''}"></div>
          </div>
          <div class="cms-field"><label>Summary</label><textarea name="summary">${esc(item.summary || '')}</textarea></div>
          <div class="cms-field"><label>Eligibility</label><textarea name="eligibility">${esc(item.eligibility || '')}</textarea></div>
          <div class="cms-field"><label>Careers</label><textarea name="careers">${esc(item.careers || '')}</textarea></div>
          <div class="cms-field"><label>Lab exposure</label><textarea name="labs">${esc(item.labs || '')}</textarea></div>
          <div class="cms-field"><label>What will I become?</label><textarea name="become">${esc(item.become || '')}</textarea></div>
        `}
        <label class="cms-checkbox"><input type="checkbox" name="published" ${item.published !== false ? 'checked' : ''}> Published</label>
        <div class="cms-form__actions">
          <button type="submit" class="cms-btn cms-btn--primary">Save</button>
          <button type="button" class="cms-btn cms-btn--outline" id="modalCancel">Cancel</button>
        </div>
      </form>`);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    document.getElementById('modalForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const record = {
        name: fd.get('name'), published: fd.get('published') === 'on',
        ...(isFaculty
          ? {
              department: fd.get('department'),
              dept: fd.get('department'),
              qualification: fd.get('qualification'),
              designation: fd.get('designation'),
              deptSlug: fd.get('deptSlug'),
              role: [fd.get('qualification'), fd.get('designation')].filter(Boolean).join(' — '),
            }
          : {
              duration: fd.get('duration'),
              intake: Number(fd.get('intake')),
              summary: fd.get('summary'),
              eligibility: fd.get('eligibility'),
              careers: fd.get('careers'),
              labs: fd.get('labs'),
              become: fd.get('become'),
            }),
      };
      if (id) GPCMS.updateInSection(sectionPath, arrayKey, id, record);
      else GPCMS.createInSection(sectionPath, arrayKey, record);
      closeModal();
      toastSaved('Saved');
      route(currentRoute);
    });
  }

  /* ─── Gallery ─── */
  function renderGallery() {
    const items = GPCMS.list('gallery');
    document.getElementById('cmsContent').innerHTML = `
      <div class="cms-panel">
        <div class="cms-panel__head">
          <h2>Gallery Items (${items.length})</h2>
          <button type="button" class="cms-btn cms-btn--primary cms-btn--sm" id="addBtn">+ Add Photo/Video</button>
        </div>
        <div class="cms-panel__body cms-table-wrap">
          <table class="cms-table">
            <thead><tr><th>Title</th><th>Category</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${items.map(i => `
              <tr>
                <td><span class="cms-table__title">${esc(i.title)}</span></td>
                <td>${esc(i.category)}</td>
                <td>${esc(i.type)}</td>
                <td>${badge(i.published)}</td>
                <td class="cms-actions">
                  <button class="cms-btn cms-btn--ghost cms-btn--sm" data-edit="${i.id}">Edit</button>
                  <button class="cms-btn cms-btn--ghost cms-btn--sm" data-toggle="${i.id}">${i.published !== false ? 'Unpublish' : 'Publish'}</button>
                  <button class="cms-btn cms-btn--ghost cms-btn--sm" data-delete="${i.id}">Delete</button>
                </td>
              </tr>`).join('') || '<tr><td colspan="5">No gallery items</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>`;
    document.getElementById('addBtn').addEventListener('click', () => openGalleryForm(null));
    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openGalleryForm(b.dataset.edit)));
    document.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
      GPCMS.togglePublish('gallery', b.dataset.toggle);
      route(currentRoute);
    }));
    document.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => {
      if (confirm('Delete this gallery item?')) { GPCMS.remove('gallery', b.dataset.delete); route(currentRoute); toast('Deleted'); }
    }));
  }

  function openGalleryForm(id) {
    const item = id ? GPCMS.get('gallery', id) : {};
    openModal(id ? 'Edit Gallery Item' : 'Add Gallery Item', `
      <form id="modalForm" class="cms-form">
        <div class="cms-field"><label>Title</label><input name="title" required value="${escAttr(item.title || '')}"></div>
        <div class="cms-form__row">
          <div class="cms-field"><label>Category</label>
            <select name="category">
              ${['campus','labs','classrooms','events','pharmacy-week','industrial','hospital','sports','cultural','placements','convocation'].map(c =>
                `<option value="${c}" ${item.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="cms-field"><label>Type</label>
            <select name="type"><option value="photo" ${item.type === 'photo' ? 'selected' : ''}>Photo</option>
            <option value="video" ${item.type === 'video' ? 'selected' : ''}>Video</option>
            <option value="360" ${item.type === '360' ? 'selected' : ''}>360°</option></select>
          </div>
        </div>
        ${imgField({ name: 'src', label: 'Image / Media URL', value: item.src || '', hint: 'For videos, paste YouTube or direct video URL.' })}
        <div class="cms-field"><label>Size</label>
          <select name="size"><option value="normal">Normal</option><option value="large" ${item.size==='large'?'selected':''}>Large</option>
          <option value="wide" ${item.size==='wide'?'selected':''}>Wide</option><option value="tall" ${item.size==='tall'?'selected':''}>Tall</option></select>
        </div>
        <label class="cms-checkbox"><input type="checkbox" name="published" ${item.published !== false ? 'checked' : ''}> Published</label>
        <button type="submit" class="cms-btn cms-btn--primary">Save</button>
      </form>`);
    document.getElementById('modalForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const record = { title: fd.get('title'), category: fd.get('category'), type: fd.get('type'), src: fd.get('src'), size: fd.get('size'), published: fd.get('published') === 'on' };
      if (id) GPCMS.update('gallery', id, record);
      else GPCMS.create('gallery', record);
      closeModal(); route(currentRoute); toastSaved('Saved');
    });
  }

  /* ─── Admissions ─── */
  function renderAdmissions() {
    const a = GPCMS.getSection('admissions');
    document.getElementById('cmsContent').innerHTML = `
      ${publishBar(a.published, 'admissions', 'published')}
      <div class="cms-panel"><div class="cms-panel__body">
        <form id="cmsForm" class="cms-form">
          <div class="cms-form__row">
            <div class="cms-field"><label>Page Title</label><input name="heroTitle" value="${escAttr(a.heroTitle)}"></div>
            <div class="cms-field"><label>Counselling Code</label><input name="counsellingCode" value="${escAttr(a.counsellingCode)}"></div>
          </div>
          <div class="cms-field"><label>Subtitle</label><textarea name="heroSubtitle">${esc(a.heroSubtitle)}</textarea></div>
          <div class="cms-form__row">
            <div class="cms-field"><label>Application Fee (₹)</label><input name="fee" type="number" value="${a.fee}"></div>
          </div>
          <div class="cms-field"><label>Eligibility Note</label><textarea name="eligibilityNote">${esc(a.eligibilityNote)}</textarea></div>
          <div class="cms-field"><label>Fee / scholarship rows (Label | Value — one per line)</label><textarea name="feeRows" rows="5">${esc((a.feeRows || []).map(r => `${r.label || ''} | ${r.value || ''}`).join('\n'))}</textarea><small>Shown on Admissions and Courses fee sections. Always point visitors to Talk to Admin for exact fee.</small></div>
          <div class="cms-field"><label>Required Documents (one per line)</label><textarea name="documents" rows="4">${esc((a.documents||[]).join('\n'))}</textarea></div>
          <button type="submit" class="cms-btn cms-btn--primary">Save Admissions Settings</button>
        </form>
      </div></div>`;
    document.getElementById('cmsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const feeRows = String(fd.get('feeRows') || '').split('\n').map((line) => {
        const parts = line.split('|');
        return { label: (parts[0] || '').trim(), value: (parts.slice(1).join('|') || '').trim() };
      }).filter((r) => r.label || r.value);
      GPCMS.setSection('admissions', { ...a, published: a.published,
        heroTitle: fd.get('heroTitle'), heroSubtitle: fd.get('heroSubtitle'),
        counsellingCode: fd.get('counsellingCode'), fee: Number(fd.get('fee')),
        eligibilityNote: fd.get('eligibilityNote'), documents: lines(fd.get('documents')),
        feeRows,
      });
      toastSaved('Admissions saved');
    });
  }

  /* ─── Placements ─── */
  function renderPlacements() {
    const p = GPCMS.getSection('placements');
    document.getElementById('cmsContent').innerHTML = `
      ${publishBar(p.published, 'placements', 'published')}
      <div class="cms-panel"><div class="cms-panel__body">
        <form id="cmsForm" class="cms-form cms-form--wide">
          <div class="cms-form__row">
            <div class="cms-field"><label>Page Title</label><input name="heroTitle" value="${escAttr(p.heroTitle)}"></div>
            <div class="cms-field"><label>Subtitle</label><input name="heroSubtitle" value="${escAttr(p.heroSubtitle)}"></div>
          </div>
          <h3 style="margin:1rem 0 .5rem;font-size:.9rem">Statistics</h3>
          ${(p.stats||[]).map((s,i)=>`
            <div class="cms-form__row">
              <div class="cms-field"><label>Stat ${i+1} Label</label><input name="statLabel${i}" value="${escAttr(s.label)}"></div>
              <div class="cms-field"><label>Value</label><input name="statValue${i}" value="${escAttr(s.value)}"></div>
            </div>`).join('')}
          <div class="cms-field"><label>Recruiters (comma separated)</label><input name="recruiters" value="${escAttr((p.recruiters||[]).join(', '))}"></div>
          <button type="submit" class="cms-btn cms-btn--primary">Save Placements</button>
        </form>
      </div></div>
      <div class="cms-panel" style="margin-top:1.25rem">
        <div class="cms-panel__head"><h2>Job Openings</h2>
          <button type="button" class="cms-btn cms-btn--primary cms-btn--sm" id="addJob">+ Add Opening</button></div>
        <div class="cms-panel__body cms-table-wrap">
          <table class="cms-table"><thead><tr><th>Company</th><th>Role</th><th>Package</th><th>Status</th><th></th></tr></thead>
          <tbody>${(p.openings||[]).map(j=>`<tr>
            <td>${esc(j.company)}</td><td>${esc(j.role)}</td><td>${esc(j.package)}</td>
            <td>${badge(j.published)}</td>
            <td class="cms-actions">
              <button class="cms-btn cms-btn--ghost cms-btn--sm" data-job-edit="${j.id}">Edit</button>
              <button class="cms-btn cms-btn--ghost cms-btn--sm" data-job-toggle="${j.id}">${j.published?'Unpublish':'Publish'}</button>
              <button class="cms-btn cms-btn--ghost cms-btn--sm" data-job-del="${j.id}">Delete</button>
            </td></tr>`).join('')}</tbody></table>
        </div>
      </div>`;
    document.getElementById('cmsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const stats = (p.stats||[]).map((_,i)=>({ label: fd.get(`statLabel${i}`), value: fd.get(`statValue${i}`) }));
      GPCMS.setSection('placements', { ...p, published: p.published,
        heroTitle: fd.get('heroTitle'), heroSubtitle: fd.get('heroSubtitle'),
        stats, recruiters: String(fd.get('recruiters')).split(',').map(s=>s.trim()).filter(Boolean),
      });
      toastSaved('Placements saved');
    });
    document.getElementById('addJob').addEventListener('click', () => openJobForm(null));
    document.querySelectorAll('[data-job-edit]').forEach(b=>b.addEventListener('click',()=>openJobForm(b.dataset.jobEdit)));
    document.querySelectorAll('[data-job-toggle]').forEach(b=>b.addEventListener('click',()=>{
      const pl = GPCMS.getSection('placements');
      const j = pl.openings.find(x=>x.id===b.dataset.jobToggle);
      if(j){ j.published=!j.published; GPCMS.setSection('placements',pl); route(currentRoute); }
    }));
    document.querySelectorAll('[data-job-del]').forEach(b=>b.addEventListener('click',()=>{
      if(!confirm('Delete opening?'))return;
      const pl = GPCMS.getSection('placements');
      pl.openings = pl.openings.filter(x=>x.id!==b.dataset.jobDel);
      GPCMS.setSection('placements',pl); route(currentRoute);
    }));
  }

  function openJobForm(id) {
    const pl = GPCMS.getSection('placements');
    const j = id ? pl.openings.find(x=>x.id===id) : {};
    openModal(id?'Edit Opening':'Add Opening', `
      <form id="modalForm" class="cms-form">
        <div class="cms-field"><label>Company</label><input name="company" required value="${escAttr(j.company||'')}"></div>
        <div class="cms-form__row">
          <div class="cms-field"><label>Role</label><input name="role" value="${escAttr(j.role||'')}"></div>
          <div class="cms-field"><label>Package</label><input name="package" value="${escAttr(j.package||'')}"></div>
        </div>
        <div class="cms-field"><label>Course</label><input name="course" value="${escAttr(j.course||'')}"></div>
        <label class="cms-checkbox"><input type="checkbox" name="published" ${j.published!==false?'checked':''}> Published</label>
        <button type="submit" class="cms-btn cms-btn--primary">Save</button>
      </form>`);
    document.getElementById('modalForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const rec = { company: fd.get('company'), role: fd.get('role'), package: fd.get('package'), course: fd.get('course'), published: fd.get('published')==='on' };
      const pl2 = GPCMS.getSection('placements');
      if(id){ const idx=pl2.openings.findIndex(x=>x.id===id); pl2.openings[idx]={...pl2.openings[idx],...rec}; }
      else pl2.openings.unshift({...rec, id:'job-'+Date.now()});
      GPCMS.setSection('placements',pl2); closeModal(); route(currentRoute); toastSaved('Saved');
    });
  }

  /* ─── Research ─── */
  function renderResearch() {
    const r = GPCMS.getSection('research');
    document.getElementById('cmsContent').innerHTML = `
      ${publishBar(r.published, 'research', 'published')}
      <div class="cms-panel"><div class="cms-panel__body">
        <form id="cmsForm" class="cms-form cms-form--wide">
          <div class="cms-form__row">
            <div class="cms-field"><label>Page Title</label><input name="heroTitle" value="${escAttr(r.heroTitle)}"></div>
            <div class="cms-field"><label>Subtitle</label><input name="heroSubtitle" value="${escAttr(r.heroSubtitle)}"></div>
          </div>
          ${(r.stats||[]).map((s,i)=>`<div class="cms-form__row">
            <div class="cms-field"><label>Stat ${i+1}</label><input name="statLabel${i}" value="${escAttr(s.label)}"></div>
            <div class="cms-field"><label>Value</label><input name="statValue${i}" value="${escAttr(s.value)}"></div>
          </div>`).join('')}
          <button type="submit" class="cms-btn cms-btn--primary">Save Research Page</button>
        </form>
      </div></div>
      <div class="cms-panel" style="margin-top:1.25rem">
        <div class="cms-panel__head"><h2>Publications (${(r.publications||[]).length})</h2>
          <button type="button" class="cms-btn cms-btn--primary cms-btn--sm" id="addPub">+ Add Publication</button></div>
        <div class="cms-panel__body cms-table-wrap">
          <table class="cms-table"><thead><tr><th>Title</th><th>Authors</th><th>Year</th><th>Status</th><th></th></tr></thead>
          <tbody>${(r.publications||[]).map(p=>`<tr>
            <td>${esc(p.title)}</td><td>${esc(p.authors)}</td><td>${p.year}</td><td>${badge(p.published)}</td>
            <td><button class="cms-btn cms-btn--ghost cms-btn--sm" data-pub-del="${p.id}">Delete</button></td>
          </tr>`).join('')}</tbody></table>
        </div>
      </div>`;
    document.getElementById('cmsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const stats = (r.stats||[]).map((_,i)=>({ label: fd.get(`statLabel${i}`), value: fd.get(`statValue${i}`) }));
      GPCMS.setSection('research', { ...r, published: r.published, heroTitle: fd.get('heroTitle'), heroSubtitle: fd.get('heroSubtitle'), stats });
      toastSaved('Research saved');
    });
    document.getElementById('addPub').addEventListener('click', () => {
      openModal('Add Publication', `<form id="modalForm" class="cms-form">
        <div class="cms-field"><label>Title</label><input name="title" required></div>
        <div class="cms-form__row"><div class="cms-field"><label>Authors</label><input name="authors"></div>
        <div class="cms-field"><label>Journal</label><input name="journal"></div></div>
        <div class="cms-field"><label>Year</label><input name="year" type="number" value="2025"></div>
        <button type="submit" class="cms-btn cms-btn--primary">Save</button></form>`);
      document.getElementById('modalForm').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const fd = new FormData(ev.target);
        const rs = GPCMS.getSection('research');
        rs.publications.unshift({ id:'pub-'+Date.now(), title:fd.get('title'), authors:fd.get('authors'), journal:fd.get('journal'), year:Number(fd.get('year')), published:true });
        GPCMS.setSection('research',rs); closeModal(); route(currentRoute); toastSaved('Added');
      });
    });
    document.querySelectorAll('[data-pub-del]').forEach(b=>b.addEventListener('click',()=>{
      if(!confirm('Delete?'))return;
      const rs=GPCMS.getSection('research');
      rs.publications=rs.publications.filter(p=>p.id!==b.dataset.pubDel);
      GPCMS.setSection('research',rs); route(currentRoute);
    }));
  }

  /* ─── Generic list CRUD ─── */
  const noticeFields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'category', label: 'Category', type: 'select', options: ['admission','counselling','exam','general'] },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'priority', label: 'Priority', type: 'select', options: ['normal','high'] },
    { key: 'link', label: 'Link URL', type: 'text' },
  ];
  const eventFields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'time', label: 'Time', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'category', label: 'Category', type: 'select', options: ['academic','seminar','placement','outreach'] },
    { key: 'content', label: 'Full Content (HTML)', type: 'textarea', rows: 6 },
  ];
  const newsFields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'category', label: 'Category', type: 'select', options: ['event','visit','placement','general'] },
    { key: 'image', label: 'Image', type: 'image' },
    { key: 'content', label: 'Full Content (HTML)', type: 'textarea', rows: 6 },
  ];
  const achievementFields = [
    { key: 'student', label: 'Student Name', type: 'text', required: true },
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'achievement', label: 'Achievement', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'select', options: ['rank','academic','research','placement','sports','certification'] },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'event', label: 'Event', type: 'text' },
    { key: 'photo', label: 'Photo', type: 'image' },
    { key: 'certificate', label: 'Has Certificate', type: 'checkbox' },
  ];

  function renderList(collection, fields) {
    const items = GPCMS.list(collection);
    const title = TITLES[collection] || collection;
    document.getElementById('cmsContent').innerHTML = `
      <div class="cms-panel">
        <div class="cms-panel__head">
          <h2>${esc(title)} (${items.length})</h2>
          <button type="button" class="cms-btn cms-btn--primary cms-btn--sm" id="addBtn">+ Add ${esc(title.slice(0,-1) || title)}</button>
        </div>
        <div class="cms-panel__body cms-table-wrap">
          <table class="cms-table">
            <thead><tr><th>Title</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${items.map(i => `
              <tr>
                <td><span class="cms-table__title">${esc(i.title || i.student || i.achievement)}</span>
                  <div class="cms-table__meta">${esc(i.summary || i.course || '')}</div></td>
                <td>${esc(i.date || '—')}</td>
                <td>${badge(i.published)}${i.priority==='high'?' <span class="cms-badge cms-badge--urgent">Urgent</span>':''}</td>
                <td class="cms-actions">
                  <button class="cms-btn cms-btn--ghost cms-btn--sm" data-edit="${i.id}">Edit</button>
                  <button class="cms-btn cms-btn--ghost cms-btn--sm" data-toggle="${i.id}">${i.published !== false ? 'Unpublish' : 'Publish'}</button>
                  <button class="cms-btn cms-btn--ghost cms-btn--sm" data-delete="${i.id}">Delete</button>
                </td>
              </tr>`).join('') || `<tr><td colspan="4"><div class="cms-empty"><div class="cms-empty__icon">📭</div>No ${esc(title.toLowerCase())} yet. Click Add to create one.</div></td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
    document.getElementById('addBtn').addEventListener('click', () => openListForm(collection, fields, null));
    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openListForm(collection, fields, b.dataset.edit)));
    document.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
      GPCMS.togglePublish(collection, b.dataset.toggle);
      route(currentRoute);
      toast('Status updated');
    }));
    document.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => {
      if (confirm('Delete this item permanently?')) {
        GPCMS.remove(collection, b.dataset.delete);
        route(currentRoute);
        toast('Deleted');
      }
    }));
  }

  function openListForm(collection, fields, id) {
    const item = id ? GPCMS.get(collection, id) : { published: true };
    const formFields = fields.map(f => {
      if (f.type === 'image') return imgField({ name: f.key, label: f.label, value: item[f.key] || '' });
      if (f.type === 'textarea') return `<div class="cms-field"><label>${esc(f.label)}</label><textarea name="${f.key}" rows="${f.rows||3}">${esc(item[f.key]||'')}</textarea></div>`;
      if (f.type === 'select') return `<div class="cms-field"><label>${esc(f.label)}</label><select name="${f.key}">${f.options.map(o=>`<option value="${o}" ${item[f.key]===o?'selected':''}>${o}</option>`).join('')}</select></div>`;
      if (f.type === 'checkbox') return `<label class="cms-checkbox"><input type="checkbox" name="${f.key}" ${item[f.key]?'checked':''}> ${esc(f.label)}</label>`;
      return `<div class="cms-field"><label>${esc(f.label)}</label><input name="${f.key}" type="${f.type||'text'}" ${f.required?'required':''} value="${escAttr(item[f.key]||'')}"></div>`;
    }).join('');
    openModal(id ? 'Edit Item' : 'Add New', `
      <form id="modalForm" class="cms-form">${formFields}
        <label class="cms-checkbox"><input type="checkbox" name="published" ${item.published !== false ? 'checked' : ''}> Published</label>
        <button type="submit" class="cms-btn cms-btn--primary">Save</button>
      </form>`);
    document.getElementById('modalForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const record = { published: fd.get('published') === 'on' };
      fields.forEach(f => {
        if (f.type === 'checkbox') record[f.key] = fd.get(f.key) === 'on';
        else record[f.key] = fd.get(f.key);
      });
      if (!id && collection === 'notices') record.id = slug(record.title);
      if (id) GPCMS.update(collection, id, record);
      else GPCMS.create(collection, record);
      closeModal();
      route(currentRoute);
      toastSaved('Saved');
    });
  }

  /* ─── Applications ─── */
  function renderApplications() {
    const apps = GPCMS.getApplications();
    document.getElementById('cmsContent').innerHTML = `
      <div class="cms-panel">
        <div class="cms-panel__head"><h2>Admission Applications (${apps.length})</h2>
          <span class="cms-table__meta">Synced from online admission form (localStorage demo)</span></div>
        <div class="cms-panel__body cms-table-wrap">${renderAppsTable(apps)}</div>
      </div>`;
  }

  function renderAppsTable(apps) {
    if (!apps.length) return '<div class="cms-empty"><div class="cms-empty__icon">📋</div>No applications submitted yet.</div>';
    return `<table class="cms-table"><thead><tr><th>Application ID</th><th>Name</th><th>Course</th><th>Phone</th><th>Submitted</th></tr></thead><tbody>
      ${apps.map(a => `<tr>
        <td><strong>${esc(a.applicationId||a.id||'—')}</strong></td>
        <td>${esc(a.fullName||a.name||'—')}</td>
        <td>${esc(a.course||'—')}</td>
        <td>${esc(a.phone||a.mobile||'—')}</td>
        <td>${esc(a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('en-IN') : '—')}</td>
      </tr>`).join('')}
    </tbody></table>`;
  }

  /* ─── Users ─── */
  function renderUsers() {
    if (!GPCMS.isAdmin()) { document.getElementById('cmsContent').innerHTML = '<p>Admin access required.</p>'; return; }
    const users = GPCMS.listUsers();
    document.getElementById('cmsContent').innerHTML = `
      <div class="cms-panel">
        <div class="cms-panel__head"><h2>CMS Users (${users.length})</h2>
          <button type="button" class="cms-btn cms-btn--primary cms-btn--sm" id="addUser">+ Add User</button></div>
        <div class="cms-panel__body cms-table-wrap">
          <table class="cms-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>${users.map(u=>`<tr>
            <td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.role)}</td>
            <td>${u.active?'<span class="cms-badge cms-badge--published">Active</span>':'<span class="cms-badge cms-badge--draft">Inactive</span>'}</td>
            <td>${u.id!=='user-admin'?`<button class="cms-btn cms-btn--ghost cms-btn--sm" data-user-del="${u.id}">Remove</button>`:''}</td>
          </tr>`).join('')}</tbody></table>
        </div>
      </div>`;
    document.getElementById('addUser').addEventListener('click', () => {
      openModal('Add User', `<form id="modalForm" class="cms-form">
        <div class="cms-field"><label>Name</label><input name="name" required></div>
        <div class="cms-field"><label>Email</label><input name="email" type="email" required></div>
        <div class="cms-field"><label>Password</label><input name="password" type="password" required></div>
        <div class="cms-field"><label>Role</label><select name="role"><option value="editor">Editor</option><option value="admin">Admin</option></select></div>
        <button type="submit" class="cms-btn cms-btn--primary">Create User</button></form>`);
      document.getElementById('modalForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const u = await GPCMS.createUser({ name: fd.get('name'), email: fd.get('email'), password: fd.get('password'), role: fd.get('role') });
        if (!u) { toast('Email already exists', 'error'); return; }
        closeModal(); route(currentRoute); toastSaved('User created');
      });
    });
    document.querySelectorAll('[data-user-del]').forEach(b=>b.addEventListener('click',()=>{
      if(confirm('Remove user?')){ GPCMS.removeUser(b.dataset.userDel); route(currentRoute); }
    }));
  }

  /* ─── Helpers ─── */
  function publishBar(published) {
    return `<div class="cms-publish-bar ${published ? '' : 'cms-publish-bar--draft'}">
      <span>${published
        ? 'This section is <strong>published</strong> on the website'
        : 'This section is <strong>draft</strong> — hidden from visitors'}</span>
      <button type="button" class="cms-btn cms-btn--sm ${published ? 'cms-btn--outline' : 'cms-btn--gold'}" id="togglePublishBtn">
        ${published ? 'Unpublish' : 'Publish now'}
      </button>
    </div>`;
  }

  document.addEventListener('click', (e) => {
    const quick = e.target.closest?.('[data-quick]');
    if (quick) {
      location.hash = quick.dataset.quick;
      return;
    }
    if (e.target.id === 'togglePublishBtn') {
      const parts = currentRoute.split('-');
      if (parts[0] === 'website') {
        const map = { homepage: 'website.homepage', about: 'website.about', courses: 'website.courses', faculty: 'website.faculty', contact: 'website.contact' };
        const path = map[parts[1]];
        if (path) {
          const sec = GPCMS.getSection(path);
          sec.published = !sec.published;
          GPCMS.setSection(path, sec);
          route(currentRoute);
          toastSaved(sec.published ? 'Published' : 'Unpublished');
        }
      } else if (['admissions','placements','research'].includes(currentRoute)) {
        const sec = GPCMS.getSection(currentRoute);
        sec.published = !sec.published;
        GPCMS.setSection(currentRoute, sec);
        route(currentRoute);
        toastSaved(sec.published ? 'Published' : 'Unpublished');
      }
    }
  });

  function rowActions(sectionPath, arrayKey, id, published) {
    return `
      <button class="cms-btn cms-btn--ghost cms-btn--sm" data-edit="${id}">Edit</button>
      <button class="cms-btn cms-btn--ghost cms-btn--sm" data-toggle="${id}">${published !== false ? 'Unpublish' : 'Publish'}</button>
      <button class="cms-btn cms-btn--ghost cms-btn--sm" data-delete="${id}">Delete</button>`;
  }

  function bindRowActions(sectionPath, arrayKey) {
    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => {
      openProgramForm(sectionPath, arrayKey, b.dataset.edit, arrayKey === 'members' ? 'Faculty Member' : 'Program');
    }));
    document.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
      GPCMS.toggleInSection(sectionPath, arrayKey, b.dataset.toggle);
      route(currentRoute);
    }));
    document.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => {
      if (confirm('Delete?')) { GPCMS.removeFromSection(sectionPath, arrayKey, b.dataset.delete); route(currentRoute); }
    }));
  }

  function openModal(title, html) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('cmsModalOverlay').classList.add('is-open');
    bindMediaFields();
  }

  function closeModal() {
    document.getElementById('cmsModalOverlay').classList.remove('is-open');
  }

  function toast(msg, type) {
    const t = document.getElementById('cmsToast');
    t.textContent = msg;
    t.className = `cms-toast is-visible${type ? ' cms-toast--' + type : ''}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => t.classList.remove('is-visible'), 3200);
  }

  /** Save confirmation + flush CMS → API sync for public site */
  function toastSaved(msg) {
    const canSync = !!(window.CMSApi?.isEnabled?.() && GPCMS.getSession()?.apiToken);
    if (!canSync) {
      toast(`${msg} · saved on this device`, 'success');
      return;
    }
    toast(`${msg} · syncing to site…`, 'success');
    const flush = GPCMS.flushSync?.();
    if (flush && typeof flush.then === 'function') {
      flush.then(() => {
        toast(`${msg} · live site updated`, 'success');
      }).catch(() => {
        toast(`${msg} · saved locally (server sync failed)`, 'error');
      });
    }
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function escAttr(s) { return esc(s).replace(/'/g,'&#39;'); }

  function lines(str) {
    return String(str || '').split('\n').map(s => s.trim()).filter(Boolean);
  }

  function slug(t) {
    return String(t).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') + '-' + Date.now().toString(36).slice(-4);
  }

  function badge(published) {
    return published !== false
      ? '<span class="cms-badge cms-badge--published">Published</span>'
      : '<span class="cms-badge cms-badge--draft">Draft</span>';
  }
})();
