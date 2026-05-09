import { Region, TransformRegion } from "./regionTypes.types";

export const transformJobTypes = (jobTypes: Region[]): TransformRegion[] => {
  return jobTypes.map((jobType) => ({
    id: jobType._id,
    name: jobType.name,
  }));
};
