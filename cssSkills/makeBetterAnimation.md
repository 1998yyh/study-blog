# 更好的过度和动画

当我们面对一个产品的时候, 可能不知道为什么这个更好，或者什么具体的细节让那个更糟糕，但你肯定地、直观地、毫无疑问地知道它是好的或者不好的设计.

同样，用户可能不会意识到我们网站和应用程序上的过渡或动画是什么，但他们可以敏锐地发现好坏之间的区别。他们凭直觉知道什么时候应用程序的运行感觉良好，什么时候这种印象是一般的或未经打磨的——即使他们无法解释是如何或为什么。


## 1. 缩短动画时间

我明白;如果你刚刚投入了时间和精力来创造一个伟大的过渡，你会想要享受它。如果你像我(和大多数其他开发人员)一样，你甚至可能只是坐在那里欣赏你的幻想动画，高兴地看着它来回转换。但问题是:

您的用户不像您那样迷恋—因此也不像您那样耐心。他们来这里是为了完成一些事情，他们对等待任何事情不感兴趣，不管它有多酷。

我的建议是:尽量让你的过渡尽可能快，但不至于过快而导致用户可能会错过他们。根据经验，大多数单一过渡在150-400毫秒范围内(0.15到0.4秒)工作得最好。如果您接连的转换(例如，当一个元素移出然后另一个元素移进来)，您可以将其增加一倍，并在它们之间添加一点时间。(你肯定不希望两个独立动画同时出现)

但是也有例外, 如果是整个页面的动画, 我们会希望它慢一点. 当一只苍蝇从你身边飞驰而过时，感觉很正常，但当一辆公共汽车从你身边疾驰而过时感觉很紧张。不要让大的变化过得太快。

## 2. 使曲线与运动相配

诚然，这说起来容易做起来难。你可能会说:“好的，很好，但是我怎么知道在任何给定的情况下使用哪种立方bézier曲线呢?”

令人不满意的答案是:试错法(也就是经验)是最好的老师。

有一个技巧要记住:当你试验时，想象现实世界中的运动，并将其与你在应用程序中处理的运动进行比较。这种转变是一种积极的确认，出现并滑动到位吗?这可能需要一个快速的进入，平稳但迅速地结束，就像一个急切的帮手跑过来报告他们的任务完成了。

比如: 屏幕上出现失败消息会怎样? 这可能需要稍微放慢放松曲线的速度，以表明稍有不情愿。

如果是一些需要立即了解的重要内容，那么速度和可见性将是优先考虑的。如果情况非常严重，甚至可能需要更激烈的动作(比如摇晃)，以传达严重程度，并在需要的地方引起注意。

所以建议是:花点时间，问问这个动作是否传达了合适的感觉。


## 3. 加速和减速

在现实世界中，我们几乎看不到任何类型的运动立即跳到最大速度，或者立即完全停止。因此，如果我们避免了产生这种移动的曲线，我们的ui将看起来更“真实”和直观。

当一个动画看起来有些不对劲时，很可能是因为它以不自然的突然开始或结束。

即使它是轻微的，我仍然建议在你的三次bezier曲线中添加一点放松。这种微小但可察觉的加速和/或减速可能是感觉平稳的过渡和看起来有点偏离的过渡之间的区别。

<iframe allowfullscreen="true" allowpaymentrequest="true" allowtransparency="true" class="cp_embed_iframe " frameborder="0" height="426" width="100%" name="cp_embed_1" scrolling="no" src="https://codepen.io/collinsworth/embed/poORdVo/6a29e9ec4ceb068892a7b77211864139?height=626&amp;default-tab=result&amp;slug-hash=poORdVo&amp;user=collinsworth&amp;token=6a29e9ec4ceb068892a7b77211864139&amp;name=cp_embed_1" style="width: 100%; overflow:hidden; display:block;" title="CodePen Embed" loading="lazy" id="cp_embed_poORdVo"></iframe>

注意上面的第一个和第二个方格的开始和结束似乎太突然了。

第三个“平滑”选项的效果更好，因为它的自定义曲线在加速和减速时更加优雅的运动。

如果你想进一步制作动画，让它感觉像是应用了真实世界的物理，那么第四个“惯性”选项也很管用;它“上弦”并超调，就像由弹簧驱动一样。(请记住:对于这种类型的动画来说，一点就很重要。)

## 4. 少即是多

很多建议可以很好地总结为“少即是多”。我经常需要听到的一句话是:不是所有的事情都需要过渡。

当你专注于制作尽可能令人印象深刻的动画时，很容易走极端。然而，当涉及到使用CSS进行转换时，低调通常比夸张更好。

一个元素在动画中变化越多，过渡的风险就越大。

如果你的动画不透明度从0到1，也许可以尝试一个较小的范围，比如0.4到1。如果你的元素放大到全尺寸，试着让它开始时稍微小一点，而不是小到看不见。

元素是否滑动到位?我发现在大多数情况下，这样的移动应该在大约5-40像素的范围内。再少一点，运动可能太微妙了，甚至注意不到;再多的话，一次灵巧的滑行就可能变成一次笨拙的碰撞。

做得太多可能比什么都不做更糟糕。因此，要找到过渡到足以有效的点，如果你更进一步，要谨慎行事。

## 5. 避免浏览器默认设置

您可能已经知道浏览器有一些内置的缓动曲线可供使用:线性、缓动、缓入、缓出和缓入-出。

然而，虽然这五个命名的计时函数很方便，但它们也非常通用。(许多内置于在线工具和库中的动画都是同质化的牺牲品，即使它们确实提供了更广泛的选择。)

如果你想从运动中得到最大的收获，你应该超越最常见的现成的命名选项。


每个主流浏览器都有一个简化面板，可以作为沙盒来尝试不同的选项并进行调整。要访问它，打开开发工具，并单击CSS样式面板中立方-bezier值旁边的曲线图标。


## 6. 多重属性 多重动画

虽然这并不总是很方便，但有时你会在一个元素上同时动画多个属性，比如当你用transform缩放一个项目时，它的不透明度也会发生变化。

![](https://pic.imgdb.cn/item/6401a924f144a0100773dd04.jpg)

视情况而定，这可能看起来不错。然而，在某些情况下，相同的曲线并不适用于正在转换的每个属性。

对于变换效果很好的缓和曲线可能并不适合渐变效果。这时为每个CSS属性设置一个唯一的easing效果就很方便了。

在这些情况下，你可以通过属性拆分@keyframes动画，或者指定多个过渡。然后，你可以为每个属性指定不同的曲线，因为过渡和动画都可以接受多个值:

<iframe allowfullscreen="true" allowpaymentrequest="true" allowtransparency="true" class="cp_embed_iframe " frameborder="0" height="443" width="100%" name="cp_embed_2" scrolling="no" src="https://codepen.io/collinsworth/embed/NWLdLGW?height=443&amp;default-tab=result&amp;slug-hash=NWLdLGW&amp;user=collinsworth&amp;name=cp_embed_2" style="width: 100%; overflow:hidden; display:block;" title="CodePen Embed" loading="lazy" id="cp_embed_NWLdLGW"></iframe>


## 7. Ins go out, outs go in

如果你看过各种各样的缓和曲线，你可能会注意到它们趋向于三种类型:缓和进入(开始更慢)，缓和退出(结束更慢)，以及输入-输出(本质上是两者兼而有之;中间快，开头和结尾慢)。

过渡的棘手之处在于:您通常希望您的过渡进入是一个轻松退出，而您的过渡输出是一个轻松进入。

你有一个动画，其中一个元素离开页面，另一个元素出现在它的位置，就像页面转换，或在灯箱中的两个图像之间滑动。

用户认为这是一次UI转换。但实际上，它是两个转换:旧元素离开，然后是新元素进入。

这意味着如果你要转移一个元素出去，并且你想让它慢慢开始，你需要一个缓进。

相反，当一个元素正在过渡时，它通常应该逐渐停止。这就需要放松。

这两者结合在一起，创造出一个无缝动作的效果。


## 8. 依靠硬件加速

并不是所有的CSS属性都可以在所有设备和浏览器上流畅地动画或转换。事实上，只有少数几个属性能够利用设备的硬件加速来实现最平稳、最高帧率的过渡。

总是可以硬件加速的属性:

变换(包括各种形式的平移、缩放和旋转，以及所有对应的3d)
不透明度


仅仅因为某些东西可以被硬件加速并不意味着它就会被硬件加速。

它可能会选择退出的一个潜在原因是:GPU速度更快，但能耗也更高。因此，如果设备电量不足，或者处于节电模式，浏览器可能会选择电量而不是图形性能。


## 9. 根据需要使用will-change

如果你确实遇到了动画问题，理论上应该是流畅的，但实际上似乎是起伏的或生硬的(再次强调:对我来说这通常是在Safari中，但你的情况可能会有所不同)，请使用will-change属性。

我不会过多地讨论技术细节，但是will-change本质上是给浏览器一个提示……嗯，什么将会改变。(有些东西就是有完美的名字。)


例如:如果你确定一个元素唯一要改变的是它的transform属性，并且可以自信地通过will-change: transform提前让浏览器知道，那么当页面上的某些内容发生变化时，它可以安全地跳过所有其他步骤来重新呈现该元素


## 参考

> [https://joshcollinsworth.com/blog/great-transitions?utm_source=CSS-Weekly&utm_campaign=Issue-541&utm_medium=email](https://joshcollinsworth.com/blog/great-transitions?utm_source=CSS-Weekly&utm_campaign=Issue-541&utm_medium=email)