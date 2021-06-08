import { Node, Operation } from "slate";
import { dmp } from "./utils/dmp";
import { StringCharMapping } from "./string-char-mapping";
import { childrenToStrings } from "./utils/children-to-strings";
import { generateOperations } from "./utils/generate-oprations";

export function slateDiff(
  doc0: Node[],
  doc1: Node[],
  path: number[] = []
): Operation[] {
  const string_mapping = new StringCharMapping();
  // 根节点通过stringify转换为字符串，传入节点数组 返回 字符串数组
  const s0 = childrenToStrings(doc0);
  const s1 = childrenToStrings(doc1);
  // 字符串到字符的映射 StringCharMapping 会存储每一个字符串与字符的映射关系，可以实现反向查找
  const m0 = string_mapping.to_string(s0);
  const m1 = string_mapping.to_string(s1);
  // json转换为字符进行diff 
  const diff = dmp.diff_main(m0, m1);
  return generateOperations(diff, path, string_mapping);
}