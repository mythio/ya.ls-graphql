/**
 * QUERY
 */
module.exports.meResult = result => {
  let {
    _id: userId,
    joiningDate,
    shortIds,
    isAdmin,
    name,
    emailAddress
  } = result;

  shortIds = shortIds.map(item => ({
    shortId: item._id,
    shareWith: item.shareWith,
    originalUrl: item.originalUrl
  }));
  return { userId, name, emailAddress, isAdmin, shortIds, joiningDate };
};

module.exports.loginResult = result => {
  let {
    user: { _id: userId },
    token
  } = result;

  return { userId, token };
};

module.exports.expandUrlResult = result => {
  let { _id: shortId, originalUrl, createdBy, shareWith } = result;

  if (createdBy) {
    createdBy = {
      userId: createdBy._id,
      name: createdBy.name,
      emailAddress: createdBy.emailAddress
    };
  }

  if (shareWith) {
    shareWith = shareWith.map(item => ({
      userId: item._id,
      name: item.name,
      emailAddress: item.emailAddress
    }));
  }

  return {
    shortId,
    originalUrl,
    createdBy,
    shareWith
  };
};

/**
 * MUTATION
 */
module.exports.createUserResult = result => {
  let { _id: userId, name, emailAddress } = result;

  return {
    userId,
    name,
    emailAddress
  };
};

module.exports.shortenUrlResult = result => {
  let { _id: shortId, originalUrl, shareWith } = result;

  return {
    shortId,
    originalUrl,
    shareWith
  };
};
