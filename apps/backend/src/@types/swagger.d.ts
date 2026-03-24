import type { SchemaObject } from 'openapi3-ts/oas30';

declare global {
  type SwaggerSchema = {
    request?: SchemaObject,
    response: SchemaObject
  };
}

export {};
