import { Operation, Path, Text } from "slate";
import { StringCharMapping } from "string-char-mapping";
import { transformNode } from "../transforms/node";
import { transformTextNodes } from "../transforms/text";
import { diffNodes, NodeRelatedItem } from "./diff-nodes";
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
            const diffResult = diffNodes(nodes, nextNodes);
            diffResult.forEach((item: NodeRelatedItem) => {
              if (item.delete) {
                operations.push({
                  type: "remove_node",
                  path: path.concat([index]),
                  node: item.originNode,
                } as Operation);
              }
              if (item.insert) {
                operations.push({
                  type: "insert_node",
                  path: path.concat([index]),
                  node: item.originNode,
                } as Operation);
                index += 1;
              }
              if (item.relatedNode) {
                operations.push(...transformNode(
                  item.originNode,
                  item.relatedNode,
                  path.concat([index])
                ))
                index += 1;
              }
            });
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