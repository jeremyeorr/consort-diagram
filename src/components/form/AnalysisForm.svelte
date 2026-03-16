<script>
  import NumberInput from './NumberInput.svelte'

  let { arm = $bindable() } = $props()
</script>

<section class="form-section">
  <h3>Analysis — {arm.label}</h3>

  <NumberInput label="Analysed for primary outcome" bind:value={arm.analysis.analysed} />
  <NumberInput label="Excluded from analysis" bind:value={arm.analysis.excludedFromAnalysis} />

  <label class="field">
    <span class="label-text">Reasons for exclusion</span>
    <textarea bind:value={arm.analysis.excludedReasons} placeholder="Give reasons..."></textarea>
  </label>
</section>

<style>
  .form-section {
    margin-bottom: 20px;
  }

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 2px solid var(--color-primary);
  }

  .field {
    margin-bottom: 10px;
  }
</style>
