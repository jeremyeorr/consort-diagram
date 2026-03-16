<script>
  import { computeLayout, BOX_PADDING_X, BOX_PADDING_Y, LINE_HEIGHT, FONT_SIZE } from '../../lib/layout.js'

  let { data, svgRef = $bindable(null) } = $props()

  let layout = $derived(computeLayout(data))
</script>

<svg
  bind:this={svgRef}
  viewBox="0 0 {layout.width} {layout.height}"
  width={layout.width}
  height={layout.height}
  style="max-width: 100%; height: auto;"
>
  <defs>
    <marker
      id="arrowhead"
      viewBox="0 0 10 7"
      refX="10"
      refY="3.5"
      markerWidth="10"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
    </marker>
  </defs>

  <!-- Phase labels -->
  {#each layout.phaseLabels as label}
    {@const cy = (label.y1 + label.y2) / 2}
    <text
      x={label.x}
      y={cy}
      transform="rotate(-90, {label.x}, {cy})"
      text-anchor="middle"
      font-size="13"
      font-weight="700"
      fill="#374151"
      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >{label.text}</text>

    <!-- Phase bracket line -->
    <line
      x1={label.x + 10}
      y1={label.y1}
      x2={label.x + 10}
      y2={label.y2}
      stroke="#d1d5db"
      stroke-width="1.5"
    />
  {/each}

  <!-- Arrows -->
  {#each layout.arrows as arrow}
    <line
      x1={arrow.x1}
      y1={arrow.y1}
      x2={arrow.x2}
      y2={arrow.y2}
      stroke="#374151"
      stroke-width="1.5"
      marker-end={arrow.noArrow ? '' : 'url(#arrowhead)'}
    />
  {/each}

  <!-- Boxes -->
  {#each layout.boxes as box}
    <rect
      x={box.x}
      y={box.y}
      width={box.width}
      height={box.height}
      rx="4"
      ry="4"
      fill="white"
      stroke="#374151"
      stroke-width="1.5"
    />
    {#each box.lines as line, j}
      <text
        x={box.x + BOX_PADDING_X + (line.indent ? 10 : 0)}
        y={box.y + BOX_PADDING_Y + (j + 1) * LINE_HEIGHT - 3}
        font-size={FONT_SIZE}
        font-weight={line.bold ? '700' : '400'}
        fill="#1f2937"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >{line.text}</text>
    {/each}
  {/each}
</svg>
