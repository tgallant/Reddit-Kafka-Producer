/* global module */

module.exports = function formatComment (profile, comment) {
  return {
    author_link_karma: profile.link_karma,
    author_comment_karma: profile.comment_karma,
    author_created_at: profile.created_utc,
    author_verified: profile.verified,
    author_has_verified_email: profile.has_verified_email,
    subreddit_it: comment.subreddit_id,
    approved_at_utc: comment.approved_at_utc,
    edited: comment.edited || 0,
    mod_reason_by: comment.mod_reason_by,
    banned_by: comment.banned_by,
    author_flair_type: comment.author_flair_type,
    removal_reason: comment.removal_reason,
    link_id: comment.link_id,
    author_flair_template_id: comment.author_flair_template_id,
    likes: comment.likes,
    banned_at_utc: comment.banned_at_utc,
    mod_reason_title: comment.mod_reason_title,
    gilded: comment.gilded,
    archived: comment.archived,
    no_follow: comment.no_follow,
    author: comment.author,
    num_comments: comment.num_comments,
    score: comment.score,
    over_18: comment.over_18,
    controversiality: comment.controversiality,
    body: comment.body,
    link_title: comment.link_title,
    downs: comment.downs,
    is_submitter: comment.is_submitter,
    subreddit: comment.subreddit,
    num_reports: comment.num_reports,
    created_utc: comment.created_utc,
    quarantine: comment.quarantine,
    subreddit_type: comment.subreddit_type,
    ups: comment.ups
  }
}
