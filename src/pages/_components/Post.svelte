<script>
	import ProfilePicture from "./ProfilePicture.svelte";
	export let post;
	import SvelteMarkdown from "svelte-markdown";

	function timeSince(date) {
		var seconds = Math.floor((new Date() - date) / 1000);

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
</script>

<!-- {#if post} -->
<div style="padding: 1rem 1rem 0;">
	<div style="display: flex; ">
		<!-- <ProfilePicture name={post?.username} /> -->
		<div style="margin-left: 10px;">
			<div style="display: flex; gap: 2px;">
				<b>{post?.username} </b>
				<div style="width: 18px; height: 18px; display: inline-block;">
					<svg
						viewBox="0 0 24 24"
						aria-label="Verified account"
						role="img"
						class="r-13v1u17 r-4qtqp9 r-yyyyoo r-1xvli5t r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr"
						><g
							><path
								d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"
							/></g
						></svg
					>
				</div>
				<span>
					@{post?.username.toLowerCase().replace(/\s/g, "")}
				</span>
				<span> · {timeSince(new Date(post?.createdAt))}</span>
			</div>

			<!-- <br /> -->
			<!-- {#each [post.text] as text} -->
			<!-- <div style="padding: 0.5rem 0;">
                {post.text}
              </div> -->
			<div class="postBody">
				<SvelteMarkdown source={post?.text} options={{ sanitize: true }} />
			</div>
			<!-- {/each} -->
		</div>
	</div>
</div>
<!-- {:else}
	<div>Post not found</div>
	{post}
{/if} -->
