<script>
  import NumberInput from './NumberInput.svelte'

  let { arm = $bindable(), index } = $props()
</script>

<section class="form-section">
  <h3>Allocation — {arm.label}</h3>

  <label class="field">
    <span class="label-text">Group label</span>
    <input type="text" bind:value={arm.label} />
  </label>

  <NumberInput label="Allocated to intervention" bind:value={arm.allocation.allocated} />
  <NumberInput label="Received allocated intervention" bind:value={arm.allocation.received} />
  <NumberInput label="Did not receive allocated intervention" bind:value={arm.allocation.didNotReceive} />

  <label class="field">
    <span class="label-text">Reasons for not receiving</span>
    <textarea bind:value={arm.allocation.didNotReceiveReasons} placeholder="Give reasons..."></textarea>
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
