<script>
    let { title } = $props();
</script>

<style>
  td {
    padding: 2px 8px;
    font-size: 0.9em;
  }
</style>

<tr>
  <td>{title}</td>
  <td><slot></slot></td>
</tr>
