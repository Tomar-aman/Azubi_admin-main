import { City, Region, TransformCity, TransformRegionTypeAdd, } from "./city.types";
const convertToAM_PM = (isoTime: Date) => {
  const date = new Date(isoTime);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options);
};
export const transformCities = (cities: City[]): TransformCity[] => {
  return cities.map((city) => ({
    id: city._id.toString(),
    name: city.name,
    region: city.region,
    startTime: convertToAM_PM(new Date(city.startTime)),
    endTime: convertToAM_PM(new Date(city.endTime)),
    address: city.address,
    zipCode: city.zipCode,
    directionLink: city.directionLink,
    status: city.status,
    popular: city.popular,
  }));
};

export const transformRegions = (regions: Region): TransformRegionTypeAdd[] => {
  console.log("regions----", regions);
  return regions?.data?.map((region) => ({
    _id: region._id.toString(),
    id: region._id.toString(),
    name: region.name,
    createdAt: region.createdAt,
    updatedAt: region.updatedAt,
    isDeleted: region.isDeleted,
  }));
};
