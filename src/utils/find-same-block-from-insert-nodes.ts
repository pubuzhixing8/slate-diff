import { isEqual } from 'lodash';
import { Node } from 'slate';
import { copyWithout } from './copy-without';

export function findSameElementFromElements(element: Node, elements: Node[]) {
    return elements.find((_element) => element["children"] != null &&
        _element["children"] != null &&
        isEqual(
            copyWithout(element, ["children"]),
            copyWithout(_element, ["children"])
        ))
}