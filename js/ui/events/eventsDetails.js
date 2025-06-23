// js/ui/events/eventsDetails.js

// ---- Render Section Detail (tasks/rewards/info for section) ----
export function renderSectionDetail(event, section) {
  const box = document.createElement('div')
  box.className = 'event-section-detail'
  box.innerHTML = `
    <h3>${section.label}</h3>
    ${
      section.tasks && section.tasks.length
        ? section.tasks
            .map(
              (t) => `
      <div class="event-task">
        <strong>${t.title || ''}</strong>
        <div class="event-task-desc">${t.description || ''}</div>
        ${
          t.reward || t.rewards
            ? `<div class="event-task-reward">Reward: ${
                t.reward
                  ? Object.entries(t.reward)
                      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                      .join(', ')
                  : (t.rewards || [])
                      .map((r, i) =>
                        Object.entries(r)
                          .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                          .join(', '),
                      )
                      .join(' | ')
              }</div>`
            : ''
        }
      </div>
    `,
            )
            .join('')
        : "<div class='event-task-desc'>No tasks for this section.</div>"
    }
  `
  return box
}
