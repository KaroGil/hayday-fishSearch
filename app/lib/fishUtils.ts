import { Fish } from "./fish";

export const loadFishData = async () => {
  const res = await fetch("/fish.json");
  const data = await res.json();
  return data.fish;
};

export const getFishByName = (data: any[], name: string) => {
  const n = name.toLowerCase();
  return data.filter((f) => f.name.toLowerCase().includes(n));
};

export const getFishBySpot = (data: any[], spot: number) => {
  return data.filter((f) => Array.isArray(f.spots) && f.spots.includes(spot));
};

export const getFishByLure = (data: any[], lure: string) => {
  const l = lure.toLowerCase();
  return data.filter((f) =>
    f.lure.some((lu: string) => lu.toLowerCase().includes(l))
  );
};
