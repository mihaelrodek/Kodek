/*! Kodek badge | https://kodek.hr */
/**
 * <kodek-badge> — "Izrada: Kodek" credit for sites built by Kodek.
 *
 * Self-contained: no dependencies, no network requests, no fonts. The logo is
 * inlined with the wordmark converted to outlines, and styles live in a shadow
 * root so the host page's CSS cannot restyle the logo (and vice versa).
 *
 * Attributes:
 *   mode   sticky (default) | static | inline
 *   theme  auto (default, follows prefers-color-scheme) | light | dark
 *   align  center (default) | left | right
 *   lang   hr | en — falls back to the nearest [lang] ancestor, then hr
 *   label  custom text in front of the logo; label="" hides the text
 *   href   link target, defaults to https://kodek.hr
 */
;(() => {
  if (typeof window === 'undefined' || !('customElements' in window)) return
  if (customElements.get('kodek-badge')) return

  const LABELS = { hr: 'Izrada', en: 'Built by' }
  const DEFAULT_HREF = 'https://kodek.hr'

  const LOGO =
    '<svg class="logo" viewBox="0 0 375 95" aria-hidden="true" focusable="false">' +
    '<g transform="scale(0.775)">' +
    '<rect width="120" height="120" fill="#15318f"/>' +
    '<path d="M13.75 14H31.15V106H13.75Z" fill="#ffffff"/>' +
    '<path d="M38.75 60 82.25 14h15.3v9.2L62.75 60l43.5 46h-24Z" fill="#ffffff"/>' +
    '<path d="M39.55 14h31.2l-9.5 10h-21.7Z" fill="#4264e3"/>' +
    '</g>' +
    '<path class="word" d="M107.8 73.02V45.18L117.69 35.19H145.14L155.03 45.18V73.02L145.14 83H117.69ZM139 72.44 142.36 69.08V49.11L139 45.75H123.83L120.47 49.11V69.08L123.83 72.44ZM164.63 73.02V45.18L174.52 35.19H193.53L199.19 40.09V14.46H211.86V83H199.96V75.61L192.57 83H174.52ZM191.42 72.25 199.19 64.28V51.8L192.66 45.94H180.95L177.3 49.69V68.5L180.95 72.25ZM222.42 73.21V45.18L232.31 35.19H259.29L269.27 45.18V63.32H235.1V69.46L238.17 72.63H253.82L256.7 69.66V67.16H269.18V73.4L259.67 83H232.12ZM256.6 54.49V48.92L253.34 45.56H238.36L235.1 48.92V54.49ZM279.35 14.46H292.02V52.76H300.38L312.57 35.19H326.58L310.65 58.23L327.54 83H313.53L300.09 63.51H292.02V83H279.35Z"/>' +
    '<path class="underscore" d="M328.02 83.96H374.3V94.71H328.02Z"/>' +
    '</svg>'

  const DARK =
    '--kb-bg:#201e1d;--kb-fg:#f3f2f2;--kb-accent:#4264e3;--kb-border:rgba(243,242,242,.14)'

  const CSS = `
:host{--kb-bg:#f3f2f2;--kb-fg:#201e1d;--kb-accent:#15318f;--kb-border:rgba(32,30,29,.12);display:block;position:sticky;bottom:0;z-index:var(--kodek-badge-z,40)}
:host([hidden]){display:none}
@media (prefers-color-scheme:dark){:host(:not([theme=light])){${DARK}}}
:host([theme=dark]){${DARK}}
:host([mode=static]),:host([mode=inline]){position:static}
:host([mode=inline]){display:inline-block;vertical-align:middle}
.bar{display:flex;justify-content:center;box-sizing:border-box;padding:4px 16px calc(4px + env(safe-area-inset-bottom,0px));background:var(--kb-bg);border-top:1px solid var(--kb-border)}
:host([align=left]) .bar{justify-content:flex-start}
:host([align=right]) .bar{justify-content:flex-end}
:host([mode=inline]) .bar{padding:0;background:none;border:0}
a{display:inline-flex;align-items:center;gap:10px;min-height:36px;padding:0 6px;color:var(--kb-fg);font:500 13px/1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;letter-spacing:.01em;text-decoration:none;white-space:nowrap}
a:focus-visible{outline:2px solid var(--kb-accent);outline-offset:2px}
.label{opacity:.72}
a:hover .label{opacity:1}
.logo{display:block;height:24px;width:auto;flex:none}
.word{fill:var(--kb-fg)}
.underscore{fill:var(--kb-accent)}
`

  // Constructable stylesheets are exempt from the host page's style-src CSP;
  // fall back to a <style> element where they are unavailable.
  let sheet = null
  try {
    sheet = new CSSStyleSheet()
    sheet.replaceSync(CSS)
  } catch {
    sheet = null
  }

  class KodekBadge extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'lang', 'href']
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        const root = this.attachShadow({ mode: 'open' })
        if (sheet && 'adoptedStyleSheets' in root) {
          root.adoptedStyleSheets = [sheet]
        } else {
          const style = document.createElement('style')
          style.textContent = CSS
          root.appendChild(style)
        }
        const bar = document.createElement('div')
        bar.className = 'bar'
        bar.innerHTML =
          '<a target="_blank" rel="noopener"><span class="label"></span>' + LOGO + '</a>'
        root.appendChild(bar)
      }
      this.update()
    }

    attributeChangedCallback() {
      if (this.shadowRoot) this.update()
    }

    update() {
      const link = this.shadowRoot.querySelector('a')
      const label = this.shadowRoot.querySelector('.label')
      const scope = this.closest('[lang]')
      const lang = ((scope && scope.getAttribute('lang')) || 'hr').toLowerCase().slice(0, 2)
      const text = this.hasAttribute('label')
        ? this.getAttribute('label').trim()
        : (LABELS[lang] || LABELS.en) + ':'

      label.textContent = text
      label.hidden = text === ''
      link.href = this.getAttribute('href') || DEFAULT_HREF
      link.setAttribute('aria-label', (text ? text + ' ' : '') + 'Kodek')
    }
  }

  customElements.define('kodek-badge', KodekBadge)
})()
