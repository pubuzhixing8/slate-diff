const doc1 = [
    {
        "type": "paragraph",
        "children": [
            {
                "text": "PingCode",
                "bold": true
            },
            {
                "text": " & "
            },
            {
                "text": "Worktile",
                "bold": true
            }
        ]
    }
];
const doc2 = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode' }
        ]
    }
];

const expected = [
    {
        type: 'merge_node',
        path: [0, 1],
        position: 0,
        properties: {}
    },
    {
        type: 'merge_node',
        path: [0, 1],
        position: 0,
        properties: {}
    },
    {
        type: 'remove_text',
        path: [0, 0],
        offset: 8,
        text: ' & Worktile'
    },
    {
        type: 'set_node',
        path: [0, 0],
        properties: {
            bold: true
        },
        newProperties: {
            bold: undefined
        }
    }
];

export { doc1, doc2, expected };