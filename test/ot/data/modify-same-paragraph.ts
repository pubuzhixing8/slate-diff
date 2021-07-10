const old = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode' }
        ]
    }
];
const newA = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode 前端' }
        ]
    }
];
const newB = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode 后端' }
        ]
    }
];
const expected = [
    {
        offset: 8,
        path: [
            0,
            0,
        ],
        text: " 前端",
        type: "insert_text",
    },
    {
        offset: 11,
        path: [
            0,
            0,
        ],
        text: " 后端",
        type: "insert_text",
    },
];
export { old, newA, newB, expected };