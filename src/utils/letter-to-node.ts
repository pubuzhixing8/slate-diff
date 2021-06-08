import { StringCharMapping } from "string-char-mapping";
import { Node } from 'slate';

export function letterToNode(x: string, stringMapping: StringCharMapping): Node {
    const node = JSON.parse(stringMapping._to_string[x]);
    if (node == null) {
        throw Error("letterToNode: bug");
    }
    return node;
}