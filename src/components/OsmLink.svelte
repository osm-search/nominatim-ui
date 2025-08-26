<script>
import { formatOSMType } from '../lib/helpers.js';

let { osmType, osmId } = $props();

const osmTypeString = $derived(formatOSMType(osmType, false));

const href = $derived(`https://www.openstreetmap.org/${osmTypeString}/${osmId}`);

</script>

{#if osmTypeString}
<a {href}>{osmTypeString} {osmId}</a>
{/if}
