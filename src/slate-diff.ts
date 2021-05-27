import { Node, Operation, Text } from "slate";
import { dmp } from "./utils/dmp";
import { StringCharMapping } from "./string-char-mapping";
import { childrenToStrings } from "./utils/children-to-strings";
import { transformTextNodes } from "./transforms/text";
import { transformNode } from "./transforms/node";

export function slateDiff(
  doc0: Node[],
  doc1: Node[],
  path: number[] = []
): Operation[] {
  const string_mapping = new StringCharMapping();
  // 根节点通过stringify转换为字符串，传入节点数组 返回 字符串数组
  const s0 = childrenToStrings(doc0);
  const s1 = childrenToStrings(doc1);
  // 字符串到字符的映射 StringCharMapping 会存储每一个字符串与字符的映射关系，可以实现反向查找
  const m0 = string_mapping.to_string(s0);
  const m1 = string_mapping.to_string(s1);
  // json转换为字符进行diff 
  const diff = dmp.diff_main(m0, m1);
  const operations: Operation[] = [];

  function letterToNode(x: string): Node {
    const node = JSON.parse(string_mapping._to_string[x]);
    if (node == null) {
      throw Error("letterToNode: bug");
    }
    return node;
  }

  function stringToNodes(s: string): Node[] {
    const nodes: Node[] = [];
    for (const x of s) {
      nodes.push(letterToNode(x));
    }
    return nodes;
  }

  let index = 0;
  let i = 0;
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
    const nodes = stringToNodes(val);
    if (op === -1) {
      if (i < diff.length - 1 && diff[i + 1][0] == 1) {
        // next one is an insert, so this is really a "replace".
        const nextVal = diff[i + 1][1];
        const nextNodes = stringToNodes(nextVal);
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

export function slatePatch() {
  
}