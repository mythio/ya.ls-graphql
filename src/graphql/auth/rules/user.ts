import { adminRule } from "./admin";

// const userRule = async requestData => {
//   try {
//     const isAdmin = await adminRule(requestData);
//   } catch (err) {
//     if (err instanceof )
//   }
//   if (isAdmin) {
//     return true;
//   }

//   const { authorization } = requestData;

//   if (!authorization) {
//     return false;
//   }

//   try {
//     const token = jwt.verify(authorization, process.env.USER_SECRET);
//     const user = await User.findById(token.userId);

//     if (!user) {
//       return false;
//     }

//     requestData.user = user;
//   } catch (err) {
//     return false;
//   }

//   return true;
// };

// module.exports = userRule;
