<script>
  import NumberInput from './NumberInput.svelte'

  let { arm = $bindable(), armIndex, timePointIndex } = $props()

  let fu = $derived(arm.followUp[timePointIndex])
</script>

<section class="form-section">
  <h3>Follow-Up — {arm.label}</h3>

  <NumberInput label="Discontinued intervention" bind:value={arm.followUp[timePointIndex].discontinuedIntervention} />

  <label class="field">
    <span class="label-text">Reasons for discontinuing</span>
    <textarea bind:value={arm.followUp[timePointIndex].discontinuedReasons} placeholder="Give reasons..."></textarea>
  </label>

  <NumberInput label="Lost to follow-up" bind:value={arm.followUp[timePointIndex].lostToFollowUp} />

  <label class="field">
    <span class="label-text">Reasons for loss to follow-up</span>
    <textarea bind:value={arm.followUp[timePointIndex].lostToFollowUpReasons} placeholder="Give reasons..."></textarea>
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
