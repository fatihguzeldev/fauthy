export interface Device {
  deviceName: string;
  secret: string;
  createdAt: string;
  tag?: string;
}

export interface DisplayDevice extends Device {
  token: string;
  remainingTime: string;
}
