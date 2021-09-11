from .binary_search import *
from .ternary_search import *
from .first_occurrence import *
from .last_occurrence import *
from .linear_search import *
from .search_insert import *
from .two_sum import *
from .search_range import *
from .find_min_rotate import *
from .search_rotate import *
from .jump_search import *
from .next_greatest_letter import *
from .interpolation_search import *

#
# Binary search works for a sorted array.
# Note: The code logic is written for an array sorted in
#  increasing order.
# For Binary Search, T(N) = T(N/2) + O(1) // the recurrence relation
# Apply Masters Theorem for computing Run time complexity of recurrence relations : T(N) = aT(N/b) + f(N)
# Here, a = 1, b = 2 => log (a base b) = 1
# also, here f(N) = n^c log^k(n) //k = 0 & c = log (a base b) So, T(N) = O(N^c log^(k+1)N) = O(log(N))


def binary_search(array, query):
    lo, hi = 0, len(array) - 1
    while lo <= hi:
        mid = (hi + lo) // 2
        val = array[mid]
        if val == query:
            return mid
        elif val < query:
            lo = mid + 1
        else:
            hi = mid - 1
    return None


def binary_search_recur(array, low, high, val):
    if low > high:  # error case
        return -1
    mid = (low + high) // 2
    if val < array[mid]:
        return binary_search_recur(array, low, mid - 1, val)
    elif val > array[mid]:
        return binary_search_recur(array, mid + 1, high, val)
    else:
        return mid

"""
Suppose an array sorted in ascending order is rotated at some pivot unknown
to you beforehand. (i.e., 0 1 2 4 5 6 7 might become 4 5 6 7 0 1 2).

Find the minimum element. The complexity must be O(logN)

You may assume no duplicate exists in the array.
"""


def find_min_rotate(array):
    low = 0
    high = len(array) - 1
    while low < high:
        mid = (low + high) // 2
        if array[mid] > array[high]:
            low = mid + 1
        else:
            high = mid

    return array[low]


def find_min_rotate_recur(array, low, high):
    mid = (low + high) // 2
    if mid == low:
        return array[low]
    elif array[mid] > array[high]:
        return find_min_rotate_recur(array, mid + 1, high)
    else:
        return find_min_rotate_recur(array, low, mid)

#
# Find first occurance of a number in a sorted array (increasing order)
# Approach- Binary Search
# T(n)- O(log n)
#
def first_occurrence(array, query):
    lo, hi = 0, len(array) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        # print("lo: ", lo, " hi: ", hi, " mid: ", mid)
        if lo == hi:
            break
        if array[mid] < query:
            lo = mid + 1
        else:
            hi = mid
    if array[lo] == query:
        return lo

""" 
Python implementation of the Interpolation Search algorithm.
Given a sorted array in increasing order, interpolation search calculates
the starting point of its search according to the search key.

FORMULA: start_pos = low + [ (x - arr[low])*(high - low) / (arr[high] - arr[low]) ]

Doc: https://en.wikipedia.org/wiki/Interpolation_search

Time Complexity: O(log2(log2 n)) for average cases, O(n) for the worst case.
The algorithm performs best with uniformly distributed arrays.
"""

from typing import List


def interpolation_search(array: List[int], search_key: int) -> int:
    """
    :param array: The array to be searched.
    :param search_key: The key to be searched in the array.

    :returns: Index of search_key in array if found, else -1.

    Examples:

    >>> interpolation_search([-25, -12, -1, 10, 12, 15, 20, 41, 55], -1)
    2
    >>> interpolation_search([5, 10, 12, 14, 17, 20, 21], 55)
    -1
    >>> interpolation_search([5, 10, 12, 14, 17, 20, 21], -5)
    -1

    """

    # highest and lowest index in array
    high = len(array) - 1
    low = 0

    while (low <= high) and (array[low] <= search_key <= array[high]):
        # calculate the search position
        pos = low + int(
            ((search_key - array[low]) * (high - low) / (array[high] - array[low]))
        )

        # search_key is found
        if array[pos] == search_key:
            return pos

        # if search_key is larger, search_key is in upper part
        if array[pos] < search_key:
            low = pos + 1

        # if search_key is smaller, search_key is in lower part
        else:
            high = pos - 1

    return -1


if __name__ == "__main__":
    import doctest

    doctest.testmod()

import math


def jump_search(arr, target):
    """Jump Search
        Worst-case Complexity: O(√n) (root(n))
        All items in list must be sorted like binary search

        Find block that contains target value and search it linearly in that block
        It returns a first target value in array

        reference: https://en.wikipedia.org/wiki/Jump_search

    """
    n = len(arr)
    block_size = int(math.sqrt(n))
    block_prev = 0
    block = block_size

    # return -1 means that array doesn't contain target value
    # find block that contains target value

    if arr[n - 1] < target:
        return -1
    while block <= n and arr[block - 1] < target:
        block_prev = block
        block += block_size

    # find target value in block

    while arr[block_prev] < target:
        block_prev += 1
        if block_prev == min(block, n):
            return -1

    # if there is target value in array, return it

    if arr[block_prev] == target:
        return block_prev
    else:
        return -1

#
# Find last occurance of a number in a sorted array (increasing order)
# Approach- Binary Search
# T(n)- O(log n)
#
def last_occurrence(array, query):
    lo, hi = 0, len(array) - 1
    while lo <= hi:
        mid = (hi + lo) // 2
        if (array[mid] == query and mid == len(array) - 1) or (
            array[mid] == query and array[mid + 1] > query
        ):
            return mid
        elif array[mid] <= query:
            lo = mid + 1
        else:
            hi = mid - 1

#
# Linear search works in any array.
#
# T(n): O(n)
#


def linear_search(array, query):
    for i in range(len(array)):
        if array[i] == query:
            return i

    return -1

"""
Given a list of sorted characters letters containing only lowercase letters,
and given a target letter target, find the smallest element in the list that
is larger than the given target.

Letters also wrap around. For example, if the target is target = 'z' and
letters = ['a', 'b'], the answer is 'a'.

Input:
letters = ["c", "f", "j"]
target = "a"
Output: "c"

Input:
letters = ["c", "f", "j"]
target = "c"
Output: "f"

Input:
letters = ["c", "f", "j"]
target = "d"
Output: "f"

Reference: https://leetcode.com/problems/find-smallest-letter-greater-than-target/description/
"""

import bisect

"""
Using bisect libarary
"""


def next_greatest_letter(letters, target):
    index = bisect.bisect(letters, target)
    return letters[index % len(letters)]


"""
Using binary search: complexity O(logN)
"""


def next_greatest_letter_v1(letters, target):
    if letters[0] > target:
        return letters[0]
    if letters[len(letters) - 1] <= target:
        return letters[0]
    left, right = 0, len(letters) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if letters[mid] > target:
            right = mid - 1
        else:
            left = mid + 1
    return letters[left]


"""
Brute force: complexity O(N)
"""


def next_greatest_letter_v2(letters, target):
    for index in letters:
        if index > target:
            return index
    return letters[0]

"""
Given a sorted array and a target value, return the index if the target is
found. If not, return the index where it would be if it were inserted in order.

For example:
[1,3,5,6], 5 -> 2
[1,3,5,6], 2 -> 1
[1,3,5,6], 7 -> 4
[1,3,5,6], 0 -> 0
"""


def search_insert(array, val):
    low = 0
    high = len(array) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if val > array[mid]:
            low = mid + 1
        else:
            high = mid - 1
    return low

"""
Given an array of integers nums sorted in ascending order, find the starting
and ending position of a given target value. If the target is not found in the
array, return [-1, -1].

For example:
Input: nums = [5,7,7,8,8,8,10], target = 8
Output: [3,5]
Input: nums = [5,7,7,8,8,8,10], target = 11
Output: [-1,-1]
"""


def search_range(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    low = 0
    high = len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if target < nums[mid]:
            high = mid - 1
        elif target > nums[mid]:
            low = mid + 1
        else:
            break

    for j in range(len(nums) - 1, -1, -1):
        if nums[j] == target:
            return [mid, j]

    return [-1, -1]

"""
Search in Rotated Sorted Array
Suppose an array sorted in ascending order is rotated at some pivot unknown
to you beforehand. (i.e., [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2]).

You are given a target value to search. If found in the array return its index,
otherwise return -1.

Your algorithm's runtime complexity must be in the order of O(log n).
---------------------------------------------------------------------------------
Explanation algorithm:

In classic binary search, we compare val with the midpoint to figure out if
val belongs on the low or the high side. The complication here is that the
array is rotated and may have an inflection point. Consider, for example:

Array1: [10, 15, 20, 0, 5]
Array2: [50, 5, 20, 30, 40]

Note that both arrays have a midpoint of 20, but 5 appears on the left side of
one and on the right side of the other. Therefore, comparing val with the
midpoint is insufficient.

However, if we look a bit deeper, we can see that one half of the array must be
ordered normally(increasing order). We can therefore look at the normally ordered
half to determine whether we should search the low or hight side.

For example, if we are searching for 5 in Array1, we can look at the left element (10)
and middle element (20). Since 10 < 20, the left half must be ordered normally. And, since 5
is not between those, we know that we must search the right half

In array2, we can see that since 50 > 20, the right half must be ordered normally. We turn to
the middle 20, and right 40 element to check if 5 would fall between them. The value 5 would not
Therefore, we search the left half.

There are 2 possible solution: iterative and recursion.
Recursion helps you understand better the above algorithm explanation
"""


def search_rotate(array, val):
    low, high = 0, len(array) - 1
    while low <= high:
        mid = (low + high) // 2
        if val == array[mid]:
            return mid

        if array[low] <= array[mid]:
            if array[low] <= val <= array[mid]:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if array[mid] <= val <= array[high]:
                low = mid + 1
            else:
                high = mid - 1

    return -1


# Recursion technique
def search_rotate_recur(array, low, high, val):
    if low >= high:
        return -1
    mid = (low + high) // 2
    if val == array[mid]:  # found element
        return mid
    if array[low] <= array[mid]:
        if array[low] <= val <= array[mid]:
            return search_rotate_recur(array, low, mid - 1, val)  # Search left
        else:
            return search_rotate_recur(array, mid + 1, high, val)  # Search right
    else:
        if array[mid] <= val <= array[high]:
            return search_rotate_recur(array, mid + 1, high, val)  # Search right
        else:
            return search_rotate_recur(array, low, mid - 1, val)  # Search left

"""
Ternary search is a divide and conquer algorithm that can be used to find an element in an array. 
It is similar to binary search where we divide the array into two parts but in this algorithm, 
we divide the given array into three parts and determine which has the key (searched element). 
We can divide the array into three parts by taking mid1 and mid2.
Initially, l and r will be equal to 0 and n-1 respectively, where n is the length of the array.
mid1 = l + (r-l)/3 
mid2 = r – (r-l)/3 

Note: Array needs to be sorted to perform ternary search on it.
T(N) = O(log3(N))
log3 = log base 3
"""


def ternary_search(l, r, key, arr):
    while r >= l:

        mid1 = l + (r - l) // 3
        mid2 = r - (r - l) // 3

        if key == arr[mid1]:
            return mid1
        if key == mid2:
            return mid2

        if key < arr[mid1]:
            # key lies between l and mid1
            r = mid1 - 1
        elif key > arr[mid2]:
            # key lies between mid2 and r
            l = mid2 + 1
        else:
            # key lies between mid1 and mid2
            l = mid1 + 1
            r = mid2 - 1

            # key not found
    return -1

"""
Given an array of integers that is already sorted in ascending order, find two
numbers such that they add up to a specific target number. The function two_sum
should return indices of the two numbers such that they add up to the target,
where index1 must be less than index2. Please note that your returned answers
(both index1 and index2) are not zero-based.
You may assume that each input would have exactly one solution and you
may not use the same element twice.

Input: numbers = [2, 7, 11, 15], target=9
Output: index1 = 1, index2 = 2

Solution:
two_sum: using binary search
two_sum1: using dictionary as a hash table
two_sum2: using two pointers
"""
# Using binary search technique
def two_sum(numbers, target):
    for i in range(len(numbers)):
        second_val = target - numbers[i]
        low, high = i + 1, len(numbers) - 1
        while low <= high:
            mid = low + (high - low) // 2
            if second_val == numbers[mid]:
                return [i + 1, mid + 1]
            elif second_val > numbers[mid]:
                low = mid + 1
            else:
                high = mid - 1


# Using dictionary as a hash table
def two_sum1(numbers, target):
    dic = {}
    for i, num in enumerate(numbers):
        if target - num in dic:
            return [dic[target - num] + 1, i + 1]
        dic[num] = i


# Using two pointers
def two_sum2(numbers, target):
    p1 = 0  # pointer 1 holds from left of array numbers
    p2 = len(numbers) - 1  # pointer 2 holds from right of array numbers
    while p1 < p2:
        s = numbers[p1] + numbers[p2]
        if s == target:
            return [p1 + 1, p2 + 1]
        elif s > target:
            p2 = p2 - 1
        else:
            p1 = p1 + 1

