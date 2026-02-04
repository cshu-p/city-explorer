import { apiFetch } from "./http";

export type CityResponse = { 
    regionID: number;
    sizeRank: number;
    regionName: string;
    regionType: string;
    state: string;
    metro: string;
    countyName: string;
    rent: number;
};


export async function searchCityByName(regionName: string): Promise<CityResponse> {
  const qs = new URLSearchParams({ regionName }).toString();
  return apiFetch<CityResponse>(`/api/city?${qs}`, {
    method: "GET",
  })
}

// export type RegisterRequest = {
//   username: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// };


