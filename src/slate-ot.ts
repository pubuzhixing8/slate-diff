import { Node } from 'slate';
import { dmp } from './utils/dmp';
import { StringCharMapping } from './string-char-mapping';
import { childrenToStrings } from './utils/children-to-strings';
import { Changeset } from './utils/changeset';
import { generateOperations } from './utils/generate-oprations';

export function slateOperationalTransformation(
    old: Node[],
    newA: Node[],
    newB: Node[],
    path: number[] = []
) {
    const string_mapping = new StringCharMapping();
    // 根节点通过stringify转换为字符串，传入节点数组 返回 字符串数组
    const oldStrings = childrenToStrings(old);
    const newAStrings = childrenToStrings(newA);
    const newBStrings = childrenToStrings(newB);
    // 字符串到字符的映射 StringCharMapping 会存储每一个字符串与字符的映射关系，可以实现反向查找
    const oldString = string_mapping.to_string(oldStrings);
    const newAString = string_mapping.to_string(newAStrings);
    const newBString = string_mapping.to_string(newBStrings);
    // json转换为字符进行diff 
    const diffA = dmp.diff_main(oldString, newAString);
    const diffB = dmp.diff_main(oldString, newBString);

    var csA = Changeset.fromDiff(diffA);
    var csB = Changeset.fromDiff(diffB);
    var csBNew = csB.transformAgainst(csA); //这里这就是操作转换
    var csANew = csA.apply(oldString);
    const results = csBNew.apply(csANew);

    

    // json转换为字符进行diff 
    const diff = dmp.diff_main(oldString, results);
    return generateOperations(diff, path, string_mapping);
}
