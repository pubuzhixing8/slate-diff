// We could instead use
//    import * as stringify from "json-stable-stringify";
// which might sometimes avoid a safe "false positive" (i.e., slightly

import { Node } from "slate";

// less efficient patch), but is significantly slower.
const stringify = JSON.stringify;

export function childrenToStrings(children: Node[]): string[] {
  const v: string[] = [];
  for (const node of children) {
    v.push(stringify(node));
  }
  return v;
}