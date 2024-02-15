const apiEndpoints = {
  //Don't require authentification
  versions: '/_matrix/client/versions',
  login: '/_matrix/client/v3/login',
  ssoRedirect: '/_matrix/client/v3/login/sso/redirect',

  //Require authentification
  whoami: '/_matrix/client/v3/account/whoami',
  sync: '/_matrix/client/v3/sync',
  profile: (userId: string) => `/_matrix/client/v3/profile/${userId}`,
  putStateEvent: (roomId: string, eventType: string, stateKey: string) =>
    `/_matrix/client/v3/rooms/${roomId}/state/${eventType}/${stateKey}`,
  putMessageEvent: (roomId: string, eventType: string, transactionId: string) =>
    `/_matrix/client/v3/rooms/${roomId}/send/${eventType}/${transactionId}`,
  thumbnailGet: (
    serverName: string,
    mediaId: string,
    width: number,
    height: number,
    method: string
  ) => {
    return `/_matrix/media/v3/thumbnail/${serverName}/${mediaId}?width=${width}&height=${height}&method=${method}`;
  },
  roomMessagesGet(roomId: string, from: string, dir: string) {
    return `/_matrix/client/v3/rooms/${roomId}/messages?from=${from}&dir=${dir}`;
  },
  roomCreate: '/_matrix/client/v3/createRoom',
  roomJoin: (roomId: string) => `/_matrix/client/v3/join/${roomId}`,
  roomLeave: (roomId: string) => `/_matrix/client/v3/rooms/${roomId}/leave`,
  userDirectorySearch: '/_matrix/client/v3/user_directory/search',
  roomInvite: (roomId: string) => `/_matrix/client/v3/rooms/${roomId}/invite`,
  roomKick: (roomId: string) => `/_matrix/client/v3/rooms/${roomId}/kick`,
  uploadFile: '/_matrix/media/v3/upload',
};

export default apiEndpoints;
