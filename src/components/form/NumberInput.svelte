<script>
  let { label, value = $bindable(), placeholder = '' } = $props()
</script>

<label class="field">
  <span class="label-text">{label}</span>
  <input
    type="number"
    bind:value
    min="0"
    {placeholder}
  />
</label>

<style>
  .field {
    display: block;
    margin-bottom: 10px;
  }

  .label-text {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-muted);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  input {
    width: 100%;
  }
</style>
