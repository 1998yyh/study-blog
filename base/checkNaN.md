```JS
const obj = {
    [+0]: 1,
    [-0]: 2
}

const map = new Map();

map.set(+0, 1)
map.set(-0, 2)

console.log(obj[+0], obj[-0]);
console.log(map.get(+0), map.get(-0));

console.log({
    NaN: NaN
}.hasOwnProperty(NaN));
console.log([NaN].indexOf(NaN));
console.log([NaN].includes(NaN));

function fn() {
    setTimeout(() => {
        return Promise.resolve(1)
    }, 1000);
}
```
