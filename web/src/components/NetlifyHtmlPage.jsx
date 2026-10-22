import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCms } from '../context/CmsContext'
import { SITE, categoryLabel, formatEventDate, toAppPath, whatsappUrl } from '../lib/site'

const HIGHLIGHTS = [
  {
    title: 'Experienced Faculty',
    desc: 'Real-world expertise and deep subject knowledge guiding every student.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College22.jpg',
  },
  {
    title: 'Smart Classrooms',
    desc: 'Interactive digital tools for dynamic, engaging theory sessions.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College4.jpg',
  },
  {
    title: 'Modern Laboratories',
    desc: 'Hands-on practical training with industry-standard equipment.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/Pharmaceutics-lab.jpg',
  },
  {
    title: 'AC Library',
    desc: 'Air-conditioned library with vast resources for study and research.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.-Pharmacy-College-Library.jpg',
  },
  {
    title: 'Separate Hostels',
    desc: 'Safe, comfortable hostel facilities for boys and girls.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College28.jpg',
  },
  {
    title: 'Transport & Amenities',
    desc: 'Reliable college transport, purified water, and campus conveniences.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College10.jpg',
  },
]

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function observeFadeUps(root) {
  if (!root) return () => {}
  const nodes = root.querySelectorAll('.fade-up')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach((el) => el.classList.add('visible'))
    return () => {}
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  )
  nodes.forEach((el) => observer.observe(el))
  return () => observer.disconnect()
}

function fillAboutExtras(root, notices) {
  const hl = root.querySelector('#aboutHighlights')
  if (hl && !hl.children.length) {
    hl.innerHTML = HIGHLIGHTS.map(
      (item) => `
      <article class="about-highlight-card">
        <div class="about-highlight-card__img">
          <img src="${esc(item.image)}" alt="" loading="lazy" />
        </div>
        <div class="about-highlight-card__body">
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.desc)}</p>
        </div>
      </article>`
    ).join('')
  }

  const news = root.querySelector('#aboutRecentNews')
  if (news && !news.children.length) {
    const items = notices.slice(0, 3)
    if (!items.length) {
      news.innerHTML =
        '<p style="color:var(--text-light);grid-column:1/-1">No recent news at the moment.</p>'
    } else {
      news.innerHTML = items
        .map((item) => {
          const d = formatEventDate(item.date)
          return `
          <a href="${esc(item.link || '/news')}" class="about-news-mini fade-up">
            <span class="about-news-mini__cat">${esc(categoryLabel(item.category))}</span>
            <h4>${esc(item.title)}</h4>
            <time datetime="${esc(item.date)}">${esc(d.day)} ${esc(d.month)}</time>
          </a>`
        })
        .join('')
    }
  }
}

function bindFacultyTabs(root) {
  const tabs = [...root.querySelectorAll('.dept-tab')]
  const cards = [...root.querySelectorAll('.faculty-card')]
  if (!tabs.length || !cards.length) return () => {}

  const onClick = (e) => {
    const btn = e.target.closest('.dept-tab')
    if (!btn) return
    const dept = btn.getAttribute('data-dept') || 'all'
    tabs.forEach((t) => t.classList.toggle('active', t === btn))
    cards.forEach((card) => {
      const match = dept === 'all' || card.getAttribute('data-dept') === dept
      card.style.display = match ? '' : 'none'
    })
  }
  tabs.forEach((t) => t.addEventListener('click', onClick))
  return () => tabs.forEach((t) => t.removeEventListener('click', onClick))
}

function bindContactForm(root) {
  const form = root.querySelector('#contactForm')
  if (!form) return () => {}

  const statusEl = root.querySelector('#contactFormStatus')
  const messageField = form.querySelector('#message')
  const counterEl = root.querySelector('#messageCounter')

  const updateCounter = () => {
    if (!messageField || !counterEl) return
    counterEl.textContent = `${messageField.value.length} / 1000`
  }
  updateCounter()
  messageField?.addEventListener('input', updateCounter)

  const onSubmit = (event) => {
    event.preventDefault()
    if (form.querySelector('[name="_honey"]')?.value) return

    const name = form.name?.value?.trim() || ''
    const phone = form.phone?.value?.trim() || ''
    const email = form.email?.value?.trim() || ''
    const course = form.course?.value || ''
    const message = form.message?.value?.trim() || ''

    if (name.length < 2 || !phone || !email) {
      if (statusEl) {
        statusEl.hidden = false
        statusEl.className = 'form-status form-status--error'
        statusEl.textContent = 'Please fill name, phone, and email.'
      }
      return
    }

    const text = [
      'Enquiry from website',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      course ? `Course: ${course}` : '',
      message ? `Message: ${message}` : '',
      `Code ${SITE.code}`,
    ]
      .filter(Boolean)
      .join('\n')

    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer')
    if (statusEl) {
      statusEl.hidden = false
      statusEl.className = 'form-status form-status--ok'
      statusEl.textContent = 'Opening WhatsApp so you can send your enquiry…'
    }
  }

  form.addEventListener('submit', onSubmit)
  return () => {
    form.removeEventListener('submit', onSubmit)
    messageField?.removeEventListener('input', updateCounter)
  }
}

/**
 * Renders Netlify HTML page bodies inside the React chrome.
 * Intercepts internal links for client-side routing.
 */
export default function NetlifyHtmlPage({ html }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { notices } = useCms()

  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    fillAboutExtras(root, notices)
    const stopFade = observeFadeUps(root)
    const stopTabs = bindFacultyTabs(root)
    const stopForm = bindContactForm(root)

    const onClick = (e) => {
      const a = e.target.closest('a')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href || /^(https?:|tel:|mailto:|wa\.me)/i.test(href) || href.startsWith('//')) return
      if (href.startsWith('#')) {
        e.preventDefault()
        const id = href.slice(1)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      if (href.startsWith('/')) {
        e.preventDefault()
        navigate(toAppPath(href))
      }
    }
    root.addEventListener('click', onClick)

    return () => {
      root.removeEventListener('click', onClick)
      stopFade()
      stopTabs()
      stopForm()
    }
  }, [html, navigate, notices])

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = decodeURIComponent(location.hash.slice(1))
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [location.pathname, location.hash, html])

  return <div ref={ref} className="netlify-page" dangerouslySetInnerHTML={{ __html: html }} />
}
