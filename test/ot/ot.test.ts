import { Changeset } from '../../src/utils/changeset';
import { dmp } from '../../src/utils/dmp';
import { slateOperationalTransformation } from '../../src/slate-ot';
import * as modifyDifferentParagraph from './data/modify-different-paragraph';
import * as modifySameParagraph from './data/modify-same-paragraph';
import * as insertTextDifferentOffset from './data/insert-text-different-offset-paragraph';
import * as removeTextInsertTextParagraph from './data/remove-text-insert-text-paragraph';
import * as removeTextInsertTextParagraph2 from './data/remove-text-insert-text-paragraph2';


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

describe('slateOperationalTransformation', () => {
    test('modify-different-paragraph', () => {
        const operations = slateOperationalTransformation(modifyDifferentParagraph.old, modifyDifferentParagraph.newA, modifyDifferentParagraph.newB);
        expect(operations).toStrictEqual(modifyDifferentParagraph.expected);
    });
    test('modify-same-paragraph', () => {
        const operations = slateOperationalTransformation(modifySameParagraph.old, modifySameParagraph.newA, modifySameParagraph.newB);
        expect(operations).toStrictEqual(modifySameParagraph.expected);
    });
    test('insert-text-different-offset-paragraph', () => {
        const operations = slateOperationalTransformation(insertTextDifferentOffset.old, insertTextDifferentOffset.newA, insertTextDifferentOffset.newB);
        expect(operations).toStrictEqual(insertTextDifferentOffset.expected);
    });
    test('remove-text-insert-text-paragraph', () => {
        const operations = slateOperationalTransformation(removeTextInsertTextParagraph.old, removeTextInsertTextParagraph.newA, removeTextInsertTextParagraph.newB);
        expect(operations).toStrictEqual(removeTextInsertTextParagraph.expected);
    });
    test('remove-text-insert-text-paragraph2', () => {
        const operations = slateOperationalTransformation(removeTextInsertTextParagraph2.old, removeTextInsertTextParagraph2.newA, removeTextInsertTextParagraph2.newB);
        expect(operations).toStrictEqual(removeTextInsertTextParagraph2.expected);
    });
});