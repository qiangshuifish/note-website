# 09 | 控制结构：for循环的进化与新语义

你好，我是 Tony Bai。

```
在 Go 的世界里，如果你想重复执行一段代码，只有一个选择——那就是 for 循环。不像其
他语言提供了 while、do-while 等多种循环，Go 的设计者们选择了“少即是多”，用一种统
一的 for 结构来应对所有循环场景。
这种简洁性是 Go 的魅力之一，但并不意味着 for 循环就一成不变、毫无“坑”点。恰恰相反，
作为 Go 程序逻辑的核心骨架，for 循环自身也在不断“进化”：
你是否曾被 for range 中那个难以捉摸的“循环变量重用”问题困扰过？甚至因此写出过隐
```

- 藏的 bug？

```
Go 1.22 版本对 for 循环的语义做了哪些关键的修正？这对我们的日常编码意味着什么？
最新的 Go 1.23 版本又为 for range 带来了什么激动人心的新能力——自定义迭代器？
```

- 它将如何改变我们遍历数据的方式？

不理解 for 循环的这些“陷阱”和“进化”，你可能会在并发编程中踩坑，或者错过利用新特性提升代码表达力和灵活性的机会。

```
这节课，我们就来深入剖析 Go 的 for 循环，从基础到演进，彻底搞懂它。我们将一起：
回顾 for 循环的基础用法和常见模式，并点出历史遗留的“陷阱”。
```

2. 理解 Go 1.22+ 对循环变量语义的关键变更及其影响。

```
探索 Go 1.23+ 引入的 range over func（自定义迭代器）这一强大的新特性。
掌握 for 循环的过去、现在与未来，才能更好地驾驭 Go 的控制流。
```

## for 循环基础：常见模式与历史陷阱

```
虽然 Go 只有一个 for 关键字，但它足够灵活，可以模拟其他语言中的多种循环模式。
```

### 基础形式回顾

- 三段式 for （类 C 风格）

这是最经典、最完整的 for 循环形式，包含初始化、条件和后置语句。

```go
// 计算 0 到 9 的和
sum := 0
for i := 0; i < 10; i++ { // 初始化; 条件; 后置语句
   sum += i
}
fmt.Println(sum) // 输出 45
```

- 条件式 for （类 while 风格）

这种 for 语句形式省略了初始化和后置语句，只保留条件判断。

```go
n := 1
for n < 5 { // 只有条件
   n *= 2
}
fmt.Println(n) // 输出 8 (1 -> 2 -> 4 -> 8)
```

- 无限循环（for {}）

这种形式 for 循环省略了三段式 for 循环形式的所有部分，形成一个无限循环，通常需要配合

```
break 或 return 语句来退出。
for {
   fmt.Println("Looping forever... (or until break/return)")
   // if someCondition { break }
   time.Sleep(1 * time.Second) // 避免CPU空转
   // break // 示例，实际需要退出条件
}
```

- for range 循环

这是 Go 中最常用的循环形式之一，也是用于迭代各种数据集合（数组、切片、字符串、map、channel）的利器。

```go
// 迭代切片
items := []string{"apple", "banana", "cherry"}
for index, value := range items {
   fmt.Printf("Index: %d, Value: %s\n", index, value)
}
// 迭代字符串 (按 rune)
str := "Go语言"
for index, char := range str { // index 是字节索引, char 是 rune
   fmt.Printf("Byte Index: %d, Char: %c\n", index, char)
}
// 迭代 map (顺序随机)
m := map[string]int{"one": 1, "two": 2}
for key, value := range m {
   fmt.Printf("Key: %s, Value: %d\n", key, value)
}
// 迭代 channel (直到关闭)
ch := make(chan int, 2) // 带缓冲channel，不会导致下面语句执行阻塞
ch <- 1
ch <- 2
close(ch)
for value := range ch {
   fmt.Printf("Received from channel: %d\n", value)
}
```

Go 1.22 版本还增加了 for range 对 int 的迭代支持，前面三段式 for 形式的示例，可以改写为下面等价的形式：

```go
for i := range 10 { // [0, 10)
   sum += i
}
fmt.Println(sum) // 45
我们看到：for i:= range n 将从 0 迭代到 n-1。如果只是需要迭代 n 次，而不需要循环
```

变量，也可以写为：

```
for range 10 {
   //... ...
}
```

### for range 的历史陷阱（Go 1.22 之前）

```
for range 虽然方便，但在 Go 1.22 版本之前，存在一个非常容易让人掉坑的设计：循环变
```

量重用（Loop Variable Reuse）。

```go
简单来说，for index, value := range collection 这句声明中的 index 和 value
```

变量，在整个循环过程中只会被创建一次。每次迭代时，Go 只是将集合中当前元素的值赋给这两个已经存在的变量。

这在同步代码中通常没问题，但一旦涉及到并发（启动 goroutine）或闭包（创建匿名函数），并且这些 goroutine 或闭包捕获了循环变量时，问题就来了。

下面就是一个经典的并发陷阱的示例：

```go
func main() {
   var wg sync.WaitGroup // 使用 WaitGroup 等待 goroutine 完成
   values := []string{"a", "b", "c"}
   for _, v := range values {
       wg.Add(1)
       // 启动 goroutine，它捕获了循环变量 v
       go func() {
           defer wg.Done()
           time.Sleep(10 * time.Millisecond) // 模拟一些延迟，让循环先跑完
           fmt.Println(v) // 打印 v 的值
       }()
   }
   wg.Wait() // 等待所有 goroutine 执行完毕
}
```

在 Go 1.22 之前运行，你很可能会看到输出：

```
c
c
c
为什么呢？因为所有三个 goroutine 都引用了同一个变量 v。当这些 goroutine 真正开始执行
fmt.Println(v) 时（由于 Sleep，循环通常已经结束），变量 v 存储的是最后一次迭代的
```

值，也就是 “c”。

下面再来看一个与 for range 有关的经典闭包陷阱的示例：

```go
func main() {
   var funcs []func()
   for i := 0; i < 3; i++ {
       // 创建闭包，捕获循环变量 i
       funcs = append(funcs, func() {
           fmt.Println(i)
       })
   }
   // 执行这些闭包
   for _, f := range funcs {
       f()
   }
}
```

在 Go 1.22 之前运行，输出是：

```
3
3
3
原因同上：所有三个闭包都引用了同一个变量 i。当它们被调用执行时，循环早已结束，变量
i 的最终值是 3。
```

在 Go 1.22 之前，为了解决这个问题，开发者们不得不在循环体内显式地创建一个循环变量的副本，比如：

```go
// 并发示例规避
for _, v := range values {
   v := v // 创建 v 的副本，goroutine 捕获的是这个副本
   wg.Add(1)
   go func() { /* ... use v ... */ }()
}
// 闭包示例规避
for i := 0; i < 3; i++ {
   i := i // 创建 i 的副本
   funcs = append(funcs, func() { fmt.Println(i) })
}
这种 v := v 或 i := i 的写法虽然有效，但看起来有点奇怪，也容易忘记。这个长期存在
```

的“坑”给无数 Go 开发者带来了困扰。幸运的是，Go 团队终于在 1.22 版本解决了它。

## 关键变更：理解 Go 1.22+ 循环变量新语义

```
Go 1.22 版本带来了一个对 for 循环（包括三段式 for 和 for range）语义十分重大、也
```

是开发者期待已久的变更：从 Go 1.22 开始，每次循环迭代都会创建循环变量的新实例。这意味着，不再有“循环变量重用”的问题了！ 下面是新语义带来的一些影响。

- 并发代码更符合直觉

```
现在，前面那个并发陷阱的示例代码，在 Go 1.22+ 环境下运行，会输出 a、b、c 的某种排
```

列组合（具体顺序取决于 goroutine 调度），因为每个 goroutine 捕获的是其创建时那次迭代

```
的、独立的 v 变量副本。
```

- 闭包代码更符合直觉

同样，前面闭包陷阱的示例代码，在 Go 1.22+ 下运行，会输出：

```
0
1
2
因为每个闭包捕获的是其创建时那次迭代的、独立的 i 变量副本。
```

- 不再需要手动创建副本

```go
类似 v := v 或 i := i 这种为了规避旧语义陷阱的写法，在 Go 1.22+ 中不再需要了。新
```

语义本身就保证了每次迭代变量的独立性。

不过，考虑到向后兼容性，为了不破坏依赖旧语义的现有代码，这个新的循环变量语义是选择

```
性启用的。它只对满足以下条件的包生效：该包所在的 Go 模块，其 go.mod 文件中声明了
```

Go 1.22 或更高的版本（例如 Go 1.22 或 Go 1.23）。

```
如果你的 go.mod 文件写的是 Go 1.21 或更低版本，即使你使用 Go 1.22 或更高版本的编译
```

器编译，循环变量的行为仍然是旧的、重用的语义。这给了项目逐步迁移到新语义的缓冲期。

Go 1.22 的这项改进，极大地简化了在循环中编写并发和闭包代码的复杂度，消除了一个长期存在的痛点，让 Go 代码更安全、更符合直觉。对于新项目或已迁移到 Go 1.22+ 的项目，这是一个非常受欢迎的变化。

## range over func：探索 Go 1.23+ 函数迭代器

```
Go 1.22 解决了历史遗留问题，而 Go 1.23 则为 for range 带来了令人兴奋的新功能：支持
```

对函数进行 range 迭代，也就是所谓的自定义迭代器（Custom Iterators）或函数迭代器（Function Iterators）。

```
在 Go 1.23 之前，for range 只能用于内置的几种类型（整型 - Go 1.22+、数组、切片、字
符串、map、channel）。现在，我们可以让 for range 遍历任何我们想遍历的序列，只要我
```

们提供一个符合特定规范的迭代器函数。

### 什么是迭代器函数？

简单来说，迭代器函数是一个特殊的函数，它负责生成序列中的下一个元素，并通过一个回调

```
函数（通常命名为 yield）将元素“产出”给 for range 循环。
Go 1.23 在新的标准库 iter 包中定义了迭代器函数的标准签名：
package iter
// Seq[V] 代表一个产生 V 类型值的迭代器函数
type Seq[V any] func(yield func(V) bool)
// Seq2[K, V] 代表一个产生 K, V 类型键值对的迭代器函数
type Seq2[K, V any] func(yield func(K, V) bool)
我们看到迭代器函数本身（Seq 或 Seq2）接受一个 yield 函数作为参数。yield 函数则是
由 for range 循环隐式提供的。迭代器函数负责在内部逻辑中调用 yield 来“推送”元素给
```

循环。

```
yield 函数返回一个 bool 值。返回 true 表示循环应该继续接收下一个元素；返回 false
表示循环请求提前停止（例如因为循环内部执行了 break）。迭代器函数收到 false 后应该
```

立即停止产生元素并返回。

### 如何创建和使用自定义迭代器？

```go
让我们看一个具体的例子。假设我们想让 for range 能够逆序遍历一个切片：
package main
import (
   "fmt"
   "iter" // 导入 iter 包
)
// Backward 返回一个逆序遍历切片的迭代器函数
func Backward[E any](s []E) iter.Seq2[int, E] {
   // 返回符合 iter.Seq2 签名的函数
   return func(yield func(int, E) bool) {
       // 从后往前遍历
       for i := len(s) - 1; i >= 0; i-- {
           // 调用 yield "产出" 索引和元素
           // 如果 yield 返回 false，立即停止迭代
           if !yield(i, s[i]) {
               return
           }
       }
   }
}
func main() {
   data := []string{"a", "b", "c"}
   // 使用 for range 遍历我们自定义的 Backward 迭代器
   for i, s := range Backward(data) {
       fmt.Printf("Index: %d, Value: %s\n", i, s)
       if i == 1 { // 演示提前 break
           break
       }
   }
}
```

运行这个示例，你将看到如下输出：

```
Index: 2, Value: c
Index: 1, Value: b
```

究竟发生了什么？我们通过下面“分解动作”来理解一下 for range 与函数迭代器的工作原理：

```
Backward(data) 返回了一个闭包（迭代器函数）。
for range 接收到这个函数。
for range 内部创建了一个 yield 函数，并调用我们返回的迭代器函数，将 yield 传
```

- 给它。

```
迭代器函数内部开始执行 for 循环（从后往前）。
第一次迭代（i=2），调用 yield(2, "c")。yield 内部将 2 和 "c" 赋值给 for
range 左侧的 i 和 s，执行循环体 fmt.Println(...)。yield 返回 true。
第二次迭代（i=1），调用 yield(1, "b")。同样，赋值、执行循环体。循环体执行了
break。yield 函数感知到 break，于是返回 false。
迭代器函数内部检查到 yield 返回 false，执行 return，迭代结束。
```

实际上，Go 编译器是将 for range 循环：

```go
for i, s := range Backward(data) {
   fmt.Printf("Index: %d, Value: %s\n", i, s)
   if i == 1 { // 演示提前 break
       break
   }
}
```

重写为了下面的代码：

```go
Backward(data)(func(#p1 int, #p2 string) bool {
   i, x := #p1, #p2
   fmt.Printf("Index: %d, Value: %s\n", i, x)
   if i == 1 {
       return false
   }
   return true
})
```

我们看到原 for range 代码中的 break 语句将终止循环的运行，那么转换为 yield 函数后，就相当于 yield 返回 false。

如果 for range 中有 return 语句呢？Go 编译器会如何转换 for range 代码呢？我们改造一下示例代码：

```go
data := []string{"a", "b", "c"}
for i, s := range Backward(data) {
   fmt.Printf("Index: %d, Value: %s\n", i, s)
   if i == 1 {
       return
   }
}
```

Go 编译器会将上述代码转换为类似下面的代码：

```go
{
   var #next int
   Backward(data)(func(#p1 int, #p2 string) bool {
       i, x := #p1, #p2
       fmt.Printf("Index: %d, Value: %s\n", i, x)
       if i == 1 {
           #next = -1
           return false
       }
       return true
   })
   if #next == -1 {
       return
   }
}
```

我们看到，由于 yield 函数只是传给 iterator 的输入参数，它的返回不会影响外层函数的返回，于是转换后的代码会设置一个标志变量（这里为 #next），对于有 return 的 for range，会在 yield 函数中设置该变量的值，然后在 Backward 调用之后，再次检查一下该变量，以决定是否调用 return 从函数中返回。

如果 for range 的 body 中有 defer 调用，那么 Go 编译器会又是如何做代码转换的呢？我们看下面示例：

```go
data := []string{"a", "b", "c"}
for i, s := range Backward(data) {
   defer fmt.Printf("Index: %d, Value: %s\n", i, s)
}
```

我们知道 defer 的语义是在函数 return 之后按“先进后出”的次序执行，那么直接将上述代码转换为如下代码是否 ok 呢？

```go
Backward(data)(func(#p1 int, #p2 string) bool {
   i, x := #p1, #p2
   defer fmt.Printf("Index: %d, Value: %s\n", i, x)
})
```

这显然不行！这样转换后的代码，deferred function 会在每次 yield 函数执行完就执行了，而不是在 for range 所在的函数返回前执行！为此，Go 团队在 runtime 层增加了一个deferprocat 函数，用于代码转换后的 deferred 函数执行。上面的示例将被 Go 编译器转换为类似下面的代码：

```go
var #defers = runtime.deferrangefunc()
Backward(data)(func(#p1 int, #p2 string) bool {
   i, x := #p1, #p2
   runtime.deferprocat(func() { fmt.Printf("Index: %d, Value: %s\n", i, x) }, #d
})
```

到这里，我们所举的代码示例，其实都还是比较简单的情况！还有很多复杂的情况，比如break/continue/goto+label 的、嵌套 loop、loop 中代码 panic 以及 iterator 自身 panic 等，是不是想想就复杂呢！更多复杂的转换代码这里不展开了，展开的也很可能不对，这本来就是Go 编译器的事情。如果哪个小伙伴要了解转换的复杂逻辑，可以自行阅读 Go 项目库中的cmd/compile/internal/rangefunc/rewrite.go。

### Pull 迭代器 vs Push 迭代器

```
我们上面定义的 iter.Seq 和 iter.Seq2 属于 Push 风格的迭代器：迭代器主动控制流
程，将元素“推送”给 yield。
```

还有另一种 Pull 风格的迭代器，它更像传统的迭代器模式：由调用者控制流程，每次调用

```
Next() 方法来“拉取”下一个元素。在一些其他语言中，Pull 迭代器也被称为外部迭代器
```

（External Iterator)，即主动通过迭代器提供的类 next 方法从中获取数据。

```go
Go 标准库 iter 包提供了 Pull 函数，可以将 Push 迭代器转换为 Pull 迭代器：
// 将 Push 迭代器 s 转换为 Pull 迭代器
// next() 返回下一个元素和是否有效的布尔值
// stop() 用于提前释放迭代器可能持有的资源 (如果有的话)
next, stop := iter.Pull(s)
defer stop() // 推荐使用 defer stop()
for {
   value, ok := next()
   if !ok { // 没有更多元素了
       break
   }
   // 处理 value
}
```

Pull 迭代器在需要更精细控制迭代（如并行处理、合并多个序列）时很有用，但 Pull 迭代器是不能直接对接 for range 的。此外要注意的是 Pull/Pull2 返回的 next、stop 不能在多个Goroutine 中使用。Russ Cox 很早就在其个人博客上对 Go iterator 的实现方式进行了铺垫，他的这篇 Coroutines for Go 对 Go 各类 iterator 的实现方式做了早期探讨，感兴趣的小伙伴儿可以移步阅读一下。

### 迭代器的组合与标准库支持

函数迭代器的强大之处在于它们的可组合性。我们可以编写“适配器”函数，接收一个或多个迭代器，返回一个新的迭代器，实现过滤、映射、组合等操作。

我们来看一个示例：

```go
package main
import (
   "iter"
   "slices"
)
// Filter returns an iterator over seq that only includes
// the values v for which f(v) is true.
func Filter[V any](f func(V) bool, seq iter.Seq[V]) iter.Seq[V] {
   return func(yield func(V) bool) {
       for v := range seq {
           if f(v) && !yield(v) {
               return
           }
       }
   }
}
// 过滤奇数
func FilterOdd(seq iter.Seq[int]) iter.Seq[int] {
   return Filter[int](func(n int) bool {
       return n%2 == 0
   }, seq)
}
// Map returns an iterator over f applied to seq.
func Map[In, Out any](f func(In) Out, seq iter.Seq[In]) iter.Seq[Out] {
   return func(yield func(Out) bool) {
       for in := range seq {
           if !yield(f(in)) {
               return
           }
       }
   }
}
// Add 100 to every element in seq
func Add100(seq iter.Seq[int]) iter.Seq[int] {
   return Map[int, int](func(n int) int {
       return n + 100
   }, seq)
}
var sl = []int{12, 13, 14, 5, 67, 82}
func main() {
   for v := range Add100(FilterOdd(slices.Values(sl))) {
       println(v)
   }
}
```

这个示例定义了两个适配器：Filter 和 Map，然后通过多个 iterator 的组合实现了对一个切片的元素的过滤与重新映射：先是过滤掉奇数，然后又在每个元素值的基础上加 100。这有点其他语言支持那种函数式的链式调用的意思，但从代码层面看，还不是那么优雅。

我们也可以改造一下上述代码，让 for range 后面的迭代器的组合更像链式调用一些：

```go
package main
import (
   "fmt"
   "iter"
   "slices"
)
// Sequence 是一个包装 iter.Seq 的结构体，用于支持链式调用
type Sequence[T any] struct {
   seq iter.Seq[T]
}
// From 创建一个新的 Sequence
func From[T any](seq iter.Seq[T]) Sequence[T] {
   return Sequence[T]{seq: seq}
}
// Filter 方法
func (s Sequence[T]) Filter(f func(T) bool) Sequence[T] {
   return Sequence[T]{
       seq: func(yield func(T) bool) {
           for v := range s.seq {
               if f(v) && !yield(v) {
                   return
               }
           }
       },
   }
}
// Map 方法
func (s Sequence[T]) Map(f func(T) T) Sequence[T] {
   return Sequence[T]{
       seq: func(yield func(T) bool) {
           for v := range s.seq {
               if !yield(f(v)) {
                   return
               }
           }
       },
   }
}
// Range 方法，用于支持 range 语法
func (s Sequence[T]) Range() iter.Seq[T] {
   return s.seq
}
// 辅助函数
func IsEven(n int) bool {
   return n%2 == 0
}
func Add100(n int) int {
   return n + 100
}
func main() {
   sl := []int{12, 13, 14, 5, 67, 82}
   for v := range From(slices.Values(sl)).Filter(IsEven).Map(Add100).Range() {
       fmt.Println(v)
   }
}
```

这样看起来是不是更像链式调用了！

运行上述示例，我们将得到如下结果：

```
112
114
182
Go 1.23 还在 slices 和 maps 包中添加了返回迭代器的“适配器”函数，方便实现自定义迭代
```

器组合：

```
slices.All(s)：返回 iter.Seq2[int, E]（索引, 值）
slices.Values(s)：返回 iter.Seq[E]（值）
maps.All(m)：返回 iter.Seq2[K, V]（键, 值）
maps.Keys(m)：返回 iter.Seq[K]（键）
maps.Values(m)：返回 iter.Seq[V]（值）
```

以及将迭代器元素收集回来的函数：

```
slices.Collect(seq)：将 iter.Seq[E] 收集到 []E
maps.Collect(seq2)：将 iter.Seq2[K, V] 收集到 map[K]V
```

目前 Go 官方也正在策划golang.org/x/exp/xiter 包，其中就有很多工具函数可以帮我们实现iterator 的组合。

### 性能考量

函数迭代器非常灵活强大，但也引入了函数调用的开销。虽然 Go 编译器会尽力内联和优化，

```
但在性能极其敏感的热点路径中，其开销可能比直接使用原生 for range（针对内置类型）
```

或手动编写的循环要高一些。

我们来实测一下 iterator 带来的额外的开销：

```go
// benchmark_iterator_test.go
package main
import (
   "slices"
   "testing"
)
var sl = []string{"go", "java", "rust", "zig", "python"}
func iterateUsingClassicLoop() {
   for i, v := range sl {
       _, _ = i, v
   }
}
func iterateUsingIterator() {
   for i, v := range slices.All(sl) {
       _, _ = i, v
   }
}
func BenchmarkIterateUsingClassicLoop(b *testing.B) {
   for range b.N {
       iterateUsingClassicLoop()
   }
}
func BenchmarkIterateUsingIterator(b *testing.B) {
   for range b.N {
       iterateUsingIterator()
   }
}
```

我们对比一下使用传统 for range + slice 和 for range + iterator 的 benchmark 结果（基于 Go1.24.0 的编译执行）：

```
$go test -bench . benchmark_iterator_test.go
goos: darwin
goarch: amd64
cpu: Intel(R) Core(TM) i5-8257U CPU @ 1.40GHz
BenchmarkIterateUsingClassicLoop-8       414234890            2.838 ns/op
BenchmarkIterateUsingIterator-8          291626221            4.104 ns/op
PASS
ok      command-line-arguments  3.095s
```

我们看到：虽然有优化，但 iterator 还是带来了一定的开销，这说明在性能敏感的系统中还是要考虑 iterator 带来的开销的。

因此，在追求极致性能的场景，需要进行基准测试，权衡使用自定义迭代器的便利性与可能的性能损耗。对于大多数非性能瓶颈的代码，自定义迭代器带来的代码清晰度和可组合性优势通常更重要。

## 小结

```
这一讲，我们深入探索了 Go 语言核心控制结构 for 循环的“进化”之路。
基础与陷阱：回顾了 for 的多种形式，并重点剖析了 Go 1.22 之前 for range 循环中因
```

- 循环变量重用导致的并发和闭包陷阱。

2. 关键语义变更：理解了 Go 1.22+ 版本如何通过为每次迭代创建新的循环变量实例来彻底解

```
决重用问题，让代码行为更符合直觉（需 go.mod 声明 Go 1.22+ 启用）。
range over func（Go 1.23+）：学习了自定义迭代器这一强大的新特性。我们了解了迭
代器函数的签名 (iter.Seq、 iter.Seq2)、yield 机制、Push/Pull 风格、迭代器的组
合（适配器）以及标准库 slices、maps 包的新增支持，并了解了使用迭代器带来的额外
```

- 的性能开销。

```
for 循环的这些演进，体现了 Go 语言在保持简洁的同时，不断提升表达力、修复历史问题、
```

拥抱现代编程范式的努力。理解这些变化和新特性，将帮助我们编写出更安全、更灵活、也更具表现力的 Go 代码。

## 思考题

```
自定义迭代器（range over func）为 for range 打开了新的大门。请思考一下：
```

1. 除了逆序遍历切片，你还能想到哪些场景或自定义数据结构适合使用自定义迭代器来实现

```
for range 遍历？例如：树的遍历？分页数据的遍历？生成器……
```

2. 与直接返回一个包含所有元素的切片相比，使用迭代器（尤其是处理大数据集时）的主要优势是什么？

欢迎在留言区分享你的想法和创意！我是 Tony Bai，我们下节课见。
