import {describe} from "@jest/globals";
import {helper} from "../_helpers/helper";

const paths = {
  "/requestPath": {
    "get": {
      "tags": [
        "ControllerName"
      ],
      "operationId": "operationName",
      "parameters": [],
      "requestBody": {
        "content": {
          "multipart/form-data": {
            "schema": {
              "$ref": "#/components/schemas/ObjectDto"
            }
          }
        },
        "required": true
      },
      "responses": {}
    },
  }
}

const components:any = {
  schemas: {
    "ObjectDto": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "fileDataProperty": {
          "type": "string",
          "format": "binary"
        }
      }
    }
  }
}

describe(helper.name(__filename), () => {
  helper.test(__filename, paths, components)
});

///Expected: ./_fetcher.ts
/*
const notImplemented:any = () => {
  throw Error("Not implemented")
}

type ClientType = {
  call: typeof fetch
}

export const fetcher: ClientType = {
  call: notImplemented
};
*/
///Expected-End

/////Expected: ./_bodyToFormData.ts
/*
export const bodyToFormData = (body: any): FormData => {
  return Object.entries(body ?? {}).reduce((formData, [key, value]) => {
    const appendTo = (element: unknown) => {
      if(element === undefined) {
        return;
      }
      if(element instanceof Blob) {
        formData.append(key, element);
        return;
      }
      if(typeof element === "string") {
        formData.append(key, element);
        return;
      }
      formData.append(key, JSON.stringify(element));
    }
    if(value instanceof Array) {
      value.forEach(element => appendTo(element));
      return formData;
    }
    appendTo(value);
    return formData;
  }, new FormData())
}
*/
///Expected-End

///Expected: ./ControllerName_operationName.ts
/*
import {fetcher} from "./_fetcher";
import {bodyToFormData} from "./_bodyToFormData";

export type ObjectDto = {
  id: string,
  fileDataProperty: Blob,
}

const urlBuilder = () => {
  return `/requestPath`;
}

export const ControllerName_operationName = (body: ObjectDto) => {
  return fetcher.call(urlBuilder(), {
    method: "GET",
    body: bodyToFormData(body),
    headers: {}
  })
}
*/
///Expected-End
