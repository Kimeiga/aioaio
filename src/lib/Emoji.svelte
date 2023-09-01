<script>
	import { createEventDispatcher } from "svelte";
	import { onMount } from "svelte";
	const dispatch = createEventDispatcher();

	onMount(async () => {
		const { createPopup } = await import("@picmo/popup-picker");
		const trigger = document.querySelector("#emojiTrigger");

		const picker = createPopup(
			{},
			{
				referenceElement: trigger,
				triggerElement: trigger,
			}
		);

		trigger.addEventListener("click", () => {
			picker.toggle();
		});
		picker.addEventListener("emoji:select", (selection) => {
			dispatch("change", selection);
		});
	});
</script>
