<script lang="ts">
  import '../app.css';
  
  let { children } = $props();
</script>

<svelte:boundary>
  {@render children()}
</svelte:boundary>
