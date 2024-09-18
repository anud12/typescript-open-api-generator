import {templateString} from "../helper/templateString";

export const fetchTemplate = () => {
  return templateString()`
const notImplemented:any = () => {
  throw Error("Not implemented")
}

type ClientType = {
  call: typeof fetch
}

export const fetcher: ClientType = {
  call: notImplemented
};

  `
}
