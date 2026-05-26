# 43 | Contracts：C++ 和契约式编程
你好，我是吴咏炜。

最近，在 C++ 社区有一条热门新闻：契约（contracts）终于被（再次）加入 C++ 标准了！今天，我就先来讲讲契约式设计吧。

## 基本概念

Bertrand Meyer 在 1986 年发明了 Eiffel 语言，并同时提出了 **契约式设计**（Design by Contract，DbC）的思想。就像商业活动中甲方和乙方之间用“契约”（合同）来规定彼此的义务和权利一样，软件系统中的各个元素之间也有“责任”和“权利”。如果某个函数提供了某种功能，那么它会：

- 期望客户代码在调用该函数时保证满足一定的条件，即函数的 **先决条件**（precondition，另一种常见叫法是“前置条件”）——客户的责任和供应商的权利。这样，函数就不需要去处理不满足先决条件的情况。
- 保证函数退出时满足一定的条件，即函数的 **后置条件**（postcondition）——供应商的责任，显然也是客户的权利。
- 要求一些条件在进入函数时成立，并确保它们在函数退出时还能保持成立，这就是 **不变量**（invariant，也称为“不变式”或“不变条件”）。

此外，用来检查契约的断言既可以放在函数外部，作为正式的先决条件和后置条件；也可以放在函数内部，作为执行时的检查。如果契约被检查的话（后面我们会回到这一点），函数内部的契约当然是根据执行流，在代码执行到相应位置时进行检查。而先决条件和后置条件会在执行函数体代码之前和之后分别得到检查——尤其是后置条件，在没有直接契约支持时用其他方式检查还是比较麻烦的。

契约就是这些权利和责任的正式形式，是论证代码正确性的重要工具。

### 为什么要用契约式设计？

以类的成员函数为例。假设：

- 类 `Obj` 的对象满足不变量 _I_。
- 成员函数 `foo` 期望先决条件 _A_，并保证后置条件 _B_。
- 成员函数 `bar` 期望先决条件 _B_，并保证后置条件 _C_。

那么，当我们使用一个类 `Obj` 的对象 `obj`，并确保条件 _A_ 成立时，成功调用 `obj.foo(); obj.bar();` 之后，条件 _C_ 应当成立，并且不变量 _I_ 也继续成立。

换句话说，契约的概念能让我们自然而然地论证软件的正确性。契约式设计通过明确划分函数的实现者和调用方的职责，确保了可以尽早发现问题，并在发现问题时迅速确定责任归属。虽然不如形式化验证（formal verification）那样严格，但跟程序员只是依赖自己的直觉相比，这是一个很大的进步。同时，它也并没有引入大的额外开销，而只是对开发人员思维上的严谨性提出了一定的要求。它会让调试更加简单，并减少返工。根据业界的数据，软件组织的返工率平均高达 60% \[1\]。因此，相比它带来的好处，契约式设计增加的工作量微不足道。

### 如何设计契约？

当你在设计某个函数的功能时，你需要问：

- 它期望的是什么？
- 它要保证的是什么？
- 它要保持的是什么？

对于这些问题，你需要思考，并将答案记录到文档里。想从代码中直接看出这些问题的答案是不容易的。即使有全部的源代码，你都不一定能找出答案；如果你没有源代码，比如只能看到函数的原型声明，那就更不可能了。

我们应当尽量让先决条件和后置条件易于检查。在像 C++ 这样的强类型语言里，我们首先可以利用类型系统。编译器就可以帮我们进行很多检查：如果参数要求是一个字符串，那调用者传递一个整数是无法成功的，编译器会直接拦截这个错误。C++ 还有编译期编程，我们可以利用 `static_assert` 之类的机制在程序运行前尽可能多地发现错误。但无论如何，我们一定会需要一些“动态”的检查。此时我们需要类型系统外的机制来帮忙，可能是直接的契约支持，也可能是其他的模拟方式，包括最基本的断言（ `assert`）。

### 契约式编程与防御式编程

在典型的契约式编程里，要么不对先决条件和类不变量进行检查，要么在检查失败时直接让程序终止；后者也称为进攻式编程（offensive programming）。与其形成鲜明对比的，是防御式编程（defensive programming），本质上是没有先决条件（或对其有大幅度削弱）的编程方法。它要对各种可能和不太可能的情况进行检查，确保在客户代码传错参数时，程序仍能有合理的行为。

比如，对于一个获得色彩名的函数，进攻式编程可能写成下面这个样子（正常的 `Color` 应该落到下面的三个 `case` 之一，落不进就终止程序）：

```cpp
const char*
getColorName(Color color)
{
  switch (color) {
  case Color::red:
    return "red";
  case Color::green:
    return "green";
  case Color::blue:
    return "blue";
  }
  std::terminate();
}

```

而防御式编程则要么最后返回其他的字符串（如 `return "black";`），要么得彻底改造这个函数的形式，比如（ `Error` 是错误码的枚举）：

```cpp
Error getColorName(
  Color color, const char*& result)
{
  switch (color) {
  case Color::red:
    result = "red";
    return Error::success;
  case Color::green:
    result = "green";
    return Error::success;
  case Color::blue:
    result = "blue";
    return Error::success;
  }
  return Error::invalid_argument;
}

```

每次调用这个 `getColorName` 要检查返回值似乎很无聊，是吧？防御式编程有好些问题，如：

- 设计和编码更加复杂，很难做到对各种情况有完善的处理。
- 防御有副作用，可能会得到不正确的结果，或隐藏原本可以发现的代码错误。
- 可能因为有过多的检查而导致代码可读性和可维护性下降。
- 可能因为有过多的检查而导致运行速度受到影响。
- 测试很难走到那些防御性的分支，导致测试覆盖率无法提升，而这一事实又使得人们很难确定是不是对非防御的代码部分有了合适的测试覆盖。

不过，跟契约式编程有最大潜在冲突的，是防御式编程可能给人们带来的不良习惯：没有区分不同的错误类型。尤其需要指出的是，契约违约属于逻辑错误，是不应该发生的，跟代码应该期待的用户输入错误、环境问题等运行期错误，是完全不同的——因此这两种错误也应当具有不同的处理方式。在逻辑错误发生时，抛异常和完全终止程序运行是较为合理的处理方式。而返回错误码则通常不好：易于被忽略，让错误难以发现；并且容易跟后置条件检查发生冲突。

一般而言，我们应当区分以下的运行环境：

- 调试、单元测试或功能测试环境——应当尽可能多地检查契约断言。
- 性能测试环境——可能需要忽略契约检查；或对是不是检查的性能差异进行比较，确保没有因为契约检查引入性能问题。（好消息是，一些实践经验表明，引入额外的安全检查对性能的影响非常有限 \[2\]。）
- 产品环境——最复杂，可能需要根据部署环境、性能要求和安全要求来决定契约检查的策略。在安全至上的环境里，我们可能应该始终进行契约检查，甚至不惜牺牲部分性能作为代价。

理解这两种编程范式的检查方式差异后，我们可以更好地把握 C++26 契约支持的灵活性——开发者可根据不同运行环境动态配置契约的检查策略。

## C++26 的契约支持

从 Eiffel 开始，很多语言都有契约的支持。C++ 里的契约支持也不止一次地被提上议事日程，甚至在 2018 年 6 月就 [已经投票通过进入了 C++20 的工作文件](https://github.com/Cpp-Club/Cxx_HOPL4_zh/blob/main/09.md#961-%E5%A5%91%E7%BA%A6)（HOPL4 论文 \[3\] 的 9.6.1 节）。可惜的是，虽然大家在大方向上认知较为一致，但魔鬼在细节，小问题上纷争不断，最终无法在 C++20 的时间窗里达成共识——结果是，契约在 2019 年 7 月从 C++ 标准草案中被删除。

在此之后，契约仍在继续被讨论，但在 C++23 的时间窗里没有取得什么大进展。终于，今年 2 月 C++ 标准委员会的 Hagenberg 会议上传来好消息，提案 P2900R14 \[4\] 被批准，C++26 将会支持契约了。

P2900 引入了下面的基本契约支持：

- 先决条件断言 `pre`
- 后置条件断言 `post`
- 契约断言语句 `contract_assert`

下面是个简单的示意：

```cpp
int f(const int x)
  pre (x != 0)
  post(r : r &gt; x)
{
  contract_assert (x != -1);
  return x + 1;
}

```

这里规定了：

- 入参 `x` 不能是 0，否则调用者违反了契约。
- 返回值（这里用 `r` 表示，也可以使用其他标识符）必须大于入参。注意这里有个小细节：在后置条件里使用的值参数要求必须声明为 `const`，即禁止在代码里对其进行更改（这一般在代码里不需要，也不推荐）。
- 函数体内有额外的断言， `x` 不能等于 -1。

注意，这里 `contract_assert` 是新的关键字，而 `pre` 和 `post` 则是上下文关键字——跟 `override` 类似，仅当出现在函数声明后（函数体之前），它们才是关键字。这样，如果我们目前代码里使用 `pre` 或 `post` 作为变量名，那么在 C++26 里也仍然是合法代码，不会发生冲突。

这里很重要的一点是，作为函数对外接口的一部分，“契约说明序列” `pre` 和 `post` 需要出现在函数原型声明上，并且以先出现的声明或定义为准。如果声明里只写了 `int f(const int x);`，那上面的函数定义是非法的。声明和定义的契约说明序列一致，或者（先出现的）声明里写契约说明序列而（后出现的）定义里不写，则都是允许的。

对于虚函数，由于接口的契约说明序列跟实现的契约说明序列可以不同（见“先决条件”部分的讨论），这引发了实际的困难。目前提案里的权宜之计是，禁止对虚函数加契约说明序列。

相比传统的 `assert`，契约的三种断言方式更加安全，因为编译器会禁止你在断言里修改对象。契约的检查方式也更多（ `assert` 只有检查跟不检查两种情况），标准的说法是我们目前有四种不同的求值语义（evaluation semantic）：

- _ignore_（忽略）：忽略检查（跟在定义 `NDEBUG` 宏时使用 `assert` 相似）
- _observe_（观察）：进行检查，并在检查失败时调用契约违约处理器（contract-violation handler）
- _enforce_（强制）：进行检查，在检查失败时调用契约违约处理器，并终止程序执行（跟在未定义 `NDEBUG` 宏时使用 `assert` 比较相似）
- _quick-enforce_（快速强制）：进行检查，在检查失败时直接终止程序执行

默认的契约违约处理器会打印断言相关的信息。比如，如果使用 `f(0)` 调用上面的函数的话，那你可能会得到下面这样的出错信息：

> `contract violation in function f at /app/example.cpp:2: x != 0`
>
> `[assertion_kind: pre, semantic: enforce, mode: predicate_false, terminating: yes]`

这是我们在目前 GCC 的一个分支版本下直接能看到的信息： [https://godbolt.org/z/9dffdxonb](https://godbolt.org/z/9dffdxonb)。

我们也能够修改契约违约处理器的行为。比如，可以让它打印调用栈。这个例子就请你直接查看 Compiler Explorer 了： [https://godbolt.org/z/r4Es5qx7h](https://godbolt.org/z/r4Es5qx7h)。

Hagenberg 会议上通过的另一个跟契约相关的提案是 P3471 \[5\]，对标准库的安全加强（hardening）。C++26 里很多标准库对象有了安全加强的实现，在其中原本一些下标越界类的未定义行为现在是契约违约，可以在运行时得到检查。这对关注安全的同学们一定是个好消息。我们可以在 Compiler Explorer 上查看示例（这在 Clang 的 libc++ 标准库上已有实现）： [https://godbolt.org/z/jPfMz8P9d](https://godbolt.org/z/jPfMz8P9d)。

当前的契约支持当然并不完美，作者也承认了这只是个最小可行产品（minimum viable product，MVP）。但作为一个对代码正确性和安全性非常重要的功能，契约还是早点用上为好。拿 Bjarne 喜欢引用的一句老话来说：“最好是好的敌人（The best is the enemy of the good）。”但我们仍应期待，这一功能在后续的 C++ 标准里会继续完善和发展。

## 契约式编程的代码实现

下面，我们结合有和没有契约支持的场景，来逐个讨论一下先决条件、后置条件和不变量。不过，在此之前，我想先单独讨论一下断言语句。

### 断言语句

从 C++26 开始，我们可以在一切需要断言的地方使用 `contract_assert`，来对我们认为逻辑上一定成立的条件进行检查，防止程序员的思维错误。这可以替代我们目前对 `assert` 的使用——它的行为太简单，你只能在下面两者之间进行选择：忽略检查；或在检查失败时让程序崩溃。

当然，在 C++26 到来之前，我们也可以用自己的宏来代替 `assert`，从而实现更加复杂的逻辑，包括部分模拟标准契约的行为。我在 Compiler Explorer 上放了一个完整的例子来供你参考： [https://godbolt.org/z/P1cMnTvfo](https://godbolt.org/z/P1cMnTvfo)。跟 `contract_assert` 一样，检查失败时的行为也同样可以定制，比如，你可以用命令行选项 `-DCONTRACT_SEMANTIC=CONTRACT_SEMANTIC_IGNORE` 来忽略契约检查。

在使用 `assert` 或自己实现断言时，用户得小心不能在断言表达式里修改环境。这里，标准契约支持的优势就很明显了：契约断言里的代码不允许修改用到的对象。这种语言内置的安全检查在宏里没法模拟。

有一个有趣的问题：我们是不是可以把契约检查跟防御式编程结合起来？下面是另外一种更加灵活、但用起来也更复杂的断言（源自 Herb Sutter \[6\]，并做了改进）：

```cpp
#define ASSERT_OR_FALLBACK(cond,   \
                           ...)    \
  {                                \
    bool _b = (cond);              \
    assert(_b);                    \
    if (!_b)                       \
      __VA_ARGS__;                 \
  }

```

这个 `ASSERT_OR_FALLBACK` 宏需要两个参数：第一个跟 `assert` 一样，是个条件；第二个则是 `assert` 未能终止程序时的善后处理（这边使用可变宏参数是为了处理第二个参数里可能出现逗号的情况）。如果我们希望检查入参 `ptr` 不是空指针，并且防御式地在空指针的情况下返回一个错误码，那我们可以这样写：

```cpp
ASSERT_OR_FALLBACK(
  ptr != nullptr,
  return Error::assertion_fail);

```

还可以更加复杂：

```cpp
ASSERT_OR_FALLBACK(ptr != nullptr, {
  LOG_ERROR("Null pointer!");
  throw std::invalid_argument(
    "null pointer");
});

```

这个技巧在有契约支持之后都同样有用，我们只需要把上面宏定义里的 `assert` 换成 `contract_assert` 即可。

### 先决条件

先决条件是函数对函数调用方的要求：它首先是对函数参数的要求，但也可能涉及对象或环境的状态。由于函数调用者需要了解这些条件并确保它们被满足，因此这些条件最好在函数的文档里明确写出来。

不是所有的先决条件都可以用代码表达，但依然有很多先决条件可以用代码表达，或者至少可以部分表达。比如，我们没法通用地判断非法指针，但至少可以在不接受空指针的时候对空指针进行检查。比如，在 C++26 里可以像下面这样写：

```cpp
void f(void* ptr)
  pre (ptr != nullptr)
{
  …
}

```

在没有契约支持的情况下，我们则只能在程序入口处进行检查，如：

```cpp
void f(void* ptr)
{
  assert(ptr != nullptr);
  …
}

```

这里我使用了标准断言 `assert`（也可以使用上面讨论的其他断言宏）。当然，跟 `pre` 相比，断言肯定是不够方便的。

需要注意一下，因为调用者可能通过基类调用某个虚成员函数，因此派生类在覆盖成员函数时，只能削弱先决条件（要求更少）、增强后置条件（保证更多），而不能增强先决条件（要求更多）、削弱后置条件（保证更少）——Liskov 可替换性要求派生类对象必须能完全替代基类对象，且替换后程序的行为仍然正确 \[7\]。这样才能确保我们能够透明地通过基类接口来操纵派生类对象，而不会因为派生类上发生的变化导致客户代码出现问题。这也意味着，我们一旦在基类应用了防御式编程，那所有的派生类也必须这么做。

前面已经提到，C++26 里我们不能对虚函数加先决条件和后置条件。一种可能的解决方式是使用非虚接口（non-virtual interface，NVI）\[8\]\[9\]，并把先决条件和后置条件（以及可能的防御式代码）加在非虚公开函数里：

```cpp
class Account {
public:
  void deposit(int amount)
    pre (amount &gt; 0)
  {
    doDeposit(amount);
  }

private:
  virtual void
  doDeposit(int amount) = 0;
};

class SavingAccount
  : public Account {
private:
  void
  doDeposit(int amount) override;
};

```

### 后置条件

后置条件是对函数自身的要求，通常涉及返回值、出参和状态。如果在一切正常的情况下后置条件不满足，那通常意味着代码实现有逻辑错误。如果函数主动认为后置条件已经无法满足，一般就应该通过抛异常来表示操作无法继续。

后置条件一般而言更难进行检查，更多地是放在代码的文档里。比如，下面是我写过的真实代码的一部分：

```cpp
/**
 * Discards the first element in the
 * queue.
 *
 * &#64;pre   This queue is not empty.
 * &#64;post  One element is discarded
 *        at the front, \c size() is
 *        decremented by one, and
 *        \c full() is \c false.
 */
void pop()
{
  assert(!empty());
  …
}

```

这里我用 [文档注释](https://www.doxygen.nl/manual/docblocks.html) 的形式描述了队列的 `pop` 操作的先决条件和后置条件。在代码里，我用 `assert` 检查了先决条件，但对后置条件没有做任何处理。在这里，也只有 `!full()` 相对容易检查。在 C++26 里我们可以这么写：

```cpp
void pop()
  pre (!empty)
  post (!full())
{
  …
}

```

跟先决条件不同，没有契约支持，我们很难手工来模拟后置条件。如果函数没有返回值，或者返回值是个变量，那我们勉强可以用模板来解决一下（参见代码库里的 finally.h）：

```cpp
void pop()
{
  on_return contract_check(
    [&] { assert(!full()); });
  …
}

```

这里的 `on_return` 是一个类模板，我们利用它声明了一个对象，这个对象会在析构时执行传递给它的函数对象——除非析构发生在异常抛出过程中。有异常时，后置条件自然就不需要检查了。这跟我最早实现的 `finally` 不同，那里的操作在异常抛出时也会得到执行。

由此也可以看到，如果先决条件成立，我们却发现由于环境、用户输入之类的原因导致后置条件无法满足，我们只能使用异常。如果我们这里使用错误码的话，需要注意的是，在返回错误码时，后置条件仍然会得到检查。因此，我们通常需要把对错误码的检查写到后置条件里去，如：

```cpp
Error op()
  post (r : r != Error::success || …);

```

### 不变量

不变量是程序的某一部分在执行中可以始终保证为真的条件。对于一个循环，在进入循环时及后续循环过程中都保持为真的条件称为循环不变量。对于一个类对象，在其生存期里可以一直保持为真的条件称为类不变量。跟先决条件和后置条件类似，不变量也是论证代码正确性的重要工具。

在这里，我们简单讨论一下类不变量。我们通常需要在类的构造函数里建立类不变量，并在所有修改成员变量的函数中保持类不变量继续成立。

比如，对于一个日期对象，它的不变量可能是：成员变量 `year_`、 `month_`、 `day_` 合起来代表一个有效的日期。在接受年、月、日作为参数的构造函数中，我们需要进行有效性检查，确保在构造正常结束时， `year_`、 `month_` 和 `day_` 组成一个有效的日期（类不变量是构造函数的后置条件）。在修改日期的成员函数中，可能也需要进行类似的检查，以确保不变量在修改结束时一定成立（对于其他成员函数，类不变量既是先决条件，又是后置条件）。

不变量实际上是我们在一般设计里反对使用公开成员变量（包括 C 风格的结构体）的原因：在这样的设计里，我们很难维护一个不变量，保证数据的完整性。

对于一个 `vector`，它的不变量就更复杂一些了。比如，一种设计可能是：

1. 如果 `begin_` 成员变量不为空，则 \[ `begin_`, `end_cap_`) 组成的区间表示从系统分配到的有效内存空间，\[ `begin_`, `end_)` 组成的区间表示 `vector` 里的有效元素。
2. 否则，对其他成员变量的值不作规定。

而另外一种设计可能是：

1. 如果 `begin_` 成员变量不为空，则 \[ `begin_`, `end_cap_`) 组成的区间表示从系统分配到的有效内存空间，\[ `begin_`, `end_`) 组成的区间表示 `vector` 里的有效元素。
2. 否则， `end_` 和 `end_cap_` 成员变量也一定为空。

不同的设计会导致不同的后果。前一种设计意味着，我们默认构造只需要初始化成员变量 `begin_`，但实现 `size` 成员函数需要写成 `return begin_ ? end_ - begin_ : 0;`——如果忘记对 `begin_` 进行判空检查，那代码就可能不正确。后一种设计要求默认构造初始化所有三个成员变量，此时 `size` 成员函数可以简单实现成 `return end_ - begin_;`。每一种设计都是自洽的，但考虑到犯错是人之常态，我们通常使用初始化所有成员变量这种更简单的实现方式。

如果函数发现继续执行下去它无法保持不变量，那它就应该终止执行，然后抛异常或返回错误。对于构造函数，你只能在抛异常和不做任何可能失败的操作里选择。比如，如果你的对象构造时需要分配内存，那内存不足时的行为只能是抛异常。否则，你只能在构造时不做任何需要分配内存的动作，或认为内存不足不可能发生（一旦发生，程序就会崩溃）。

不变量当然应该一直成立，但人总可能会犯错误。在代码中使用 `contract_assert`（C++26）或类似宏（见“先决条件”部分的讨论） 对不变量或其他应该成立的条件进行检查，是一种可以帮助我们减少错误的方式。

## 内容小结

本讲我们首先讨论了契约式设计：它的优点，以及跟防御式编程的冲突。随后我们介绍了 C++26 带来的契约相关的新功能，并具体分析了如何在 C++ 里实现契约检查——既包括有契约支持的情况，也包括尚没有契约支持的情况。在有了契约支持后，我们将可以写出更健壮的代码；但在没有契约支持时，我们仍可以在一定程度上模拟契约的检查。

## 课后思考

你的代码里有关于先决条件、后置条件和不变量的设计吗？你的错误处理策略是怎样的，有没有对契约/逻辑错误与运行期错误进行区别处理？你的项目在处理不同类型的错误上有没有最佳实践？

欢迎留言和我分享你的想法和疑问。如果读完这篇文章有所收获，也欢迎分享给你的朋友。

## 特别鸣谢

微软的王铭鑫（C++ 标准委员会委员）阅读了本讲内容的初稿，并提出了重要的改进意见。在此表示感谢。

## 参考资料

\[1\] Steve Tockey, _How to Engineer Software: A Model-Based Approach_. Wiley–IEEE Computer Society Press, 2019.

\[2\] Google Security Blog, “Retrofitting spatial safety to hundreds of millions of lines of C++”. [https://security.googleblog.com/2024/11/retrofitting-spatial-safety-to-hundreds.html](https://security.googleblog.com/2024/11/retrofitting-spatial-safety-to-hundreds.html)

\[3\] Bjarne Stroustrup, “Thriving in a Crowded and Changing World: C++ 2006–2020”. _Proceedings of the ACM on Programming Languages_, **4**, HOPL, Article 70 (2020). [https://doi.org/10.1145/3386320](https://doi.org/10.1145/3386320)

\[3a\] Bjarne Stroustrup, “在纷繁多变的世界里茁壮成长：C++ 2006–2020”（吴咏炜、杨文波、张云潮等译）. [https://github.com/Cpp-Club/Cxx\_HOPL4\_zh/](https://github.com/Cpp-Club/Cxx_HOPL4_zh/)

\[4\] Joshua Berne, Timur Doumler, Andrzej Krzemieński, et al., “P2900R14: Contracts for C++”. [http://wg21.link/p2900r14](http://wg21.link/p2900r14)

\[5\] Konstantin Varlamov and Louis Dionne, “P3471: Standard library hardening”. [http://wg21.link/p3471r2](http://wg21.link/p3471r2)

\[6\] Herb Sutter, “GotW #102 Solution: Assertions and ‘UB’”. [https://herbsutter.com/2021/06/03/gotw-102-solution-assertions-and-ub-difficulty-7-10/](https://herbsutter.com/2021/06/03/gotw-102-solution-assertions-and-ub-difficulty-7-10/)

\[7\] Wikipedia, “Liskov substitution principle”. [https://en.wikipedia.org/wiki/Liskov\_substitution\_principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)

\[8\] Herb Sutter, “Virtuality”. [http://www.gotw.ca/publications/mill18.htm](http://www.gotw.ca/publications/mill18.htm)

\[9\] Wikibooks, “Non-Virtual Interface”. [https://en.wikibooks.org/wiki/More\_C%2B%2B\_Idioms/Non-Virtual\_Interface](https://en.wikibooks.org/wiki/More_C%2B%2B_Idioms/Non-Virtual_Interface)