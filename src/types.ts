export interface Device {
  deviceName: string;
  secret: string;
  createdAt: string;
}

export interface DisplayDevice extends Device {
  token: string;
  remainingTime: string;
}
