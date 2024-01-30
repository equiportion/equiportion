const apiEndpoints = {
  //Don't require authentification
  versions: '',
  login: '/_matrix/client/v3/login',

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
};

export default apiEndpoints;
