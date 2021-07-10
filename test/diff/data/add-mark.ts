const doc1 = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode Wiki & Worktile' }
        ]
    }
];
const doc2 = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode ' },
            { text: 'Wiki', bold: true },
            { text: ' & Worktile' }
        ]
    }
];

const expected = [
    {
        path: [0, 0],
        position: 9,
        properties: { bold: true },
        type: 'split_node'
    },
    {
        path: [0, 1],
        position: 4,
        properties: {
            bold: undefined
        },
        type: 'split_node'
    }
];

export { doc1, doc2, expected };