// @/lib/units-cache.ts
import { Unit } from '@/api/stock';
import * as unitsApi from '@/api/unit';

let unitsCache: Unit[] = [];
let unitsPromise: Promise<Unit[]> | null = null;

export const getUnits = async (): Promise<Unit[]> => {
  if (unitsCache.length > 0) {
    return unitsCache;
  }

  if (unitsPromise) {
    return unitsPromise;
  }

  unitsPromise = unitsApi.getUnits().then((units) => {
    unitsCache = units;
    unitsPromise = null;
    return units;
  });

  return unitsPromise;
};

export const getUnitById = (id: string): Unit | undefined => {
  return unitsCache.find((u) => u._id === id);
};

export const clearUnitsCache = () => {
  unitsCache = [];
  unitsPromise = null;
};