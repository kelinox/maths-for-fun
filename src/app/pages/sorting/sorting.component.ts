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
  size = 30;
  maxItem = 100;
  timeouts: any[] = [];
  paused = false;
  tracker = [];
  step = -1;
  animation = true;
  running = false;
  animationSpeed = 1;

  constructor() {}

  ngOnInit(): void {}

  stop() {
    this.timeouts = resetTimeout(this.timeouts);
    this.running = false;
    this.sorted = copyArrayJSON(this.unsorted);
  }

  reset() {
    this.timeouts = resetTimeout(this.timeouts);
    this.running = false;
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
        color: 0,
      });
    }

    numbers.forEach((e) => {
      e.color = intToHex(e.value / this.maxItem);
    });

    this.unsorted = numbers;
    this.sorted = copyArrayJSON(this.unsorted);
    this.max = max;
  }

  bubbleSort() {
    this.running = true;
    this.timeouts = resetTimeout(this.timeouts);
    this.sorted = copyArrayJSON(this.unsorted);

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
    this.running = true;
    this.timeouts = resetTimeout(this.timeouts);
    this.sorted = copyArrayJSON(this.unsorted);
    const tracker: any[] = [];
    let numbers = this.sorted.map((e) => e.value);
    qs(numbers, 0, numbers.length - 1, tracker);

    this.displayMoves(tracker);
    console.log(this.unsorted.map((e) => e));
  }

  mergeSort() {
    this.running = true;
    this.timeouts = resetTimeout(this.timeouts);
    this.sorted = copyArrayJSON(this.unsorted);
    const tracker: any[] = [];
    let numbers = this.sorted.map((e) => e.value);
    numbers = mergeSort(numbers, 0, tracker);
    this.displayMovesMergeSort(tracker);
  }

  displayMoves(tracker: any[]) {
    for (let i = 0; i < tracker.length; i++) {
      this.timeouts.push(
        this.displaySwap(tracker, i, animationSpeed(this.animationSpeed) * i)
      );
    }
  }

  displayMovesMergeSort(tracker: any[]) {
    tracker.forEach((e, index) => {
      this.timeouts.push(
        setTimeout(() => {
          for (let i = 0; i < e.tmp.length; i++) {
            this.sorted.forEach((x) => (x.moved = false));
            this.sorted[i + e.startLeft].value = e.tmp[i];
            this.sorted[i + e.startLeft].color = intToHex(
              e.tmp[i] / this.maxItem
            );
            this.sorted[i + e.startLeft].moved = true;

            if (index === tracker.length - 1 && i === e.tmp.length - 1) {
              this.running = false;
            }
          }
        }, animationSpeed(this.animationSpeed) * index)
      );
    });
  }

  displaySwap(tracker: any, i: any, timer: any): any {
    return setTimeout(() => {
      switchElement(this.sorted, tracker[i][0], tracker[i][1]);

      this.sorted = setMoved(this.sorted, false);
      this.sorted[tracker[i][0]].moved = true;
      this.sorted[tracker[i][1]].moved = true;

      this.step = i + 1;
      if (i === tracker.length - 1) this.running = false;
    }, timer);
  }
}
const mergeSort = (array: any[], start: number, tracker: any[]): any[] => {
  var tmp = array.map((e) => e);
  const half = Math.round(tmp.length / 2);

  if (tmp.length < 2) {
    return tmp;
  }

  const left = tmp.splice(0, half);
  return merge(
    mergeSort(left, start, tracker),
    mergeSort(tmp, half + start, tracker),
    start,
    tracker
  );
};

const merge = (
  left: any[],
  right: any[],
  startLeft: number,
  tracker: any[]
): any[] => {
  let arr = [];

  // Break out of loop if any one of the array gets empty
  while (left.length && right.length) {
    // Pick the smaller among the smallest element of left and right sub arrays
    if (left[0] < right[0]) {
      arr.push(left.shift());
    } else {
      arr.push(right.shift());
    }
  }

  const tmp = [...arr, ...left, ...right];
  if (tmp.length > 0) {
    tracker.push({
      startLeft,
      tmp: tmp.map((e) => e),
    });
  }
  return tmp;
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
const setMoved = (numbers: any[], moved: boolean) => {
  return numbers.map((e) => {
    return { value: e.value, moved, color: e.color };
  });
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

const animationSpeed = (speed: any): number => {
  switch (speed) {
    case '1':
      return 5;
    case '2':
      return 25;
    case '3':
      return 100;

    default:
      return 5;
  }
};

const copyArrayJSON = (array: any[]): any[] => {
  return JSON.parse(JSON.stringify(array));
};

const intToHex = (colorNumber: number) => {
  function toHex(n: any) {
    n = n.toString(16) + '';
    console.log(n);
    return n.length == 2 ? n : new Array(2 - n.length + 1).join('0') + n;
  }

  var r = Math.round(colorNumber * 256),
    g = 125, //toHex(Math.floor(colorNumber / 256) % 256),
    b = 0; //toHex(colorNumber % 256);
  return `rgba(${r}, 125, 0, 1)`;
};
