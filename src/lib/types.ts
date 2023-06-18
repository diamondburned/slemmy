import { LemmyHttp } from "lemmy-js-client"

export type Profile = {
  instance: {
    url: string
    name?: string
    icon?: string
  }
  user?: {
    name: string
    jwt: string

    avatar?: string
    display_name?: string
  }
}

export type Settings = {
  autoLogin?: boolean
}

// LemmyHTTP is an alias for LemmyHttp.
export class LemmyHTTP extends LemmyHttp {}
