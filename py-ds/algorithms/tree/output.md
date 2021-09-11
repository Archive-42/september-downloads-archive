
"""
B-tree is used to disk operations. Each node (except root) contains
at least t-1 keys (t children) and at most 2*t - 1 keys (2*t children)
where t is the degree of b-tree. It is not a kind of typical bst tree, because
this tree grows up.
B-tree is balanced which means that the difference between height of left subtree and right subtree is at most 1.

Complexity
    n - number of elements
    t - degree of tree
    Tree always has height at most logt (n+1)/2
    Algorithm        Average        Worst case
    Space            O(n)           O(n)
    Search           O(log n)       O(log n)
    Insert           O(log n)       O(log n)
    Delete           O(log n)       O(log n)
"""


class Node:
    def __init__(self):
        # self.is_leaf = is_leaf
        self.keys = []
        self.children = []

    def __repr__(self):
        return "<id_node: {0}>".format(self.keys)

    @property
    def is_leaf(self):
        return len(self.children) == 0


class BTree:
    def __init__(self, t=2):
        self.min_numbers_of_keys = t - 1
        self.max_number_of_keys = 2 * t - 1

        self.root = Node()

    def _split_child(self, parent: Node, child_index: int):
        new_right_child = Node()
        half_max = self.max_number_of_keys // 2
        child = parent.children[child_index]
        middle_key = child.keys[half_max]
        new_right_child.keys = child.keys[half_max + 1 :]
        child.keys = child.keys[:half_max]
        # child is left child of parent after splitting

        if not child.is_leaf:
            new_right_child.children = child.children[half_max + 1 :]
            child.children = child.children[: half_max + 1]

        parent.keys.insert(child_index, middle_key)
        parent.children.insert(child_index + 1, new_right_child)

    def insert_key(self, key):
        if (
            len(self.root.keys) >= self.max_number_of_keys
        ):  # overflow, tree increases in height
            new_root = Node()
            new_root.children.append(self.root)
            self.root = new_root
            self._split_child(new_root, 0)
            self._insert_to_nonfull_node(self.root, key)
        else:
            self._insert_to_nonfull_node(self.root, key)

    def _insert_to_nonfull_node(self, node: Node, key):
        i = len(node.keys) - 1
        while i >= 0 and node.keys[i] >= key:  # find position where insert key
            i -= 1

        if node.is_leaf:
            node.keys.insert(i + 1, key)
        else:
            if len(node.children[i + 1].keys) >= self.max_number_of_keys:  # overflow
                self._split_child(node, i + 1)
                if (
                    node.keys[i + 1] < key
                ):  # decide which child is going to have a new key
                    i += 1

            self._insert_to_nonfull_node(node.children[i + 1], key)

    def find(self, key) -> bool:
        current_node = self.root
        while True:
            i = len(current_node.keys) - 1
            while i >= 0 and current_node.keys[i] > key:
                i -= 1

            if i >= 0 and current_node.keys[i] == key:
                return True
            elif current_node.is_leaf:
                return False
            else:
                current_node = current_node.children[i + 1]

    def remove_key(self, key):
        self._remove_key(self.root, key)

    def _remove_key(self, node: Node, key) -> bool:
        try:
            key_index = node.keys.index(key)
            if node.is_leaf:
                node.keys.remove(key)
                return True
            else:
                self._remove_from_nonleaf_node(node, key_index)

            return True

        except ValueError:  # key not found in node
            if node.is_leaf:
                print("Key not found.")
                return False  # key not found
            else:
                i = 0
                number_of_keys = len(node.keys)
                while (
                    i < number_of_keys and key > node.keys[i]
                ):  # decide in which subtree may be key
                    i += 1

                action_performed = self._repair_tree(node, i)
                if action_performed:
                    return self._remove_key(node, key)
                else:
                    return self._remove_key(node.children[i], key)

    def _repair_tree(self, node: Node, child_index: int) -> bool:
        child = node.children[child_index]
        if (
            self.min_numbers_of_keys < len(child.keys) <= self.max_number_of_keys
        ):  # The leaf/node is correct
            return False

        if (
            child_index > 0
            and len(node.children[child_index - 1].keys) > self.min_numbers_of_keys
        ):
            self._rotate_right(node, child_index)
            return True

        if (
            child_index < len(node.children) - 1
            and len(node.children[child_index + 1].keys) > self.min_numbers_of_keys
        ):  # 0 <-- 1
            self._rotate_left(node, child_index)
            return True

        if child_index > 0:
            # merge child with brother on the left
            self._merge(node, child_index - 1, child_index)
        else:
            # merge child with brother on the right
            self._merge(node, child_index, child_index + 1)

        return True

    def _rotate_left(self, parent_node: Node, child_index: int):
        """
        Take key from right brother of the child and transfer to the child
        """
        new_child_key = parent_node.keys[child_index]
        new_parent_key = parent_node.children[child_index + 1].keys.pop(0)
        parent_node.children[child_index].keys.append(new_child_key)
        parent_node.keys[child_index] = new_parent_key

        if not parent_node.children[child_index + 1].is_leaf:
            ownerless_child = parent_node.children[child_index + 1].children.pop(0)
            # make ownerless_child as a new biggest child (with highest key) -> transfer from right subtree to left subtree
            parent_node.children[child_index].children.append(ownerless_child)

    def _rotate_right(self, parent_node: Node, child_index: int):
        """
        Take key from left brother of the child and transfer to the child
        """
        parent_key = parent_node.keys[child_index - 1]
        new_parent_key = parent_node.children[child_index - 1].keys.pop()
        parent_node.children[child_index].keys.insert(0, parent_key)
        parent_node.keys[child_index - 1] = new_parent_key

        if not parent_node.children[child_index - 1].is_leaf:
            ownerless_child = parent_node.children[child_index - 1].children.pop()
            # make ownerless_child as a new lowest child (with lowest key) -> transfer from left subtree to right subtree
            parent_node.children[child_index].children.insert(0, ownerless_child)

    def _merge(
        self, parent_node: Node, to_merge_index: int, transfered_child_index: int
    ):
        from_merge_node = parent_node.children.pop(transfered_child_index)
        parent_key_to_merge = parent_node.keys.pop(to_merge_index)
        to_merge_node = parent_node.children[to_merge_index]
        to_merge_node.keys.append(parent_key_to_merge)
        to_merge_node.keys.extend(from_merge_node.keys)

        if not to_merge_node.is_leaf:
            to_merge_node.children.extend(from_merge_node.children)

        if parent_node == self.root and not parent_node.keys:
            self.root = to_merge_node

    def _remove_from_nonleaf_node(self, node: Node, key_index: int):
        key = node.keys[key_index]
        left_subtree = node.children[key_index]
        if len(left_subtree.keys) > self.min_numbers_of_keys:
            largest_key = self._find_largest_and_delete_in_left_subtree(left_subtree)
        elif len(node.children[key_index + 1].keys) > self.min_numbers_of_keys:
            largest_key = self._find_largest_and_delete_in_right_subtree(
                node.children[key_index + 1]
            )
        else:
            self._merge(node, key_index, key_index + 1)
            return self._remove_key(node, key)

        node.keys[key_index] = largest_key

    def _find_largest_and_delete_in_left_subtree(self, node: Node):
        if node.is_leaf:
            return node.keys.pop()
        else:
            ch_index = len(node.children) - 1
            self._repair_tree(node, ch_index)
            largest_key_in_subtree = self._find_largest_and_delete_in_left_subtree(
                node.children[len(node.children) - 1]
            )
            # self._repair_tree(node, ch_index)
            return largest_key_in_subtree

    def _find_largest_and_delete_in_right_subtree(self, node: Node):
        if node.is_leaf:
            return node.keys.pop(0)
        else:
            ch_index = 0
            self._repair_tree(node, ch_index)
            largest_key_in_subtree = self._find_largest_and_delete_in_right_subtree(
                node.children[0]
            )
            # self._repair_tree(node, ch_index)
            return largest_key_in_subtree

    def traverse_tree(self):
        self._traverse_tree(self.root)
        print()

    def _traverse_tree(self, node: Node):
        if node.is_leaf:
            print(node.keys, end=" ")
        else:
            for i, key in enumerate(node.keys):
                self._traverse_tree(node.children[i])
                print(key, end=" ")
            self._traverse_tree(node.children[-1])

from tree.tree import TreeNode


def bin_tree_to_list(root):
    """
    type root: root class
    """
    if not root:
        return root
    root = bin_tree_to_list_util(root)
    while root.left:
        root = root.left
    return root


def bin_tree_to_list_util(root):
    if not root:
        return root
    if root.left:
        left = bin_tree_to_list_util(root.left)
        while left.right:
            left = left.right
        left.right = root
        root.left = left
    if root.right:
        right = bin_tree_to_list_util(root.right)
        while right.left:
            right = right.left
        right.left = root
        root.right = right
    return root


def print_tree(root):
    while root:
        print(root.val)
        root = root.right

def binary_tree_paths(root):
    res = []
    if root is None:
        return res
    dfs(res, root, str(root.val))
    return res


def dfs(res, root, cur):
    if root.left is None and root.right is None:
        res.append(cur)
    if root.left:
        dfs(res, root.left, cur + "->" + str(root.left.val))
    if root.right:
        dfs(res, root.right, cur + "->" + str(root.right.val))

"""
    Given two arrays representing preorder and postorder traversal of a full
    binary tree, construct the binary tree and print the inorder traversal of the
    tree.
    A full binary tree has either 0 or 2 children.
    Algorithm:
        1. Assign the first element of preorder array as root of the tree.
        2. Find the same element in the postorder array and divide the postorder
            array into left and right subtree.
        3. Repeat the above steps for all the elements and construct the tree.
    Eg: pre[] = {1, 2, 4, 8, 9, 5, 3, 6, 7}
        post[] = {8, 9, 4, 5, 2, 6, 7, 3, 1}
        Tree:
                1
              /   \
             2     3
            / \   / \
           4   5 6   7
          / \
         8   9
      Output: 8 4 9 2 5 1 6 3 7
"""


class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


pre_index = 0


def construct_tree_util(pre: list, post: list, low: int, high: int, size: int):
    """
        Recursive function that constructs tree from preorder and postorder array.
        
        preIndex is a global variable that keeps track of the index in preorder
        array.
        preorder and postorder array are represented are pre[] and post[] respectively.
        low and high are the indices for the postorder array.
    """

    global pre_index

    if pre_index == -1:
        pre_index = 0

    # Base case
    if pre_index >= size or low > high:
        return None

    root = TreeNode(pre[pre_index])
    pre_index += 1

    # If only one element in the subarray return root
    if low == high or pre_index >= size:
        return root

    # Find the next element of pre[] in post[]
    i = low
    while i <= high:
        if pre[pre_index] == post[i]:
            break

        i += 1

    # Use index of element present in postorder to divide postorder array
    # to two parts: left subtree and right subtree
    if i <= high:
        root.left = construct_tree_util(pre, post, low, i, size)
        root.right = construct_tree_util(pre, post, i + 1, high, size)

    return root


def construct_tree(pre: list, post: list, size: int):
    """
        Main Function that will construct the full binary tree from given preorder
        and postorder array.
    """

    global pre_index
    root = construct_tree_util(pre, post, 0, size - 1, size)

    return print_inorder(root)


def print_inorder(root: TreeNode, result=None):
    """
        Prints the tree constructed in inorder format
    """
    if root is None:
        return []
    if result is None:
        result = []

    print_inorder(root.left, result)
    result.append(root.val)
    print_inorder(root.right, result)
    return result


if __name__ == "__main__":
    pre = [1, 2, 4, 5, 3, 6, 7]
    post = [4, 5, 2, 6, 7, 3, 1]
    size = len(pre)

    result = construct_tree(pre, post, size)

    print(result)

# Given a binary tree, find the deepest node
# that is the left child of its parent node.

# Example:

# 1
# /   \
# 2     3
# / \     \
# 4   5     6
# \
# 7
# should return 4.

from tree.tree import TreeNode


class DeepestLeft:
    def __init__(self):
        self.depth = 0
        self.Node = None


def find_deepest_left(root, is_left, depth, res):
    if not root:
        return
    if is_left and depth > res.depth:
        res.depth = depth
        res.Node = root
    find_deepest_left(root.left, True, depth + 1, res)
    find_deepest_left(root.right, False, depth + 1, res)


if __name__ == "__main__":
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    root.right.right = TreeNode(6)
    root.right.right.right = TreeNode(7)

    res = DeepestLeft()
    find_deepest_left(root, True, 1, res)
    if res.Node:
        print(res.Node.val)

# invert a binary tree


def reverse(root):
    if root is None:
        return
    root.left, root.right = root.right, root.left
    if root.left:
        reverse(root.left)
    if root.right:
        reverse(root.right)

def is_balanced(root):
    return __is_balanced_recursive(root)


def __is_balanced_recursive(root):
    """
    O(N) solution
    """
    return -1 != __get_depth(root)


def __get_depth(root):
    """
    return 0 if unbalanced else depth + 1
    """
    if root is None:
        return 0
    left = __get_depth(root.left)
    right = __get_depth(root.right)
    if abs(left - right) > 1 or -1 in [left, right]:
        return -1
    return 1 + max(left, right)


# def is_balanced(root):
#     """
#     O(N^2) solution
#     """
#     left = max_height(root.left)
#     right = max_height(root.right)
#     return abs(left-right) <= 1 and is_balanced(root.left) and is_balanced(root.right)

# def max_height(root):
#     if root is None:
#         return 0
#     return max(max_height(root.left), max_height(root.right)) + 1

"""
Given two binary trees s and t, check if t is a subtree of s.
A subtree of a tree t is a tree consisting of a node in t and
all of its descendants in t.

Example 1:

Given s:

     3
    / \
   4   5
  / \
 1   2

Given t:

   4
  / \
 1   2
Return true, because t is a subtree of s.

Example 2:

Given s:

     3
    / \
   4   5
  / \
 1   2
    /
   0

Given t:

     3
    /
   4
  / \
 1   2
Return false, because even though t is part of s,
it does not contain all descendants of t.

Follow up:
What if one tree is significantly lager than the other?
"""
import collections


def is_subtree(big, small):
    flag = False
    queue = collections.deque()
    queue.append(big)
    while queue:
        node = queue.popleft()
        if node.val == small.val:
            flag = comp(node, small)
            break
        else:
            queue.append(node.left)
            queue.append(node.right)
    return flag


def comp(p, q):
    if p is None and q is None:
        return True
    if p is not None and q is not None:
        return p.val == q.val and comp(p.left, q.left) and comp(p.right, q.right)
    return False

"""
Given a binary tree, check whether it is a mirror of
itself (ie, symmetric around its center).

For example, this binary tree [1,2,2,3,4,4,3] is symmetric:

    1
   / \
  2   2
 / \ / \
3  4 4  3
But the following [1,2,2,null,3,null,3] is not:
    1
   / \
  2   2
   \   \
   3    3
Note:
Bonus points if you could solve it both recursively and iteratively.
"""

# TC: O(b) SC: O(log n)
def is_symmetric(root):
    if root is None:
        return True
    return helper(root.left, root.right)


def helper(p, q):
    if p is None and q is None:
        return True
    if p is not None or q is not None or q.val != p.val:
        return False
    return helper(p.left, q.right) and helper(p.right, q.left)


def is_symmetric_iterative(root):
    if root is None:
        return True
    stack = [[root.left, root.right]]
    while stack:
        left, right = stack.pop()  # popleft
        if left is None and right is None:
            continue
        if left is None or right is None:
            return False
        if left.val == right.val:
            stack.append([left.left, right.right])
            stack.append([left.right, right.left])
        else:
            return False
    return True

"""
Given a binary tree, find the length of the longest consecutive sequence path.

The path refers to any sequence of nodes from some starting node to any node
in the tree along the parent-child connections.
The longest consecutive path need to be from parent to child
(cannot be the reverse).

For example,
   1
    \
     3
    / \
   2   4
        \
         5
Longest consecutive sequence path is 3-4-5, so return 3.
   2
    \
     3
    /
   2
  /
 1
"""


def longest_consecutive(root):
    """
    :type root: TreeNode
    :rtype: int
    """
    if root is None:
        return 0
    max_len = 0
    dfs(root, 0, root.val, max_len)
    return max_len


def dfs(root, cur, target, max_len):
    if root is None:
        return
    if root.val == target:
        cur += 1
    else:
        cur = 1
    max_len = max(cur, max_len)
    dfs(root.left, cur, root.val + 1, max_len)
    dfs(root.right, cur, root.val + 1, max_len)

"""
Given a binary tree, find the lowest common ancestor
(LCA) of two given nodes in the tree.

According to the definition of LCA on Wikipedia:
    “The lowest common ancestor is defined between two nodes
    v and w as the lowest node in T that has both v and w as
    descendants
    (where we allow a node to be a descendant of itself).”

        _______3______
       /              \
    ___5__          ___1__
   /      \        /      \
   6      _2       0       8
         /  \
         7   4
For example, the lowest common ancestor (LCA) of nodes 5 and 1 is 3.
Another example is LCA of nodes 5 and 4 is 5,
since a node can be a descendant of itself according to the LCA definition.
"""


def lca(root, p, q):
    """
    :type root: TreeNode
    :type p: TreeNode
    :type q: TreeNode
    :rtype: TreeNode
    """
    if root is None or root is p or root is q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left is not None and right is not None:
        return root
    return left if left else right

"""
Given a binary tree, find its maximum depth.

The maximum depth is the number of nodes along the
longest path from the root node down to the farthest leaf node.
"""

# def max_height(root):
#     if not root:
#         return 0
#     return max(maxDepth(root.left), maxDepth(root.right)) + 1

# iterative

from tree import TreeNode


def max_height(root):
    if root is None:
        return 0
    height = 0
    queue = [root]
    while queue:
        height += 1
        level = []
        while queue:
            node = queue.pop(0)
            if node.left is not None:
                level.append(node.left)
            if node.right is not None:
                level.append(node.right)
        queue = level
    return height


def print_tree(root):
    if root is not None:
        print(root.val)
        print_tree(root.left)
        print_tree(root.right)


if __name__ == "__main__":
    tree = TreeNode(10)
    tree.left = TreeNode(12)
    tree.right = TreeNode(15)
    tree.left.left = TreeNode(25)
    tree.left.left.right = TreeNode(100)
    tree.left.right = TreeNode(30)
    tree.right.left = TreeNode(36)

    height = max_height(tree)
    print_tree(tree)
    print("height:", height)

def max_path_sum(root):
    maximum = float("-inf")
    helper(root, maximum)
    return maximum


def helper(root, maximum):
    if root is None:
        return 0
    left = helper(root.left, maximum)
    right = helper(root.right, maximum)
    maximum = max(maximum, left + right + root.val)
    return root.val + maximum

from tree import TreeNode


def min_depth(self, root):
    """
    :type root: TreeNode
    :rtype: int
    """
    if root is None:
        return 0
    if root.left is not None or root.right is not None:
        return max(self.minDepth(root.left), self.minDepth(root.right)) + 1
    return min(self.minDepth(root.left), self.minDepth(root.right)) + 1


# iterative
def min_height(root):
    if root is None:
        return 0
    height = 0
    level = [root]
    while level:
        height += 1
        new_level = []
        for node in level:
            if node.left is None and node.right is None:
                return height
            if node.left is not None:
                new_level.append(node.left)
            if node.right is not None:
                new_level.append(node.right)
        level = new_level
    return height


def print_tree(root):
    if root is not None:
        print(root.val)
        print_tree(root.left)
        print_tree(root.right)


if __name__ == "__main__":
    tree = TreeNode(10)
    tree.left = TreeNode(12)
    tree.right = TreeNode(15)
    tree.left.left = TreeNode(25)
    tree.left.left.right = TreeNode(100)
    tree.left.right = TreeNode(30)
    tree.right.left = TreeNode(36)

    height = min_height(tree)
    print_tree(tree)
    print("height:", height)

"""
Given a binary tree and a sum, determine if the tree has a root-to-leaf
path such that adding up all the values along the path equals the given sum.

For example:
Given the below binary tree and sum = 22,
              5
             / \
            4   8
           /   / \
          11  13  4
         /  \      \
        7    2      1
return true, as there exist a root-to-leaf path 5->4->11->2 which sum is 22.
"""


def has_path_sum(root, sum):
    """
    :type root: TreeNode
    :type sum: int
    :rtype: bool
    """
    if root is None:
        return False
    if root.left is None and root.right is None and root.val == sum:
        return True
    sum -= root.val
    return has_path_sum(root.left, sum) or has_path_sum(root.right, sum)


# DFS with stack
def has_path_sum2(root, sum):
    if root is None:
        return False
    stack = [(root, root.val)]
    while stack:
        node, val = stack.pop()
        if node.left is None and node.right is None:
            if val == sum:
                return True
        if node.left is not None:
            stack.append((node.left, val + node.left.val))
        if node.right is not None:
            stack.append((node.right, val + node.right.val))
    return False


# BFS with queue
def has_path_sum3(root, sum):
    if root is None:
        return False
    queue = [(root, sum - root.val)]
    while queue:
        node, val = queue.pop(0)  # popleft
        if node.left is None and node.right is None:
            if val == 0:
                return True
        if node.left is not None:
            queue.append((node.left, val - node.left.val))
        if node.right is not None:
            queue.append((node.right, val - node.right.val))
    return False

"""
Given a binary tree and a sum, find all root-to-leaf
paths where each path's sum equals the given sum.

For example:
Given the below binary tree and sum = 22,
              5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
return
[
   [5,4,11,2],
   [5,8,4,5]
]
"""


def path_sum(root, sum):
    if root is None:
        return []
    res = []
    dfs(root, sum, [], res)
    return res


def dfs(root, sum, ls, res):
    if root.left is None and root.right is None and root.val == sum:
        ls.append(root.val)
        res.append(ls)
    if root.left is not None:
        dfs(root.left, sum - root.val, ls + [root.val], res)
    if root.right is not None:
        dfs(root.right, sum - root.val, ls + [root.val], res)


# DFS with stack
def path_sum2(root, s):
    if root is None:
        return []
    res = []
    stack = [(root, [root.val])]
    while stack:
        node, ls = stack.pop()
        if node.left is None and node.right is None and sum(ls) == s:
            res.append(ls)
        if node.left is not None:
            stack.append((node.left, ls + [node.left.val]))
        if node.right is not None:
            stack.append((node.right, ls + [node.right.val]))
    return res


# BFS with queue
def path_sum3(root, sum):
    if root is None:
        return []
    res = []
    queue = [(root, root.val, [root.val])]
    while queue:
        node, val, ls = queue.pop(0)  # popleft
        if node.left is None and node.right is None and val == sum:
            res.append(ls)
        if node.left is not None:
            queue.append((node.left, val + node.left.val, ls + [node.left.val]))
        if node.right is not None:
            queue.append((node.right, val + node.right.val, ls + [node.right.val]))
    return res

# a -> Adam -> Book -> 4
# b -> Bill -> Computer -> 5
#           -> TV -> 6
#      Jill -> Sports -> 1
# c -> Bill -> Sports -> 3
# d -> Adam -> Computer -> 3
#      Quin -> Computer -> 3
# e -> Quin -> Book -> 5
#           -> TV -> 2
# f -> Adam -> Computer -> 7

from __future__ import print_function


def tree_print(tree):
    for key in tree:
        print(key, end=" ")  # end=' ' prevents a newline character
        tree_element = tree[key]  # multiple lookups is expensive, even amortized O(1)!
        for subElem in tree_element:
            print(" -> ", subElem, end=" ")
            if type(subElem) != str:  # OP wants indenting after digits
                print("\n ")  # newline and a space to match indenting
        print()  # forces a newline

"""
Given two binary trees, write a function to check
if they are equal or not.

Two binary trees are considered equal if they are
structurally identical and the nodes have the same value.
"""


def is_same_tree(p, q):
    if p is None and q is None:
        return True
    if p is not None and q is not None and p.val == q.val:
        return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)
    return False


# Time Complexity O(min(N,M))
# where N and M are the number of nodes for the trees.

# Space Complexity O(min(height1, height2))
# levels of recursion is the mininum height between the two trees.

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

