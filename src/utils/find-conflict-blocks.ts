import { StringCharMapping } from "string-char-mapping";
import { diffNodes } from "./diff-nodes";
import { stringToNodes } from "./string-to-nodes";

export function findConflictBlocks(diffA: any[], diffB: any[], stringCharMapping: StringCharMapping) {
    let i = 0;
    const sameBlockModify = new Map<string, any>();
    while (i < diffA.length) {
        const chunk = diffA[i];
        const op = chunk[0]; // -1 = delete, 0 = leave unchanged, 1 = insert
        const val = chunk[1];
        if (op === 0) {
            // skip over context diff nodes
            i += 1;
            continue;
        }
        
        if (op === -1 && i < diffA.length - 1 && diffA[i + 1][0] == 1) {
            const nodes = stringToNodes(val, stringCharMapping);
            const nextVal = diffA[i + 1][1];
            const nextNodes = stringToNodes(nextVal, stringCharMapping);
            diffNodes(nodes, nextNodes);

            const sameBlockOp = findSameBlockFromAnotherDiff(diffA[i], diffB);
            if (sameBlockOp) {
                sameBlockModify.set(val, { opA: diffA[i], nextOpA: diffA[i + 1], opB: sameBlockOp.op, nextOpB: sameBlockOp.nextOp })
            }
            i += 2;
            continue;
        }

        if (op === 1) {
            i += 1;
            continue;
        }
        throw Error("BUG1");
    }
    return sameBlockModify;
}

export function findSameBlockFromAnotherDiff(opA, diffB) {
    let i = 0;
    while (i < diffB.length) {
        const chunk = diffB[i];
        const op = chunk[0]; // -1 = delete, 0 = leave unchanged, 1 = insert
        const val = chunk[1];
        if (op === 0) {
            i += 1;
            continue;
        }
        
        if (op === -1 && i < diffB.length - 1 && diffB[i + 1][0] == 1 && val === opA[1]) { // 修改场景
            return { op: diffB[i],  nextOp: diffB[i + 1]};
        } else {
            i += 1;
            continue;
        }
    }
    return null;
}