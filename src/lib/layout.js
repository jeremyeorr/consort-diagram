import { formatN } from './data.js'

const BOX_WIDTH = 240
const BOX_MIN_HEIGHT = 50
const LINE_HEIGHT = 16
const BOX_PADDING_X = 14
const BOX_PADDING_Y = 10
const PHASE_GAP = 30
const ARM_GAP = 50
const SIDE_BOX_GAP = 40
const PHASE_LABEL_WIDTH = 30
const MARGIN = 40
const FONT_SIZE = 11
const CHARS_PER_LINE = Math.floor((BOX_WIDTH - BOX_PADDING_X * 2) / (FONT_SIZE * 0.58))

/**
 * Wraps text to fit within a box.
 * @param {string} text
 * @returns {string[]}
 */
function wrapText(text) {
  if (!text) return []
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    if (current && (current.length + 1 + word.length) > CHARS_PER_LINE) {
      lines.push(current)
      current = word
    } else {
      current = current ? current + ' ' + word : word
    }
  }
  if (current) lines.push(current)
  return lines
}

/**
 * Computes the height of a box given its lines of text.
 * @param {string[]} lines
 */
function boxHeight(lines) {
  return Math.max(BOX_MIN_HEIGHT, lines.length * LINE_HEIGHT + BOX_PADDING_Y * 2)
}

/**
 * Builds the lines of text for a box.
 * @param {Array<{text: string, bold?: boolean, indent?: boolean}>} items
 * @returns {{lines: Array<{text: string, bold?: boolean, indent?: boolean}>, height: number}}
 */
function buildBox(items) {
  const lines = []
  for (const item of items) {
    const wrapped = wrapText(item.text)
    for (let i = 0; i < wrapped.length; i++) {
      lines.push({
        text: wrapped[i],
        bold: item.bold && i === 0,
        indent: item.indent
      })
    }
  }
  return { lines, height: boxHeight(lines) }
}

/**
 * Computes the full layout for a CONSORT diagram.
 * Returns { boxes, arrows, phaseLabels, width, height }
 */
export function computeLayout(data) {
  const boxes = []
  const arrows = []
  const phaseLabels = []
  const armCount = data.arms.length

  // X positions for arms
  const totalArmsWidth = armCount * BOX_WIDTH + (armCount - 1) * ARM_GAP
  const startX = MARGIN + PHASE_LABEL_WIDTH + SIDE_BOX_GAP
  const centerX = startX + totalArmsWidth / 2
  const armXs = []
  for (let i = 0; i < armCount; i++) {
    armXs.push(startX + i * (BOX_WIDTH + ARM_GAP))
  }

  let y = MARGIN

  // ── ENROLLMENT ──
  const enrollmentStartY = y

  // Assessed for eligibility (centered)
  const assessedBox = buildBox([
    { text: `Assessed for eligibility (${formatN(data.enrollment.assessed)})`, bold: true }
  ])
  const assessedX = centerX - BOX_WIDTH / 2
  boxes.push({
    id: 'assessed',
    x: assessedX,
    y,
    width: BOX_WIDTH,
    height: assessedBox.height,
    lines: assessedBox.lines
  })

  // Excluded box (to the right)
  const excl = data.enrollment.excluded
  const excludedItems = [
    { text: `Excluded (${formatN(excl.total)})`, bold: true },
    { text: `Not meeting inclusion criteria (${formatN(excl.notMeetingCriteria)})`, indent: true },
    { text: `Declined to participate (${formatN(excl.declinedToParticipate)})`, indent: true },
    { text: `Other reasons (${formatN(excl.otherReasons)})`, indent: true }
  ]
  if (excl.otherReasonsDetail) {
    excludedItems.push({ text: excl.otherReasonsDetail, indent: true })
  }
  const excludedBox = buildBox(excludedItems)
  const excludedX = assessedX + BOX_WIDTH + SIDE_BOX_GAP
  const excludedY = y
  boxes.push({
    id: 'excluded',
    x: excludedX,
    y: excludedY,
    width: BOX_WIDTH,
    height: excludedBox.height,
    lines: excludedBox.lines
  })

  // Arrow: assessed -> excluded (horizontal)
  arrows.push({
    x1: assessedX + BOX_WIDTH,
    y1: y + assessedBox.height / 2,
    x2: excludedX,
    y2: excludedY + excludedBox.height / 2,
    type: 'horizontal'
  })

  y += Math.max(assessedBox.height, excludedBox.height) + PHASE_GAP

  // Randomised (centered)
  const randomisedBox = buildBox([
    { text: `Randomised (${formatN(data.enrollment.randomised)})`, bold: true }
  ])
  boxes.push({
    id: 'randomised',
    x: centerX - BOX_WIDTH / 2,
    y,
    width: BOX_WIDTH,
    height: randomisedBox.height,
    lines: randomisedBox.lines
  })

  // Arrow: assessed -> randomised
  arrows.push({
    x1: centerX,
    y1: y - PHASE_GAP,
    x2: centerX,
    y2: y,
    type: 'vertical'
  })

  const enrollmentEndY = y + randomisedBox.height
  y += randomisedBox.height + PHASE_GAP

  // Phase label: Enrolment
  phaseLabels.push({
    text: 'Enrolment',
    x: MARGIN,
    y1: enrollmentStartY,
    y2: enrollmentEndY
  })

  // ── ALLOCATION ──
  const allocationStartY = y

  // Arrows from randomised to each arm
  const randomisedCenterY = allocationStartY - PHASE_GAP
  const splitY = allocationStartY - PHASE_GAP / 2

  // Draw branching arrows from randomised
  for (let i = 0; i < armCount; i++) {
    const armCenterX = armXs[i] + BOX_WIDTH / 2
    // Vertical from randomised to split level
    if (armCount > 1) {
      arrows.push({
        x1: centerX,
        y1: randomisedCenterY,
        x2: centerX,
        y2: splitY,
        type: 'vertical',
        noArrow: true
      })
      // Horizontal at split level
      arrows.push({
        x1: centerX,
        y1: splitY,
        x2: armCenterX,
        y2: splitY,
        type: 'horizontal',
        noArrow: true
      })
      // Vertical down to allocation box
      arrows.push({
        x1: armCenterX,
        y1: splitY,
        x2: armCenterX,
        y2: allocationStartY,
        type: 'vertical'
      })
    }
  }

  let allocationMaxBottom = allocationStartY
  const allocationBoxes = []

  for (let i = 0; i < armCount; i++) {
    const arm = data.arms[i]
    const alloc = arm.allocation
    const items = [
      { text: `Allocated to ${arm.label.toLowerCase()} (${formatN(alloc.allocated)})`, bold: true },
      { text: `Received allocated intervention (${formatN(alloc.received)})` },
      { text: `Did not receive allocated intervention (${formatN(alloc.didNotReceive)})` }
    ]
    if (alloc.didNotReceiveReasons) {
      items.push({ text: alloc.didNotReceiveReasons, indent: true })
    }
    const box = buildBox(items)
    boxes.push({
      id: `allocation-${i}`,
      x: armXs[i],
      y: allocationStartY,
      width: BOX_WIDTH,
      height: box.height,
      lines: box.lines
    })
    allocationBoxes.push({ height: box.height })
    allocationMaxBottom = Math.max(allocationMaxBottom, allocationStartY + box.height)
  }

  const allocationEndY = allocationMaxBottom
  y = allocationMaxBottom + PHASE_GAP

  phaseLabels.push({
    text: 'Allocation',
    x: MARGIN,
    y1: allocationStartY,
    y2: allocationEndY
  })

  // ── FOLLOW-UP ──
  const followUpStartY = y
  const timePoints = data.followUpTimePoints || ['']

  for (let t = 0; t < timePoints.length; t++) {
    let followUpMaxBottom = y

    for (let i = 0; i < armCount; i++) {
      const arm = data.arms[i]
      const fu = arm.followUp[t] || {}
      const items = [
        { text: `Discontinued intervention (${formatN(fu.discontinuedIntervention)})` },
      ]
      if (fu.discontinuedReasons) {
        items.push({ text: fu.discontinuedReasons, indent: true })
      }
      items.push(
        { text: `Lost to follow-up (${formatN(fu.lostToFollowUp)})` }
      )
      if (fu.lostToFollowUpReasons) {
        items.push({ text: fu.lostToFollowUpReasons, indent: true })
      }

      const box = buildBox(items)
      const armCenterX = armXs[i] + BOX_WIDTH / 2

      // Arrow from allocation/previous follow-up to this box
      arrows.push({
        x1: armCenterX,
        y1: y - PHASE_GAP + (t === 0 ? 0 : 0),
        x2: armCenterX,
        y2: y,
        type: 'vertical'
      })

      boxes.push({
        id: `followup-${t}-${i}`,
        x: armXs[i],
        y,
        width: BOX_WIDTH,
        height: box.height,
        lines: box.lines
      })
      followUpMaxBottom = Math.max(followUpMaxBottom, y + box.height)
    }

    y = followUpMaxBottom + PHASE_GAP
  }

  const followUpEndY = y - PHASE_GAP

  phaseLabels.push({
    text: 'Follow-Up',
    x: MARGIN,
    y1: followUpStartY,
    y2: followUpEndY
  })

  // ── ANALYSIS ──
  const analysisStartY = y

  let analysisMaxBottom = y

  for (let i = 0; i < armCount; i++) {
    const arm = data.arms[i]
    const items = [
      { text: `Analysed (${formatN(arm.analysis.analysed)})`, bold: true },
      { text: `Excluded from analysis (${formatN(arm.analysis.excludedFromAnalysis)})` }
    ]
    if (arm.analysis.excludedReasons) {
      items.push({ text: arm.analysis.excludedReasons, indent: true })
    }

    const box = buildBox(items)
    const armCenterX = armXs[i] + BOX_WIDTH / 2

    // Arrow from last follow-up to analysis
    arrows.push({
      x1: armCenterX,
      y1: y - PHASE_GAP,
      x2: armCenterX,
      y2: y,
      type: 'vertical'
    })

    boxes.push({
      id: `analysis-${i}`,
      x: armXs[i],
      y,
      width: BOX_WIDTH,
      height: box.height,
      lines: box.lines
    })
    analysisMaxBottom = Math.max(analysisMaxBottom, y + box.height)
  }

  phaseLabels.push({
    text: 'Analysis',
    x: MARGIN,
    y1: analysisStartY,
    y2: analysisMaxBottom
  })

  // Compute total dimensions
  const rightEdge = excludedX + BOX_WIDTH + MARGIN
  const totalWidth = Math.max(rightEdge, startX + totalArmsWidth + MARGIN)
  const totalHeight = analysisMaxBottom + MARGIN

  return { boxes, arrows, phaseLabels, width: totalWidth, height: totalHeight }
}

export { BOX_PADDING_X, BOX_PADDING_Y, LINE_HEIGHT, FONT_SIZE }
