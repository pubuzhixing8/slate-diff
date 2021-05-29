const old = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode' }
        ]
    },
    {
        type: 'paragraph',
        children: [
            { text: 'Worktile' }
        ]
    }
];
const newA = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode 前端' }
        ]
    },
    {
        type: 'paragraph',
        children: [
            { text: 'Worktile' }
        ]
    }
];
const newB = [
    {
        type: 'paragraph',
        children: [
            { text: 'PingCode' }
        ]
    },
    {
        type: 'paragraph',
        children: [
            { text: 'Worktile 后端' }
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
        offset: 8,
        path: [
            1,
            0,
        ],
        text: " 后端",
        type: "insert_text",
    }
];
export { old, newA, newB, expected };