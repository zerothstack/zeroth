export function initializeRelationMap(target: any) {
  if (!target.__relations) {
    target.__relations = new Map();
  }
}

export * from './hasOne.decorator';
export * from './hasMany.decorator';
