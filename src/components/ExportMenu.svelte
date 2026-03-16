<script>
  import { exportSvg, exportPng } from '../lib/export.js'

  let { svgRef } = $props()

  function handleExportSvg() {
    if (svgRef) exportSvg(svgRef)
  }

  function handleExportPng() {
    if (svgRef) exportPng(svgRef)
  }
</script>

<div class="export-menu">
  <button class="export-btn" onclick={handleExportSvg}>
    Export SVG
  </button>
  <button class="export-btn" onclick={handleExportPng}>
    Export PNG
  </button>
</div>

<style>
  .export-menu {
    display: flex;
    gap: 8px;
  }

  .export-btn {
    background: var(--color-primary);
    color: white;
    font-weight: 600;
    font-size: 13px;
    padding: 6px 14px;
  }

  .export-btn:hover {
    background: var(--color-primary-hover);
  }
</style>
