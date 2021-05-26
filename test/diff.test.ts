import { slateDiff } from "../diff";
import * as basic from './basic';
import * as addBlock from './add-block';
import * as addTextAndAddMark from './add-text-and-add-mark';


describe('diff', () => {
    test('basic', () => {
        expect(slateDiff(basic.doc1, basic.doc2)).toBe([]);
    });

    test('add block', () => {
        expect(slateDiff(addBlock.doc1, addBlock.doc2)).toBe([]);
    });

    test('add-text-and-add-mark', () => {
        expect(slateDiff(addTextAndAddMark.doc1, addTextAndAddMark.doc2)).toBe([]);
    });
});