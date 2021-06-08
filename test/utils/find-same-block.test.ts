import { dmp } from '../../src/utils/dmp';
import { findSameDiff } from '../../src/utils/find-same-diff';


describe('find modified same diff operations', () => {
    test('modify A -> B and A -> C', () => {
        const old_text = 'ADD';
        const a_new_text = 'BDD';
        const b_new_text = 'CDD';
        var diffA = dmp.diff_main(old_text, a_new_text);
        var diffB = dmp.diff_main(old_text, b_new_text);
        const findSameBlock3 = findSameDiff(diffA, diffB);
        const expected = {
            opA: { 0: -1, 1: 'A'},
            nextOpA: { 0: 1, 1: 'B' },
            opB: { 0: -1, 1: 'A' },
            nextOpB: { 0: 1, 1: 'C' }
        };
        expect(JSON.stringify(findSameBlock3.get('A'))).toStrictEqual(JSON.stringify(expected));
    })
    // test('modify B -> DE and B -> MN case 2', () => {
    //     const old_text = 'ABC';
    //     const a_new_text = 'ADEC';
    //     const b_new_text = 'AMNC';
    //     var diffA = dmp.diff_main(old_text, a_new_text);
    //     var diffB = dmp.diff_main(old_text, b_new_text);
    //     const findSameBlock3 = findSameDiff(diffA, diffB);
    //     const expected = {
    //         opA: diffA[0],
    //         nextOpA: diffA[1],
    //         opB: diffB[0],
    //         nextOpB: diffB[1]
    //     };
    //     expect(findSameBlock3.get('A')).toStrictEqual(expected);
    // })
    // test('modify A -> B and A -> C case 3', () => {
    //     const old_text = 'AEE';
    //     const a_new_text = 'DDBEE';
    //     const b_new_text = 'FFCEE';
    //     var diffA = dmp.diff_main(old_text, a_new_text);
    //     var diffB = dmp.diff_main(old_text, b_new_text);
    //     const findSameBlock3 = findSameDiff(diffA, diffB);
    //     const expected = {
    //         opA: diffA[0],
    //         nextOpA: diffA[1],
    //         opB: diffB[0],
    //         nextOpB: diffB[1]
    //     };
    //     expect(findSameBlock3.get('A')).toStrictEqual(expected);
    // })
});