import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageRouteLoader() {
  const { pathname, search, hash } = useLocation()
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(true)
    const done = window.setTimeout(() => setActive(false), 650)
    return () => window.clearTimeout(done)
  }, [pathname, search, hash])

  return (
    <div
      className={`page-route-loader${active ? ' is-active' : ''}`}
      aria-hidden={!active}
    >
      <div className="page-route-loader__bar" />
    </div>
  )
}
