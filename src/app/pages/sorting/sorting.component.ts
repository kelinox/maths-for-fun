import { Component, OnInit } from '@angular/core';
import { resetTimeout } from 'src/app/extensions';

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.sass'],
})
export class SortingComponent implements OnInit {
  sorted: any[] = [];
  unsorted: any[] = [];
  widthItem = 20;
  max = 0;
  size = 10;
  maxItem = 100;
  timeouts: any[] = [];
  paused = false;
  tracker = [];
  step = -1;

  constructor() {}

  ngOnInit(): void {
    this.generateRandomList(this.size, this.maxItem);
  }

  stop() {
    this.timeouts = resetTimeout(this.timeouts);
  }

  reset() {
    this.timeouts = resetTimeout(this.timeouts);
    this.generateRandomList(this.size, this.maxItem);
  }

  /**
   * Generate a list of random number between 0 and @max
   * The list will have a size of @listSize elements
   * @param {int} listSize Numbers of elements to add to the list
   * @param {int} max maximul value of a number in the list
   */
  generateRandomList(listSize: number, max: number) {
    const numbers: any[] = [];
    for (let i = 0; i < listSize; i++) {
      numbers.push({
        value: Math.floor(Math.random() * max),
        moved: false,
      });
    }

    this.unsorted = numbers;
    this.sorted = numbers.map((e) => e);
    this.widthItem = (window.innerWidth - 80) / numbers.length;
    this.max = max;
  }

  bubbleSort() {
    this.timeouts = resetTimeout(this.timeouts);
    this.sorted = resetMoved(this.unsorted);

    const numbers = this.sorted.map((e) => e.value);
    const tracker = [];
    const length = numbers.length;
    for (let i = 0; i < length - 1; i++) {
      for (let j = 0; j < length - i - 1; j++) {
        if (numbers[j] > numbers[j + 1]) {
          tracker.push([j, j + 1]);
          switchElement(numbers, j, j + 1);
        }
      }
    }
    this.displayMoves(tracker);
  }

  /**
   * Handle the click on the quicksort button
   * Will execute the quicksort algorithm
   * And will display the moves made to sort the list
   */
  quickSort() {
    this.timeouts = resetTimeout(this.timeouts);
    this.sorted = resetMoved(this.unsorted);
    const tracker: any[] = [];
    let numbers = this.sorted.map((e) => e.value);
    qs(numbers, 0, numbers.length - 1, tracker);

    this.displayMoves(tracker);
  }

  mergeSort() {
    this.timeouts = resetTimeout(this.timeouts);
    this.sorted = resetMoved(this.unsorted);
    const tracker: any[] = [];
    let numbers = this.sorted.map((e) => e.value);
    console.log(numbers.map((e) => e));
    numbers = mergeSort(numbers, 0, tracker);
    //console.log(numbers);
    this.displayMoves(tracker);
  }

  displayMoves(tracker: any[]) {
    for (let i = 0; i < tracker.length; i++) {
      this.timeouts.push(this.displaySwap(tracker, i, 500 * i));
    }
  }

  displaySwap(tracker: any, i: any, timer: any): any {
    return setTimeout(() => {
      switchElement(this.sorted, tracker[i][0], tracker[i][1]);

      setMoved(this.sorted, false);
      this.sorted[tracker[i][0]].moved = true;
      this.sorted[tracker[i][1]].moved = true;

      this.step = i + 1;
    }, timer);
  }
}
const mergeSort = (array: any[], start: number, tracker: any[]): any[] => {
  var tmp = array.map((e) => e);
  const half = Math.round(tmp.length / 2);

  // Base case or terminating case
  if (tmp.length < 2) {
    return tmp;
  }

  const left = tmp.splice(0, half);
  console.log(left);
  console.log(tmp);
  console.log(start);
  console.log(half);
  return merge(
    mergeSort(left, start, tracker),
    mergeSort(tmp, half + start, tracker),
    start,
    half + start,
    tracker
  );
};

const merge = (
  left: any[],
  right: any[],
  startLeft: number,
  startRight: number,
  tracker: any[]
): any[] => {
  let arr = [];
  let tmpLeft: any = null;
  // console.log(startLeft);
  // console.log(startRight);
  // Break out of loop if any one of the array gets empty
  while (left.length && right.length) {
    // Pick the smaller among the smallest element of left and right sub arrays
    if (left[0] < right[0]) {
      arr.push(left.shift());

      startLeft++;
    } else {
      tracker.push([startLeft, startRight]);
      tmpLeft = startRight;
      arr.push(right.shift());
      startRight++;
    }
  }
  //console.log(tracker.map((e) => e));

  return [...arr, ...left, ...right];
};

const arraycopy = (
  src: any[],
  srcPos: any,
  dst: any[],
  dstPos: any,
  length: any,
  tracker: any[]
) => {
  let j = dstPos;
  let tempArr = src.slice(srcPos, srcPos + length);
  for (let e in tempArr) {
    tracker.push([j, e]);
    dst[j] = tempArr[e];
    j++;
  }
};

const switchElement = (array: any[], i: number, j: number) => {
  const tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
};
/**
 * Set the moved attribute of the element in @numbers with the value @moved
 * @param {any[]} numbers
 * @param {boolean} moved
 */
const setMoved = (numbers: any[], moved: any) => {
  numbers.map((e) => (e.moved = moved));
};

/**
 * Quicksort algorithm
 * https://en.wikipedia.org/wiki/Quicksort
 * @param {any[]} array elements to sort
 * @param {int} start starting index in the array
 * @param {int} end ending index in the array
 * @param {int[][]} tracker moves tracker
 */
const qs = (array: any[], start: any, end: any, tracker: any[]) => {
  if (array.length < 1) return;

  const index = partition(array, start, end, tracker);

  if (start < index - 1) {
    qs(array, start, index - 1, tracker);
  }

  if (index < end) {
    qs(array, index, end, tracker);
  }
};

const resetMoved = (array: any[]): any[] => {
  return array.map((e) => {
    e.moved = false;
    return e;
  });
};

/**
 * Sort a certain part of an array using the quicksort method
 * return the index of the pivot in the array, which means that every value in the left
 * of this index are lower and all the value to the right are upper
 * @param {any[]} array array to sort
 * @param {int} start starting index
 * @param {int} end ending index
 * @param {int[][]} tracker moves tracker
 */
const partition = (array: any[], start: any, end: any, tracker: any[]) => {
  const pivot = array[Math.floor((end + start) / 2)];
  let i = start;
  let j = end;
  while (i <= j) {
    while (array[i] < pivot) i++;

    while (array[j] > pivot) j--;

    if (i <= j) {
      tracker.push([i, j]);
      const tmp = array[j];
      array[j] = array[i];
      array[i] = tmp;
      i++;
      j--;
    }
  }
  return i;
};
