import { dmp } from "../../src/utils/dmp";

describe('dmp', () => {
    test('modify BC -> FM', () => {
        const old_text = 'ABCD';
        const new_text = 'AFMD';
        var diff = dmp.diff_main(old_text, new_text);
        expect(JSON.stringify(diff)).toStrictEqual(JSON.stringify([
            {
                0: 0,
                1: "A"
            },
            {
                0: -1,
                1: "BC"
            },
            {
                0: 1,
                1: 'FM'
            },
            {
                0: 0,
                1: "D"
            }
        ]));
    });
    test('insert E and modify BC -> FM', () => {
        const old_text = 'ABCD';
        const new_text = 'AEFMD';
        var diff = dmp.diff_main(old_text, new_text);
        expect(JSON.stringify(diff)).toStrictEqual(JSON.stringify([
            {
                0: 0,
                1: "A"
            },
            {
                0: -1,
                1: "BC"
            },
            {
                0: 1,
                1: 'EFM'
            },
            {
                0: 0,
                1: "D"
            }
        ]));
    });
});