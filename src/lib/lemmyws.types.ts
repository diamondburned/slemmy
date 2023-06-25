// Generated using ./src/scripts/gen-ws-types.sh

import { UserOperation } from "lemmy-js-client"
import type * as lemmy from "lemmy-js-client"

type a = {
  [UserOperation.Login]: [lemmy.Login, lemmy.LoginResponse, "/user/login"]
  [UserOperation.UserJoin]: [lemmy.UserJoin, unknown, never]
  [UserOperation.PostJoin]: [lemmy.PostJoin, unknown, never]
  [UserOperation.CommunityJoin]: [lemmy.CommunityJoin, unknown, never]
  [UserOperation.Register]: [
    lemmy.Register,
    lemmy.LoginResponse,
    "/user/register",
  ]
  [UserOperation.GetCaptcha]: [
    lemmy.GetCaptcha,
    lemmy.GetCaptchaResponse,
    "/user/get_captcha",
  ]
  [UserOperation.CreateCommunity]: [
    lemmy.CreateCommunity,
    lemmy.CommunityResponse,
    "/community",
  ]
  [UserOperation.EditCommunity]: [
    lemmy.EditCommunity,
    lemmy.CommunityResponse,
    "/community",
  ]
  [UserOperation.DeleteCommunity]: [
    lemmy.DeleteCommunity,
    lemmy.CommunityResponse,
    "/community/delete",
  ]
  [UserOperation.RemoveCommunity]: [
    lemmy.RemoveCommunity,
    lemmy.CommunityResponse,
    "/community/remove",
  ]
  [UserOperation.FollowCommunity]: [
    lemmy.FollowCommunity,
    lemmy.CommunityResponse,
    "/community/follow",
  ]
  [UserOperation.ListCommunities]: [
    lemmy.ListCommunities,
    lemmy.ListCommunitiesResponse,
    "/community/list",
  ]
  [UserOperation.CreatePost]: [lemmy.CreatePost, lemmy.PostResponse, "/post"]
  [UserOperation.GetPost]: [lemmy.GetPost, lemmy.GetPostResponse, "/post"]
  [UserOperation.GetCommunity]: [
    lemmy.GetCommunity,
    lemmy.GetCommunityResponse,
    "/community",
  ]
  [UserOperation.CreateComment]: [
    lemmy.CreateComment,
    lemmy.CommentResponse,
    "/comment",
  ]
  [UserOperation.EditComment]: [
    lemmy.EditComment,
    lemmy.CommentResponse,
    "/comment",
  ]
  [UserOperation.DeleteComment]: [
    lemmy.DeleteComment,
    lemmy.CommentResponse,
    "/comment/delete",
  ]
  [UserOperation.RemoveComment]: [
    lemmy.RemoveComment,
    lemmy.CommentResponse,
    "/comment/remove",
  ]
  [UserOperation.MarkCommentReplyAsRead]: [
    lemmy.MarkCommentReplyAsRead,
    lemmy.CommentReplyResponse,
    "/comment/mark_as_read",
  ]
  [UserOperation.CreateCommentLike]: [
    lemmy.CreateCommentLike,
    lemmy.CommentResponse,
    "/comment/like",
  ]
  [UserOperation.SaveComment]: [
    lemmy.SaveComment,
    lemmy.CommentResponse,
    "/comment/save",
  ]
  [UserOperation.CreateCommentReport]: [
    lemmy.CreateCommentReport,
    lemmy.CommentReportResponse,
    "/comment/report",
  ]
  [UserOperation.ResolveCommentReport]: [
    lemmy.ResolveCommentReport,
    lemmy.CommentReportResponse,
    "/comment/report/resolve",
  ]
  [UserOperation.ListCommentReports]: [
    lemmy.ListCommentReports,
    lemmy.ListCommentReportsResponse,
    "/comment/report/list",
  ]
  [UserOperation.GetPosts]: [
    lemmy.GetPosts,
    lemmy.GetPostsResponse,
    "/post/list",
  ]
  [UserOperation.GetComments]: [
    lemmy.GetComments,
    lemmy.GetCommentsResponse,
    "/comment/list",
  ]
  [UserOperation.GetComment]: [
    lemmy.GetComment,
    lemmy.CommentResponse,
    "/comment",
  ]
  [UserOperation.CreatePostLike]: [
    lemmy.CreatePostLike,
    lemmy.PostResponse,
    "/post/like",
  ]
  [UserOperation.EditPost]: [lemmy.EditPost, lemmy.PostResponse, "/post"]
  [UserOperation.DeletePost]: [
    lemmy.DeletePost,
    lemmy.PostResponse,
    "/post/delete",
  ]
  [UserOperation.RemovePost]: [
    lemmy.RemovePost,
    lemmy.PostResponse,
    "/post/remove",
  ]
  [UserOperation.LockPost]: [lemmy.LockPost, lemmy.PostResponse, "/post/lock"]
  [UserOperation.FeaturePost]: [
    lemmy.FeaturePost,
    lemmy.PostResponse,
    "/post/feature",
  ]
  [UserOperation.MarkPostAsRead]: [
    lemmy.MarkPostAsRead,
    lemmy.PostResponse,
    "/post/mark_as_read",
  ]
  [UserOperation.SavePost]: [lemmy.SavePost, lemmy.PostResponse, "/post/save"]
  [UserOperation.CreatePostReport]: [
    lemmy.CreatePostReport,
    lemmy.PostReportResponse,
    "/post/report",
  ]
  [UserOperation.ResolvePostReport]: [
    lemmy.ResolvePostReport,
    lemmy.PostReportResponse,
    "/post/report/resolve",
  ]
  [UserOperation.ListPostReports]: [
    lemmy.ListPostReports,
    lemmy.ListPostReportsResponse,
    "/post/report/list",
  ]
  [UserOperation.GetSiteMetadata]: [
    lemmy.GetSiteMetadata,
    lemmy.GetSiteMetadataResponse,
    "/post/site_metadata",
  ]
  [UserOperation.BanFromCommunity]: [
    lemmy.BanFromCommunity,
    lemmy.BanFromCommunityResponse,
    "/community/ban_user",
  ]
  [UserOperation.AddModToCommunity]: [
    lemmy.AddModToCommunity,
    lemmy.AddModToCommunityResponse,
    "/community/mod",
  ]
  [UserOperation.TransferCommunity]: [
    lemmy.TransferCommunity,
    lemmy.GetCommunityResponse,
    "/community/transfer",
  ]
  [UserOperation.LeaveAdmin]: [
    lemmy.LeaveAdmin,
    lemmy.GetSiteResponse,
    "/user/leave_admin",
  ]
  [UserOperation.BanPerson]: [
    lemmy.BanPerson,
    lemmy.BanPersonResponse,
    "/user/ban",
  ]
  [UserOperation.GetBannedPersons]: [
    lemmy.GetBannedPersons,
    lemmy.BannedPersonsResponse,
    "/user/banned",
  ]
  [UserOperation.AddAdmin]: [
    lemmy.AddAdmin,
    lemmy.AddAdminResponse,
    "/admin/add",
  ]
  [UserOperation.GetUnreadRegistrationApplicationCount]: [
    lemmy.GetUnreadRegistrationApplicationCount,
    lemmy.GetUnreadRegistrationApplicationCountResponse,
    "/admin/registration_application/count",
  ]
  [UserOperation.ListRegistrationApplications]: [
    lemmy.ListRegistrationApplications,
    lemmy.ListRegistrationApplicationsResponse,
    "/admin/registration_application/list",
  ]
  [UserOperation.ApproveRegistrationApplication]: [
    lemmy.ApproveRegistrationApplication,
    lemmy.RegistrationApplicationResponse,
    "/admin/registration_application/approve",
  ]
  [UserOperation.GetPersonDetails]: [
    lemmy.GetPersonDetails,
    lemmy.GetPersonDetailsResponse,
    "/user",
  ]
  [UserOperation.GetReplies]: [
    lemmy.GetReplies,
    lemmy.GetRepliesResponse,
    "/user/replies",
  ]
  [UserOperation.GetPersonMentions]: [
    lemmy.GetPersonMentions,
    lemmy.GetPersonMentionsResponse,
    "/user/mention",
  ]
  [UserOperation.MarkPersonMentionAsRead]: [
    lemmy.MarkPersonMentionAsRead,
    lemmy.PersonMentionResponse,
    "/user/mention/mark_as_read",
  ]
  [UserOperation.GetModlog]: [
    lemmy.GetModlog,
    lemmy.GetModlogResponse,
    "/modlog",
  ]
  [UserOperation.CreateSite]: [lemmy.CreateSite, lemmy.SiteResponse, "/site"]
  [UserOperation.EditSite]: [lemmy.EditSite, lemmy.SiteResponse, "/site"]
  [UserOperation.GetSite]: [lemmy.GetSite, lemmy.GetSiteResponse, "/site"]
  [UserOperation.Search]: [lemmy.Search, lemmy.SearchResponse, "/search"]
  [UserOperation.ResolveObject]: [
    lemmy.ResolveObject,
    lemmy.ResolveObjectResponse,
    "/resolve_object",
  ]
  [UserOperation.MarkAllAsRead]: [
    lemmy.MarkAllAsRead,
    lemmy.GetRepliesResponse,
    "/user/mark_all_as_read",
  ]
  [UserOperation.SaveUserSettings]: [
    lemmy.SaveUserSettings,
    lemmy.LoginResponse,
    "/user/save_user_settings",
  ]
  [UserOperation.ChangePassword]: [
    lemmy.ChangePassword,
    lemmy.LoginResponse,
    "/user/change_password",
  ]
  [UserOperation.GetReportCount]: [
    lemmy.GetReportCount,
    lemmy.GetReportCountResponse,
    "/user/report_count",
  ]
  [UserOperation.GetUnreadCount]: [
    lemmy.GetUnreadCount,
    lemmy.GetUnreadCountResponse,
    "/user/unread_count",
  ]
  [UserOperation.VerifyEmail]: [
    lemmy.VerifyEmail,
    lemmy.VerifyEmailResponse,
    "/user/verify_email",
  ]
  [UserOperation.DeleteAccount]: [
    lemmy.DeleteAccount,
    lemmy.DeleteAccountResponse,
    "/user/delete_account",
  ]
  [UserOperation.PasswordReset]: [
    lemmy.PasswordReset,
    lemmy.PasswordResetResponse,
    "/user/password_reset",
  ]
  [UserOperation.PasswordChangeAfterReset]: [
    lemmy.PasswordChangeAfterReset,
    lemmy.LoginResponse,
    "/user/password_change",
  ]
  [UserOperation.CreatePrivateMessage]: [
    lemmy.CreatePrivateMessage,
    lemmy.PrivateMessageResponse,
    "/private_message",
  ]
  [UserOperation.EditPrivateMessage]: [
    lemmy.EditPrivateMessage,
    lemmy.PrivateMessageResponse,
    "/private_message",
  ]
  [UserOperation.DeletePrivateMessage]: [
    lemmy.DeletePrivateMessage,
    lemmy.PrivateMessageResponse,
    "/private_message/delete",
  ]
  [UserOperation.MarkPrivateMessageAsRead]: [
    lemmy.MarkPrivateMessageAsRead,
    lemmy.PrivateMessageResponse,
    "/private_message/mark_as_read",
  ]
  [UserOperation.GetPrivateMessages]: [
    lemmy.GetPrivateMessages,
    lemmy.PrivateMessagesResponse,
    "/private_message/list",
  ]
  [UserOperation.CreatePrivateMessageReport]: [
    lemmy.CreatePrivateMessageReport,
    lemmy.PrivateMessageReportResponse,
    "/private_message/report",
  ]
  [UserOperation.ResolvePrivateMessageReport]: [
    lemmy.ResolvePrivateMessageReport,
    lemmy.PrivateMessageReportResponse,
    "/private_message/report/resolve",
  ]
  [UserOperation.ListPrivateMessageReports]: [
    lemmy.ListPrivateMessageReports,
    lemmy.ListPrivateMessageReportsResponse,
    "/private_message/report/list",
  ]
  [UserOperation.BlockPerson]: [
    lemmy.BlockPerson,
    lemmy.BlockPersonResponse,
    "/user/block",
  ]
  [UserOperation.BlockCommunity]: [
    lemmy.BlockCommunity,
    lemmy.BlockCommunityResponse,
    "/community/block",
  ]
  [UserOperation.PurgePerson]: [
    lemmy.PurgePerson,
    lemmy.PurgeItemResponse,
    "/admin/purge/person",
  ]
  [UserOperation.PurgeCommunity]: [
    lemmy.PurgeCommunity,
    lemmy.PurgeItemResponse,
    "/admin/purge/community",
  ]
  [UserOperation.PurgePost]: [
    lemmy.PurgePost,
    lemmy.PurgeItemResponse,
    "/admin/purge/post",
  ]
  [UserOperation.PurgeComment]: [
    lemmy.PurgeComment,
    lemmy.PurgeItemResponse,
    "/admin/purge/comment",
  ]
  [UserOperation.CreateCustomEmoji]: [
    lemmy.CreateCustomEmoji,
    lemmy.CustomEmojiResponse,
    "/custom_emoji",
  ]
  [UserOperation.EditCustomEmoji]: [
    lemmy.EditCustomEmoji,
    lemmy.CustomEmojiResponse,
    "/custom_emoji",
  ]
  [UserOperation.DeleteCustomEmoji]: [
    lemmy.DeleteCustomEmoji,
    lemmy.DeleteCustomEmojiResponse,
    "/custom_emoji/delete",
  ]
  [UserOperation.GetFederatedInstances]: [
    lemmy.GetFederatedInstances,
    lemmy.GetFederatedInstancesResponse,
    "/federated_instances",
  ]
}

export type { a as default }
