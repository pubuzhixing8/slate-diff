import { Changeset } from '../../src/utils/changeset';
import { dmp } from '../../src/utils/dmp';

describe('changeset', () => {
    test('modify same char', () => {
        const old_text = 'AA';
        const a_new_text = 'AB';
        const b_new_text = 'AC';
        var diffA = dmp.diff_main(old_text, a_new_text);
        var diffB = dmp.diff_main(old_text, b_new_text);

        var csA = Changeset.fromDiff(diffA);
        var csB = Changeset.fromDiff(diffB);  
        var csB_new = csB.transformAgainst(csA); //这里这就是操作转换
        var textA_new = csA.apply(old_text);
        const results = csB_new.apply(textA_new);
        expect(results).toBe('ABC');
    })
    test('modify same char', () => {
        const old_text = 'AA BBB';
        const a_new_text = 'BBB CC';
        const b_new_text = 'AA DD';
        var diffA = dmp.diff_main(old_text, a_new_text);
        var diffB = dmp.diff_main(old_text, b_new_text);

        var csA = Changeset.fromDiff(diffA);
        var csB = Changeset.fromDiff(diffB);  
        var csB_new = csB.transformAgainst(csA); //这里这就是操作转换
        var textA_new = csA.apply(old_text);
        const results = csB_new.apply(textA_new);
        expect(results).toBe(' CCDD');
    })
});