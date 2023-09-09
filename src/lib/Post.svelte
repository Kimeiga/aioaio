<script>
	import ProfilePictureEmoji from "./ProfilePictureEmoji.svelte";
	export let post;
	import SvelteMarkdown from "svelte-markdown";

	function timeSince(date) {
		var seconds = Math.floor((new Date().valueOf() - date) / 1000);

		var interval = seconds / 31536000;

		if (interval > 1) {
			return Math.floor(interval) + " years";
		}
		interval = seconds / 2592000;
		if (interval > 1) {
			return Math.floor(interval) + " months";
		}
		interval = seconds / 86400;
		if (interval > 1) {
			return Math.floor(interval) + "d";
		}
		interval = seconds / 3600;
		if (interval > 1) {
			return Math.floor(interval) + "h";
		}
		interval = seconds / 60;
		if (interval > 1) {
			return Math.floor(interval) + "m";
		}
		return Math.floor(seconds) + "s";
	}

	import { onMount } from "svelte";
	import { marked } from "marked";
	import DOMPurify from "dompurify";
	import { color } from "../store";

	let html2;

	onMount(() => {
		const renderer = new marked.Renderer();
		const linkRenderer = renderer.link;
		const imageRenderer = renderer.image;

		function cleanVideoID(separator, id) {
			let index = id.indexOf(separator) + separator.length;
			if (index > id.length) return "";
			if (id.length - index < 11) return "";
			let videoID = id.substring(index, index + 11);
			if (videoID.match(/^[a-zA-Z0-9_-]{11}$/) === null) return "";
			return videoID.replace(/[^a-zA-Z0-9_-]/g, "");
		}

		renderer.link = (href, title, text) => {
			let html = linkRenderer.call(renderer, href, title, text);
			if (href.includes("youtube.com/watch?v=")) {
				const videoId = cleanVideoID("v=", href);
				html =
					`<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" loading="lazy" ` +
					`title="YouTube video player" frameborder="0" ` +
					`allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
			}
			if (href.includes("youtube.com/embed/")) {
				const videoId = cleanVideoID("embed/", href);
				html =
					`<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" loading="lazy" ` +
					`title="YouTube video player" frameborder="0" ` +
					`allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
			} else if (/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(href)) {
				html = `<img src="${href}" alt="" style="max-width:100%; height:auto;">`;
			}
			return html;
		};

		renderer.image = (href, title, text) => {
			return `<img src="${href}" alt="${text}" style="max-width:100%; height:auto;">`;
		};

		marked.use({ renderer });
		html2 = marked.parse(
			DOMPurify.sanitize(post.text, { FORBID_TAGS: ["style"] })
		);

		// console.log(html);
	});
</script>

<!-- {#if post} -->
<div style="padding: 0.5rem 0.5rem 0;">
	<div style="display: flex; ">
		<ProfilePictureEmoji
			name={post?.username}
			emoji={post?.emoji}
			color={post?.color}
		/>
		<div style="margin-left: 10px;">
			<div style="display: flex; gap: 2px;">
				<b>{post?.username} </b>
				<div style="width: 18px; height: 18px; display: inline-block;">
					<svg
						viewBox="0 0 24 24"
						aria-label="Verified account"
						role="img"
						class="r-13v1u17 r-4qtqp9 r-yyyyoo r-1xvli5t r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr"
						style="fill: white;"
						><g
							><path
								d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"
							/></g
						></svg
					>
				</div>
				<span> · {timeSince(new Date(post?.createdAt))}</span>
			</div>

			<!-- <br /> -->
			<!-- {#each [post.text] as text} -->
			<!-- <div style="padding: 0.5rem 0;">
                {post.text}
              </div> -->
			<div class="postBody">
				<!-- <iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/YOPY0ZpLdBw"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				/> -->
				<!-- <SvelteMarkdown source={post?.text} options={{ sanitize: true }} /> -->
				<div class="postBodyContent">{@html html2}</div>
			</div>
			<!-- {/each} -->
		</div>
	</div>
</div>

<!-- {:else}
	<div>Post not found</div>
	{post}
{/if} -->

<style>
	/* last item of postBodyContent should have no margin-bottom */
	.postBodyContent > *:last-child {
		margin-bottom: 0;
	}

	.postBodyContent > *:first-child {
		margin-top: 0;
	}
</style>
