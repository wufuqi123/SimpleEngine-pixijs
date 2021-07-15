export class HashMap<K, V> {
    private mMap = new Map();
    private mKeyMap: Map<any, K> = new Map();

    clear() {
        this.mMap.clear();
        this.mKeyMap.clear();
    }
    get size(): number {
        return this.mMap.size;
    }

    keys():Array<K>{
        let arr = new Array();
        this.mKeyMap.forEach(v=>{
            arr.push(v);
        })
        return arr;
    }
    values():Array<V>{
        let arr = new Array();
        this.mMap.forEach(v=>{
            arr.push(v);
        })
        return arr;
    }

    forEach(callbackfn: (v: V, k: K) => void) {
        this.mMap.forEach((v: V, k: K) => {
            let olk = <any>k;
            callbackfn(v, <K>this.mKeyMap.get(olk));
        });
    }
    delete(key: K) {
        let olKey = <any>key;
        if (olKey.hashCode) {
            olKey = olKey.hashCode();
        }
        this.mMap.delete(olKey);
        this.mKeyMap.delete(olKey);
    }
    set(key: K, value: V) {
        let olKey = <any>key;
        if (olKey.hashCode) {
            olKey = olKey.hashCode();
        }
        this.mMap.set(olKey, value);
        this.mKeyMap.set(olKey, key);
    }
    get(key: K): V {
        let olKey = <any>key;
        if (olKey.hashCode) {
            olKey = olKey.hashCode();
        }
        return this.mMap.get(olKey);
    }

    has(key: K): boolean {
        let olKey = <any>key;
        if (olKey.hashCode) {
            return this.mMap.has(olKey.hashCode());
        } else {
            return this.mMap.has(olKey);
        }
    }
}