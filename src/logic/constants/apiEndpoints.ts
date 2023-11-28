const apiEndpoints = {
  whoami: '/_matrix/client/v3/account/whoami',
  sync: '/_matrix/client/v3/sync',
  profile: (userId: string) => {
    return `/_matrix/client/v3/profile/${userId}`;
  },
  putStateEvent: (roomId: string, eventType: string, stateKey: string) => {
    return `/_matrix/client/v3/rooms/${roomId}/state/${eventType}/${stateKey}`;
  },
};

export default apiEndpoints;
