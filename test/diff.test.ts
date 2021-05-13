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
                type: 'heding-two',
                children: [
                    {text: 'adsl'}
                ]
            },
            {
                type: 'heding-one',
                children: [
                    {text: 'adsladsl'}
                ]
            }
        ];
        expect(slateDiff(doc1, doc2)).toBe([]);
    });
});