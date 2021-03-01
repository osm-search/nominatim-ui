<script>
    export let items;
</script>

<style>
  .name{
    font-weight: bold;
  }
</style>

{#each Object.keys(items) as name}
  <div class="line">
    <span class="name">{items[name]}</span> ({name})
  </div>
{/each}
