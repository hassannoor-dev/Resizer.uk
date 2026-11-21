import { useEffect } from 'react'
import { SITE_URL } from '../data/platformData.js'

function setTag(selector, tag, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(tag)
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
}

// Keeps the tab title, description and canonical link in sync with the current page.
export default function usePageMeta({ title, description, path }) {
  useEffect(() => {
    document.title = title
    setTag('meta[name="description"]', 'meta', { name: 'description', content: description })
    setTag('link[rel="canonical"]', 'link', { rel: 'canonical', href: SITE_URL + path })
  }, [title, description, path])
}
