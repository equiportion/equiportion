class InvalidHomeserverUrlError extends Error {
  public log() {
    console.error('Error: Invalid Homeserver Url');
  }
}

export default InvalidHomeserverUrlError;
