import Room from '@/logic/models/Room';

export default class User{
  private rooms: Room[];
  private name: string;
  private matrixId: string;
  private profilePictureURL: string;
  private paymentInformation: Map<string, string>;
  
  constructor(name: string, matrixID: string, profilePictureURL: string, paymentInformation: Map<string, string>, rooms: Room[]) {
    this.name = name;
    this.matrixId = matrixID;
    this.profilePictureURL = profilePictureURL;
    this.paymentInformation = paymentInformation;
    this.rooms = rooms;
  }

  public getRooms(): Room[] {
    return this.rooms;
  }
  public getName(): string {
    return this.name;
  }
  public getMatrixId(): string {
    return this.matrixId;
  }
  public getProfilePictureUrl(): string {
    return this.profilePictureURL;
  }
  public getPaymentInformation(provider:string): string {
    if (this.paymentInformation.has(provider)) {
      return this.paymentInformation.get(provider)!;
    } else {
      return "";
    }
  }
}