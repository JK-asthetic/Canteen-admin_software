import apiClient from "./apiclient";
export interface ServerTime {
  serverTime: string;
  istTime: string;
  istDate: string;
  utcStartOfDay: string;
  timezone: string;
  offset: string;
}

export const getCurrentServerTime = async (): Promise<ServerTime> => {
  return await apiClient.get('/time/current');
};