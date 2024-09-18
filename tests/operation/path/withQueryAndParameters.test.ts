import {describe} from "@jest/globals";
import {helper} from "../_helpers/helper";

const paths = {
  "/requestPath/{parentId}/{id}": {
    "get": {
      "tags": [
        "ControllerName"
      ],
      "operationId": "operationName",
      "parameters": [
        {
          "name": "parentId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "queryParentId",
          "in": "query",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "queryId",
          "in": "query",
          "required": true,
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
    parentId: string | number,
    id: string | number,
    queryParentId: string | number,
    queryId: string | number,
  }) => {
  const parentId = parameters.parentId;
  const id = parameters.id;
  const query = [];
  query.push(`queryParentId=${parameters.queryParentId}`);
  query.push(`queryId=${parameters.queryId}`);
  if(query.length) {
    return `/requestPath/${parentId}/${id}?${query.join("&")}`;
  }
  return `/requestPath/${parentId}/${id}`;
}

export const ControllerName_operationName = (parameters: {
    parentId: string | number,
    id: string | number,
    queryParentId: string | number,
    queryId: string | number,
  }) => {
  return fetcher.call(urlBuilder(parameters), {
    method: "GET",
  })
}
*/
///Expected-End
