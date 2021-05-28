import { dmp } from '../../src/utils/dmp';

describe('patch', () => {
    test('path_main', () => {
        const old_text = 'PingCode Web';
        const other_new_text = 'PingCode FE';
        var patch_list = dmp.patch_make(old_text, other_new_text);
        const expected_patch_list = [
            {
                diffs: [
                    {
                        0: 0,
                        1: "ode "
                    },
                    {
                        0: -1,
                        1: "Web"
                    },
                    {
                        0: 1,
                        1: "FE"
                    }
                ],
                start1: 5,
                start2: 5,
                length1: 7,
                length2: 6
            }
        ];
        expect(JSON.stringify(patch_list)).toEqual(JSON.stringify(expected_patch_list));
    })
    test('pathc non-conflicting position modify', () => {
        const old_text = 'PingCode Web';
        const other_new_text = 'PingCode FE';
        const my_new_text = 'Web';
        var patch_list = dmp.patch_make(old_text, other_new_text);
        var results = dmp.patch_apply(patch_list, my_new_text);
        const expected_result = ["FE", [true]];
        expect(JSON.stringify(results)).toEqual(JSON.stringify(expected_result));
    })
    test('patch conflicting changes and keep my new text', () => {
        const old_text = 'PingCode Web';
        const other_new_text = 'PingCode FE';
        const my_new_text = 'Worktile';
        var patch_list = dmp.patch_make(old_text, other_new_text);
        var results = dmp.patch_apply(patch_list, my_new_text);
        const expected_result = ["Worktile", [false]];
        expect(JSON.stringify(results)).toEqual(JSON.stringify(expected_result));
    })
    test('modify same char', () => {
        const old_text = 'AA';
        const other_new_text = 'AB';
        const my_new_text = 'AC';
        var patch_list = dmp.patch_make(old_text, other_new_text);
        var results = dmp.patch_apply(patch_list, my_new_text);
        const expected_result = ["AB", [true]];// this is not expected
        expect(JSON.stringify(results)).toEqual(JSON.stringify(expected_result));
    })
    test('modify same char', () => {
        const old_text = 'AA BBB';
        const other_new_text = 'BBB CC';
        const my_new_text = 'AA DD';
        var patch_list = dmp.patch_make(old_text, other_new_text);
        var results = dmp.patch_apply(patch_list, my_new_text);
        const expected_result = ["DD\u0001 C", [true]];// this is not expected
        expect(JSON.stringify(results)).toEqual(JSON.stringify(expected_result));
    })
});