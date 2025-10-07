import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { toast } from "react-toastify";
import { CourseContext } from "@/contexts/CourseContext";
import { AiFillStar } from "react-icons/ai";

const Comments = () => {
  const { courseId } = useParams();
  const { BackendAPI } = useApi();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [openReplies, setOpenReplies] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [me, setMe] = useState(null);
  const { avgRating, setAvgRating } = useContext(CourseContext);

  const studentToken = localStorage.getItem("studentToken");

  // Fetch comments when component mounts or courseId changes
  useEffect(() => {
    try {
      if (!courseId) return;

      const fetchComments = async () => {
        const response = await axios.get(
          `${BackendAPI}/courses/comments-with-replies/${courseId}`
        );

        if (response.status === 200) {
          setComments(response.data.comments || []);
          setLoading(false);
        }

        if (studentToken) {
          const profile = await axios.get(`${BackendAPI}/profile`, {
            headers: { Authorization: `Bearer ${studentToken}` },
          });
          setMe(profile.data);
        }
      };
      fetchComments();
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [courseId, BackendAPI]);

  // Calculate average rating
  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum, comment) => sum + comment.rating, 0) /
          comments.length
        ).toFixed(1)
      : 0;

  useEffect(() => {
    setAvgRating(averageRating);
  }, [averageRating, setAvgRating]);

  const isOwner = (item) => {
    if (!me) return false;
    return String(item.student_id) === String(me.student_id);
  };

  const toggleReplies = (id) => setOpenReplies((s) => ({ ...s, [id]: !s[id] }));

  // Get rating distribution
  const ratingDistribution = {
    5: comments.filter((c) => c.rating === 5).length,
    4: comments.filter((c) => c.rating === 4).length,
    3: comments.filter((c) => c.rating === 3).length,
    2: comments.filter((c) => c.rating === 2).length,
    1: comments.filter((c) => c.rating === 1).length,
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!studentToken) {
      navigate("/auth");
      return;
    }
    if (!newComment.trim() || rating === 0) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${BackendAPI}/courses/create-comment/${courseId}`,
        { rating, comment_text: newComment },
        {
          headers: {
            Authorization: `Bearer ${studentToken}`,
          },
        }
      );

      const user = await axios.get(`${BackendAPI}/profile`, {
        headers: {
          Authorization: `Bearer ${studentToken}`,
        },
      });
      const newCommentObj = {
        comment_id: response.data.comment_id,
        comment_text: response.data.comment_text ?? newComment,
        rating: Number(response.data.rating ?? rating),
        created_at: new Date().toISOString(),
        replies: Array.isArray(response.data.replies)
          ? response.data.replies
          : [],
        student_name: user.data.username,
        user_profile: user.data.user_profile,
      };
      setComments((prev) => [...prev, newCommentObj]);
      setNewComment("");
      setRating(0);
      setIsSubmitting(false);

      toast.success("Comment submitted successfully");
    } catch (error) {
      const server =
        error.response?.data?.details ||
        error.response?.data?.error ||
        error.message;
      setErrorMsg(server || "Something went wrong. Please try again.");
      toast.error(server || "Failed to submit comment");
    }
  };

  const startEdit = (c) => {
    setEditingId(c.comment_id);
    setEditText(c.comment_text || "");
    setEditRating(Number(c.rating || 0));
  };

  const submitEdit = async (id) => {
    if (!studentToken) return navigate("/auth");
    if (!editText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.put(`${BackendAPI}/courses/edit-comment/${id}`, {
        comment_text: editText,
        rating: editRating,
      });
      const data = res.data;
      setComments((p) =>
        p.map((c) =>
          c.comment_id === id
            ? {
                ...c,
                comment_text: data.comment_text ?? editText,
                rating: Number(data.rating ?? editRating),
              }
            : c
        )
      );
      setEditingId(null);
      toast.success("Updated");
    } catch (e) {
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (id) => {
    if (!studentToken) return navigate("/auth");
    if (!window.confirm("Delete comment?")) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`${BackendAPI}/courses/delete-comment/${id}`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      setComments((p) => p.filter((c) => c.comment_id !== id));
      toast.success("Deleted");
    } catch (e) {
      toast.error("Delete failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyText.trim()) return;
    if (!studentToken) {
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      const studentToken = localStorage.getItem("studentToken");

      // Create reply
      const response = await axios.post(
        `${BackendAPI}/courses/create-reply`,
        { comment_id: commentId, reply_text: replyText },
        {
          headers: { Authorization: `Bearer ${studentToken}` },
        }
      );

      // Fetch current student profile
      const user = await axios.get(`${BackendAPI}/profile`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });

      const newReply = {
        reply_id: response.data.reply_id,
        reply_text: response.data.reply_text ?? replyText,
        created_at: new Date().toISOString(),
        student_name: user.data.username,
        user_profile: user.data.user_profile,
      };

      // Update comments state with new reply
      setComments((prev) =>
        prev.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );

      setReplyText("");
      setShowReplyForm(null);
      toast.success("Reply submitted successfully");
    } catch (error) {
      const server =
        error.response?.data?.details ||
        error.response?.data?.error ||
        error.message;
      setErrorMsg(server || "Something went wrong. Please try again.");
      toast.error(server || "Failed to submit reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditReply = (reply) => {
    setEditingReplyId(reply.reply_id);
    setEditReplyText(reply.reply_text);
  };

  const submitEditReply = async (replyId, commentId) => {
    if (!studentToken) return navigate("/auth");
    if (!editReplyText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.put(
        `${BackendAPI}/courses/edit-reply/${replyId}`,
        { reply_text: editReplyText }
      );
      const data = res.data;

      setComments((prev) =>
        prev.map((comment) =>
          comment.comment_id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.reply_id === replyId
                    ? { ...reply, reply_text: data.reply_text ?? editReplyText }
                    : reply
                ),
              }
            : comment
        )
      );

      setEditingReplyId(null);
      toast.success("Reply updated successfully");
    } catch (error) {
      toast.error("Failed to update reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReply = async (replyId, commentId) => {
    if (!studentToken) return navigate("/auth");
    if (!window.confirm("Delete reply?")) return;

    setIsSubmitting(true);
    try {
      await axios.delete(`${BackendAPI}/courses/delete-reply/${replyId}`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.comment_id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply.reply_id !== replyId
                ),
              }
            : comment
        )
      );

      toast.success("Reply deleted successfully");
    } catch (error) {
      toast.error("Failed to delete reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "Today";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Render stars
  const renderStars = (rating, interactive = false, onRate = null) => {
    return [...Array(5)].map((_, index) => {
      const starNumber = index + 1;
      const isActive = interactive
        ? starNumber <= (hoverRating || rating)
        : starNumber <= rating;

      return (
        <button
          key={index}
          type="button"
          className={`text-2xl ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          } ${isActive ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => interactive && onRate && onRate(starNumber)}
          onMouseEnter={() => interactive && setHoverRating(starNumber)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          disabled={!interactive}
        >
          <AiFillStar />
        </button>
      );
    });
  };

  if (loading) {
    return (
      <div className="mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-7xl mx-auto px-6">
      {/* Comments Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            Student Reviews ({comments.length})
          </h2>
        </div>

        {/* Rating Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <span className="text-5xl font-bold text-gray-900 mr-4">
                  {averageRating}
                </span>
                <div>
                  <div className="flex text-yellow-400 text-xl mb-1">
                    {renderStars(Math.round(parseFloat(averageRating)))}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Based on {comments.length} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {star}★
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${
                          comments.length > 0
                            ? (ratingDistribution[star] / comments.length) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {ratingDistribution[star]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Comment Form */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Share Your Experience
          </h3>
          <form onSubmit={handleSubmitComment}>
            {/* Rating Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex items-center space-x-1">
                {renderStars(rating, true, setRating)}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 && `(${rating} star${rating !== 1 ? "s" : ""})`}
                </span>
              </div>
            </div>

            {/* Comment Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this course..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="4"
                maxLength="500"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {newComment.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!newComment.trim() || rating === 0 || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </div>
              ) : (
                "Post Review"
              )}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
              <p className="text-gray-400 text-sm">
                Be the first to share your experience!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.comment_id}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-inner ring-1 ring-gray-100">
                    {comment.user_profile ? (
                      <img
                        src={comment.user_profile}
                        alt={comment.student_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {comment.student_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {/* Header: name, badge, rating, date */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-gray-900 text-sm truncate">
                            {comment.student_name}
                          </h5>
                          {/* Owner badge (optional) */}
                          {isOwner(comment) && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex text-yellow-400 text-sm -ml-0.5">
                            {renderStars(comment.rating)}
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleReplies(comment.comment_id)}
                          className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                        >
                          {(openReplies[comment.comment_id] ? "Hide" : "Show") +
                            ` (${(comment.replies || []).length})`}
                        </button>

                        {isOwner(comment) && (
                          <>
                            <button
                              onClick={() => startEdit(comment)}
                              className="text-xs px-3 py-1 rounded-full bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteComment(comment.comment_id)}
                              className="text-xs px-3 py-1 rounded-full bg-white border border-red-100 text-red-600 hover:bg-red-50 transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Comment content / edit form */}
                    {editingId === comment.comment_id ? (
                      <div className="mt-3 bg-white rounded-lg p-3 border">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full border rounded p-2 mb-2 focus:ring-2 focus:ring-indigo-200"
                          rows={3}
                        />
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center space-x-2">
                            <select
                              value={editRating}
                              onChange={(e) =>
                                setEditRating(Number(e.target.value))
                              }
                              className="border px-2 py-1 rounded"
                            >
                              {[5, 4, 3, 2, 1].map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <AiFillStar className="text-yellow-400 text-xl" />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => submitEdit(comment.comment_id)}
                              disabled={isSubmitting || !editText.trim()}
                              className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:brightness-105 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 rounded border text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-gray-700 leading-relaxed">
                        {comment.comment_text}
                      </p>
                    )}

                    {/* Reply button */}
                    <div className="flex items-center space-x-4 text-sm mt-3">
                      <button
                        onClick={() =>
                          setShowReplyForm(
                            showReplyForm === comment.comment_id
                              ? null
                              : comment.comment_id
                          )
                        }
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply form */}
                    {showReplyForm === comment.comment_id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 resize-none"
                          rows={3}
                        />
                        <div className="flex items-center space-x-3 mt-3">
                          <button
                            onClick={() =>
                              handleSubmitReply(comment.comment_id)
                            }
                            disabled={!replyText.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            Post Reply
                          </button>
                          <button
                            onClick={() => {
                              setShowReplyForm(null);
                              setReplyText("");
                            }}
                            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                        {errorMsg && (
                          <p role="alert" className="mt-2 text-sm text-red-600">
                            {errorMsg}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Replies list (toggleable) */}
                    {openReplies[comment.comment_id] &&
                      (comment.replies || []).length > 0 && (
                        <div className="mt-6 space-y-4">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.reply_id}
                              className="bg-white rounded-lg p-4 ml-4 shadow-sm border"
                            >
                              <div className="flex items-start space-x-3">
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                  {reply.user_profile ? (
                                    <img
                                      src={reply.user_profile}
                                      alt={reply.student_name || "User"}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                                      {(reply.student_name || "U").charAt(0)}
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-gray-900 text-sm">
                                      {reply.student_name}
                                    </h5>
                                    <span className="text-xs text-gray-400 ml-auto">
                                      {formatDate(reply.created_at)}
                                    </span>
                                  </div>

                                  {editingReplyId === reply.reply_id ? (
                                    <div className="flex gap-2 mt-1">
                                      <input
                                        type="text"
                                        value={editReplyText}
                                        onChange={(e) =>
                                          setEditReplyText(e.target.value)
                                        }
                                        className="w-full border rounded px-2 py-1"
                                      />
                                      <button
                                        onClick={() =>
                                          submitEditReply(
                                            reply.reply_id,
                                            comment.comment_id
                                          )
                                        }
                                        className="px-2 py-1 bg-green-600 text-white rounded"
                                        disabled={isSubmitting}
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingReplyId(null)}
                                        className="px-2 py-1 border rounded"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-gray-700 text-sm">
                                      {reply.reply_text}
                                    </p>
                                  )}

                                  {/* Action buttons */}
                                  {isOwner(reply) &&
                                    editingReplyId !== reply.reply_id && (
                                      <div className="flex gap-2 mt-2 text-xs">
                                        <button
                                          onClick={() => startEditReply(reply)}
                                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            deleteReply(
                                              reply.reply_id,
                                              comment.comment_id
                                            )
                                          }
                                          className="px-2 py-1 bg-red-100 text-red-700 rounded"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
