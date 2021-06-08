import { Operation, Path, Text, Node } from "slate";
import { StringCharMapping } from "string-char-mapping";
import { transformNode } from "../transforms/node";
import { transformTextNodes } from "../transforms/text";
import { findSameElementFromElements } from "./find-same-block-from-insert-nodes";
import { stringToNodes } from "./string-to-nodes";

export function generateOperations(diff: { 0: number, 1: string}[], path: Path, stringCharMapping: StringCharMapping) {
    let index = 0;
  let i = 0;
    const operations: Operation[] = [];
    while (i < diff.length) {
        const chunk = diff[i];
        const op = chunk[0]; // -1 = delete, 0 = leave unchanged, 1 = insert
        const val = chunk[1];
        if (op === 0) {
          // skip over context diff nodes
          index += val.length;
          i += 1;
          continue;
        }
        const nodes = stringToNodes(val, stringCharMapping);
        if (op === -1) {
          if (i < diff.length - 1 && diff[i + 1][0] == 1) {
            // next one is an insert, so this is really a "replace".
            const nextVal = diff[i + 1][1];
            const nextNodes = stringToNodes(nextVal, stringCharMapping);
            if (Text.isTextList(nodes) && Text.isTextList(nextNodes)) {
              // Every single node involved is a text node.  This can be done
              // via modifying and splitting and joining.
              for (const op of transformTextNodes(
                nodes,
                nextNodes,
                path.concat([index])
              )) {
                operations.push(op);
              }
              index += nextNodes.length;
              i += 2; // this consumed two entries from the diff array.
              continue;
            }

            let originNode: null | Node = null;
            let matchedNode: null | Node = null;
            for (const node of nodes) {
              const matched = findSameElementFromElements(node, nextNodes);
              if (matched) {
                originNode = node;
                matchedNode = matched;
                break;
              }
            }
    
            if (matchedNode && originNode) {
              const originIndex = nodes.indexOf(originNode);
              const matchedIndex = nextNodes.indexOf(matchedNode);
              // delete anything left in nodes
              for (let i = 0; i < originIndex; i++) {
                operations.push({
                  type: "remove_node",
                  path: path.concat([index]),
                  node: nodes[0],
                } as Operation);
                nodes.shift();
              }
              for (let i = 0; i < matchedIndex; i++) {
                operations.push({
                  type: "insert_node",
                  path: path.concat([index]),
                  node: nextNodes[0],
                } as Operation);
                index += 1;
                nextNodes.shift();
              }
            }
    
            while (nodes.length > 0 && nextNodes.length > 0) {
              // replace corresponding node
              for (const op of transformNode(
                nodes[0],
                nextNodes[0],
                path.concat([index])
              )) {
                operations.push(op);
              }
              index += 1;
              nodes.shift();
              nextNodes.shift();
            }
            // delete anything left in nodes
            for (const node of nodes) {
              operations.push({
                type: "remove_node",
                path: path.concat([index]),
                node,
              } as Operation);
            }
            // insert anything left in nextNodes
            for (const node of nextNodes) {
              operations.push({
                type: "insert_node",
                path: path.concat([index]),
                node,
              } as Operation);
              index += 1;
            }
            i += 2; // this consumed two entries from the diff array.
            continue;
          } else {
            // Plain delete of some nodes (with no insert immediately after)
            for (const node of nodes) {
              operations.push({
                type: "remove_node",
                path: path.concat([index]),
                node,
              } as Operation);
            }
            i += 1; // consumes only one entry from diff array.
            continue;
          }
        }
        if (op === 1) {
          // insert new nodes.
          for (const node of nodes) {
            operations.push({
              type: "insert_node",
              path: path.concat([index]),
              node,
            });
            index += 1;
          }
          i += 1;
          continue;
        }
        throw Error("BUG");
      }
    
      return operations;
}