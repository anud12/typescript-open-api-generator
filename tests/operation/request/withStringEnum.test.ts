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
          "application/json": {
            "schema": {
              "type": "string",
              "enum": [
                "VALUE1",
                "VALUE2",
              ]
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

const urlBuilder = () => {
  return `/requestPath`;
}

export const ControllerName_operationName = (body: "VALUE1" | "VALUE2") => {
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
