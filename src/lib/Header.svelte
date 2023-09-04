<script>
	import { onMount } from "svelte";
	import EmojiPicker from "./Emoji.svelte";
	let message;
	function onEmoji(event) {
		// change the emoji to the new one selected
		$emoji = event.detail.emoji;
		console.log(event);
	}
	// to discourage players from changing their name during the game
	// and causing bugs LMAO
	export let showChangeButton = true;

	import { username, emoji, color } from "../store";

	const changeName = () => {
		let string = prompt("Enter your name:") ?? $username;
		string = string.trim();
		if (string) {
			$username = string.substring(0, 25); // limit to 25 characters
		}
	};

	let shouldShowChangeProfileDialog = false;
	const showChangeProfileDialog = () => {
		shouldShowChangeProfileDialog = true;
	};

	import { createPopup } from "@picmo/popup-picker";
	import ProfilePictureEmoji from "./ProfilePictureEmoji.svelte";

	// The picker must have a root element to insert itself into
	$: rootElement = document.querySelector("#pickerContainer");

	import pickTextColorBasedOnBgColorAdvanced from "./colorLightOrDark";
</script>

<header>
	<a href="/"><h1>⊛aioaio</h1></a>
	{#if !$username}
		<div class="right-side">
			<button on:click={changeName}>Who are you? 🤷</button>
		</div>
	{:else}
		<div class="right-side">
			{#if showChangeButton}
				<!-- <button on:click={changeName}>Change</button> -->
			{/if}
			<button
				on:click={showChangeProfileDialog}
				style={`background: cyan; color: ${pickTextColorBasedOnBgColorAdvanced(
					"#00FFFF",
					"#FFFFFF",
					"#000000"
				)}`}
				><ProfilePictureEmoji
					name={$username}
					emoji={$emoji}
					color={$color}
					inline={true}
				/><span>{$username} </span></button
			>
		</div>
	{/if}
</header>

{#if shouldShowChangeProfileDialog}
	<dialog open>
		<h1>Change Profile</h1>
		<!-- show ui for changing name, color, emoji,  -->
		<label for="name">Username</label>
		<input id="name" bind:value={$username} type="text" maxlength="20" />
		<br />
		<label for="emoji">Emoji</label>
		<EmojiPicker on:change={onEmoji} />
		<button id="emojiTrigger">{$emoji}</button>

		<br />
		<label for="color">Color</label>
		<input id="color" type="color" bind:value={$color} />
		<br />

		<span style="float: left;">Preview</span>
		<ProfilePictureEmoji name={$username} emoji={$emoji} color={$color} />
		<button on:click={() => (shouldShowChangeProfileDialog = false)}>
			Close
		</button>
	</dialog>
{/if}

<style>
	a {
		text-decoration: none;
	}
	header {
		position: sticky;
		top: 0;
		width: 100%;
		border-bottom: 1px solid grey;

		background-color: black;
		display: flex;
		align-items: center;
	}

	header h1 {
		margin: 0;
	}

	header h2 {
		margin: 0;
	}

	header .right-side {
		margin: 0;
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-right: 1rem;
	}
</style>
