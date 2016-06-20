
export function primary(target: any, propertyKey: string) {
  if (!target.constructor.storedProperties) {
    target.constructor.storedProperties = new Map();
  }
  let type = Reflect.getMetadata("design:type", target, propertyKey);
  target.constructor.storedProperties.set(propertyKey, type);

  target.constructor.identifierKey = propertyKey;
}
