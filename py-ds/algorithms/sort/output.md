```py

#---------------init.py ---------------#

from .bitonic_sort import *
from .bogo_sort import *
from .bubble_sort import *
from .comb_sort import *
from .counting_sort import *
from .cycle_sort import *
from .heap_sort import *
from .insertion_sort import *
from .merge_sort import *
from .pancake_sort import *
from .pigeonhole_sort import *
from .quick_sort import *
from .selection_sort import *
from .top_sort import *
from .bucket_sort import *
from .shell_sort import *
from .stooge_sort import *
from .radix_sort import *
from .gnome_sort import *
from .cocktail_shaker_sort import *
#---------------init.py ---------------#

#-------------------------------------------next -------------------------------------------#

def bitonic_sort(arr, reverse=False):
    """
    bitonic sort is sorting algorithm to use multiple process, but this code not containing parallel process
    It can sort only array that sizes power of 2
    It can sort array in both increasing order and decreasing order by giving argument true(increasing) and false(decreasing)
    
    Worst-case in parallel: O(log(n)^2)
    Worst-case in non-parallel: O(nlog(n)^2)
    
    reference: https://en.wikipedia.org/wiki/Bitonic_sorter
    """

    def compare(arr, reverse):
        n = len(arr) // 2
        for i in range(n):
            if reverse != (arr[i] > arr[i + n]):
                arr[i], arr[i + n] = arr[i + n], arr[i]
        return arr

    def bitonic_merge(arr, reverse):
        n = len(arr)

        if n <= 1:
            return arr

        arr = compare(arr, reverse)
        left = bitonic_merge(arr[: n // 2], reverse)
        right = bitonic_merge(arr[n // 2 :], reverse)
        return left + right

    # end of function(compare and bitionic_merge) definition
    n = len(arr)
    if n <= 1:
        return arr
    # checks if n is power of two
    if not (n and (not (n & (n - 1)))):
        raise ValueError("the size of input should be power of two")

    left = bitonic_sort(arr[: n // 2], True)
    right = bitonic_sort(arr[n // 2 :], False)

    arr = bitonic_merge(left + right, reverse)

    return arr

import random
#-------------------------------------------next -------------------------------------------#

def bogo_sort(arr, simulation=False):
    """Bogo Sort
        Best Case Complexity: O(n)
        Worst Case Complexity: O(∞)
        Average Case Complexity: O(n(n-1)!)
    """

    iteration = 0
    if simulation:
        print("iteration", iteration, ":", *arr)

    def is_sorted(arr):
        # check the array is inorder
        i = 0
        arr_len = len(arr)
        while i + 1 < arr_len:
            if arr[i] > arr[i + 1]:
                return False
            i += 1

        return True

    while not is_sorted(arr):
        random.shuffle(arr)

        if simulation:
            iteration = iteration + 1
            print("iteration", iteration, ":", *arr)

    return arr
#-------------------------------------------next -------------------------------------------#
"""

https://en.wikipedia.org/wiki/Bubble_sort

Worst-case performance: O(N^2)

If you call bubble_sort(arr,True), you can see the process of the sort
Default is simulation = False

"""


def bubble_sort(arr, simulation=False):
    def swap(i, j):
        arr[i], arr[j] = arr[j], arr[i]

    n = len(arr)
    swapped = True

    iteration = 0
    if simulation:
        print("iteration", iteration, ":", *arr)
    x = -1
    while swapped:
        swapped = False
        x = x + 1
        for i in range(1, n - x):
            if arr[i - 1] > arr[i]:
                swap(i - 1, i)
                swapped = True
                if simulation:
                    iteration = iteration + 1
                    print("iteration", iteration, ":", *arr)

    return arr
#-------------------------------------------next -------------------------------------------#
def bucket_sort(arr):
    """ Bucket Sort
        Complexity: O(n^2)
        The complexity is dominated by nextSort
    """
    # The number of buckets and make buckets
    num_buckets = len(arr)
    buckets = [[] for bucket in range(num_buckets)]
    # Assign values into bucket_sort
    for value in arr:
        index = value * num_buckets // (max(arr) + 1)
        buckets[index].append(value)
    # Sort
    sorted_list = []
    for i in range(num_buckets):
        sorted_list.extend(next_sort(buckets[i]))
    return sorted_list
#-------------------------------------------next -------------------------------------------#

def next_sort(arr):
    # We will use insertion sort here.
    for i in range(1, len(arr)):
        j = i - 1
        key = arr[i]
        while arr[j] > key and j >= 0:
            arr[j + 1] = arr[j]
            j = j - 1
        arr[j + 1] = key
    return arr
#-------------------------------------------next -------------------------------------------#
def cocktail_shaker_sort(arr):
    """
    Cocktail_shaker_sort
    Sorting a given array
    mutation of bubble sort

    reference: https://en.wikipedia.org/wiki/Cocktail_shaker_sort
    
    Worst-case performance: O(N^2)
    """

    def swap(i, j):
        arr[i], arr[j] = arr[j], arr[i]

    n = len(arr)
    swapped = True
    while swapped:
        swapped = False
        for i in range(1, n):
            if arr[i - 1] > arr[i]:
                swap(i - 1, i)
                swapped = True
        if swapped == False:
            return arr
        swapped = False
        for i in range(n - 1, 0, -1):
            if arr[i - 1] > arr[i]:
                swap(i - 1, i)
                swapped = True
    return arr
#-------------------------------------------next -------------------------------------------#
"""

https://en.wikipedia.org/wiki/Comb_sort

Worst-case performance: O(N^2)

"""


def comb_sort(arr):
    def swap(i, j):
        arr[i], arr[j] = arr[j], arr[i]

    n = len(arr)
    gap = n
    shrink = 1.3
    sorted = False
    while not sorted:
        gap = int(gap / shrink)
        if gap > 1:
            sorted = False
        else:
            gap = 1
            sorted = True

        i = 0
        while i + gap < n:
            if arr[i] > arr[i + gap]:
                swap(i, i + gap)
                sorted = False
            i = i + 1
    return arr
#-------------------------------------------next -------------------------------------------#
def counting_sort(arr):
    """
    Counting_sort
    Sorting a array which has no element greater than k
    Creating a new temp_arr,where temp_arr[i] contain the number of
    element less than or equal to i in the arr
    Then placing the number i into a correct position in the result_arr
    return the result_arr
    Complexity: 0(n)
    """

    m = min(arr)
    # in case there are negative elements, change the array to all positive element
    different = 0
    if m < 0:
        # save the change, so that we can convert the array back to all positive number
        different = -m
        for i in range(len(arr)):
            arr[i] += -m
    k = max(arr)
    temp_arr = [0] * (k + 1)
    for i in range(0, len(arr)):
        temp_arr[arr[i]] = temp_arr[arr[i]] + 1
    # temp_array[i] contain the times the number i appear in arr

    for i in range(1, k + 1):
        temp_arr[i] = temp_arr[i] + temp_arr[i - 1]
    # temp_array[i] contain the number of element less than or equal i in arr

    result_arr = arr.copy()
    # creating a result_arr an put the element in a correct positon
    for i in range(len(arr) - 1, -1, -1):
        result_arr[temp_arr[arr[i]] - 1] = arr[i] - different
        temp_arr[arr[i]] = temp_arr[arr[i]] - 1

    return result_arr
#-------------------------------------------next -------------------------------------------#
def cycle_sort(arr):
    """
    cycle_sort
    This is based on the idea that the permutations to be sorted
    can be decomposed into cycles,
    and the results can be individually sorted by cycling.
    
    reference: https://en.wikipedia.org/wiki/Cycle_sort
    
    Average time complexity : O(N^2)
    Worst case time complexity : O(N^2)
    """
    len_arr = len(arr)
    # Finding cycle to rotate.
    for cur in range(len_arr - 1):
        item = arr[cur]

        # Finding an indx to put items in.
        index = cur
        for i in range(cur + 1, len_arr):
            if arr[i] < item:
                index += 1

        # Case of there is not a cycle
        if index == cur:
            continue

        # Putting the item immediately right after the duplicate item or on the right.
        while item == arr[index]:
            index += 1
        arr[index], item = item, arr[index]

        # Rotating the remaining cycle.
        while index != cur:

            # Finding where to put the item.
            index = cur
            for i in range(cur + 1, len_arr):
                if arr[i] < item:
                    index += 1

            # After item is duplicated, put it in place or put it there.
            while item == arr[index]:
                index += 1
            arr[index], item = item, arr[index]
    return arr
#-------------------------------------------next -------------------------------------------#
"""

Gnome Sort
Best case performance is O(n)
Worst case performance is O(n^2)

"""


def gnome_sort(arr):
    n = len(arr)
    index = 0
    while index < n:
        if index == 0 or arr[index] >= arr[index - 1]:
            index = index + 1
        else:
            arr[index], arr[index - 1] = arr[index - 1], arr[index]
            index = index - 1
    return arr
#-------------------------------------------next -------------------------------------------#
def max_heap_sort(arr, simulation=False):
    """ Heap Sort that uses a max heap to sort an array in ascending order
        Complexity: O(n log(n))
    """
    iteration = 0
    if simulation:
        print("iteration", iteration, ":", *arr)

    for i in range(len(arr) - 1, 0, -1):
        iteration = max_heapify(arr, i, simulation, iteration)

    if simulation:
        iteration = iteration + 1
        print("iteration", iteration, ":", *arr)
    return arr

#-------------------------------------------next -------------------------------------------#
def max_heapify(arr, end, simulation, iteration):
    """ Max heapify helper for max_heap_sort
    """
    last_parent = (end - 1) // 2

    # Iterate from last parent to first
    for parent in range(last_parent, -1, -1):
        current_parent = parent

        # Iterate from current_parent to last_parent
        while current_parent <= last_parent:
            # Find greatest child of current_parent
            child = 2 * current_parent + 1
            if child + 1 <= end and arr[child] < arr[child + 1]:
                child = child + 1

            # Swap if child is greater than parent
            if arr[child] > arr[current_parent]:
                arr[current_parent], arr[child] = arr[child], arr[current_parent]
                current_parent = child
                if simulation:
                    iteration = iteration + 1
                    print("iteration", iteration, ":", *arr)
            # If no swap occured, no need to keep iterating
            else:
                break
    arr[0], arr[end] = arr[end], arr[0]
    return iteration

#-------------------------------------------next -------------------------------------------#
def min_heap_sort(arr, simulation=False):
    """ Heap Sort that uses a min heap to sort an array in ascending order
        Complexity: O(n log(n))
    """
    iteration = 0
    if simulation:
        print("iteration", iteration, ":", *arr)

    for i in range(0, len(arr) - 1):
        iteration = min_heapify(arr, i, simulation, iteration)

    return arr
#-------------------------------------------next -------------------------------------------#

def min_heapify(arr, start, simulation, iteration):
    """ Min heapify helper for min_heap_sort
    """
    # Offset last_parent by the start (last_parent calculated as if start index was 0)
    # All array accesses need to be offset by start
    end = len(arr) - 1
    last_parent = (end - start - 1) // 2

    # Iterate from last parent to first
    for parent in range(last_parent, -1, -1):
        current_parent = parent

        # Iterate from current_parent to last_parent
        while current_parent <= last_parent:
            # Find lesser child of current_parent
            child = 2 * current_parent + 1
            if child + 1 <= end - start and arr[child + start] > arr[child + 1 + start]:
                child = child + 1

            # Swap if child is less than parent
            if arr[child + start] < arr[current_parent + start]:
                arr[current_parent + start], arr[child + start] = (
                    arr[child + start],
                    arr[current_parent + start],
                )
                current_parent = child
                if simulation:
                    iteration = iteration + 1
                    print("iteration", iteration, ":", *arr)
            # If no swap occured, no need to keep iterating
            else:
                break
    return iteration
#-------------------------------------------next -------------------------------------------#
def insertion_sort(arr, simulation=False):
    """ Insertion Sort
        Complexity: O(n^2)
    """

    iteration = 0
    if simulation:
        print("iteration", iteration, ":", *arr)

    for i in range(len(arr)):
        cursor = arr[i]
        pos = i

        while pos > 0 and arr[pos - 1] > cursor:
            # Swap the number down the list
            arr[pos] = arr[pos - 1]
            pos = pos - 1
        # Break and do the final swap
        arr[pos] = cursor

        if simulation:
            iteration = iteration + 1
            print("iteration", iteration, ":", *arr)

    return arr

"""
Given an array of meeting time intervals consisting of
start and end times [[s1,e1],[s2,e2],...] (si < ei),
determine if a person could attend all meetings.

For example,
Given [[0, 30],[5, 10],[15, 20]],
return false.
"""

#-------------------------------------------next -------------------------------------------#
def can_attend_meetings(intervals):
    """
    :type intervals: List[Interval]
    :rtype: bool
    """
    intervals = sorted(intervals, key=lambda x: x.start)
    for i in range(1, len(intervals)):
        if intervals[i].start < intervals[i - 1].end:
            return False
    return True
#-------------------------------------------next -------------------------------------------#
def merge_sort(arr):
    """ Merge Sort
        Complexity: O(n log(n))
    """
    # Our recursive base case
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    # Perform merge_sort recursively on both halves
    left, right = merge_sort(arr[:mid]), merge_sort(arr[mid:])

    # Merge each side together
    return merge(left, right, arr.copy())


def merge(left, right, merged):
    """ Merge helper
        Complexity: O(n)
    """

    left_cursor, right_cursor = 0, 0
    while left_cursor < len(left) and right_cursor < len(right):
        # Sort each one and place into the result
        if left[left_cursor] <= right[right_cursor]:
            merged[left_cursor + right_cursor] = left[left_cursor]
            left_cursor += 1
        else:
            merged[left_cursor + right_cursor] = right[right_cursor]
            right_cursor += 1
    # Add the left overs if there's any left to the result
    for left_cursor in range(left_cursor, len(left)):
        merged[left_cursor + right_cursor] = left[left_cursor]
    # Add the left overs if there's any left to the result
    for right_cursor in range(right_cursor, len(right)):
        merged[left_cursor + right_cursor] = right[right_cursor]

    # Return result
    return merged
#-------------------------------------------next -------------------------------------------#
def pancake_sort(arr):
    """
    Pancake_sort
    Sorting a given array
    mutation of selection sort

    reference: https://www.geeksforgeeks.org/pancake-sorting/
    
    Overall time complexity : O(N^2)
    """

    len_arr = len(arr)
    if len_arr <= 1:
        return arr
    for cur in range(len(arr), 1, -1):
        # Finding index of maximum number in arr
        index_max = arr.index(max(arr[0:cur]))
        if index_max + 1 != cur:
            # Needs moving
            if index_max != 0:
                # reverse from 0 to index_max
                arr[: index_max + 1] = reversed(arr[: index_max + 1])
            # Reverse list
            arr[:cur] = reversed(arr[:cur])
    return arr
#-------------------------------------------next -------------------------------------------#
"""

https://en.wikipedia.org/wiki/Pigeonhole_sort

Time complexity: O(n + Range) where n = number of elements and Range = possible values in the array

Suitable for lists where the number of elements and key values are mostly the same.

"""


def pigeonhole_sort(arr):
    Max = max(arr)
    Min = min(arr)
    size = Max - Min + 1

    holes = [0] * size

    for i in arr:
        holes[i - Min] += 1

    i = 0
    for count in range(size):
        while holes[count] > 0:
            holes[count] -= 1
            arr[i] = count + Min
            i += 1
    return arr

def quick_sort(arr, simulation=False):
  
  
  #-------------------------------------------next -------------------------------------------#
  
    """ Quick sort
        Complexity: best O(n log(n)) avg O(n log(n)), worst O(N^2)
    """

    iteration = 0
    if simulation:
        print("iteration", iteration, ":", *arr)
    arr, _ = quick_sort_recur(arr, 0, len(arr) - 1, iteration, simulation)
    return arr


def quick_sort_recur(arr, first, last, iteration, simulation):
    if first < last:
        pos = partition(arr, first, last)
        # Start our two recursive calls
        if simulation:
            iteration = iteration + 1
            print("iteration", iteration, ":", *arr)

        _, iteration = quick_sort_recur(arr, first, pos - 1, iteration, simulation)
        _, iteration = quick_sort_recur(arr, pos + 1, last, iteration, simulation)

    return arr, iteration


def partition(arr, first, last):
    wall = first
    for pos in range(first, last):
        if arr[pos] < arr[last]:  # last is the pivot
            arr[pos], arr[wall] = arr[wall], arr[pos]
            wall += 1
    arr[wall], arr[last] = arr[last], arr[wall]
    return wall
#-------------------------------------------next -------------------------------------------#
"""
radix sort
complexity: O(nk + n) . n is the size of input list and k is the digit length of the number
"""


def radix_sort(arr, simulation=False):
    position = 1
    max_number = max(arr)

    iteration = 0
    if simulation:
        print("iteration", iteration, ":", *arr)

    while position <= max_number:
        queue_list = [list() for _ in range(10)]

        for num in arr:
            digit_number = num // position % 10
            queue_list[digit_number].append(num)

        index = 0
        for numbers in queue_list:
            for num in numbers:
                arr[index] = num
                index += 1

        if simulation:
            iteration = iteration + 1
            print("iteration", iteration, ":", *arr)

        position *= 10
    return arr
#-------------------------------------------next -------------------------------------------#
def selection_sort(arr, simulation=False):
    """ Selection Sort
        Complexity: O(n^2)
    """
    iteration = 0
    if simulation:
        print("iteration", iteration, ":", *arr)

    for i in range(len(arr)):
        minimum = i

        for j in range(i + 1, len(arr)):
            # "Select" the correct value
            if arr[j] < arr[minimum]:
                minimum = j

        arr[minimum], arr[i] = arr[i], arr[minimum]

        if simulation:
            iteration = iteration + 1
            print("iteration", iteration, ":", *arr)

    return arr
#-------------------------------------------next -------------------------------------------#
def shell_sort(arr):
    """ Shell Sort
        Complexity: O(n^2)
    """
    n = len(arr)
    # Initialize size of the gap
    gap = n // 2

    while gap > 0:
        y_index = gap
        while y_index < len(arr):
            y = arr[y_index]
            x_index = y_index - gap
            while x_index >= 0 and y < arr[x_index]:
                arr[x_index + gap] = arr[x_index]
                x_index = x_index - gap
            arr[x_index + gap] = y
            y_index = y_index + 1
        gap = gap // 2

    return arr
#-------------------------------------------next -------------------------------------------#
"""
Given an array with n objects colored red,
white or blue, sort them so that objects of the same color
are adjacent, with the colors in the order red, white and blue.

Here, we will use the integers 0, 1, and 2 to represent
the color red, white, and blue respectively.

Note:
You are not suppose to use the library's sort function for this problem.
"""


def sort_colors(nums):
    i = j = 0
    for k in range(len(nums)):
        v = nums[k]
        nums[k] = 2
        if v < 2:
            nums[j] = 1
            j += 1
        if v == 0:
            nums[i] = 0
            i += 1


if __name__ == "__main__":
    nums = [0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 2, 2]
    sort_colors(nums)
    print(nums)
#-------------------------------------------next -------------------------------------------#
"""

Stooge Sort
Time Complexity : O(n2.709)
Reference: https://www.geeksforgeeks.org/stooge-sort/

"""

#-------------------------------------------next -------------------------------------------#
def stoogesort(arr, l, h):
    if l >= h:
        return

    # If first element is smaller
    # than last, swap them
    if arr[l] > arr[h]:
        t = arr[l]
        arr[l] = arr[h]
        arr[h] = t

    # If there are more than 2 elements in
    # the array
    if h - l + 1 > 2:
        t = (int)((h - l + 1) / 3)

        # Recursively sort first 2 / 3 elements
        stoogesort(arr, l, (h - t))

        # Recursively sort last 2 / 3 elements
        stoogesort(arr, l + t, (h))

        # Recursively sort first 2 / 3 elements
        # again to confirm
        stoogesort(arr, l, (h - t))


if __name__ == "__main__":
    array = [1, 3, 64, 5, 7, 8]
    n = len(array)
    stoogesort(array, 0, n - 1)
    for i in range(0, n):
        print(array[i], end=" ")

GRAY, BLACK = 0, 1

#-------------------------------------------next -------------------------------------------#
def top_sort_recursive(graph):
    """ Time complexity is the same as DFS, which is O(V + E)
        Space complexity: O(V)
    """
    order, enter, state = [], set(graph), {}

    def dfs(node):
        state[node] = GRAY
        # print(node)
        for k in graph.get(node, ()):
            sk = state.get(k, None)
            if sk == GRAY:
                raise ValueError("cycle")
            if sk == BLACK:
                continue
            enter.discard(k)
            dfs(k)
        order.append(node)
        state[node] = BLACK

    while enter:
        dfs(enter.pop())
    return order

#-------------------------------------------next -------------------------------------------#
def top_sort(graph):
    """ Time complexity is the same as DFS, which is O(V + E)
        Space complexity: O(V)
    """
    order, enter, state = [], set(graph), {}

    def is_ready(node):
        lst = graph.get(node, ())
        if len(lst) == 0:
            return True
        for k in lst:
            sk = state.get(k, None)
            if sk == GRAY:
                raise ValueError("cycle")
            if sk != BLACK:
                return False
        return True

    while enter:
        node = enter.pop()
        stack = []
        while True:
            state[node] = GRAY
            stack.append(node)
            for k in graph.get(node, ()):
                sk = state.get(k, None)
                if sk == GRAY:
                    raise ValueError("cycle")
                if sk == BLACK:
                    continue
                enter.discard(k)
                stack.append(k)
            while stack and is_ready(stack[-1]):
                node = stack.pop()
                order.append(node)
                state[node] = BLACK
            if len(stack) == 0:
                break
            node = stack.pop()

    return order
#-------------------------------------------next -------------------------------------------#
"""
Given an unsorted array nums, reorder it such that nums[0] < nums[1] > nums[2] < nums[3]....
"""


def wiggle_sort(nums):
    for i in range(len(nums)):
        if (i % 2 == 1) == (nums[i - 1] > nums[i]):
            nums[i - 1], nums[i] = nums[i], nums[i - 1]


if __name__ == "__main__":
    array = [3, 5, 2, 1, 6, 4]

    print(array)
    wiggle_sort(array)
    print(array)
    
#-------------------------------------------End-------------------------------------------#


```
