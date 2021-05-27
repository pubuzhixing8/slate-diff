import { Operation, Path, Text } from "slate";
import { dmp } from "../utils/dmp";
import { getProperties } from "../utils/get-properties";
import { len } from "../utils/len";

interface Op {
    type: "insert_text" | "remove_text";
    offset: number;
    text: string;
}

// Transform some text nodes into some other text nodes.
export function transformTextNodes(
    nodes: Text[],
    nextNodes: Text[],
    path: number[]
): Operation[] {
    if (nodes.length == 0) throw Error("must have at least one nodes");
    if (nextNodes.length == 0) throw Error("must have at least one nextNodes");

    const operations: Operation[] = [];

    // 匹配nodes合成一个text节点
    let node = nodes[0];
    if (nodes.length > 1) {
        // join together everything in nodes first
        for (let i = 1; i < nodes.length; i++) {
            operations.push({
                type: "merge_node",
                path: Path.next(path),
                position: 0, // make TS happy; seems ignored in source code
                properties: {}, // make TS happy; seems ignored in source code -- probably a typescript error.
            });
            node = { ...node, ...{ text: node.text + nodes[i].text } }; // update text so splitTextNodes can use this below.
        }
    }

    for (const op of splitTextNodes(node, nextNodes, path)) {
        operations.push(op);
    }

    return operations;
}

function slateTextDiff(a: string, b: string): Op[] {
    const diff = dmp.diff_main(a, b);

    const operations: Op[] = [];

    let offset = 0;
    let i = 0;
    while (i < diff.length) {
        const chunk = diff[i];
        const op = chunk[0]; // -1 = delete, 0 = leave unchanged, 1 = insert
        const text = chunk[1];
        if (op === 0) {
            // skip over context, since this diff applies cleanly
            offset += text.length;
        } else if (op === -1) {
            // remove some text.
            operations.push({ type: "remove_text", offset, text });
        } else if (op == 1) {
            // insert some text
            operations.push({ type: "insert_text", offset, text });
            offset += text.length;
        }
        i += 1;
    }
    //console.log("slateTextDiff", { a, b, diff, operations });

    return operations;
}

/* Accomplish something like this

node={"text":"xyz A **B** C"} ->
               split={"text":"A "} {"text":"B","bold":true} {"text":" C"}

via a combination of remove_text/insert_text as above and split_node
operations.
*/

function splitTextNodes(
    node: Text,
    split: Text[],
    path: number[] // the path to node.
): Operation[] {
    if (split.length == 0) {
        // easy special case
        return [
            {
                type: "remove_node",
                node,
                path,
            },
        ];
    }
    // 首先处理文本 生成模式text字符串转换成目标text字符串的操作
    // First operation: transform the text node to the concatenation of result.
    let splitText = "";
    for (const { text } of split) {
        splitText += text;
    }
    const nodeText = node.text;
    const operations: Operation[] = [];
    if (splitText != nodeText) {
        // Use diff-match-pach to transform the text in the source node to equal
        // the text in the sequence of target nodes.  Once we do this transform,
        // we can then worry about splitting up the resulting source node.
        for (const op of slateTextDiff(nodeText, splitText)) {
            // TODO: maybe path has to be changed if there are multiple OPS?
            operations.push({ ...{ path }, ...op });
        }
    }

    // Set properties on initial text to be those for split[0], if necessary.
    const newProperties = getProperties(split[0], node);
    if (len(newProperties) > 0) {
        operations.push({
            type: "set_node",
            path,
            properties: getProperties(node),
            newProperties,
        });
    }
    let properties = getProperties(split[0]);
    // Rest of the operations to split up node as required.
    let splitPath = path;
    for (let i = 0; i < split.length - 1; i++) {
        const part = split[i];
        const nextPart = split[i + 1];
        const newProperties = getProperties(nextPart, properties);

        operations.push({
            type: "split_node",
            path: splitPath,
            position: part.text.length,
            properties: newProperties,
        });

        splitPath = Path.next(splitPath);
        properties = getProperties(nextPart);
    }
    return operations;
}

/*
NOTE: the set_node api lets you delete properties by setting
them to null, but the split_node api doesn't (I guess Ian forgot to
implement that... or there is a good reason).  So if there are any
property deletes, then we have to also do a set_node... or just be
ok with undefined values.  For text where values are treated as
booleans, this is fine and that's what we do.   Maybe the reason
is just to keep the operations simple and minimal.
Also setting to undefined / false-ish for a *text* node property
is equivalent to not having it regarding everything else.
*/
