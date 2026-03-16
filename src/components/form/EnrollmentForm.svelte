<script>
  import NumberInput from './NumberInput.svelte'

  let { enrollment = $bindable() } = $props()
</script>

<section class="form-section">
  <h3>Enrolment</h3>

  <NumberInput label="Assessed for eligibility" bind:value={enrollment.assessed} />

  <div class="sub-group">
    <h4>Excluded</h4>
    <NumberInput label="Total excluded" bind:value={enrollment.excluded.total} />
    <NumberInput label="Not meeting inclusion criteria" bind:value={enrollment.excluded.notMeetingCriteria} />
    <NumberInput label="Declined to participate" bind:value={enrollment.excluded.declinedToParticipate} />
    <NumberInput label="Other reasons" bind:value={enrollment.excluded.otherReasons} />
    <label class="field">
      <span class="label-text">Other reasons detail</span>
      <textarea bind:value={enrollment.excluded.otherReasonsDetail} placeholder="Specify other reasons..."></textarea>
    </label>
  </div>

  <NumberInput label="Randomised" bind:value={enrollment.randomised} />
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

  h4 {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-muted);
    margin-bottom: 8px;
  }

  .sub-group {
    margin: 8px 0 12px;
    padding-left: 12px;
    border-left: 3px solid var(--color-border);
  }

  .field {
    margin-bottom: 10px;
  }
</style>
