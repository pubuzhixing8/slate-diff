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
            { text: 'Worktile' }
        ]
    }
];
const newB = [
    {
        type: 'paragraph',
        children: [
            { text: 'Worktile & Ping_^_Code' }
        ]
    }
];
const expected = [
    {
        offset: 8,
        path: [0, 0],
        text: ' & PingCode',
        type: 'remove_text'
    },
    {
        offset: 8,
        path: [0, 0],
        text: '_^_',
        type: 'insert_text'
    }
];
export { old, newA, newB, expected };