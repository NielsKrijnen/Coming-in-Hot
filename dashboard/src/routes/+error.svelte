<script lang="ts">
  import { page } from "$app/state"
</script>

<div class="flex flex-col gap-4 items-center justify-center h-full">
  <h1 class="text-8xl font-medium">{page.status}</h1>
  <span>{page.error?.message}</span>
</div>
