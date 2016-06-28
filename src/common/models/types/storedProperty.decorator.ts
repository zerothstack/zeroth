export function StoredProperty2(target: any, propertyKey: string): void {

  if (!target.constructor.storedProperties) {
    target.constructor.storedProperties = new Map();
  }
  let type = Reflect.getMetadata("design:type", target, propertyKey);
  target.constructor.storedProperties.set(propertyKey, type);
}
