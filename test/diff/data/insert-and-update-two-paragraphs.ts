const doc1 = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is the first paragraph.' }
        ],
        key: '1'
    },
    {
        type: 'paragraph',
        children: [
            { text: 'This is the third paragraph.' }
        ],
        key: '3'
    },
    {
        type: 'paragraph',
        children: [
            { text: 'This is the fourth paragraph.' }
        ],
        key: '4'
    }
];
const doc2 = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is the first paragraph.' }
        ],
        key: '1'
    },
    {
        type: 'paragraph',
        children: [
            { text: 'This is the second paragraph.' }
        ],
        key: '2'
    },
    {
        type: 'paragraph',
        children: [
            { text: 'This is the third paragraph, and insert some text.' }
        ],
        key: '3'
    },
    {
        type: 'paragraph',
        children: [
            { text: 'This is the fifth paragraph.' }
        ],
        key: '5'
    },
    {
        type: 'paragraph',
        children: [
            { text: 'This is the fourth paragraph, and insert some text.' }
        ],
        key: '4'
    }
];

const expected = [
    {
        "node": {
            "children": [{ "text": "This is the second paragraph." }],
            "key": "2",
            "type": "paragraph"
        },
        "path": [1],
        "type": "insert_node"
    },
    {
        "offset": 27,
        "path": [2, 0],
        "text": ", and insert some text",
        "type": "insert_text"
    },
    {
        "node": {
            "children": [{ "text": "This is the fifth paragraph." }],
            "key": "5",
            "type": "paragraph"
        },
        "path": [3],
        "type": "insert_node"
    },
    {
        "offset": 28,
        "path": [4, 0],
        "text": ", and insert some text",
        "type": "insert_text"
    }
];

export { doc1, doc2, expected };