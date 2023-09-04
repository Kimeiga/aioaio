<script>
  import ProfilePicture from "./lib/ProfilePicture.svelte";
  import { username, emoji, color } from "./store.js";
  import Header from "./lib/Header.svelte";
  import EmojiPicker from "./lib/Emoji.svelte";

  // metatags.title = "aioaio";
  // metatags.description = "aioaio";
  import SvelteMarkdown from "svelte-markdown";
  import Post from "./lib/Post.svelte";
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import { auth, firestore } from "./lib/firebase.js";

  import { collection, query, addDoc, orderBy } from "firebase/firestore";

  // let username = "hi";

  let postText;
  // let username;
  // let loggedIn = false;

  async function post(postsRef) {
    if (!$username || !$emoji) {
      return;
    }
    if (!postText.trim()) {
      // let postText;
      return; // no posting whitespace
    }

    // Add a new document with a generated id.
    const docRef = await addDoc(collection(firestore, "posts"), {
      username: $username,
      emoji: $emoji,
      color: $color,
      text: postText,
      createdAt: Date.now(),
    });

    console.log("Document written with ID: ", docRef.id);
    postText = "";
  }

  async function comment(commentsRef, postID) {
    if (!$username || !$emoji) {
      return;
    }
    let commentText = document.getElementById(postID).value;
    if (!commentText.trim()) {
      document.getElementById(postID).value = "";
      return; // no posting whitespace
    }
    // commentsRef.add({
    //   username: $username,
    //   text: commentText,
    //   createdAt: Date.now(),
    // });

    const docRef = await addDoc(
      collection(firestore, `posts/${postID}/comments`),
      {
        username: $username,
        emoji: $emoji,
        color: $color,
        text: commentText,
        createdAt: Date.now(),
      }
    );

    console.log("Document written with ID: ", docRef.id);
    document.getElementById(postID).value = "";
  }

  const postsQuery = query(
    collection(firestore, "posts"),
    orderBy("createdAt", "desc")
  );

  $: buildCommentsQuery = (id) => {
    return query(
      collection(firestore, `posts/${id}/comments`),
      orderBy("createdAt", "asc")
    );
  };

  const onEmoji = (event) => {
    // change the emoji to the new one selected
    let emoji = event.detail.emoji;
    console.log(event);
    console.log(emoji);
    postText = (postText ?? "") + emoji;
  };
</script>

<main>
  <FirebaseApp {auth} {firestore}>
    <Header />

    <Collection ref={postsQuery} let:data={posts} let:ref={postsRef}>
      <small>5000 character limit</small>
      <div id="post-box">
        <textarea
          name="post"
          id="post"
          cols="30"
          rows="5"
          placeholder="What's on your mind?"
          bind:value={postText}
          maxlength="5000"
        />
        <div style="display: flex; width: 100%;">
          <EmojiPicker on:change={onEmoji} />
          <button id="emojiTrigger">😀</button>

          <button on:click={() => post(postsRef)} style="flex: 1;">
            Post
          </button>
        </div>
      </div>
      <hr />

      {#each posts as post (post.id)}
        <Post {post} />

        <div style="padding: 0 1rem;">
          <Collection
            ref={buildCommentsQuery(post.id)}
            let:data={comments}
            let:ref={commentsRef}
          >
            {#each comments as comment (comment.id)}
              <Post post={comment} />
            {/each}

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
              <button on:click={() => comment(commentsRef, post.id)}
                >Comment</button
              >
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

  #post-box {
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    /* align-items: flex-end; */
  }
</style>
