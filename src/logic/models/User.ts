/**
 * A matrix user. Can be either the current logged in user or any member of any joined room.
 * @author Jakob Gießibl
 * @author Philipp Stappert
 */
class User {
  private userId: string;
  private displayname?: string;
  private avatarUrl?: string;

  /**
   * Creates a new user using the given parameters.
   * @param {string} userId the user's userId, required
   * @param {string} [displayname] the user's displayname (optional)
   * @param {string} [avatarUrl] the user's avatar url (optional)
   */
  constructor(userId: string, displayname?: string, avatarUrl?: string) {
    this.userId = userId;
    this.displayname = displayname;
    this.avatarUrl = avatarUrl;
  }

  /**
   * Gets this user's userId.
   * @returns {string} the userId
   */
  public getUserId(): string {
    return this.userId;
  }

  /**
   * Sets this user's userId.
   * @param {string} userId the new userId
   * @returns {boolean} true if the userId was set, else false
   */
  public setUserId(userId: string): boolean {
    if (this.userId != '' || userId == '') {
      return false;
    }

    this.userId = userId;
    return true;
  }

  /**
   * Gets this user's displayname.
   * @returns {string|undefined} the displayname if set, else undefined
   */
  public getDisplayname(): string | undefined {
    return this.displayname;
  }

  /**
   * Sets this user's displayname.
   * @param {string} [displayname] the new displayname (optional)
   */
  public setDisplayname(displayname?: string): void {
    this.displayname = displayname;
  }

  /**
   * Gets this user's avatarUrl.
   * @returns {string|undefined} the avatarUrl if set, else undefined
   */
  public getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  /**
   * Sets this user's avatarUrl.
   * @param {string} [avatarUrl] the new avatarUrl (optional)
   */
  public setAvatarUrl(avatarUrl?: string): void {
    this.avatarUrl = avatarUrl;
  }
}

export default User;
