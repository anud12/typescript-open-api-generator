import {describe} from "@jest/globals";
import {helper} from "../_helpers/helper";

const paths = {
  "/requestPath/": {
    "get": {
      "tags": [
        "ControllerName"
      ],
      "operationId": "operationName",
      "parameters": [
        {
          "name": "optionalQueryParentId",
          "in": "query",
          "required": false,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "optionalQueryOptionalId",
          "in": "query",
          "required": false,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {}
    },
  }
}

const components:any = {
  schemas: {}
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

const urlBuilder = (parameters: {
    optionalQueryParentId?: string | number,
    optionalQueryOptionalId?: string | number,
  }) => {
  const query = [];
  if(parameters.optionalQueryParentId !== undefined && parameters.optionalQueryParentId !== null) {
    query.push(`optionalQueryParentId=${parameters.optionalQueryParentId}`);
  }
  if(parameters.optionalQueryOptionalId !== undefined && parameters.optionalQueryOptionalId !== null) {
    query.push(`optionalQueryOptionalId=${parameters.optionalQueryOptionalId}`);
  }
  if(query.length) {
    return `/requestPath/?${query.join("&")}`;
  }
  return `/requestPath/`;
}

export const ControllerName_operationName = (parameters: {
    optionalQueryParentId?: string | number,
    optionalQueryOptionalId?: string | number,
  }) => {
  return fetcher.call(urlBuilder(parameters), {
    method: "GET",
  })
}
*/
///Expected-End
