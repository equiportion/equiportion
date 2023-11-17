import Room from '@/logic/models/Room';

class User{
  private rooms: Room[];
  private name: string;
  private matrixId: string;
  private profilePictureURL: string;
  private paymentInformation: string;
  
  constructor(name: string, matrixID: string, profilePictureURL: string, paymentInformation: string, rooms: Room[]) {
    this.name = name;
    this.matrixId = matrixID;
    this.profilePictureURL = profilePictureURL;
    this.paymentInformation = paymentInformation;
    this.rooms = rooms;
  }

  getRooms() {
    return this.rooms;
  }
  getName() {
    return this.name;
  }
  getMatrixId() {
    return this.matrixId;
  }
  getProfilePictureUrl() {
    return this.profilePictureURL;
  }
  getPaymentInformation() {
    return this.paymentInformation;
  }
}