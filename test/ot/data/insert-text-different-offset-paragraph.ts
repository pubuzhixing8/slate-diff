const old = [
    {
        type: 'paragraph',
        children: [
            { text: 'Worktile & PingCode' }
        ]
    }
];
const newA = [
    {
        type: 'paragraph',
        children: [
            { text: 'Worktile 前端 & PingCode' }
        ]
    }
];
const newB = [
    {
        type: 'paragraph',
        children: [
            { text: 'Worktile & PingCode 后端' }
        ]
    }
];
const expected = [
    {
        "offset": 9,
        "path": [
            0,
            0,
        ],
        "text": "前端 ",
        "type": "insert_text",
    },
    {
        "offset": 22,
        "path": [
            0,
            0,
        ],
        "text": " 后端",
        "type": "insert_text",
    }
];
export { old, newA, newB, expected };