export {};
Number.prototype.thousandsSeperator = function(): string {
  return Number(this)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
String.prototype.isNullOrEmpty = function(this: string): boolean {
  return !this;
};

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};

Array.prototype.firstOrDefault = function(predicate) {
  for (var i = 0; i < (<Array<any>>this).length; i++) {
    let item = (<Array<any>>this)[i];
    if (predicate(item)) {
      return item;
    }
  }
  return null;
};

Array.prototype.where = function(predicate) {
  let result = [];
  for (var i = 0; i < (<Array<any>>this).length; i++) {
    let item = (<Array<any>>this)[i];
    if (predicate(item)) {
      result.push(item);
    }
  }
  return result;
};

Array.prototype.remove = function(item: any): number {
  let index = (<Array<any>>this).indexOf(item);
  if(index < 0) return index;
  let i = 1, r, n = this.length;
  if (!(index >= n || 0 === i)) {
      let o = n - (i = index + i > n ? n - index : i);
      for (r = index; r < o; ++r) this[r] = this[r + i];
      this.length = o
  }
  return index;
};
Array.prototype.clear = function() {
  this.length = 0;
};

Array.prototype.removeRange = function(items: any[]): void {
  for (var i = 0; i < items.length; i++) {
    (<Array<any>>this).remove(items[i]);
  }
};

Array.prototype.add = function(item: any): void {
  (<Array<any>>this).push(item);
};

Array.prototype.addRange = function(items: any[]): void {
  for (var i = 0; i < items.length; i++) {
    (<Array<any>>this).push(items[i]);
  }
};
