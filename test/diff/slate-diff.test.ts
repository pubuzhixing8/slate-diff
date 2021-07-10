import { slateDiff } from "../../src/slate-diff";
import * as insertText from './data/insert-text';
import * as addMark from './data/add-mark';
import * as insertTextAndAddMark from './data/insert-text-add-mark';
import * as mergeText from './data/merge-text';
import * as insertAndUpdateParagraph from './data/insert-and-update-paragraph';
import * as insertAndUpdateTwoParagraphs from './data/insert-and-update-two-paragraphs';

describe('slate-diff', () => {
    test('insert-text', () => {
        expect(slateDiff(insertText.doc1, insertText.doc2)).toStrictEqual(insertText.expected);
    });

    test('add-mark', () => {
        expect(slateDiff(addMark.doc1, addMark.doc2)).toStrictEqual(addMark.expected);
    })

    test('insert-text-and-add-mark', () => {
        expect(slateDiff(insertTextAndAddMark.doc1, insertTextAndAddMark.doc2)).toStrictEqual(insertTextAndAddMark.expected);
    });

    test('merge-text', () => {
        expect(slateDiff(mergeText.doc1, mergeText.doc2)).toStrictEqual(mergeText.expected);
    });

    test('insert-and-update-paragraph', () => {
        const diff = slateDiff(insertAndUpdateParagraph.doc1, insertAndUpdateParagraph.doc2);
        expect(diff).toStrictEqual(insertAndUpdateParagraph.expected);
    });

    test('insert-and-update-two-paragraphs', () => {
        const diff = slateDiff(insertAndUpdateTwoParagraphs.doc1, insertAndUpdateTwoParagraphs.doc2);
        expect(diff).toStrictEqual(insertAndUpdateTwoParagraphs.expected);
    });
});