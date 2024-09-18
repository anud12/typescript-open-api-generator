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
      "responses": {
        "200": {
          "description": "OK",
          "content": {
            "*/*": {
              "schema": {
                "type": "boolean",
              }
            }
          }
        }
      }
    },
  }
}

const components:any = {
  schemas: {
    "GenericResponse": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "status": {
          "type": "integer",
          "format": "int32"
        },
        "message": {
          "type": "string"
        },
        "type": {
          "type": "string"
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

///Expected: ./ControllerName_operationName.ts
/*
import {fetcher} from "./_fetcher";

const urlBuilder = () => {
  return `/requestPath`;
}

export const ControllerName_operationName = () => {
  return fetcher.call(urlBuilder(), {
    method: "GET",
  })
  .then<boolean>(async value => {
    if(!value.ok){
      throw await value.json();
    }

    if((await value.text()).toLowerCase() === "false") {
      return false;
    }
    return true;

  })
}
*/
///Expected-End
