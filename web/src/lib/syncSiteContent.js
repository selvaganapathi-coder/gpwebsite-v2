/**
 * Propagate `site` fields across CMS content so one edit updates the whole website.
 */

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

export function formatPhoneDisplay(tel) {
  const d = digits(tel)
  if (d.length === 12 && d.startsWith('91')) {
    return `+91 ${d.slice(2, 7)} ${d.slice(7)}`
  }
  if (d.length === 10) {
    return `+91 ${d.slice(0, 5)} ${d.slice(5)}`
  }
  return String(tel || '').trim()
}

function replaceCodeText(text, code) {
  if (typeof text !== 'string' || !text) return text
  return text
    .replace(/Counselling Code\s*\d{2,5}/gi, `Counselling Code ${code}`)
    .replace(/Code\s*\d{2,5}/g, `Code ${code}`)
    .replace(/\b889\b/g, code)
}

function replacePhoneText(text, phoneDisplay, phoneAltDisplay) {
  if (typeof text !== 'string' || !text || !phoneDisplay) return text
  const matches = text.match(/\+91[\s-]?\d{5}[\s-]?\d{5}/g) || []
  if (!matches.length) return text
  let out = text
  const firstAt = out.indexOf(matches[0])
  out = out.slice(0, firstAt) + phoneDisplay + out.slice(firstAt + matches[0].length)
  if (matches.length >= 2 && phoneAltDisplay) {
    const searchFrom = firstAt + phoneDisplay.length
    const secondAt = out.indexOf(matches[1], searchFrom)
    if (secondAt !== -1) {
      out = out.slice(0, secondAt) + phoneAltDisplay + out.slice(secondAt + matches[1].length)
    }
  }
  return out
}

function mapDeepStrings(value, transform, depth = 0) {
  if (depth > 10) return value
  if (typeof value === 'string') return transform(value)
  if (Array.isArray(value)) return value.map((item) => mapDeepStrings(item, transform, depth + 1))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === 'passwordHash' || k === 'password' || k === 'users') {
        out[k] = v
        continue
      }
      // Don't rewrite image URLs / maps embeds
      if (/url|image|src|href|logo|maps|youtube|instagram|linkedin|embed/i.test(k) && typeof v === 'string') {
        out[k] = v
        continue
      }
      out[k] = mapDeepStrings(v, transform, depth + 1)
    }
    return out
  }
  return value
}

/**
 * @param {object} content - full CMS document
 * @returns {object} synced clone
 */
export function syncSiteEverywhere(content) {
  if (!content || typeof content !== 'object') return content
  const next = structuredClone(content)
  const site = { ...(next.site || {}) }

  const code = String(site.code || '889').trim() || '889'
  const name = String(site.name || 'G.P. COLLEGE').trim() || 'G.P. COLLEGE'
  const phone = String(site.phone || '').trim()
  const phoneAlt = String(site.phoneAlt || '').trim()
  const phoneDisplay = String(site.phoneDisplay || '').trim() || formatPhoneDisplay(phone)
  const phoneAltDisplay = String(site.phoneAltDisplay || '').trim() || formatPhoneDisplay(phoneAlt)
  const email = String(site.email || '').trim()
  const address = String(site.address || '').trim()
  const whatsapp = digits(site.whatsapp) || digits(phone)
  const pci = String(site.pci || '3030').trim() || '3030'
  const goMs = String(site.goMs || '460 & 464').trim() || '460 & 464'
  const university =
    String(site.university || 'The Tamil Nadu Dr. M.G.R. Medical University').trim() ||
    'The Tamil Nadu Dr. M.G.R. Medical University'
  const hours = String(site.hours || 'Mon – Sat · 9:00 AM – 5:00 PM').trim()

  site.code = code
  site.name = name
  site.phone = phone
  site.phoneAlt = phoneAlt
  site.phoneDisplay = phoneDisplay
  site.phoneAltDisplay = phoneAltDisplay
  site.email = email
  site.address = address
  site.whatsapp = whatsapp
  site.pci = pci
  site.goMs = goMs
  site.university = university
  site.hours = hours
  site.tag = `Tirupattur · Code ${code}`
  site.seo = {
    ...(site.seo || {}),
    title:
      site.seo?.title ||
      `${name} | Pharmacy Education · Counselling Code ${code}`,
    description:
      site.seo?.description ||
      `PCI-approved (${pci}) pharmacy college · Counselling Code ${code} · Affiliated to ${university}.`,
    ogImage: site.seo?.ogImage || site.logo || '',
  }
  // Keep SEO title/description code-fresh when code changes
  if (site.seo.title) site.seo.title = replaceCodeText(site.seo.title, code)
  if (site.seo.description) site.seo.description = replaceCodeText(site.seo.description, code)
  next.site = site

  next.website = next.website || {}
  const hp = { ...(next.website.homepage || {}) }

  hp.title = name
  hp.badge = `PCI Approved, Counselling Code ${code}`
  if (hp.announcement) {
    hp.announcement = replaceCodeText(hp.announcement, code)
      .replace(/PCI\s*\(\d+\)/gi, `PCI (${pci})`)
      .replace(/G\.O\s*\(Ms\)\s*[\d\s&]+/gi, `G.O (Ms) ${goMs}`)
  } else {
    hp.announcement = `Counselling Code ${code} · PCI (${pci}) · TN G.O (Ms) ${goMs} · Affiliated to ${university}`
  }

  if (Array.isArray(hp.approvals)) {
    hp.approvals = hp.approvals.map((item) => {
      if (item?.id === 'code' || item?.variant === 'code') {
        return { ...item, title: code, subtitle: item.subtitle || 'Counselling Code' }
      }
      return item
    })
  }

  if (Array.isArray(hp.stats?.items)) {
    hp.stats = {
      ...hp.stats,
      items: hp.stats.items.map((item) =>
        item?.id === 'code' ? { ...item, value: code, label: item.label || 'Counselling code' } : item,
      ),
    }
  }

  if (Array.isArray(hp.attributes?.items)) {
    hp.attributes = {
      ...hp.attributes,
      items: hp.attributes.items.map((item) => {
        if (item?.id !== 'code') return item
        return {
          ...item,
          title: `Counselling Code ${code}`,
          desc: replaceCodeText(
            item.desc || `Use Code ${code} in TN paramedical counselling. Talk to Admin for course and seat guidance.`,
            code,
          ),
        }
      }),
    }
  }

  if (Array.isArray(hp.captions)) {
    hp.captions = hp.captions.map((caption) => ({
      ...caption,
      subtitle: replaceCodeText(caption?.subtitle, code),
    }))
  }

  if (hp.homeAbout) {
    hp.homeAbout = {
      ...hp.homeAbout,
      lead: replaceCodeText(hp.homeAbout.lead, code),
      facts: Array.isArray(hp.homeAbout.facts)
        ? hp.homeAbout.facts.map((fact) => replaceCodeText(fact, code))
        : hp.homeAbout.facts,
    }
  }

  next.website.homepage = hp

  // Contact page mirrors site
  const contact = { ...(next.website.contact || {}) }
  contact.email = email || contact.email
  contact.address = address || contact.address
  contact.hours = hours || contact.hours
  contact.phones = [
    { display: phoneDisplay, tel: phone || digits(phoneDisplay) },
    ...(phoneAlt
      ? [{ display: phoneAltDisplay, tel: phoneAlt }]
      : (contact.phones || []).slice(1, 2)),
  ].filter((p) => p.tel || p.display)
  next.website.contact = contact

  // Admissions
  next.admissions = {
    ...(next.admissions || {}),
    counsellingCode: code,
    heroSubtitle: replaceCodeText(
      next.admissions?.heroSubtitle || `Talk to Admin · Counselling Code ${code} · Jolarpet campus`,
      code,
    ),
  }

  // Campus / about hero subtitles that mention code
  if (next.website.campus) {
    next.website.campus = {
      ...next.website.campus,
      heroSubtitle: replaceCodeText(next.website.campus.heroSubtitle, code),
    }
  }
  if (next.website.about) {
    next.website.about = {
      ...next.website.about,
      heroSubtitle: replaceCodeText(next.website.about.heroSubtitle, code),
    }
  }

  // Events / notices — keep code + primary phone current
  const touchList = (list) =>
    (Array.isArray(list) ? list : []).map((item) => ({
      ...item,
      title: replaceCodeText(item?.title, code),
      summary: replacePhoneText(replaceCodeText(item?.summary, code), phoneDisplay, phoneAltDisplay),
      excerpt: replacePhoneText(replaceCodeText(item?.excerpt, code), phoneDisplay, phoneAltDisplay),
    }))

  next.notices = touchList(next.notices)
  next.events = touchList(next.events)
  next.news = touchList(next.news)

  // Soft pass on remaining website copy (skip urls)
  next.website = mapDeepStrings(next.website, (text) =>
    replacePhoneText(replaceCodeText(text, code), phoneDisplay, phoneAltDisplay),
  )

  return next
}
