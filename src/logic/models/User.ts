import Room from '@/logic/models/Room';

class User{
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

  getRooms(): Room[] {
    return this.rooms;
  }
  getName(): string {
    return this.name;
  }
  getMatrixId(): string {
    return this.matrixId;
  }
  getProfilePictureUrl(): string {
    return this.profilePictureURL;
  }
  getPaymentInformation(): Map<string, string> {
    return this.paymentInformation;
  }
}