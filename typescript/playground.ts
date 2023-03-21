
function loggedMethod(originalMethod: any, _context: any) {

    function replacementMethod(this: any, ...args: any[]) {
        console.log("LOG: Entering method.")
        const result = originalMethod.call(this, ...args);
        console.log("LOG: Exiting method.")
        return result;
    }

    return replacementMethod;
}

class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    @loggedMethod
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("Ray");
p.greet();

type TestLast<Arr extends string[]> = Arr extends [...infer Rest,infer Last extends string] ? `最后一个是:${Last}` : never;

type NumInfer<Str> = Str extends `${infer Num extends number}` ? Num : never;

type res = NumInfer<'123'>


