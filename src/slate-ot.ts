import { Node, Path, TextOperation, NodeOperation } from 'slate';
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

    const mergedOperations: (NodeOperation | TextOperation)[]  = [];

    while (operationsA.length > 0 && operationsB.length > 0) {
        const operationA: NodeOperation | TextOperation = operationsA[0] as any;
        const operationB: NodeOperation | TextOperation = operationsB[0] as any;
        const isEqual = Path.equals(operationA.path, operationB.path);
        if (isEqual) {
            // 处理冲突
            if (operationA.type === 'insert_text' || operationB.type === 'insert_text') {
                if ((operationA as TextOperation).offset === (operationB as TextOperation).offset) {
                    (operationA as TextOperation).text = (operationA as TextOperation).text + (operationB as TextOperation).text;
                    mergedOperations.push(operationA);
                    operationsA.splice(0, 1);
                    operationsB.splice(0, 1);
                }
            }
            continue;
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
