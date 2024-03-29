# BEM

css的样式应用是全局性的，没有作用域可言。考虑以下场景

场景一：开发一个弹窗组件，在现有页面中测试都没问题，一段时间后，新需求新页面，该页面一打开这个弹窗组件，页面中样式都变样了，一查问题，原来是弹窗组件和该页面的样式相互覆盖了，接下来就是修改覆盖样式的选择器...又一段时间，又开发新页面，每次为元素命名都心惊胆战，求神拜佛，没写一条样式，F5都按多几次，每个组件都测试一遍...

场景二：承接上文，由于页面和弹窗样式冲突了，所以把页面的冲突样式的选择器加上一些结构逻辑，比如子选择器、标签选择器，借此让选择器独一无二。一段时间后，新同事接手跟进需求，对样式进行修改，由于选择器是一连串的结构逻辑，看不过来，嫌麻烦，就干脆在样式文件最后用另一套选择器，加上了覆盖样式...接下来又有新的需求...最后的结果，一个元素对应多套样式，遍布整个样式文件...

以往开发组件，我们都用“重名概率小”或者干脆起个“当时认为是独一无二的名字”来保证样式不冲突，这是不可靠的。

理想的状态下，我们开发一套组件的过程中，我们应该可以随意的为其中元素进行命名，而不必担心它是否与组件以外的样式发生冲突。

BEM解决这一问题的思路在于，由于项目开发中，每个组件都是唯一无二的，其名字也是独一无二的，组件内部元素的名字都加上组件名，并用元素的名字作为选择器，自然组件内的样式就不会与组件外的样式冲突了。

这是通过组件名的唯一性来保证选择器的唯一性，从而保证样式不会污染到组件外。

这也可以看作是一种“硬性约束”，因为一般来说，我们的组件会放置在同一目录下，那么操作系统中，同一目录下文件名必须唯一，这一点也就确保了组件之间不会冲突。

BEM的命名规矩很容易记：block-name__element-name--modifier-name，也就是模块名 + 元素名 + 修饰器名。

## ts

``` typescript 
// use-namespace.ts

import { useGlobalConfig } from '../use-global-config'

export const defaultNamespace = 'el'
const statePrefix = 'is-'

const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

export const useNamespace = (block: string) => {
  const namespace = useGlobalConfig('namespace', defaultNamespace)
  const b = (blockSuffix = '') =>
    _bem(namespace.value, block, blockSuffix, '', '')
  const e = (element?: string) =>
    element ? _bem(namespace.value, block, '', element, '') : ''
  const m = (modifier?: string) =>
    modifier ? _bem(namespace.value, block, '', '', modifier) : ''
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(namespace.value, block, blockSuffix, element, '')
      : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? _bem(namespace.value, block, '', element, modifier)
      : ''
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(namespace.value, block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier)
      : ''
  const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  // for css var
  // --el-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key]
      }
    }
    return styles
  }
  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key]
      }
    }
    return styles
  }

  const cssVarName = (name: string) => `--${namespace.value}-${name}`
  const cssVarBlockName = (name: string) =>
    `--${namespace.value}-${block}-${name}`

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    // css
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  }
}

export type UseNamespaceReturn = ReturnType<typeof useNamespace>

```



## sass

``` sass


```