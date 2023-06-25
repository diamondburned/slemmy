// Generated using ./src/scripts/gen-ws-types.sh

import { LemmyHttp, UserOperation } from "lemmy-js-client"
import type * as lemmy from "lemmy-js-client"

function throwUnimplemented(): never {
  throw new Error("not implemented")
}

export type typeMap = {
  [UserOperation.Login]: [lemmy.Login, lemmy.LoginResponse]
  [UserOperation.UserJoin]: [lemmy.UserJoin, never]
  [UserOperation.PostJoin]: [lemmy.PostJoin, never]
  [UserOperation.CommunityJoin]: [lemmy.CommunityJoin, never]
  [UserOperation.Register]: [lemmy.Register, lemmy.LoginResponse]
  [UserOperation.GetCaptcha]: [lemmy.GetCaptcha, lemmy.GetCaptchaResponse]
  [UserOperation.CreateCommunity]: [
    lemmy.CreateCommunity,
    lemmy.CommunityResponse,
  ]
  [UserOperation.EditCommunity]: [lemmy.EditCommunity, lemmy.CommunityResponse]
  [UserOperation.DeleteCommunity]: [
    lemmy.DeleteCommunity,
    lemmy.CommunityResponse,
  ]
  [UserOperation.RemoveCommunity]: [
    lemmy.RemoveCommunity,
    lemmy.CommunityResponse,
  ]
  [UserOperation.FollowCommunity]: [
    lemmy.FollowCommunity,
    lemmy.CommunityResponse,
  ]
  [UserOperation.ListCommunities]: [
    lemmy.ListCommunities,
    lemmy.ListCommunitiesResponse,
  ]
  [UserOperation.CreatePost]: [lemmy.CreatePost, lemmy.PostResponse]
  [UserOperation.GetPost]: [lemmy.GetPost, lemmy.GetPostResponse]
  [UserOperation.GetCommunity]: [lemmy.GetCommunity, lemmy.GetCommunityResponse]
  [UserOperation.CreateComment]: [lemmy.CreateComment, lemmy.CommentResponse]
  [UserOperation.EditComment]: [lemmy.EditComment, lemmy.CommentResponse]
  [UserOperation.DeleteComment]: [lemmy.DeleteComment, lemmy.CommentResponse]
  [UserOperation.RemoveComment]: [lemmy.RemoveComment, lemmy.CommentResponse]
  [UserOperation.MarkCommentReplyAsRead]: [
    lemmy.MarkCommentReplyAsRead,
    lemmy.CommentReplyResponse,
  ]
  [UserOperation.CreateCommentLike]: [
    lemmy.CreateCommentLike,
    lemmy.CommentResponse,
  ]
  [UserOperation.SaveComment]: [lemmy.SaveComment, lemmy.CommentResponse]
  [UserOperation.CreateCommentReport]: [
    lemmy.CreateCommentReport,
    lemmy.CommentReportResponse,
  ]
  [UserOperation.ResolveCommentReport]: [
    lemmy.ResolveCommentReport,
    lemmy.CommentReportResponse,
  ]
  [UserOperation.ListCommentReports]: [
    lemmy.ListCommentReports,
    lemmy.ListCommentReportsResponse,
  ]
  [UserOperation.GetPosts]: [lemmy.GetPosts, lemmy.GetPostsResponse]
  [UserOperation.GetComments]: [lemmy.GetComments, lemmy.GetCommentsResponse]
  [UserOperation.GetComment]: [lemmy.GetComment, lemmy.CommentResponse]
  [UserOperation.CreatePostLike]: [lemmy.CreatePostLike, lemmy.PostResponse]
  [UserOperation.EditPost]: [lemmy.EditPost, lemmy.PostResponse]
  [UserOperation.DeletePost]: [lemmy.DeletePost, lemmy.PostResponse]
  [UserOperation.RemovePost]: [lemmy.RemovePost, lemmy.PostResponse]
  [UserOperation.LockPost]: [lemmy.LockPost, lemmy.PostResponse]
  [UserOperation.FeaturePost]: [lemmy.FeaturePost, lemmy.PostResponse]
  [UserOperation.MarkPostAsRead]: [lemmy.MarkPostAsRead, lemmy.PostResponse]
  [UserOperation.SavePost]: [lemmy.SavePost, lemmy.PostResponse]
  [UserOperation.CreatePostReport]: [
    lemmy.CreatePostReport,
    lemmy.PostReportResponse,
  ]
  [UserOperation.ResolvePostReport]: [
    lemmy.ResolvePostReport,
    lemmy.PostReportResponse,
  ]
  [UserOperation.ListPostReports]: [
    lemmy.ListPostReports,
    lemmy.ListPostReportsResponse,
  ]
  [UserOperation.GetSiteMetadata]: [
    lemmy.GetSiteMetadata,
    lemmy.GetSiteMetadataResponse,
  ]
  [UserOperation.BanFromCommunity]: [
    lemmy.BanFromCommunity,
    lemmy.BanFromCommunityResponse,
  ]
  [UserOperation.AddModToCommunity]: [
    lemmy.AddModToCommunity,
    lemmy.AddModToCommunityResponse,
  ]
  [UserOperation.TransferCommunity]: [
    lemmy.TransferCommunity,
    lemmy.GetCommunityResponse,
  ]
  [UserOperation.LeaveAdmin]: [lemmy.LeaveAdmin, lemmy.GetSiteResponse]
  [UserOperation.BanPerson]: [lemmy.BanPerson, lemmy.BanPersonResponse]
  [UserOperation.GetBannedPersons]: [
    lemmy.GetBannedPersons,
    lemmy.BannedPersonsResponse,
  ]
  [UserOperation.AddAdmin]: [lemmy.AddAdmin, lemmy.AddAdminResponse]
  [UserOperation.GetUnreadRegistrationApplicationCount]: [
    lemmy.GetUnreadRegistrationApplicationCount,
    lemmy.GetUnreadRegistrationApplicationCountResponse,
  ]
  [UserOperation.ListRegistrationApplications]: [
    lemmy.ListRegistrationApplications,
    lemmy.ListRegistrationApplicationsResponse,
  ]
  [UserOperation.ApproveRegistrationApplication]: [
    lemmy.ApproveRegistrationApplication,
    lemmy.RegistrationApplicationResponse,
  ]
  [UserOperation.GetPersonDetails]: [
    lemmy.GetPersonDetails,
    lemmy.GetPersonDetailsResponse,
  ]
  [UserOperation.GetReplies]: [lemmy.GetReplies, lemmy.GetRepliesResponse]
  [UserOperation.GetPersonMentions]: [
    lemmy.GetPersonMentions,
    lemmy.GetPersonMentionsResponse,
  ]
  [UserOperation.MarkPersonMentionAsRead]: [
    lemmy.MarkPersonMentionAsRead,
    lemmy.PersonMentionResponse,
  ]
  [UserOperation.GetModlog]: [lemmy.GetModlog, lemmy.GetModlogResponse]
  [UserOperation.CreateSite]: [lemmy.CreateSite, lemmy.SiteResponse]
  [UserOperation.EditSite]: [lemmy.EditSite, lemmy.SiteResponse]
  [UserOperation.GetSite]: [lemmy.GetSite, lemmy.GetSiteResponse]
  [UserOperation.Search]: [lemmy.Search, lemmy.SearchResponse]
  [UserOperation.ResolveObject]: [
    lemmy.ResolveObject,
    lemmy.ResolveObjectResponse,
  ]
  [UserOperation.MarkAllAsRead]: [lemmy.MarkAllAsRead, lemmy.GetRepliesResponse]
  [UserOperation.SaveUserSettings]: [
    lemmy.SaveUserSettings,
    lemmy.LoginResponse,
  ]
  [UserOperation.ChangePassword]: [lemmy.ChangePassword, lemmy.LoginResponse]
  [UserOperation.GetReportCount]: [
    lemmy.GetReportCount,
    lemmy.GetReportCountResponse,
  ]
  [UserOperation.GetUnreadCount]: [
    lemmy.GetUnreadCount,
    lemmy.GetUnreadCountResponse,
  ]
  [UserOperation.VerifyEmail]: [lemmy.VerifyEmail, lemmy.VerifyEmailResponse]
  [UserOperation.DeleteAccount]: [
    lemmy.DeleteAccount,
    lemmy.DeleteAccountResponse,
  ]
  [UserOperation.PasswordReset]: [
    lemmy.PasswordReset,
    lemmy.PasswordResetResponse,
  ]
  [UserOperation.PasswordChangeAfterReset]: [
    lemmy.PasswordChangeAfterReset,
    lemmy.LoginResponse,
  ]
  [UserOperation.CreatePrivateMessage]: [
    lemmy.CreatePrivateMessage,
    lemmy.PrivateMessageResponse,
  ]
  [UserOperation.EditPrivateMessage]: [
    lemmy.EditPrivateMessage,
    lemmy.PrivateMessageResponse,
  ]
  [UserOperation.DeletePrivateMessage]: [
    lemmy.DeletePrivateMessage,
    lemmy.PrivateMessageResponse,
  ]
  [UserOperation.MarkPrivateMessageAsRead]: [
    lemmy.MarkPrivateMessageAsRead,
    lemmy.PrivateMessageResponse,
  ]
  [UserOperation.GetPrivateMessages]: [
    lemmy.GetPrivateMessages,
    lemmy.PrivateMessagesResponse,
  ]
  [UserOperation.CreatePrivateMessageReport]: [
    lemmy.CreatePrivateMessageReport,
    lemmy.PrivateMessageReportResponse,
  ]
  [UserOperation.ResolvePrivateMessageReport]: [
    lemmy.ResolvePrivateMessageReport,
    lemmy.PrivateMessageReportResponse,
  ]
  [UserOperation.ListPrivateMessageReports]: [
    lemmy.ListPrivateMessageReports,
    lemmy.ListPrivateMessageReportsResponse,
  ]
  [UserOperation.BlockPerson]: [lemmy.BlockPerson, lemmy.BlockPersonResponse]
  [UserOperation.BlockCommunity]: [
    lemmy.BlockCommunity,
    lemmy.BlockCommunityResponse,
  ]
  [UserOperation.PurgePerson]: [lemmy.PurgePerson, lemmy.PurgeItemResponse]
  [UserOperation.PurgeCommunity]: [
    lemmy.PurgeCommunity,
    lemmy.PurgeItemResponse,
  ]
  [UserOperation.PurgePost]: [lemmy.PurgePost, lemmy.PurgeItemResponse]
  [UserOperation.PurgeComment]: [lemmy.PurgeComment, lemmy.PurgeItemResponse]
  [UserOperation.CreateCustomEmoji]: [
    lemmy.CreateCustomEmoji,
    lemmy.CustomEmojiResponse,
  ]
  [UserOperation.EditCustomEmoji]: [
    lemmy.EditCustomEmoji,
    lemmy.CustomEmojiResponse,
  ]
  [UserOperation.DeleteCustomEmoji]: [
    lemmy.DeleteCustomEmoji,
    lemmy.DeleteCustomEmojiResponse,
  ]
  [UserOperation.GetFederatedInstances]: [
    lemmy.GetFederatedInstances,
    lemmy.GetFederatedInstancesResponse,
  ]
}

export const clientRouteMap = (client: LemmyHttp) => ({
  [UserOperation.Login]: client.login,
  [UserOperation.UserJoin]: throwUnimplemented,
  [UserOperation.PostJoin]: throwUnimplemented,
  [UserOperation.CommunityJoin]: throwUnimplemented,
  [UserOperation.Register]: client.register,
  [UserOperation.GetCaptcha]: client.getCaptcha,
  [UserOperation.CreateCommunity]: client.createCommunity,
  [UserOperation.EditCommunity]: client.editCommunity,
  [UserOperation.DeleteCommunity]: client.deleteCommunity,
  [UserOperation.RemoveCommunity]: client.removeCommunity,
  [UserOperation.FollowCommunity]: client.followCommunity,
  [UserOperation.ListCommunities]: client.listCommunities,
  [UserOperation.CreatePost]: client.createPost,
  [UserOperation.GetPost]: client.getPost,
  [UserOperation.GetCommunity]: client.getCommunity,
  [UserOperation.CreateComment]: client.createComment,
  [UserOperation.EditComment]: client.editComment,
  [UserOperation.DeleteComment]: client.deleteComment,
  [UserOperation.RemoveComment]: client.removeComment,
  [UserOperation.MarkCommentReplyAsRead]: client.markCommentReplyAsRead,
  [UserOperation.CreateCommentLike]: client.likeComment,
  [UserOperation.SaveComment]: client.saveComment,
  [UserOperation.CreateCommentReport]: client.createCommentReport,
  [UserOperation.ResolveCommentReport]: client.resolveCommentReport,
  [UserOperation.ListCommentReports]: client.listCommentReports,
  [UserOperation.GetPosts]: client.getPosts,
  [UserOperation.GetComments]: client.getComments,
  [UserOperation.GetComment]: client.getComment,
  [UserOperation.CreatePostLike]: client.likePost,
  [UserOperation.EditPost]: client.editPost,
  [UserOperation.DeletePost]: client.deletePost,
  [UserOperation.RemovePost]: client.removePost,
  [UserOperation.LockPost]: client.lockPost,
  [UserOperation.FeaturePost]: client.featurePost,
  [UserOperation.MarkPostAsRead]: client.markPostAsRead,
  [UserOperation.SavePost]: client.savePost,
  [UserOperation.CreatePostReport]: client.createPostReport,
  [UserOperation.ResolvePostReport]: client.resolvePostReport,
  [UserOperation.ListPostReports]: client.listPostReports,
  [UserOperation.GetSiteMetadata]: client.getSiteMetadata,
  [UserOperation.BanFromCommunity]: client.banFromCommunity,
  [UserOperation.AddModToCommunity]: client.addModToCommunity,
  [UserOperation.TransferCommunity]: client.transferCommunity,
  [UserOperation.LeaveAdmin]: client.leaveAdmin,
  [UserOperation.BanPerson]: client.banPerson,
  [UserOperation.GetBannedPersons]: client.getBannedPersons,
  [UserOperation.AddAdmin]: client.addAdmin,
  [UserOperation.GetUnreadRegistrationApplicationCount]:
    client.getUnreadRegistrationApplicationCount,
  [UserOperation.ListRegistrationApplications]:
    client.listRegistrationApplications,
  [UserOperation.ApproveRegistrationApplication]:
    client.approveRegistrationApplication,
  [UserOperation.GetPersonDetails]: client.getPersonDetails,
  [UserOperation.GetReplies]: client.getReplies,
  [UserOperation.GetPersonMentions]: client.getPersonMentions,
  [UserOperation.MarkPersonMentionAsRead]: client.markPersonMentionAsRead,
  [UserOperation.GetModlog]: client.getModlog,
  [UserOperation.CreateSite]: client.createSite,
  [UserOperation.EditSite]: client.editSite,
  [UserOperation.GetSite]: client.getSite,
  [UserOperation.Search]: client.search,
  [UserOperation.ResolveObject]: client.resolveObject,
  [UserOperation.MarkAllAsRead]: client.markAllAsRead,
  [UserOperation.SaveUserSettings]: client.saveUserSettings,
  [UserOperation.ChangePassword]: client.changePassword,
  [UserOperation.GetReportCount]: client.getReportCount,
  [UserOperation.GetUnreadCount]: client.getUnreadCount,
  [UserOperation.VerifyEmail]: client.verifyEmail,
  [UserOperation.DeleteAccount]: client.deleteAccount,
  [UserOperation.PasswordReset]: client.passwordReset,
  [UserOperation.PasswordChangeAfterReset]: client.passwordChangeAfterReset,
  [UserOperation.CreatePrivateMessage]: client.createPrivateMessage,
  [UserOperation.EditPrivateMessage]: client.editPrivateMessage,
  [UserOperation.DeletePrivateMessage]: client.deletePrivateMessage,
  [UserOperation.MarkPrivateMessageAsRead]: client.markPrivateMessageAsRead,
  [UserOperation.GetPrivateMessages]: client.getPrivateMessages,
  [UserOperation.CreatePrivateMessageReport]: client.createPrivateMessageReport,
  [UserOperation.ResolvePrivateMessageReport]:
    client.resolvePrivateMessageReport,
  [UserOperation.ListPrivateMessageReports]: client.listPrivateMessageReports,
  [UserOperation.BlockPerson]: client.blockPerson,
  [UserOperation.BlockCommunity]: client.blockCommunity,
  [UserOperation.PurgePerson]: client.purgePerson,
  [UserOperation.PurgeCommunity]: client.purgeCommunity,
  [UserOperation.PurgePost]: client.purgePost,
  [UserOperation.PurgeComment]: client.purgeComment,
  [UserOperation.CreateCustomEmoji]: client.createCustomEmoji,
  [UserOperation.EditCustomEmoji]: client.editCustomEmoji,
  [UserOperation.DeleteCustomEmoji]: client.deleteCustomEmoji,
  [UserOperation.GetFederatedInstances]: client.getFederatedInstances,
})
