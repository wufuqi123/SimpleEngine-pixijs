declare global {
  interface Number {
    thousandsSeperator(): String;
  }
  interface Array<T> {
    firstOrDefault(predicate: (item: T) => boolean): T;
    where(predicate: (item: T) => boolean): T[];
    remove(item: T): number;
    add(item: T): void;
    clear(): void;
    addRange(items: T[]): void;
    removeRange(items: T[]): void;
  }
  interface String {
    isNullOrEmpty(this: string): boolean;
    format(...replacements: string[]): string;
  }
}
export {};
