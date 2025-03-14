/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "DATABASE_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DIRECT_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GITHUB_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GITHUB_SECRET": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "MyWeb": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
    "NEXTAUTH_SECRET": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "NEXTAUTH_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "NODE_ENV": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "projectManagment": {
      "name": string
      "type": "sst.aws.Bucket"
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}