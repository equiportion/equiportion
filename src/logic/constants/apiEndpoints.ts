const apiEndpoints = {
  whoami: '/_matrix/client/v3/account/whoami',
  sync: '/_matrix/client/v3/sync',
  profile: (userId: string) => `/_matrix/client/v3/profile/${userId}`,
  putStateEvent: (roomId: string, eventType: string, stateKey: string) =>
    `/_matrix/client/v3/rooms/${roomId}/state/${eventType}/${stateKey}`,
  putMessageEvent: (roomId: string, eventType: string) =>
    `/_matrix/client/v3/rooms/${roomId}/send/${eventType}`,
};

export default apiEndpoints;
