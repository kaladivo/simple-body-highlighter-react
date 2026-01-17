import React, { useCallback, useMemo } from "react";

import { bodyFront, BodyPartAsset } from "./assets/bodyFront";
import { bodyBack } from "./assets/bodyBack";
import { bodyFemaleFront } from "./assets/bodyFemaleFront";
import { bodyFemaleBack } from "./assets/bodyFemaleBack";
import { SvgMaleWrapper } from "./components/SvgMaleWrapper";
import { SvgFemaleWrapper } from "./components/SvgFemaleWrapper";
import { BodyPartSlug, BodyPartData, ModelProps } from "./types";

// Export types
export type { BodyPartSlug, BodyPartData, ModelProps } from "./types";

const Body = ({
  data = [],
  onClick,
  gender = "male",
  side = "front",
  scale = 1,
  border = "#dfdfdf",
  disabledParts = [],
  hiddenParts = [],
  defaultFill = "#3f3f3f",
}: ModelProps) => {
  // Create a Map for O(1) color lookup
  const colorMap = useMemo(() => {
    const map = new Map<BodyPartSlug, string>();
    data.forEach((item) => map.set(item.slug, item.color));
    return map;
  }, [data]);

  const getColor = useCallback(
    (slug: BodyPartSlug): string => {
      if (disabledParts.includes(slug)) return "#EBEBE4";
      return colorMap.get(slug) ?? defaultFill;
    },
    [colorMap, disabledParts, defaultFill]
  );

  const getAssets = (): BodyPartAsset[] => {
    if (gender === "female") {
      return side === "front" ? bodyFemaleFront : bodyFemaleBack;
    }
    return side === "front" ? bodyFront : bodyBack;
  };

  const renderBodySvg = (assets: BodyPartAsset[]) => {
    const SvgWrapper = gender === "male" ? SvgMaleWrapper : SvgFemaleWrapper;

    return (
      <SvgWrapper side={side} scale={scale} border={border}>
        {assets.map((part) => {
          if (hiddenParts.includes(part.slug)) return null;

          const isDisabled = disabledParts.includes(part.slug);
          const fillColor = getColor(part.slug);

          return part.pathData.map((pathD, index) => (
            <path
              key={`${part.slug}-${index}`}
              d={pathD}
              fill={fillColor}
              onClick={
                isDisabled ? undefined : (e) => onClick?.(part.slug, e)
              }
              style={{ cursor: isDisabled ? "default" : "pointer" }}
              aria-disabled={isDisabled || undefined}
              data-testid={part.slug}
            />
          ));
        })}
      </SvgWrapper>
    );
  };

  return renderBodySvg(getAssets());
};

export default Body;
export { Body };
