<script>
  import Header from "./_components/Header.svelte";
  import ProfilePicture from "./_components/ProfilePicture.svelte";
  import { username } from "../store.js";
  import { metatags } from "@roxi/routify";
  // metatags.title = "aioaio";
  // metatags.description = "aioaio";
  import SvelteMarkdown from "svelte-markdown";
  import Post from "./_components/Post.svelte";
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";

  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";

  let postText;
  // let username;
  // let loggedIn = false;

  function post(postsRef) {
    if (!$username) {
      return;
    }
    if (!postText.trim()) {
      let postText;
      return; // no posting whitespace
    }
    postsRef.add({
      username: $username,
      text: postText,
      createdAt: Date.now(),
    });
    postText = "";
  }

  function comment(commentsRef, postID) {
    if (!$username) {
      return;
    }
    let commentText = document.getElementById(postID).value;
    if (!commentText.trim()) {
      document.getElementById(postID).value = "";
      return; // no posting whitespace
    }
    commentsRef.add({
      username: $username,
      text: commentText,
      createdAt: Date.now(),
    });
    document.getElementById(postID).value = "";
  }
</script>

<main>
  <!-- 1. 🔥 Firebase App -->
  <FirebaseApp {firebase}>
    <Header />

    <Collection
      path={"posts/"}
      query={(ref) => ref.orderBy("createdAt", "desc")}
      let:data={posts}
      let:ref={postsRef}
      log
    >
      <textarea
        name="post"
        id="post"
        cols="30"
        rows="5"
        bind:value={postText}
      />
      <button on:click={post(postsRef)}> Post </button>
      <hr />

      {#each posts as post}
        <Post {post} />

        <div style="padding: 0 1rem;">
          <Collection
            path={`posts/${post.id}/comments`}
            query={(ref) => ref.orderBy("createdAt")}
            let:data={comments}
            let:ref={commentsRef}
            log
          >
            {#if comments !== undefined}
              {#each comments as comment (comment.id)}
                <Post {comment} />
              {/each}
            {:else}
              <p>Loading comments...</p>
            {/if}
            {#if comments}
              <script>
                console.log(comments);
              </script>
              {#each comments as comment (comment.id)}
                <b>{comment.username}</b>
                {comment.id}
                <!-- <SvelteMarkdown
                source={comment.text}
                options={{ sanitize: true }}
              /> -->
                <!-- {#if comment} -->
                <!-- {#if comment.name} -->
                <!-- <Post {comment} /> -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <!-- {/if} -->
                <script>
                  console.log(comment);
                </script>
              {/each}
            {/if}
            <span slot="loading">Loading comments...</span>
            <hr />

            <div style="display: flex;">
              <b>{$username}</b>
              <input
                type="text"
                id={post.id}
                style="flex: 1; margin: 0 1rem;"
                on:keydown={(e) => {
                  if (e.key === "Enter") {
                    comment(commentsRef, post.id);
                  }
                }}
              />
              <button on:click={comment(commentsRef, post.id)}>Comment</button>
            </div>
          </Collection>
        </div>
        <hr />
      {/each}
      <span slot="loading">Loading posts...</span>
    </Collection>
  </FirebaseApp>
</main>

<style>
  main {
    /* text-align: center; */
    max-width: 1000px;
    margin: auto;
    border: 1px solid black;
  }

  div.postBody p:first-child {
    margin-top: 0;
  }
  div.postBody p:last-child {
    margin-bottom: 0;
  }

  .postBody p {
    margin: 0;
  }
</style>
