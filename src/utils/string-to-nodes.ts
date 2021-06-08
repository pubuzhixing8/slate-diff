import { StringCharMapping } from "string-char-mapping";
import { letterToNode } from "./letter-to-node";
import { Node } from 'slate';

export function stringToNodes(s: string, stringMapping: StringCharMapping): Node[] {
    const nodes: Node[] = [];
    for (const x of s) {
        nodes.push(letterToNode(x, stringMapping));
    }
    return nodes;
}