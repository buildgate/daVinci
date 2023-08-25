#### !!重大更新 1.1.0 快照渲染暂时删除。考虑到 getImageData 和 putImageData 的效率比较消耗性能，而且生成的 imageData 是无压缩数据，占用空间将会很大，当角色数量增加时，占用空间和性能花销会逐渐使得快照渲染无优势，这样反而会本末倒置，所以暂时取消快照渲染，后续考虑使用脏矩形渲染作为性能优化的替代，对于多个重复的元素建议使用自定义渲染来提升性能。

# Davinci 轻量级 canvas 交互引擎

## 简介

Davinci 是一款将画布里的图形对象化处理并且可以由数据驱动图形的轻量级 canvas 插件。已发布至 npm：[@buildgate/davinci ](https://www.npmjs.com/package/@buildgate/davinci)

### [开发文档 ](https://buildgate.github.io/daVinci/#/learn/brief) 或者 运行

```
npm run dev
```

## 安装使用

```
npm i @buildgate/davinci
```

## 设计思路

这个轻量级引擎得益于本人此前接触过其他入 unity 开发引擎，设计思路也从中获得灵感。

首先将画布里的元素抽象出来，因为画布并不像 DOM 一样，画布在渲染后就完全不会再托管里面的内容，只会保留路径，路径其实也没有托管起来，只是暂存起来而已。将元素抽象出来后，就需要区分视觉层和交互层。视觉层只在渲染的时候处理，交互层是触发鼠标事件的时候处理。二者相互独立，由抽象元素沟通。实际上这个设计方案有点像 vue 使用了 vnode 的方案，频繁渲染视觉层必然会消耗巨大的性能，相对来说交互层的耗能是非常小的，因为每次只需要关注一个元素即可。

完成元素的抽象化处理之后就要面对更多细节的问题。纹理渲染是一个很重要的部分，如果实现纹理渲染之后，完全可以将所有视觉层等效替换，不过这样对美工的要求比较高，所以我保留了视觉层的图形选项，这样也有利于使用精灵图渲染。因为画布的 pattern 的位置是永远在（0，0）的位置开始渲染的，所以当元素位移变换时就会出现渲染问题，最终在查阅了很多资料后，发现可以使用 svg 对 pattern 进行变换，所以最后就使用了局部 svg 的方案。

最后就是任何程序都面临的一个问题：性能。如果每次渲染从底层开始绘制，那么当图形路径很复杂或者图形变换速度很快时，必然导致巨大的计算量。最后我发现是可以将每一层的画布缓存起来，每次渲染都缓存一次，每次画布元素变化时传入 uid，如果是 uid 的下层则不重新渲染，本层这使用缓存，上层则重新渲染，这样就可以加速渲染了。虽然这种做法会牺牲更多的存储空间，但是对于需要频繁操作的画布，用空间换速度是值得的。

后续会加入更多便利性的内容。
