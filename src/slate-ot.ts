import { Node, Path, TextOperation, NodeOperation, Point, Operation } from 'slate';
import { slateDiff } from './slate-diff';

/**
 * 问题1: 非冲突状况下路径更新
 * @param old 
 * @param newA 
 * @param newB 
 * @param path 
 */
export function slateOperationalTransformation(
    old: Node[],
    newA: Node[],
    newB: Node[],
    path: number[] = []
) {
    const operationsA = slateDiff(old, newA, path);
    const operationsB = slateDiff(old, newB, path);

    return transform(operationsA, operationsB);
}

export function transform(operationsA: Operation[], operationsB: Operation[]) {
    const mergedOperations: (NodeOperation | TextOperation)[] = [];

    while (operationsA.length > 0 && operationsB.length > 0) {
        const operationA: NodeOperation | TextOperation = operationsA[0] as any;
        const operationB: NodeOperation | TextOperation = operationsB[0] as any;
        const isEqual = Path.equals(operationA.path, operationB.path);
        if (isEqual) {
            // 处理冲突
            if (operationA.type === 'insert_text' && operationB.type === 'insert_text') {
                mergedOperations.push(operationA);
                operationB.offset = Point.transform({ path: operationB.path, offset: operationB.offset }, operationA)?.offset || 0;
                mergedOperations.push(operationB);
                operationsA.splice(0, 1);
                operationsB.splice(0, 1);
                continue;
            }
            if (operationA.type === 'remove_text' && operationB.type === 'insert_text') {
                const aOffset = operationA.offset;
                const removeLength = operationA.text.length;
                const bOffset = operationB.offset;
                if (bOffset <= aOffset) {
                    mergedOperations.push(operationA);
                    mergedOperations.push(operationB);
                }
                if (bOffset > aOffset && bOffset < aOffset + removeLength) {
                    mergedOperations.push(operationA);
                    operationB.offset = aOffset;
                    mergedOperations.push(operationB);
                }
                if (bOffset >= aOffset + removeLength) {
                    mergedOperations.push(operationA);
                    operationB.offset = Point.transform({ path: operationB.path, offset: operationB.offset }, operationA)?.offset || 0;
                    mergedOperations.push(operationB);
                }
                operationsA.splice(0, 1);
                operationsB.splice(0, 1);
                continue;
            }
            // addMark/removeMark 场景
            // case 1
            // A: PingCode Wiki & Worktile -> PingCode `Wiki` & Worktile
            // B: PingCode Wiki & Worktile -> PingCode` Wiki` & Worktile
            // 这个场景下拆分操作后会对后续的路径可能产生影响（left没有影响、right有影响）
            // set_node 的path：[0, 1] -> [0, 2]
            // 最终的数据：Worktile Wiki & PingCode -> Worktile` ``Wiki` & PingCode
            // 在这个接触上又会进行 normalize
            if (operationA.type === 'split_node' && operationB.type === 'split_node') {
                if (operationA.position < operationB.position) {
                    mergedOperations.push(operationA);
                    const position = { path: operationB.path, offset: operationB.position };
                    const newPosition = Point.transform(position, operationA);
                    mergedOperations.push({ ...operationB, ...newPosition });
                }
                if (operationA.position === operationB.position) {
                    mergedOperations.push(operationA);
                }
                if (operationA.position > operationB.position) {
                    mergedOperations.push(operationA);
                    mergedOperations.push(operationB);
                }
                operationsA.splice(0, 1);
                operationsB.splice(0, 1);
                continue;
            }
            if (operationA.type === 'set_node' && operationB.type === 'set_node') {
                mergedOperations.push(operationA);
                mergedOperations.push(operationB);
                operationsA.splice(0, 1);
                operationsB.splice(0, 1);
            }
        }
        const isFirstA = Path.isBefore(operationA.path, operationB.path);
        if (isFirstA) {
            mergedOperations.push(operationA);
            operationsA.splice(0, 1);
            operationsB.forEach((op) => {
                if ((op as any).path) {
                    (op as any).path = Path.transform((op as any).path, operationA);
                }
            });
        } else {
            mergedOperations.push(operationB);
            operationsB.splice(0, 1);
            operationsA.forEach((op) => {
                if ((op as any).path) {
                    (op as any).path = Path.transform((op as any).path, operationB);
                }
            });
        }
    }

    operationsA.forEach((op) => {
        mergedOperations.push(op as any);
    });

    operationsB.forEach((op) => {
        mergedOperations.push(op as any);
    });
    return mergedOperations;
}
