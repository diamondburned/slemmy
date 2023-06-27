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
  [UserOperation.Login]: (req: lemmy.Login) => client.login(req),
  [UserOperation.UserJoin]: (req: lemmy.UserJoin) => throwUnimplemented(),
  [UserOperation.PostJoin]: (req: lemmy.PostJoin) => throwUnimplemented(),
  [UserOperation.CommunityJoin]: (req: lemmy.CommunityJoin) =>
    throwUnimplemented(),
  [UserOperation.Register]: (req: lemmy.Register) => client.register(req),
  [UserOperation.GetCaptcha]: (req: lemmy.GetCaptcha) => client.getCaptcha(req),
  [UserOperation.CreateCommunity]: (req: lemmy.CreateCommunity) =>
    client.createCommunity(req),
  [UserOperation.EditCommunity]: (req: lemmy.EditCommunity) =>
    client.editCommunity(req),
  [UserOperation.DeleteCommunity]: (req: lemmy.DeleteCommunity) =>
    client.deleteCommunity(req),
  [UserOperation.RemoveCommunity]: (req: lemmy.RemoveCommunity) =>
    client.removeCommunity(req),
  [UserOperation.FollowCommunity]: (req: lemmy.FollowCommunity) =>
    client.followCommunity(req),
  [UserOperation.ListCommunities]: (req: lemmy.ListCommunities) =>
    client.listCommunities(req),
  [UserOperation.CreatePost]: (req: lemmy.CreatePost) => client.createPost(req),
  [UserOperation.GetPost]: (req: lemmy.GetPost) => client.getPost(req),
  [UserOperation.GetCommunity]: (req: lemmy.GetCommunity) =>
    client.getCommunity(req),
  [UserOperation.CreateComment]: (req: lemmy.CreateComment) =>
    client.createComment(req),
  [UserOperation.EditComment]: (req: lemmy.EditComment) =>
    client.editComment(req),
  [UserOperation.DeleteComment]: (req: lemmy.DeleteComment) =>
    client.deleteComment(req),
  [UserOperation.RemoveComment]: (req: lemmy.RemoveComment) =>
    client.removeComment(req),
  [UserOperation.MarkCommentReplyAsRead]: (req: lemmy.MarkCommentReplyAsRead) =>
    client.markCommentReplyAsRead(req),
  [UserOperation.CreateCommentLike]: (req: lemmy.CreateCommentLike) =>
    client.likeComment(req),
  [UserOperation.SaveComment]: (req: lemmy.SaveComment) =>
    client.saveComment(req),
  [UserOperation.CreateCommentReport]: (req: lemmy.CreateCommentReport) =>
    client.createCommentReport(req),
  [UserOperation.ResolveCommentReport]: (req: lemmy.ResolveCommentReport) =>
    client.resolveCommentReport(req),
  [UserOperation.ListCommentReports]: (req: lemmy.ListCommentReports) =>
    client.listCommentReports(req),
  [UserOperation.GetPosts]: (req: lemmy.GetPosts) => client.getPosts(req),
  [UserOperation.GetComments]: (req: lemmy.GetComments) =>
    client.getComments(req),
  [UserOperation.GetComment]: (req: lemmy.GetComment) => client.getComment(req),
  [UserOperation.CreatePostLike]: (req: lemmy.CreatePostLike) =>
    client.likePost(req),
  [UserOperation.EditPost]: (req: lemmy.EditPost) => client.editPost(req),
  [UserOperation.DeletePost]: (req: lemmy.DeletePost) => client.deletePost(req),
  [UserOperation.RemovePost]: (req: lemmy.RemovePost) => client.removePost(req),
  [UserOperation.LockPost]: (req: lemmy.LockPost) => client.lockPost(req),
  [UserOperation.FeaturePost]: (req: lemmy.FeaturePost) =>
    client.featurePost(req),
  [UserOperation.MarkPostAsRead]: (req: lemmy.MarkPostAsRead) =>
    client.markPostAsRead(req),
  [UserOperation.SavePost]: (req: lemmy.SavePost) => client.savePost(req),
  [UserOperation.CreatePostReport]: (req: lemmy.CreatePostReport) =>
    client.createPostReport(req),
  [UserOperation.ResolvePostReport]: (req: lemmy.ResolvePostReport) =>
    client.resolvePostReport(req),
  [UserOperation.ListPostReports]: (req: lemmy.ListPostReports) =>
    client.listPostReports(req),
  [UserOperation.GetSiteMetadata]: (req: lemmy.GetSiteMetadata) =>
    client.getSiteMetadata(req),
  [UserOperation.BanFromCommunity]: (req: lemmy.BanFromCommunity) =>
    client.banFromCommunity(req),
  [UserOperation.AddModToCommunity]: (req: lemmy.AddModToCommunity) =>
    client.addModToCommunity(req),
  [UserOperation.TransferCommunity]: (req: lemmy.TransferCommunity) =>
    client.transferCommunity(req),
  [UserOperation.LeaveAdmin]: (req: lemmy.LeaveAdmin) => client.leaveAdmin(req),
  [UserOperation.BanPerson]: (req: lemmy.BanPerson) => client.banPerson(req),
  [UserOperation.GetBannedPersons]: (req: lemmy.GetBannedPersons) =>
    client.getBannedPersons(req),
  [UserOperation.AddAdmin]: (req: lemmy.AddAdmin) => client.addAdmin(req),
  [UserOperation.GetUnreadRegistrationApplicationCount]: (
    req: lemmy.GetUnreadRegistrationApplicationCount,
  ) => client.getUnreadRegistrationApplicationCount(req),
  [UserOperation.ListRegistrationApplications]: (
    req: lemmy.ListRegistrationApplications,
  ) => client.listRegistrationApplications(req),
  [UserOperation.ApproveRegistrationApplication]: (
    req: lemmy.ApproveRegistrationApplication,
  ) => client.approveRegistrationApplication(req),
  [UserOperation.GetPersonDetails]: (req: lemmy.GetPersonDetails) =>
    client.getPersonDetails(req),
  [UserOperation.GetReplies]: (req: lemmy.GetReplies) => client.getReplies(req),
  [UserOperation.GetPersonMentions]: (req: lemmy.GetPersonMentions) =>
    client.getPersonMentions(req),
  [UserOperation.MarkPersonMentionAsRead]: (
    req: lemmy.MarkPersonMentionAsRead,
  ) => client.markPersonMentionAsRead(req),
  [UserOperation.GetModlog]: (req: lemmy.GetModlog) => client.getModlog(req),
  [UserOperation.CreateSite]: (req: lemmy.CreateSite) => client.createSite(req),
  [UserOperation.EditSite]: (req: lemmy.EditSite) => client.editSite(req),
  [UserOperation.GetSite]: (req: lemmy.GetSite) => client.getSite(req),
  [UserOperation.Search]: (req: lemmy.Search) => client.search(req),
  [UserOperation.ResolveObject]: (req: lemmy.ResolveObject) =>
    client.resolveObject(req),
  [UserOperation.MarkAllAsRead]: (req: lemmy.MarkAllAsRead) =>
    client.markAllAsRead(req),
  [UserOperation.SaveUserSettings]: (req: lemmy.SaveUserSettings) =>
    client.saveUserSettings(req),
  [UserOperation.ChangePassword]: (req: lemmy.ChangePassword) =>
    client.changePassword(req),
  [UserOperation.GetReportCount]: (req: lemmy.GetReportCount) =>
    client.getReportCount(req),
  [UserOperation.GetUnreadCount]: (req: lemmy.GetUnreadCount) =>
    client.getUnreadCount(req),
  [UserOperation.VerifyEmail]: (req: lemmy.VerifyEmail) =>
    client.verifyEmail(req),
  [UserOperation.DeleteAccount]: (req: lemmy.DeleteAccount) =>
    client.deleteAccount(req),
  [UserOperation.PasswordReset]: (req: lemmy.PasswordReset) =>
    client.passwordReset(req),
  [UserOperation.PasswordChangeAfterReset]: (
    req: lemmy.PasswordChangeAfterReset,
  ) => client.passwordChangeAfterReset(req),
  [UserOperation.CreatePrivateMessage]: (req: lemmy.CreatePrivateMessage) =>
    client.createPrivateMessage(req),
  [UserOperation.EditPrivateMessage]: (req: lemmy.EditPrivateMessage) =>
    client.editPrivateMessage(req),
  [UserOperation.DeletePrivateMessage]: (req: lemmy.DeletePrivateMessage) =>
    client.deletePrivateMessage(req),
  [UserOperation.MarkPrivateMessageAsRead]: (
    req: lemmy.MarkPrivateMessageAsRead,
  ) => client.markPrivateMessageAsRead(req),
  [UserOperation.GetPrivateMessages]: (req: lemmy.GetPrivateMessages) =>
    client.getPrivateMessages(req),
  [UserOperation.CreatePrivateMessageReport]: (
    req: lemmy.CreatePrivateMessageReport,
  ) => client.createPrivateMessageReport(req),
  [UserOperation.ResolvePrivateMessageReport]: (
    req: lemmy.ResolvePrivateMessageReport,
  ) => client.resolvePrivateMessageReport(req),
  [UserOperation.ListPrivateMessageReports]: (
    req: lemmy.ListPrivateMessageReports,
  ) => client.listPrivateMessageReports(req),
  [UserOperation.BlockPerson]: (req: lemmy.BlockPerson) =>
    client.blockPerson(req),
  [UserOperation.BlockCommunity]: (req: lemmy.BlockCommunity) =>
    client.blockCommunity(req),
  [UserOperation.PurgePerson]: (req: lemmy.PurgePerson) =>
    client.purgePerson(req),
  [UserOperation.PurgeCommunity]: (req: lemmy.PurgeCommunity) =>
    client.purgeCommunity(req),
  [UserOperation.PurgePost]: (req: lemmy.PurgePost) => client.purgePost(req),
  [UserOperation.PurgeComment]: (req: lemmy.PurgeComment) =>
    client.purgeComment(req),
  [UserOperation.CreateCustomEmoji]: (req: lemmy.CreateCustomEmoji) =>
    client.createCustomEmoji(req),
  [UserOperation.EditCustomEmoji]: (req: lemmy.EditCustomEmoji) =>
    client.editCustomEmoji(req),
  [UserOperation.DeleteCustomEmoji]: (req: lemmy.DeleteCustomEmoji) =>
    client.deleteCustomEmoji(req),
  [UserOperation.GetFederatedInstances]: (req: lemmy.GetFederatedInstances) =>
    client.getFederatedInstances(req),
})
