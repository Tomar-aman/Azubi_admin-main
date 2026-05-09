import { ApplicationTip, TransformApplicationTip } from "./tip.types";

export const transformApplicationTips = (
  tips: ApplicationTip[]
): TransformApplicationTip[] => {
  return tips.map((tip) => ({
    id: tip._id,
    title: tip.title,
    description: tip.description,
  }));
};
