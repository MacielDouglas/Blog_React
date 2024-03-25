import commentResolver from "./comment.resolver.js";
import postResolver from "./post.resolver.js";
import userResolver from "./user.resolver.js";
import { mergeResolvers } from "@graphql-tools/merge";

const mergedResolvers = mergeResolvers([
  userResolver,
  commentResolver,
  postResolver,
]);

export default mergedResolvers;
