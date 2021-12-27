export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export interface DeviceDto {
  _id?: string;
  uid: number;
  vendor?: string;
  createdAt?: Date;
  status: DeviceStatus;
}

export interface GatewayDto {
  _id?: string;
  serialNumber: string;
  name: string;
  ipV4Address: string;
  devices?: DeviceDto[];
}
