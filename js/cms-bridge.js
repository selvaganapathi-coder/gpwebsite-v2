/**
 * G.P. Pharmacy College — CMS Bridge
 * Applies admin-edited content to the public website (no code changes needed)
 */
(function (global) {
  if (!global.GPCMS) return;

  const sec = () => global.GPSecurity;
  let patched = false;

  function runPatches() {
    try {
      applyDataOverrides();
      applyDomPatches();
      patched = true;
      document.dispatchEvent(new CustomEvent('gpcms:patched'));
    } catch (error) {
      console.warn('[CMSBridge] Failed to apply content patches:', error);
    }
  }

  async function start() {
    await GPCMS.initAsync();
    const schedule = () => {
      runPatches();
      // site.js injects the announcement bar synchronously after this script;
      // re-apply once microtasks/timeouts flush so late-mounted nodes get CMS text.
      queueMicrotask(runPatches);
      setTimeout(runPatches, 0);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', schedule, { once: true });
    } else {
      schedule();
    }
  }

  start();

  /** Allow layout scripts to request a re-apply after mounting chrome. */
  global.GPCMSBridge = {
    refresh() {
      runPatches();
    },
    get ready() {
      return patched;
    },
  };

  function applyDataOverrides() {
    const d = GPCMS.getData();

    if (window.GPNotices) {
      if (d.notices.length) GPNotices.notices = d.notices;
      if (d.events.length) GPNotices.events = d.events;
      if (d.news.length) GPNotices.news = d.news;
      GPNotices.source = 'cms';
    }

    if (window.GPAchievements && d.achievements.length) {
      GPAchievements.items = d.achievements.filter(a => a.published !== false);
    }

    if (window.GPGallery && Array.isArray(d.gallery) && d.gallery.length) {
      GPGallery.items = d.gallery.filter(g => g.published !== false);
    }

    if (window.GPPlacedStudents && d.placements?.placedBatches?.length) {
      GPPlacedStudents.batches = d.placements.placedBatches.filter(b => b.published !== false);
    }
  }

  function applyDomPatches() {
    const page = document.body.dataset.page;
    const d = GPCMS.getData();

    patchAnnouncement(d.website?.homepage);
    if (page === 'home') {
      patchHomepage(d.website?.homepage);
      patchHomeSections(d.website?.homepage, d.placements, d.website?.about);
    }
    if (page === 'about' || page === 'about-management' || page === 'about-principal') {
      patchAbout(d.website?.about, page);
    }
    if (page === 'contact') patchContact(d.website?.contact);
    if (page === 'courses') patchCoursesHero(d.website?.courses);
    if (page === 'courses' || page === 'admissions') patchFeeRows(d.admissions?.feeRows);
    if (page === 'campus-page') patchParentCare(d.website?.homepage?.parentCare);
    if (page === 'faculty') patchFaculty(d.website?.faculty);
    if (page === 'admissions') patchAdmissions(d.admissions);
    if (page === 'placements') patchPlacements(d.placements);
    if (page === 'placed-students') patchPlacedStudents(d.placements);
    if (page === 'placed-students') patchPlacedStudents(d.placements);
    if (page === 'research') patchResearch(d.research);
  }

  function patchAnnouncement(hp) {
    if (!hp?.published || !hp.announcement) return;
    const text = String(hp.announcement);

    // Current design system (site.js): static message row
    const msg = document.querySelector('.announcement__msg');
    if (msg) {
      msg.textContent = text;
      return;
    }

    // Legacy scrolling ticker (older templates)
    const track = document.querySelector('.announcement__track');
    if (!track) return;
    const safe = esc(text);
    track.innerHTML = `<span>${safe}</span><span>${safe}</span>`;
  }

  function patchHomepage(hp) {
    if (!hp?.published) return;

    if (hp.badge) {
      document.querySelectorAll('.hero__badge, [data-home="badge"]').forEach((el) => {
        el.textContent = hp.badge;
      });
    }

    const firstCaption = document.querySelector('.hero__caption.active, .hero__caption');
    if (firstCaption) {
      const h1 = firstCaption.querySelector('[data-home="title"], .hero__title, h1');
      const sub = firstCaption.querySelector('[data-home="subtitle"], .hero__subtitle, p.hero__subtitle');
      if (h1 && hp.title) h1.textContent = hp.title;
      if (sub && hp.subtitle) sub.textContent = hp.subtitle;
    }

    if (hp.slides?.length) {
      document.querySelectorAll('.hero__slide').forEach((el, i) => {
        const url = safeImg(hp.slides[i]);
        if (!url) return;
        const optimized = global.GPImages?.optimize?.(url, { width: 1920 }) || url;
        el.dataset.bg = optimized;
        if (i === 0 || el.classList.contains('active')) {
          el.style.backgroundImage = `url('${optimized.replace(/'/g, '%27')}')`;
          el.dataset.loaded = 'true';
          el.classList.add('is-loaded');
        } else {
          el.style.backgroundImage = '';
          delete el.dataset.loaded;
          el.classList.remove('is-loaded');
        }
      });
      global.GPImages?.preloadImage?.(hp.slides[0], true);
    }
  }

  function patchHomeSections(hp, placements, about) {
    if (!hp?.published) return;
    patchHomeAbout(hp.homeAbout);
    patchHomeCampus(hp.campusShow);
    patchHomePrograms(hp.programsShow);
    patchHomePeople(hp.people, about);
    patchHomeOutcomes(hp.outcomes);
    patchHomeRecruiters(hp, placements);
    patchHomeApprovals(hp.approvals);
    patchCampusTour(hp.campusTour);
    patchParentCare(hp.parentCare);
  }

  function patchHomeAbout(ha) {
    if (!ha) return;
    setText('[data-home="aboutEyebrow"]', ha.eyebrow);
    setText('[data-home="aboutTitle"]', ha.title);
    setText('[data-home="aboutBadge"]', ha.badge);
    setText('[data-home="aboutCtaPrimary"]', ha.ctaPrimary);
    setText('[data-home="aboutCtaSecondary"]', ha.ctaSecondary);
    setImg('[data-home="aboutImage"]', ha.image);

    const factsEl = document.getElementById('homeAboutFacts');
    if (factsEl && ha.facts?.length) {
      factsEl.innerHTML = ha.facts.map((f) => {
        const text = esc(String(f || ''));
        return `<li>${text.replace(/\b889\b/g, '<strong>889</strong>')}</li>`;
      }).join('');
    }
  }

  function patchHomeCampus(cs) {
    if (!cs) return;
    setText('[data-home="campusEyebrow"]', cs.eyebrow);
    setText('[data-home="campusTitle"]', cs.title);
    setText('[data-home="campusLead"]', cs.lead);
    (cs.items || []).forEach((item) => {
      if (!item?.id) return;
      setText(`[data-home-campus-title="${item.id}"]`, item.title);
      setText(`[data-home-campus-caption="${item.id}"]`, item.caption);
      setImg(`[data-home-campus-img="${item.id}"]`, item.image);
    });
  }

  function patchHomePrograms(ps) {
    if (!ps) return;
    setText('[data-home="programsEyebrow"]', ps.eyebrow);
    setText('[data-home="programsTitle"]', ps.title);
    setText('[data-home="programsLead"]', ps.lead);
    setText('[data-home="programsCta"]', ps.ctaText);
    const cta = document.querySelector('[data-home="programsCta"]');
    if (cta?.tagName === 'A' && ps.ctaHref) cta.href = ps.ctaHref;

    (ps.items || []).forEach((item) => {
      if (!item?.id) return;
      setText(`[data-home-program-name="${item.id}"]`, item.name);
      setText(`[data-home-program-duration="${item.id}"]`, item.duration);
      setText(`[data-home-program-blurb="${item.id}"]`, item.blurb);
      setImg(`[data-home-program-img="${item.id}"]`, item.image);
      const tile = document.querySelector(`[data-home-program="${item.id}"]`);
      if (tile?.tagName === 'A' && item.href) tile.href = item.href;
      const img = document.querySelector(`[data-home-program-img="${item.id}"]`);
      if (img && item.name) img.alt = item.name;
    });
  }

  function patchHomePeople(people, about) {
    if (!people) return;
    setText('[data-home="peopleEyebrow"]', people.eyebrow);
    setText('[data-home="peopleTitle"]', people.title);
    setText('[data-home="peopleLead"]', people.lead);

    const slots = people.slots || [];
    slots.forEach((slot) => {
      if (!slot?.id) return;
      let name = slot.name;
      let role = slot.role;
      let image = slot.image;
      if (slot.id === 'chairman' && about?.chairman) {
        name = name || about.chairman.name;
        role = role || about.chairman.title;
        image = image || about.chairman.image;
      }
      if (slot.id === 'principal' && about?.leadership?.length) {
        const principal = about.leadership.find((l) => /principal/i.test(l.role || '')) || about.leadership[1];
        if (principal) {
          name = name || principal.name;
          role = role || principal.role;
          image = image || principal.image;
        }
      }
      setText(`[data-home-person-name="${slot.id}"]`, name);
      setText(`[data-home-person-role="${slot.id}"]`, role);
      const card = document.querySelector(`[data-home-person="${slot.id}"]`);
      if (card && name) card.setAttribute('aria-label', name);
      if (slot.href && card?.tagName === 'A') card.href = slot.href;
      applyPersonImage(slot.id, image, name);
    });

    setText('[data-home-person-name="more"]', people.moreLabel);
    setText('[data-home-person-role="more"]', people.moreCaption);
    setImg('[data-home-person-img="more"]', people.moreImage);
    const more = document.querySelector('[data-home-person="more"]');
    if (more?.tagName === 'A' && people.moreHref) more.href = people.moreHref;
  }

  function applyPersonImage(id, image, name) {
    const url = safeImg(image);
    const img = document.querySelector(`[data-home-person-img="${id}"]`);
    const card = document.querySelector(`[data-home-person="${id}"]`);
    if (url && img) {
      img.src = url;
      if (name) img.alt = name;
      card?.classList.remove('home-people__person--initials');
      return;
    }
    if (url && card && !img) {
      const avatar = card.querySelector('[data-home-person-avatar]');
      if (avatar) {
        avatar.outerHTML = `<img data-home-person-img="${escAttr(id)}" src="${escAttr(url)}" alt="${escAttr(name || '')}" width="200" height="200" loading="lazy">`;
        card.classList.remove('home-people__person--initials');
      }
      return;
    }
    const avatar = document.querySelector(`[data-home-person-avatar="${id}"]`);
    if (avatar && name) avatar.textContent = initials(name);
  }

  function patchHomeOutcomes(outcomes) {
    if (!outcomes) return;
    setText('[data-home="outcomesEyebrow"]', outcomes.eyebrow);
    setText('[data-home="outcomesTitle"]', outcomes.title);
    setText('[data-home="outcomesLink"]', outcomes.linkText);
    const link = document.querySelector('[data-home="outcomesLink"]');
    if (link && outcomes.linkHref) link.href = outcomes.linkHref;
    (outcomes.items || []).forEach((item) => {
      if (!item?.id) return;
      setText(`[data-home-outcome-label="${item.id}"]`, item.label);
      setText(`[data-home-outcome-desc="${item.id}"]`, item.desc);
    });
  }

  function patchHomeRecruiters(hp, placements) {
    setText('[data-home="recruitersLabel"]', hp.recruitersLabel);
    const row = document.getElementById('homeRecruitersRow');
    const names = placements?.recruiters;
    if (!row || !names?.length) return;
    row.innerHTML = names.map((n) => `<span>${esc(n)}</span>`).join('');
  }

  function patchAbout(ab, page) {
    if (!ab?.published) return;
    if (page === 'about') {
      setText('.page-hero__title', ab.heroTitle);
      setText('.page-hero__subtitle', ab.heroSubtitle);
    }
    setText('.about-story__title', ab.storyTitle);
    setText('[data-about="storyP1"]', ab.storyP1);
    setText('[data-about="storyP2"]', ab.storyP2);

    if (ab.chairman) {
      setText('[data-about="chairmanName"]', ab.chairman.name);
      setText('[data-about="chairmanTitle"]', ab.chairman.title);
      setText('[data-about="chairmanBio"]', ab.chairman.bio);
      const av = document.querySelector('#aboutChairman .chairman-card__avatar')
        || document.querySelector('.about-board__card--featured .about-board__avatar');
      const imgUrl = safeImg(ab.chairman.image);
      if (av && imgUrl) {
        av.classList.toggle('chairman-card__avatar--logo', /Logo/i.test(imgUrl));
        av.classList.toggle('about-board__avatar--logo', /Logo/i.test(imgUrl));
        av.innerHTML = `<img src="${escAttr(imgUrl)}" alt="">`;
      } else if (av && ab.chairman.name) {
        av.classList.remove('chairman-card__avatar--logo', 'about-board__avatar--logo');
        av.textContent = initials(ab.chairman.name);
      }
    }

    const factsEl = document.getElementById('aboutKeyFacts');
    if (factsEl && ab.keyFacts?.length) {
      factsEl.innerHTML = ab.keyFacts.map(f =>
        `<li><strong>${esc(f.label)}</strong><span>${esc(f.value)}</span></li>`
      ).join('');
    }

    setImg('.about-story__photo img', ab.image);
    setImg('.about-discover__media img', ab.image);
    setImg('.about-vm__banner img', ab.vmImage);
    setImg('.about-page-cta img', ab.ctaImage);

    fillList('#aboutVision', ab.vision);
    fillList('#aboutMission', ab.mission);
    setText('#aboutVisionStatement', ab.visionStatement);
    setText('#aboutMissionStatement', ab.missionStatement);
    setText('#aboutVisionStatement', ab.visionStatement);
    setText('#aboutMissionStatement', ab.missionStatement);

    const hl = document.getElementById('aboutHighlights');
    if (hl && ab.highlights?.length) {
      const items = ab.highlights.filter(h => h.published !== false);
      if (items.length) hl.innerHTML = items.map(renderHighlightCard).join('');
    }

    const ld = document.getElementById('aboutLeadership');
    if (ld && ab.leadership?.length) {
      const items = ab.leadership.filter(l => l.published !== false);
      if (items.length) ld.innerHTML = items.map(renderLeaderCard).join('');
    }

    if (page === 'about-principal') {
      const principal = ab.leadership?.find(l => l.published !== false && /principal/i.test(l.role || ''))
        || ab.leadership?.[1];
      if (principal) {
        setText('[data-principal="name"]', principal.name);
        setText('[data-principal="qual"]', principal.role);
        setText('[data-principal="bio"]', principal.bio);
        setImg('.about-principal-profile__photo img', principal.image);
      }
    }
  }

  function renderHighlightCard(h) {
    const imgUrl = safeImg(h.image);
    return `<article class="about-highlight-card">
      <div class="about-highlight-card__img">
        <img src="${escAttr(imgUrl)}" alt="${escAttr(h.title)}" loading="lazy">
      </div>
      <div class="about-highlight-card__body">
        <h4>${esc(h.title)}</h4>
        <p>${esc(h.desc)}</p>
      </div>
    </article>`;
  }

  function renderLeaderCard(l) {
    const imgUrl = safeImg(l.image);
    let avClass = ' about-leader-card__avatar--photo';
    if (imgUrl && /GP-Logo|Logo-neww/i.test(imgUrl)) avClass = ' about-leader-card__avatar--logo';
    const av = imgUrl
      ? `<img src="${escAttr(imgUrl)}" alt="">`
      : initials(l.name);
    const link = /principal/i.test(l.role || '')
      ? `<a class="about-leader-card__link" href="about-principal.html">Principal’s message →</a>`
      : `<a class="about-leader-card__link" href="about-management.html">Management →</a>`;
    return `<article class="about-leader-card">
      <div class="about-leader-card__avatar${avClass}">${av}</div>
      <div>
        <h3>${esc(l.name)}</h3>
        <p class="about-leader-card__role">${esc(l.role)}</p>
        <p class="about-leader-card__bio">${esc(l.bio)}</p>
        ${link}
      </div>
    </article>`;
  }

  function initials(name) {
    return String(name || '').split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('').toUpperCase() || '?';
  }

  function setImg(sel, src) {
    const url = safeImg(src);
    if (!url) return;
    const el = document.querySelector(sel);
    if (el) el.src = url;
  }

  function safeImg(url) {
    const raw = sec()?.sanitizeImageUrl ? sec().sanitizeImageUrl(url) : escUrl(url);
    if (!raw) return '';
    return global.GPImages?.optimize?.(raw, { width: 800 }) || raw;
  }

  function escUrl(url) {
    if (!url || typeof url !== 'string') return '';
    if (/^javascript:/i.test(url) || /^data:(?!image\/)/i.test(url)) return '';
    return url;
  }

  function patchContact(c) {
    if (!c?.published) return;
    setText('.page-hero__title', c.heroTitle);
    setText('.page-hero__subtitle', c.heroSubtitle);
    const items = document.querySelectorAll('.contact-info__item');
    items.forEach(item => {
      const h4 = item.querySelector('h4')?.textContent?.trim();
      const p = item.querySelector('p');
      if (!p) return;
      if (h4 === 'Address') {
        p.textContent = '';
        String(c.address || '').split('\n').forEach((line, i) => {
          if (i) p.appendChild(document.createElement('br'));
          p.appendChild(document.createTextNode(line));
        });
      }
      if (h4 === 'Principal') {
        p.textContent = '';
        p.appendChild(document.createTextNode(c.principal || ''));
        p.appendChild(document.createElement('br'));
        p.appendChild(document.createTextNode('GP Pharmacy College'));
      }
      if (h4 === 'Telephone' && c.phones?.length) {
        p.textContent = '';
        c.phones.forEach((ph, i) => {
          const href = sec()?.sanitizeTel ? sec().sanitizeTel(ph) : `tel:${String(ph).replace(/\s/g, '')}`;
          if (!href) return;
          if (i) p.appendChild(document.createElement('br'));
          const a = document.createElement('a');
          a.href = href;
          a.textContent = ph;
          p.appendChild(a);
        });
      }
      if (h4 === 'Email' && c.email) {
        p.textContent = '';
        const href = sec()?.sanitizeEmail ? sec().sanitizeEmail(c.email) : `mailto:${c.email}`;
        if (href) {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = c.email;
          p.appendChild(a);
        }
      }
      if (h4 === 'Office Hours' && c.hours) {
        p.textContent = c.hours;
      }
      if (h4 === 'Office Hours' && c.hours) {
        p.textContent = c.hours;
      }
    });
  }

  function youtubeEmbedUrl(url) {
    if (!url) return '';
    const raw = String(url).trim();
    if (!raw) return '';
    let id = '';
    const short = raw.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
    const watch = raw.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
    const embed = raw.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
    if (short) id = short[1];
    else if (watch) id = watch[1];
    else if (embed) id = embed[1];
    else if (/^[A-Za-z0-9_-]{6,}$/.test(raw)) id = raw;
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : '';
  }

  function patchCampusTour(tour) {
    if (!tour) return;
    setText('[data-home="tourLead"]', tour.lead);
    const embed = youtubeEmbedUrl(tour.youtubeUrl);
    const placeholder = document.getElementById('homeTourPlaceholder');
    const video = document.getElementById('homeTourVideo');
    const iframe = video?.querySelector('iframe');
    if (embed && video && iframe) {
      iframe.src = embed;
      video.hidden = false;
      if (placeholder) placeholder.hidden = true;
    } else if (placeholder) {
      placeholder.hidden = false;
      if (video) video.hidden = true;
      const img = placeholder.querySelector('img');
      if (img && tour.fallbackImage) {
        const url = safeImg(tour.fallbackImage);
        if (url) img.src = url;
      }
    }
  }

  function patchHomeApprovals(items) {
    if (!Array.isArray(items) || !items.length) return;
    items.forEach((item) => {
      if (!item?.id) return;
      const card = document.querySelector(`[data-home-approval="${item.id}"]`);
      if (!card) return;
      const strong = card.querySelector('strong');
      const span = card.querySelector('span');
      const em = card.querySelector('em');
      if (strong && item.title) strong.textContent = item.title;
      if (span && item.subtitle) span.textContent = item.subtitle;
      const href = (item.pdfUrl || item.href || '').trim();
      if (href && card.tagName === 'A') card.href = href;
      if (em && item.pdfUrl) em.textContent = 'Open PDF →';
    });
  }

  function fillRuleList(selector, rules) {
    const el = document.querySelector(selector);
    if (!el || !Array.isArray(rules) || !rules.length) return;
    el.innerHTML = rules.map((r) => `<li>${esc(String(r || ''))}</li>`).join('');
  }

  function patchParentCare(pc) {
    if (!pc) return;
    setText('[data-campus="hostelTitle"]', pc.hostelTitle);
    setText('[data-campus="transportTitle"]', pc.transportTitle);
    setText('[data-campus="safetyTitle"]', pc.safetyTitle);
    setImg('[data-campus-hostel-img]', pc.hostelImage);
    setImg('[data-campus-transport-img]', pc.transportImage);
    setImg('[data-campus-safety-img]', pc.safetyImage);
    fillRuleList('[data-campus="hostelRules"]', pc.hostelRules);
    fillRuleList('[data-campus="transportRules"]', pc.transportRules);
    fillRuleList('[data-campus="safetyRules"]', pc.safetyRules);
  }

  function patchFeeRows(rows) {
    if (!Array.isArray(rows) || !rows.length) return;
    document.querySelectorAll('[data-fees="table"]').forEach((table) => {
      table.innerHTML = rows.map((row) => `
        <div class="fee-clarity__row">
          <span>${esc(row.label || '')}</span>
          <strong>${esc(row.value || '')}</strong>
        </div>`).join('');
    });
  }

  function patchCoursesHero(co) {
    if (!co?.published) return;
    setText('.page-hero__title', co.heroTitle);
    setText('.page-hero__subtitle', co.heroSubtitle);
    (co.programs || []).forEach((p) => {
      if (!p?.id) return;
      setText(`[data-program-name="${p.id}"]`, p.name);
      setText(`[data-program-duration="${p.id}"]`, p.duration);
      if (p.intake != null && p.intake !== '') setText(`[data-program-intake="${p.id}"]`, String(p.intake));
      setText(`[data-program-eligibility="${p.id}"]`, p.eligibility);
      setText(`[data-program-careers="${p.id}"]`, p.careers);
      setText(`[data-program-labs="${p.id}"]`, p.labs);
      setText(`[data-program-become="${p.id}"]`, p.become || p.summary);
    });
  }

  function facultyAvatar(m) {
    const raw = (m.image || '').trim();
    const isCartoon = /\/(Staff|Labs|Smartclass|library|hostel|Transport|Smart-library|water|placement)\.png(\?|$)/i.test(raw)
      || /gp-pharma-home-right1\.jpg/i.test(raw);
    if (raw && !isCartoon) {
      const src = escAttr(global.GPImages?.optimize?.(raw, { width: 220 }) || raw);
      return `<img class="faculty-card__photo" src="${src}" alt="${escAttr(m.name)}" loading="lazy" decoding="async" width="88" height="88">`;
    }
    const initialsStr = m.name.split(' ').filter(Boolean).slice(-2).map((w) => w[0]).join('').toUpperCase();
    return `<div class="faculty-card__avatar" aria-hidden="true">${esc(initialsStr)}</div>`;
  }

  function syncFacultyTabs(members) {
    const tabs = document.querySelector('.faculty-directory .dept-tabs');
    if (!tabs) return;
    const seen = new Map();
    members.forEach((m) => {
      const slug = (m.deptSlug || '').trim();
      const label = (m.dept || slug).trim();
      if (slug && label && !seen.has(slug)) seen.set(slug, label);
    });
    if (!seen.size) return;
    const active = tabs.querySelector('.dept-tab.active')?.dataset?.dept || 'all';
    const buttons = [
      ['all', 'All'],
      ...seen.entries(),
    ].map(([slug, label]) => {
      const isActive = slug === active || (active !== 'all' && !seen.has(active) && slug === 'all');
      return `<button class="dept-tab${isActive ? ' active' : ''}" type="button" data-dept="${escAttr(slug)}" role="tab" aria-selected="${isActive ? 'true' : 'false'}">${esc(label)}</button>`;
    });
    tabs.innerHTML = buttons.join('');
  }

  function parseFacultyRole(role) {
    const text = String(role || '').trim();
    if (!text) return { qualification: '', designation: '' };
    const parts = text.split(/\s*[—–-]\s*/);
    if (parts.length >= 2) {
      return { qualification: parts[0].trim(), designation: parts.slice(1).join(' — ').trim() };
    }
    return { qualification: text, designation: '' };
  }

  function normalizeFacultyMember(m) {
    const fromRole = parseFacultyRole(m.role);
    const department = (m.department || m.dept || '').trim();
    const qualification = (m.qualification || fromRole.qualification || '').trim();
    const designation = (m.designation || fromRole.designation || '').trim();
    return {
      ...m,
      name: (m.name || '').trim(),
      department,
      qualification,
      designation,
      published: m.published !== false,
    };
  }

  function patchFaculty(fa) {
    if (!fa?.published) return;
    setText('.page-hero__title', fa.heroTitle);
    setText('.page-hero__subtitle', fa.heroSubtitle);
    const members = (fa.members || []).map(normalizeFacultyMember).filter((m) => m.published && m.name);
    if (!members.length) return;

    const tbody = document.querySelector('#faculty-staff-table tbody');
    if (tbody) {
      tbody.innerHTML = members.map((m) => `<tr>
        <td data-label="Staff Name">${esc(m.name)}</td>
        <td data-label="Department">${esc(m.department || '—')}</td>
        <td data-label="Degree / Qualification">${esc(m.qualification || '—')}</td>
        <td data-label="Designation">${esc(m.designation || '—')}</td>
      </tr>`).join('');
      return;
    }

    const grid = document.querySelector('.faculty-grid');
    if (!grid) return;
    syncFacultyTabs(members);
    grid.innerHTML = members.map((m) => {
      const deptSlug = m.deptSlug || '';
      const role = m.role || [m.qualification, m.designation].filter(Boolean).join(' — ');
      return `<article class="faculty-card" data-dept="${escAttr(deptSlug)}">
        <div class="faculty-card__head">
          ${facultyAvatar(m)}
          <div class="faculty-card__meta">
            <h3 class="faculty-card__name">${esc(m.name)}</h3>
            <p class="faculty-card__role">${esc(role)}</p>
          </div>
        </div>
        <div class="faculty-card__body">
          <span class="faculty-card__dept">${esc(m.department)}</span>
          <p class="faculty-card__bio">${esc(m.bio || '')}</p>
        </div>
      </article>`;
    }).join('');
  }

  function patchAdmissions(a) {
    if (!a?.published) return;
    setText('.page-hero__title', a.heroTitle);
    setText('.page-hero__subtitle', a.heroSubtitle);
  }

  function patchPlacements(p) {
    if (!p?.published) return;
    setText('.page-hero__title', p.heroTitle);
    setText('.page-hero__subtitle', p.heroSubtitle);
    const stats = document.querySelectorAll('.placement-portal-stat');
    (p.stats || []).forEach((s, i) => {
      if (stats[i]) {
        const strong = stats[i].querySelector('strong');
        const span = stats[i].querySelector('span');
        if (strong) strong.textContent = s.value;
        if (span) span.textContent = s.label;
      }
    });
  }

  /** Sync placed-students page with CMS batches (hero stays page-specific). */
  function patchPlacedStudents(p) {
    if (!p) return;
    if (window.GPPlacedStudents && p.placedBatches?.length) {
      GPPlacedStudents.batches = p.placedBatches.filter((b) => b.published !== false);
    }
  }

  function patchResearch(r) {
    if (!r?.published) return;
    setText('.page-hero__title', r.heroTitle);
    setText('.page-hero__subtitle', r.heroSubtitle);
    const stats = document.querySelectorAll('.research-stat');
    (r.stats || []).forEach((s, i) => {
      if (stats[i]) {
        const strong = stats[i].querySelector('strong');
        const span = stats[i].querySelector('span');
        if (strong) strong.textContent = s.value;
        if (span) span.textContent = s.label;
      }
    });
    const pubs = (r.publications || []).filter((p) => p.published !== false);
    const pubList = document.querySelector('[data-research="publications"]');
    if (pubList && pubs.length) {
      pubList.innerHTML = pubs.map((p) => {
        const meta = [p.journal, p.authors].filter(Boolean).join(' · ');
        return `<li class="research-list__item">
          <span class="research-list__year">${esc(p.year || '')}</span>
          <div>
            <strong>${esc(p.title)}</strong>
            ${meta ? `<p>${esc(meta)}</p>` : ''}
          </div>
        </li>`;
      }).join('');
    }
    const projects = (r.projects || []).filter((p) => p.published !== false);
    const projGrid = document.querySelector('[data-research="projects"]');
    if (projGrid && projects.length) {
      projGrid.innerHTML = projects.map((p) => {
        const eyebrow = [p.status, p.funding].filter(Boolean).join(' · ');
        return `<article class="research-card">
          ${eyebrow ? `<span class="research-card__eyebrow">${esc(eyebrow)}</span>` : ''}
          <h3>${esc(p.title)}</h3>
          ${p.pi ? `<p>Principal Investigator: ${esc(p.pi)}</p>` : '<p></p>'}
          ${p.funding ? `<span class="research-card__tag">${esc(p.funding)}</span>` : ''}
        </article>`;
      }).join('');
    }
  }

  function setText(sel, text) {
    if (!text) return;
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  }

  function fillList(sel, items) {
    if (!items?.length) return;
    const ul = document.querySelector(sel);
    if (ul) ul.innerHTML = items.map(i => `<li>${esc(i)}</li>`).join('');
  }

  function esc(s) {
    return sec()?.escapeHtml ? sec().escapeHtml(s) : String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function escAttr(s) {
    return sec()?.escapeAttr ? sec().escapeAttr(s) : esc(s).replace(/"/g, '&quot;');
  }
})(window);
