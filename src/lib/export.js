/**
 * Serializes an SVG element to a standalone SVG string.
 * @param {SVGElement} svgEl
 * @returns {string}
 */
function serializeSvg(svgEl) {
  const clone = svgEl.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  // Add white background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bg.setAttribute('width', '100%')
  bg.setAttribute('height', '100%')
  bg.setAttribute('fill', 'white')
  clone.insertBefore(bg, clone.firstChild)
  return new XMLSerializer().serializeToString(clone)
}

/**
 * Downloads a file from a blob.
 * @param {Blob} blob
 * @param {string} filename
 */
function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Exports the SVG element as an SVG file.
 * @param {SVGElement} svgEl
 * @param {string} filename
 */
export function exportSvg(svgEl, filename = 'consort-diagram.svg') {
  const svgString = serializeSvg(svgEl)
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  download(blob, filename)
}

/**
 * Exports the SVG element as a PNG file.
 * @param {SVGElement} svgEl
 * @param {string} filename
 * @param {number} scale
 */
export function exportPng(svgEl, filename = 'consort-diagram.png', scale = 3) {
  const svgString = serializeSvg(svgEl)
  const viewBox = svgEl.getAttribute('viewBox')
  const [, , w, h] = viewBox ? viewBox.split(' ').map(Number) : [0, 0, 800, 600]

  const canvas = document.createElement('canvas')
  canvas.width = w * scale
  canvas.height = h * scale
  const ctx = canvas.getContext('2d')

  const img = new Image()
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  img.onload = () => {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    URL.revokeObjectURL(url)
    canvas.toBlob(pngBlob => {
      download(pngBlob, filename)
    }, 'image/png')
  }
  img.src = url
}
