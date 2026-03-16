<script>
  import EnrollmentForm from './EnrollmentForm.svelte'
  import AllocationForm from './AllocationForm.svelte'
  import FollowUpForm from './FollowUpForm.svelte'
  import AnalysisForm from './AnalysisForm.svelte'
  import { createArm, createFollowUp } from '../../lib/data.js'

  let { data = $bindable() } = $props()

  function addArm() {
    const newArm = createArm(`Arm ${data.arms.length + 1}`, data.followUpTimePoints)
    data.arms = [...data.arms, newArm]
  }

  function removeArm(index) {
    if (data.arms.length <= 2) return
    data.arms = data.arms.filter((_, i) => i !== index)
  }

  function addTimePoint() {
    data.followUpTimePoints = [...data.followUpTimePoints, '']
    data.arms = data.arms.map(arm => ({
      ...arm,
      followUp: [...arm.followUp, createFollowUp('')]
    }))
  }

  function removeTimePoint(index) {
    if (data.followUpTimePoints.length <= 1) return
    data.followUpTimePoints = data.followUpTimePoints.filter((_, i) => i !== index)
    data.arms = data.arms.map(arm => ({
      ...arm,
      followUp: arm.followUp.filter((_, i) => i !== index)
    }))
  }
</script>

<div class="form-panel">
  <div class="form-scroll">
    <div class="settings">
      <label class="field">
        <span class="label-text">Diagram title</span>
        <input type="text" bind:value={data.title} placeholder="CONSORT Flow Diagram" />
      </label>

      <div class="row">
        <span class="setting-label">Arms: {data.arms.length}</span>
        <button class="btn-sm" onclick={addArm}>+ Add arm</button>
      </div>

      <div class="row">
        <span class="setting-label">Follow-up periods: {data.followUpTimePoints.length}</span>
        <button class="btn-sm" onclick={addTimePoint}>+ Add period</button>
        {#if data.followUpTimePoints.length > 1}
          <button class="btn-sm btn-danger" onclick={() => removeTimePoint(data.followUpTimePoints.length - 1)}>Remove last</button>
        {/if}
      </div>
    </div>

    <EnrollmentForm bind:enrollment={data.enrollment} />

    {#each data.arms as arm, i}
      <div class="arm-section">
        <AllocationForm bind:arm={data.arms[i]} index={i} />
        {#if data.arms.length > 2}
          <button class="btn-sm btn-danger remove-arm" onclick={() => removeArm(i)}>Remove this arm</button>
        {/if}
      </div>
    {/each}

    {#each data.followUpTimePoints as _, t}
      {#each data.arms as arm, i}
        <FollowUpForm bind:arm={data.arms[i]} armIndex={i} timePointIndex={t} />
      {/each}
    {/each}

    {#each data.arms as arm, i}
      <AnalysisForm bind:arm={data.arms[i]} />
    {/each}
  </div>
</div>

<style>
  .form-panel {
    width: 380px;
    min-width: 380px;
    background: var(--color-surface);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .form-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  .settings {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-border);
  }

  .field {
    margin-bottom: 10px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .setting-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
  }

  .btn-sm {
    font-size: 12px;
    padding: 4px 10px;
    background: var(--color-accent);
    color: var(--color-primary);
    border: 1px solid var(--color-border);
    font-weight: 600;
  }

  .btn-sm:hover {
    background: var(--color-primary);
    color: white;
  }

  .btn-danger {
    color: #dc2626;
    background: #fef2f2;
    border-color: #fecaca;
  }

  .btn-danger:hover {
    background: #dc2626;
    color: white;
  }

  .arm-section {
    position: relative;
  }

  .remove-arm {
    margin-bottom: 12px;
  }
</style>
