import { isEqual } from 'lodash';
import { Node, Element, Text } from 'slate';
import { copyWithout } from './copy-without';

export function diffNodes(originNodes: Node[], targetNodes: Node[]) {
    const result: NodeRelatedItem[] = [];
    let relatedNode: Node | undefined;
    let leftTargetNodes: Node[] = [...targetNodes];
    originNodes.forEach((originNode: Node) => {
        let childrenUpdated = false;
        let nodeUpdated = false;
        relatedNode = leftTargetNodes.find((targetNode: Node) => {
            if (isEqualNode(originNode, targetNode)) {
                childrenUpdated = true;
            }
            if (isEqualNodeChildren(originNode, targetNode)) {
                nodeUpdated = true;
            }
            return nodeUpdated || childrenUpdated;
        });
        if (relatedNode) {
            const insertNodes = leftTargetNodes.splice(0, leftTargetNodes.indexOf(relatedNode));
            insertNodes.forEach((insertNode) => {
                result.push({
                    originNode: insertNode,
                    insert: true
                });
            });
            leftTargetNodes.splice(0, 1);
        }
        result.push({
            originNode,
            relatedNode,
            childrenUpdated,
            nodeUpdated,
            delete: !relatedNode
        });
    });
    leftTargetNodes.forEach((insertNode) => {
        result.push({
            originNode: insertNode,
            insert: true
        });
    });
    return result;
}

export type NodeRelatedItem = {
    originNode: Node;
    relatedNode?: Node;
    childrenUpdated?: boolean;
    nodeUpdated?: boolean;
    insert?: boolean;
    delete?: boolean;
}

export function isEqualNode(value: Node, other: Node) {
    return Element.isElement(value) && Element.isElement(other) && value.children !== null && other.children !== null && isEqual(
        copyWithout(value, ["children"]),
        copyWithout(other, ["children"])
    );
}

export function isEqualNodeChildren(value: Node, other: Node) {
    if (Element.isElement(value) && Element.isElement(other) && isEqual(value.children, other.children)) {
        return true;
    }
    if (Text.isText(value) && Text.isText(other) && isEqual(value.text, other.text)) {
        return true
    }
    return false;
}