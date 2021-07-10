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

const expected = [
    {
        type: 'insert_text',
        path: [0, 0],
        offset: 8,
        text: " & Worktile"
    },
    {
        type: 'set_node',
        path: [0, 0],
        properties: {},
        newProperties: {
            bold: true
        }
    },
    {
        type: 'split_node',
        path: [0, 0],
        position: 8,
        properties: {
            bold: undefined
        },
    },
    {
        type: 'split_node',
        path: [0, 1],
        position: 3,
        properties: {
            bold: true
        }
    }
];

export { doc1, doc2, expected };