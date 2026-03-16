<script>
  import { createDefaultData } from './lib/data.js'
  import FormPanel from './components/form/FormPanel.svelte'
  import DiagramPreview from './components/diagram/DiagramPreview.svelte'
  import ExportMenu from './components/ExportMenu.svelte'

  let data = $state(createDefaultData())
  let svgRef = $state(null)
</script>

<div class="app">
  <header class="header">
    <h1>CONSORT Flow Diagram Builder</h1>
    <ExportMenu {svgRef} />
  </header>

  <div class="main">
    <FormPanel bind:data />
    <DiagramPreview {data} bind:svgRef />
  </div>
</div>

<style>
  .app {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
  }

  h1 {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-text);
  }

  .main {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
</style>
