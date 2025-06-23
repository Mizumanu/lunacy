// util/dom.js
export function createElement(tag, props = {}, children = []) {
  const el = document.createElement(tag)
  Object.entries(props).forEach(([key, val]) => {
    if (key in el) el[key] = val
    else el.setAttribute(key, val)
  })
  children.forEach((child) => el.append(child))
  return el
}
