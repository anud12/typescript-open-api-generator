import {describe} from "@jest/globals";
import {helper} from "./_helpers/helper";

const paths = {
  "/requestPath": {
    "get": {
      "tags": [
        "ControllerName"
      ],
      "operationId": "operationName",
      "parameters": [],
      "responses": {}
    },
  },
  "/secondRequestPath": {
    "get": {
      "tags": [
        "ControllerName"
      ],
      "operationId": "secondOperationName",
      "parameters": [],
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

const urlBuilder = () => {
  return `/requestPath`;
}

export const ControllerName_operationName = () => {
  return fetcher.call(urlBuilder(), {
    method: "GET",
  })
}
*/
///Expected-End

///Expected: ./ControllerName_secondOperationName.ts
/*
import {fetcher} from "./_fetcher";

const urlBuilder = () => {
  return `/secondRequestPath`;
}

export const ControllerName_secondOperationName = () => {
  return fetcher.call(urlBuilder(), {
    method: "GET",
  })
}
*/
///Expected-End