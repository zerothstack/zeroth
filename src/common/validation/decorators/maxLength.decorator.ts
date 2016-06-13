
export function maxLength(length: number) {
  return (target: any, propertyKey: string) => {
    let type = Reflect.getMetadata("design:type", target, propertyKey);
    console.log(length, type);
  };
}
