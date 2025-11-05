<script lang="ts">
  let { children } = $props()
</script>

<svelte:boundary>
  {@render children()}
</svelte:boundary>
