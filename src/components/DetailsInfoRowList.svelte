<script>
    const { items } = $props();
</script>

<style>
  .name {
    font-weight: bold;
    overflow-wrap: anywhere;
  }
</style>

{#each Object.keys(items) as name}
  <div class="line">
    <span class="name">{items[name]}</span> ({name})
  </div>
{/each}
