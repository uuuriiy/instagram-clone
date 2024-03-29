import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase";
import "./Post.css";

export const Post = (props) => {
  const {
    post: { username, caption, imageUrl },
    postId,
    user,
  } = props;
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          alt="nikitako"
          src="/broken-image.jpg"
          className="post__avatar"
        />
        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageUrl} />

      <h4 className="post__text">
        <strong>{username}:</strong>
        {caption}
      </h4>

      <div className="post__comments">
        {!!comments.length &&
          comments.map((comment) => (
            <p key={comment.id}>
              <strong>{comment.username} </strong>
              {comment.text}
            </p>
          ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder=" Add a comment... "
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            {" "}
            Post{" "}
          </button>
        </form>
      )}
    </div>
  );
};
