const doc1 = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode' }
        ]
    }
];
const doc2 = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode & Worktile' }
        ]
    }
];

const expected = [
    {
        type: 'insert_text',
        path: [0, 0],
        offset: 8,
        text: " & Worktile"
    }
];

export { doc1, doc2, expected };