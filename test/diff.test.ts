import { slateDiff } from "../diff";


describe('diff', () => {
    test('basic', () => {
        const doc1 = [
            {
                type: 'paragraph',
                children: [
                    {text: 'adsl'}
                ]
            }
        ];
        const doc2 = [
            {
                type: 'paragraph',
                children: [
                    {text: 'adsladsl'}
                ]
            }
        ];
        expect(slateDiff(doc1, doc2)).toBe([]);
    });
});