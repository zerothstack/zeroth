// This common export is used so that both the core and the implementing modules
// use the same instance. This is necessary as class-validator does a single export
// of the MetadataStorage class which is used as a singleton. Otherwise, the models
// may register their validations against a different store than what is validated with
export * from 'class-validator';
export {default as validator} from 'class-validator';
