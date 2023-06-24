// Generated using ./src/scripts/gen-ws-types.sh

import { UserOperation } from "lemmy-js-client";
import type * as lemmy from "lemmy-js-client";

type a = {
  [UserOperation.Login]: [lemmy.Login, lemmy.LoginResponse];
  [UserOperation.UserJoin]: [lemmy.UserJoin, unknown];
  [UserOperation.PostJoin]: [lemmy.PostJoin, unknown];
  [UserOperation.CommunityJoin]: [lemmy.CommunityJoin, unknown];
  [UserOperation.Register]: [lemmy.Register, lemmy.LoginResponse];
  [UserOperation.GetCaptcha]: [lemmy.GetCaptcha, lemmy.GetCaptchaResponse];
  [UserOperation.CreateCommunity]: [
    lemmy.CreateCommunity,
    lemmy.CommunityResponse
  ];
  [UserOperation.EditCommunity]: [lemmy.EditCommunity, lemmy.CommunityResponse];
  [UserOperation.DeleteCommunity]: [
    lemmy.DeleteCommunity,
    lemmy.CommunityResponse
  ];
  [UserOperation.RemoveCommunity]: [
    lemmy.RemoveCommunity,
    lemmy.CommunityResponse
  ];
  [UserOperation.FollowCommunity]: [
    lemmy.FollowCommunity,
    lemmy.CommunityResponse
  ];
  [UserOperation.ListCommunities]: [
    lemmy.ListCommunities,
    lemmy.ListCommunitiesResponse
  ];
  [UserOperation.CreatePost]: [lemmy.CreatePost, lemmy.PostResponse];
  [UserOperation.GetPost]: [lemmy.GetPost, lemmy.GetPostResponse];
  [UserOperation.GetCommunity]: [
    lemmy.GetCommunity,
    lemmy.GetCommunityResponse
  ];
  [UserOperation.CreateComment]: [lemmy.CreateComment, lemmy.CommentResponse];
  [UserOperation.EditComment]: [lemmy.EditComment, lemmy.CommentResponse];
  [UserOperation.DeleteComment]: [lemmy.DeleteComment, lemmy.CommentResponse];
  [UserOperation.RemoveComment]: [lemmy.RemoveComment, lemmy.CommentResponse];
  [UserOperation.MarkCommentReplyAsRead]: [
    lemmy.MarkCommentReplyAsRead,
    lemmy.CommentReplyResponse
  ];
  [UserOperation.CreateCommentLike]: [
    lemmy.CreateCommentLike,
    lemmy.CommentResponse
  ];
  [UserOperation.SaveComment]: [lemmy.SaveComment, lemmy.CommentResponse];
  [UserOperation.CreateCommentReport]: [
    lemmy.CreateCommentReport,
    lemmy.CommentReportResponse
  ];
  [UserOperation.ResolveCommentReport]: [
    lemmy.ResolveCommentReport,
    lemmy.CommentReportResponse
  ];
  [UserOperation.ListCommentReports]: [
    lemmy.ListCommentReports,
    lemmy.ListCommentReportsResponse
  ];
  [UserOperation.GetPosts]: [lemmy.GetPosts, lemmy.GetPostsResponse];
  [UserOperation.GetComments]: [lemmy.GetComments, lemmy.GetCommentsResponse];
  [UserOperation.GetComment]: [lemmy.GetComment, lemmy.CommentResponse];
  [UserOperation.CreatePostLike]: [lemmy.CreatePostLike, lemmy.PostResponse];
  [UserOperation.EditPost]: [lemmy.EditPost, lemmy.PostResponse];
  [UserOperation.DeletePost]: [lemmy.DeletePost, lemmy.PostResponse];
  [UserOperation.RemovePost]: [lemmy.RemovePost, lemmy.PostResponse];
  [UserOperation.LockPost]: [lemmy.LockPost, lemmy.PostResponse];
  [UserOperation.FeaturePost]: [lemmy.FeaturePost, lemmy.PostResponse];
  [UserOperation.MarkPostAsRead]: [lemmy.MarkPostAsRead, lemmy.PostResponse];
  [UserOperation.SavePost]: [lemmy.SavePost, lemmy.PostResponse];
  [UserOperation.CreatePostReport]: [
    lemmy.CreatePostReport,
    lemmy.PostReportResponse
  ];
  [UserOperation.ResolvePostReport]: [
    lemmy.ResolvePostReport,
    lemmy.PostReportResponse
  ];
  [UserOperation.ListPostReports]: [
    lemmy.ListPostReports,
    lemmy.ListPostReportsResponse
  ];
  [UserOperation.GetSiteMetadata]: [
    lemmy.GetSiteMetadata,
    lemmy.GetSiteMetadataResponse
  ];
  [UserOperation.BanFromCommunity]: [
    lemmy.BanFromCommunity,
    lemmy.BanFromCommunityResponse
  ];
  [UserOperation.AddModToCommunity]: [
    lemmy.AddModToCommunity,
    lemmy.AddModToCommunityResponse
  ];
  [UserOperation.TransferCommunity]: [
    lemmy.TransferCommunity,
    lemmy.GetCommunityResponse
  ];
  [UserOperation.LeaveAdmin]: [lemmy.LeaveAdmin, lemmy.GetSiteResponse];
  [UserOperation.BanPerson]: [lemmy.BanPerson, lemmy.BanPersonResponse];
  [UserOperation.GetBannedPersons]: [
    lemmy.GetBannedPersons,
    lemmy.BannedPersonsResponse
  ];
  [UserOperation.AddAdmin]: [lemmy.AddAdmin, lemmy.AddAdminResponse];
  [UserOperation.GetUnreadRegistrationApplicationCount]: [
    lemmy.GetUnreadRegistrationApplicationCount,
    unknown
  ];
  [UserOperation.ListRegistrationApplications]: [
    lemmy.ListRegistrationApplications,
    unknown
  ];
  [UserOperation.ApproveRegistrationApplication]: [
    lemmy.ApproveRegistrationApplication,
    unknown
  ];
  [UserOperation.GetPersonDetails]: [
    lemmy.GetPersonDetails,
    lemmy.GetPersonDetailsResponse
  ];
  [UserOperation.GetReplies]: [lemmy.GetReplies, lemmy.GetRepliesResponse];
  [UserOperation.GetPersonMentions]: [
    lemmy.GetPersonMentions,
    lemmy.GetPersonMentionsResponse
  ];
  [UserOperation.MarkPersonMentionAsRead]: [
    lemmy.MarkPersonMentionAsRead,
    lemmy.PersonMentionResponse
  ];
  [UserOperation.GetModlog]: [lemmy.GetModlog, lemmy.GetModlogResponse];
  [UserOperation.CreateSite]: [lemmy.CreateSite, lemmy.SiteResponse];
  [UserOperation.EditSite]: [lemmy.EditSite, lemmy.SiteResponse];
  [UserOperation.GetSite]: [lemmy.GetSite, lemmy.GetSiteResponse];
  [UserOperation.Search]: [lemmy.Search, lemmy.SearchResponse];
  [UserOperation.ResolveObject]: [
    lemmy.ResolveObject,
    lemmy.ResolveObjectResponse
  ];
  [UserOperation.MarkAllAsRead]: [
    lemmy.MarkAllAsRead,
    lemmy.GetRepliesResponse
  ];
  [UserOperation.SaveUserSettings]: [
    lemmy.SaveUserSettings,
    lemmy.LoginResponse
  ];
  [UserOperation.ChangePassword]: [lemmy.ChangePassword, lemmy.LoginResponse];
  [UserOperation.GetReportCount]: [
    lemmy.GetReportCount,
    lemmy.GetReportCountResponse
  ];
  [UserOperation.GetUnreadCount]: [
    lemmy.GetUnreadCount,
    lemmy.GetUnreadCountResponse
  ];
  [UserOperation.VerifyEmail]: [lemmy.VerifyEmail, lemmy.VerifyEmailResponse];
  [UserOperation.DeleteAccount]: [
    lemmy.DeleteAccount,
    lemmy.DeleteAccountResponse
  ];
  [UserOperation.PasswordReset]: [
    lemmy.PasswordReset,
    lemmy.PasswordResetResponse
  ];
  [UserOperation.PasswordChangeAfterReset]: [
    lemmy.PasswordChangeAfterReset,
    lemmy.LoginResponse
  ];
  [UserOperation.CreatePrivateMessage]: [
    lemmy.CreatePrivateMessage,
    lemmy.PrivateMessageResponse
  ];
  [UserOperation.EditPrivateMessage]: [
    lemmy.EditPrivateMessage,
    lemmy.PrivateMessageResponse
  ];
  [UserOperation.DeletePrivateMessage]: [
    lemmy.DeletePrivateMessage,
    lemmy.PrivateMessageResponse
  ];
  [UserOperation.MarkPrivateMessageAsRead]: [
    lemmy.MarkPrivateMessageAsRead,
    lemmy.PrivateMessageResponse
  ];
  [UserOperation.GetPrivateMessages]: [
    lemmy.GetPrivateMessages,
    lemmy.PrivateMessagesResponse
  ];
  [UserOperation.CreatePrivateMessageReport]: [
    lemmy.CreatePrivateMessageReport,
    unknown
  ];
  [UserOperation.ResolvePrivateMessageReport]: [
    lemmy.ResolvePrivateMessageReport,
    unknown
  ];
  [UserOperation.ListPrivateMessageReports]: [
    lemmy.ListPrivateMessageReports,
    unknown
  ];
  [UserOperation.BlockPerson]: [lemmy.BlockPerson, lemmy.BlockPersonResponse];
  [UserOperation.BlockCommunity]: [
    lemmy.BlockCommunity,
    lemmy.BlockCommunityResponse
  ];
  [UserOperation.PurgePerson]: [lemmy.PurgePerson, lemmy.PurgeItemResponse];
  [UserOperation.PurgeCommunity]: [
    lemmy.PurgeCommunity,
    lemmy.PurgeItemResponse
  ];
  [UserOperation.PurgePost]: [lemmy.PurgePost, lemmy.PurgeItemResponse];
  [UserOperation.PurgeComment]: [lemmy.PurgeComment, lemmy.PurgeItemResponse];
  [UserOperation.CreateCustomEmoji]: [
    lemmy.CreateCustomEmoji,
    lemmy.CustomEmojiResponse
  ];
  [UserOperation.EditCustomEmoji]: [
    lemmy.EditCustomEmoji,
    lemmy.CustomEmojiResponse
  ];
  [UserOperation.DeleteCustomEmoji]: [
    lemmy.DeleteCustomEmoji,
    lemmy.DeleteCustomEmojiResponse
  ];
  [UserOperation.GetFederatedInstances]: [
    lemmy.GetFederatedInstances,
    lemmy.GetFederatedInstancesResponse
  ];
};
export type { a as default };
