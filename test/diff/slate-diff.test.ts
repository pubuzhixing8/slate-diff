import { slateDiff } from "../../src/slate-diff";
import * as insertText from './data/insert-text';
import * as setTextMark from './data/set-text-mark';
import * as mergeText from './data/merge-text';
import * as insertAndUpdateParagraph from './data/insert-and-update-paragraph';

describe('slate-diff', () => {
    test('insert-text', () => {
        expect(slateDiff(insertText.doc1, insertText.doc2)).toStrictEqual(insertText.expected);
    });

    test('set-text-mark', () => {
        expect(slateDiff(setTextMark.doc1, setTextMark.doc2)).toStrictEqual(setTextMark.expected);
    });

    test('merge-text', () => {
        expect(slateDiff(mergeText.doc1, mergeText.doc2)).toStrictEqual(mergeText.expected);
    });

    test('insert-and-update-paragraph', () => {
        const diff = slateDiff(insertAndUpdateParagraph.doc1, insertAndUpdateParagraph.doc2);
        expect(diff).toStrictEqual(insertAndUpdateParagraph.expected);
    });
});