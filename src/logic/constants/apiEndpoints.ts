const apiEndpoints = {
  whoami: '/_matrix/client/v3/account/whoami',
  sync: '/_matrix/client/v3/sync',
  profile: (userId: string) => {
    return `/_matrix/client/v3/profile/${userId}`;
  },
  putStateEvent: (roomId: string, eventType: string, stateKey: string) => {
    return `/_matrix/client/v3/rooms/${roomId}/state/${eventType}/${stateKey}`;
  },
  thumbnailGet: (serverName: string, mediaId: string, width: number, height: number, method: string) => {
    return `/_matrix/media/v3/thumbnail/${serverName}/${mediaId}?width=${width}&height=${height}&method=${method}`;
  },
};

export default apiEndpoints;
