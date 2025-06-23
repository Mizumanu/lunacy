// js/ui/events/eventsSidebar.js
export function renderEventsSidebar(events, activeEventId, onSelectEvent) {
  const sidebar = document.createElement('div')
  sidebar.className = 'events-sidebar'
  events.forEach((ev) => {
    const btn = document.createElement('button')
    btn.className = 'event-btn' + (ev.id === activeEventId ? ' active' : '')
    btn.innerHTML = `<i class="fas fa-star"></i> <span>${ev.title}</span>`
    btn.title = ev.title
    btn.onclick = () => onSelectEvent(ev.id)
    sidebar.appendChild(btn)
  })
  return sidebar
}
