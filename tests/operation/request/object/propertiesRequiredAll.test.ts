import {describe} from "@jest/globals";
import {helper} from "../../_helpers/helper";

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
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ObjectDto",
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
      "required": [
        "id",
        "name",
        "date",
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "date": {
          "type":"string"
        },
        "name": {
          "type": "string"
        },
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

///Expected: ./ControllerName_operationName.ts
/*
import {fetcher} from "./_fetcher";

export type ObjectDto = {
  id: string,
  date: string,
  name: string,
}

const urlBuilder = () => {
  return `/requestPath`;
}

export const ControllerName_operationName = (body: ObjectDto) => {
  return fetcher.call(urlBuilder(), {
    method: "GET",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    }
  })
}
*/
///Expected-End
