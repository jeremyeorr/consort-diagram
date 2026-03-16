<script>
  import DiagramSvg from './DiagramSvg.svelte'

  let { data, svgRef = $bindable(null) } = $props()
</script>

<div class="preview-container">
  <div class="preview-scroll">
    <DiagramSvg {data} bind:svgRef />
  </div>
</div>

<style>
  .preview-container {
    flex: 1;
    min-width: 0;
    background: var(--color-bg);
    border-left: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .preview-scroll {
    flex: 1;
    overflow: auto;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
</style>
