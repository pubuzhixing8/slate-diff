import { dmp } from '../../src/utils/dmp';
const old_text = 'PingCode Web';
const other_new_text = 'PingCode Web FE';
const my_new_text = 'Web';

describe('patch', () => {
    test('path_main', () => {
        var patch_list = dmp.patch_make(old_text, other_new_text);
        const expected_patch_list = [
            {
                diffs: [
                    {
                        0: 0,
                        1: "Code Web"
                    },
                    {
                        0: 1,
                        1: " FE"
                    }
                ],
                start1: 4,
                start2: 4,
                length1: 8,
                length2: 11
            }
        ];
        expect(JSON.stringify(patch_list)).toEqual(JSON.stringify(expected_patch_list));
    })
    test('patch_apply', () => {
        var patch_list = dmp.patch_make(old_text, other_new_text);
        var results = dmp.patch_apply(patch_list, my_new_text);
        const expected_result = ["Web FE", [true]];
        expect(JSON.stringify(results)).toEqual(JSON.stringify(expected_result));
    })
});