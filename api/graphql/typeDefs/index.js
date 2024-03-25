import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";
import commentTypeDef from "./comment.typeDef.js";
import postTypeDef from "./post.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([
  userTypeDef,
  commentTypeDef,
  postTypeDef,
]);

export default mergedTypeDefs;
