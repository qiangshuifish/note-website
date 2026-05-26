# 46 | 飞船运算符、consteval、constinit和jthread：C++20的若干重要小改进
你好，我是吴咏炜。

在前面，我已经陆陆续续讨论了不少 C++20 的改进（“模块”即使在 2025 年也没有成熟到可以方便地跨平台广泛应用，因此我决定还是暂不讨论）。除此之外，C++20 还包含好些小改进，可以让我们快速用起来，帮助我们更方便地写出更“好”的代码。本讲我就讨论一下 C++20 里其他四种重要的、可以快速应用到开发中的改进。

## 比较运算和飞船运算符

### 比较是件麻烦事

C++ 里实现对象的比较是件麻烦事。即使对于同类型的对象，我们传统上也需要实现六个不同的比较运算符（不同类型的对象就更麻烦了，还要考虑参数的顺序问题，通常导致数量翻倍）：

- `operator==`
- `operator!=`
- `operator&lt;`
- `operator&lt;=`
- `operator>`
- `operator>=`

典型情况下，我们只实现 `==` 和 `&lt;`，然后让其他运算符调用这两个的实现，形如：

```cpp
bool operator&gt;(const Obj& lhs,
               const Obj& rhs)
{
  return rhs &lt; lhs;
}

bool operator&gt;=(const Obj& lhs,
                const Obj& rhs)
{
  return !(lhs &lt; rhs);
}

```

那我们能不能只提供部分运算符，如只提供 `operator&lt;` 和 `operator==`，让编译器生成其余的运算符？

考虑到 C++ 里对象的复杂性和比较上可能存在的不对称性，这不是 C++ 目前选择的方向。C++20 里提供的改进包括：

- **相等的对称性规则：** 如果 `a == b` 能找到合适的 `operator==` 定义而 `b == a` 不能，编译器可以自动把后者改写成 `a == b`。
- **不等的默认提供规则：** 如果 `a == b` 或 `b == a` 能找到合适的 `operator==` 定义而 `a != b` 不能，编译器可以自动把后者改写成 `!(a == b)` 或 `!(b == a)`。
- **正向飞船运算符应用规则：** 如果 `a &lt;=> b` 能找到合适的 `operator&lt;=>` 定义而某个比较表达式 `a @ b` 不能（ `@` 是 `&lt;`、 `&lt;=`、 `>`、 `>=` 之一），编译器会自动把后者改写成 `(a &lt;=> b) @ 0`。
- **反向飞船运算符应用规则：** 如果 `a &lt;=> b` 能找到合适的 `operator&lt;=>` 定义而某个比较表达式 `b @ a` 不能（ `@` 是 `&lt;`、 `&lt;=`、 `>`、 `>=` 和 `&lt;=>` 之一），编译器会自动把后者改写成 `0 @ (a &lt;=> b)`。

前两条比较好理解：编译器能根据 `==` 的定义自动给出 `!=` 的定义和参数顺序相反的 `==` 定义（ `==` 和 `!=` 被假定是对称的，但其他比较运算符上不作这样的假定）。但飞船运算符 `operator&lt;=>` 又是什么呢？——且听我慢慢道来。

### 顺序问题

之前在 [第 5 讲](https://time.geekbang.org/column/article/174434) 里我简单讨论过严格弱序，这是一种排序需要的顺序关系。以一般常用的 `&lt;` 为例，它的要点是：

- 所有的对象都可以进行比较： `a &lt; b` 是个合法操作。
- 比较不成立（ `!(a &lt; b) && !(b &lt; a)`）具有可传递性，也就意味着不可比表示了一种等价关系。

等价关系意味从该比较的角度来说两个对象是“等同”的，但这不意味着两个等价的对象真正相等——即可以互相替换。比如，对于下列操作：

- 对两个数字的绝对值进行大小比较： `-2` 和 `2` 是等价的（但不相等）。
- 对两个字符串进行忽略大小写比较： `"HELLO"` 和 `"Hello"` 是等价的（但不相等）。

如果对于某种类型， `&lt;` 代表某种严格弱序关系，那在 C++ 里我们就称该类型的比较具有 weak ordering（弱序，数学上的严格弱序）。C++20 有专门的类 `weak_ordering` 来表示比较的结果，值应当为类的三个静态常量之一：

- `weak_ordering::less`：表示小于关系
- `weak_ordering::equivalent`：表示等价关系
- `weak_ordering::greater`：表示大于关系

显然，我们有比 weak ordering 更强的顺序关系，也就顺理成章地称为 strong ordering（强序，数学上的全序）。在满足强序的类型里，任意两个对象的关系如果不是小于和大于，就一定是相等。我们日常使用的整数就符合强序。对应地，C++ 也有专门类 `strong_ordering`，其中定义了四个静态常量：三个常量的名字跟 `weak_ordering` 相同，还有一个是 `equal`，值跟 `equivalent` 相同。

那有比 weak ordering 更弱的顺序关系吗？也有。如果某类型的某些对象之间可能完全没有顺序关系（但另外的对象之间有），我们称之为 partial ordering（部分序，或偏序）。在部分序类型里，某些对象跟其他对象处于“无序”关系，即关系无法用“大于”“小于”或“等价于/等于”来描述（这些关系都要求有传递性）。一个例子是浮点数里代表“不是一个数”的 NaN 值（C++ 里可以用 `nan`、 `nanf` 等函数、以及宏 `NAN` 获得），任何数跟 NaN 的除不等于之外的比较都返回假：

- `NAN &lt; 1`：假
- `1 &lt; NAN`：假
- `1 == NAN`：假
- `NAN == NAN`：假
- `1 != NAN`：真
- `NAN != NAN`：真

C++ 使用 `partial_ordering` 类型表示这种顺序关系，其中也有 `less`、 `equivalent` 和 `greater` 三个常量，但另外多了一个 `unordered` 常量表示无序关系。

所有这三个类型的值都支持跟常量 0 进行比较（不可以是其他数字）。自然， `equivalent` 和 `equal` 只满足 `== 0`、 `&lt;= 0` 和 `>= 0`， `less` 只满足 `&lt; 0`、 `&lt;= 0` 和 `!= 0`， `greater` 只满足 `> 0`、 `>= 0` 和 `!= 0`，而 `unordered` 只满足 `!= 0`。

### `operator&lt;=>`

你可以对自己的对象定义 `operator&lt;=>`（三路比较运算符，因其形状也被称为“飞船运算符”），就像定义 `operator==` 这样的比较操作一样。它的返回类型是 `strong_ordering`、 `weak_ordering` 或 `partial_ordering` 之一。最简单的情况，就是让编译器帮你默认提供 `operator&lt;=>`，如下面类定义所示：

```cpp
struct Employee {
  string id;
  string name;
  int birth_year;
  double salary;

  auto operator&lt;=&gt;(const Employee&)
    const = default;
};

```

在使用默认提供的 `operator&lt;=>` 时，结果是按成员的逐个比较，并且此时编译器还会默认提供 `operator==`（按成员的逐个相等比较，相当于写了 `bool operator==(const Employee&) const = default;`），因此结果是所有六个比较运算符都能自动生成，非常方便。

跟通常的 `operator==` 等比较运算符的定义相同， `operator&lt;=>` 可以作为 const 成员函数提供，也可以作为一个友元函数提供。前者的参数类型必须是单个 `const Employee&`；后者的参数类型可以是两个 `const Employee&`，也可以是两个 `Employee`。

不过，你知不知道上面这个 `operator&lt;=>` 的返回类型究竟是啥？

这个类型是…… `std::partial_ordering`。你想到了吗？

这里，自动返回类型的 `operator&lt;=>` 会使用成员比较用到的最弱的顺序类型，而浮点数类型上的 `&lt;=>` 会得到 `partial_ordering` 的结果，因此这个类默认提供的飞船运算符返回类型是 `partial_ordering`。如果你有某些（自定义类型的）数据成员只支持 `operator&lt;` 和 `operator==` 而不支持 `operator&lt;=>`，那你也可以使用 `= default`，但此时就必须明确写出返回类型了。如果可能，改写这些类型让它们也支持 `operator&lt;=>` 为好。

如果你不喜欢自动按成员逐个比较的结果，那你可以自己提供 `operator&lt;=>` 的定义。比如，如果比较时应忽略 `salary`，优先按姓名和年龄排列，那你就可以这么写：

```cpp
  strong_ordering
  operator&lt;=&gt;(const Employee& rhs)
    const noexcept
  {
    strong_ordering result =
      name &lt;=&gt; rhs.name;
    if (result != 0) {
      return result;
    }
    result =
      birth_year &lt;=&gt; rhs.birth_year;
    if (result != 0) {
      return result;
    }
    return id &lt;=&gt; rhs.id;
  }

```

这时，需要注意：

- 你需要手工标注函数的 `constexpr`、 `noexcept` 等说明。
- `…_ordering` 对象可以隐式转换成更“弱”的 `…_ordering` 对象，但不能转换成更“强”的 `…_ordering` 对象。
- 在你手工提供 `operator&lt;=>` 时，编译器不再会默认提供 `operator==`。因此两个 `Employee` 对象的 `==` 或 `!=` 比较将会导致编译失败。

最简单的提供 `operator==` 的方式显然是：

```cpp
  bool
  operator==(const Employee& rhs)
    const noexcept
  {
    return (*this &lt;=&gt; rhs) == 0;
  }

```

但这种方式性能并非最优，因此编译器 **不会** 为你默认提供这样的代码。如果你要比较两个 `string`——如 `"hell"` 和 `"hello"`——的内容是否相同，相等比较可以比 `&lt;` 或 `&lt;=>` 这样的比较快得多，因为你可以先比较长度，在长度不等时就完全没必要去比较内容了。因此，对于上面这种情况，最合理的方式是自己写出：

```cpp
  bool
  operator==(const Employee& rhs)
    const noexcept
  {
    return name == rhs.name &&
           birth_year ==
             rhs.birth_year &&
           id == rhs.id;
  }

```

`&&` 的短路规则让我们可以在最早的比较返回假时即终止比较，同时 `==` 的使用保证在对有长度的范围类型对象进行相等比较时性能较优。

### 自动比较运算的生成

我在这里列一下之前已经提到过的两条规则：

- **正向飞船运算符应用规则：** 如果 `a &lt;=> b` 能找到合适的 `operator&lt;=>` 定义而某个比较表达式 `a @ b` 不能（ `@` 是 `&lt;`、 `&lt;=`、 `>`、 `>=` 之一），编译器会自动把后者改写成 `(a &lt;=> b) @ 0`。
- **反向飞船运算符应用规则：** 如果 `a &lt;=> b` 能找到合适的 `operator&lt;=>` 定义而某个比较表达式 `b @ a` 不能（ `@` 是 `&lt;`、 `&lt;=`、 `>`、 `>=` 和 `&lt;=>` 之一），编译器会自动把后者改写成 `0 @ (a &lt;=> b)`。

这两条规则估计你刚才看着会有点头晕，现在应该比较清楚些了吧？——只要定义了单个的 `operator&lt;=>`，那对于同种类型，编译器可以自动合成 `&lt;`、 `&lt;=`、 `>`、 `>=` 这四个运算符的实现；对于不同类型（异种类型），那编译器可以自动合成含 `a &lt; b`、 `b &lt; a`、 `b &lt;=> a` 在内的九个运算符的实现！

顺便说一下，这两条规则看似简单，但它们是我对包括 C++ 标准在内的若干文档进行解读（并在多个编译器上进行测试和确认）后的总结——我没有在任何一本我读到的书或文章里看到过同样的规则描述。可能因为该原因，我也没见到 AI 大模型能完全正确地回答相关问题。

当然，比较还有很多其他细节。但对于大部分使用场景而言，你仅需记住，C++20 可以大大简化比较的实现：最简单的情况只需要一句 `= default` 的 `operator&lt;=>` 声明，典型情况里也仅需定义 `operator&lt;=>` 和 `operator==` 即可（而不是定义六个甚至更多数量的比较运算符）。

## consteval

从 C++11 开始我们有了 constexpr 函数，并在后续的 C++ 标准里不断得到发展。但是，因为 constexpr 函数既可以在编译时求值，也可以在运行时求值，你要强制函数在编译时求值有时会很麻烦，甚至不可能。比如，假如你有一个希望用在编译期的检查函数：

```cpp
constexpr int check(int value)
{
  if (value &lt; 1 || value &gt; 42) {
    throw invalid_argument(
      "invalid value");
  }
  return value;
}

```

那你这样写可以强制检查在编译时执行：

```cpp
constexpr auto checked = check(11);
doSomething(checked);

```

这里， `11` 这个常数可以是任意的编译期常数，包括模板参数，但不可以是函数参数。换句话说，你没法在 `doSomething` 函数的内部进行检查，如：

```cpp
constexpr void
doSomething(int value)
{
  constexpr int checked =
    check(value);
  // 继续使用 checked
}

```

你可能会想，能不能这么写？

```cpp
doSomething(check(43));

```

答案是，也不行。这样写的结果是，你会在运行时得到一个异常，而不是期望中的中止编译。

不过，只要简单地把 `check` 前的 `constexpr` 改成 `consteval`，上面最后这个语句就可以得到期望中的效果：编译器会在编译时对 `check(43)` 进行求值，并因为发生异常而中止编译。

事实上， `format` 就是利用 consteval 构造函数，在编译时检查格式化字符串是否合法及是否跟参数完全匹配。因此，使用同样的语法时，在 C++17 或之前的标准版本里没法在编译时检查格式化字符串，而只能使用 [第 39 讲](https://time.geekbang.org/column/article/527423) 提到的 `CARG` 技巧或类似方式了。

## constinit

另外一个跟 constexpr 函数有关系的特性是静态对象的初始化。因为 constexpr 函数可以在编译期执行，我们可以使用 constexpr 函数来初始化对象，但问题是，我们没法精确控制函数的执行是不是在编译时，除非结果对象也是 constexpr。在我们并不希望结果对象是 constexpr 时——那样会要求把变量定义，而非声明，写到头文件里——就又没辙了。

这个问题使用 constinit 即可解决：它表示一个变量必须要在编译时进行初始化（因此必须是全局或静态的，而不能是自动变量），但没有提出任何其他要求（因此，这个变量甚至不必是 const 的）。

在代码示例里（可以看示例代码库，或者直接 [在线观看](https://godbolt.org/z/rdevW8d47)［不建议在手机上观看］），我展示了可以在编译期计算质数的代码，用结果来静态初始化一个 `array`，并静态初始化了指针和长度供外部访问：

```cpp
constinit auto primes =
  get_prime_array&lt;1000&gt;();
constinit int const* const
  primes_data = primes.data();
constinit size_t const primes_size =
  primes.size();

```

这样，在其他文件里，你就可以只使用指针和长度来访问这些编译期生成的质数，如：

```cpp
for (auto* p = primes_data;
     p != primes_data + primes_size;
     ++p) {
  printf("%d ", *p);
}

```

这对打通编译期的世界和运行期的世界还是非常有用的。

## jthread 和停止标记

本讲最后我想介绍一个库特性，一个早就该有的线程对象—— `jthread`。

C++11 引入的 `thread` 具有一个明显的易用性问题，可由如下代码所示：

```cpp
int main()
{
  thread t{[] {}};
}

```

如果你是第一次见到这样的代码，估计你会期待这样的代码应当看起来什么都不做，但它的实际行为是程序会崩溃。C++ 里规定，在 `thread` 对象析构时，如果它有一个关联的线程，那析构函数的行为不是试图去汇合（ `join`）线程，而是让程序终结（ `terminate`）。

在 C++20 里，只要把上面的 `thread` 改成 `jthread`，程序就具有了汇合线程的自然行为。

`jthread` 的变化还不仅仅在析构函数的汇合行为上。它的析构函数大致是这样的：

```cpp
jthread::~jthread()
{
  if (joinable()) {
    request_stop();
    join();
  }
}

```

这里， `request_stop` 是向线程所关联的 `stop_source`（停止源）请求停止，而 `stop_source` 可以关联零个或多个 `stop_token`（停止标记）。我们一般使用值传参的方式传递 `stop_token`（它是一个使用引用计数的轻量级对象），可以在该对象上使用成员函数来检查状态。其中最重要的是 `stop_requested()`，用来检查有没有人向 `stop_source` 请求停止线程，从而实现协作式的线程停止。

为了兼容之前 `thread` 的行为，线程入口函数的参数可以跟之前一样。但是，如果你想利用停止标记，那线程入口函数的第一个参数就应该是 `stop_token`，这样，你可以在线程内检查是否有停止线程的请求。

下面是不检查的例子：

```cpp
{
  jthread th{[] {
    for (int i = 0; i &lt; 5; ++i) {
      cout &lt;&lt; i &lt;&lt; '\n';
      this_thread::sleep_for(100ms);
    }
  }};
}

```

这种情况下，最后一行会析构 `th`，当前线程将汇合新起的线程，因而会被阻塞约 0.5 秒，等待线程输出所有五个数。

上面已经说到，析构函数会自动请求停止线程，如下所示：

```cpp
{
  jthread th{[](stop_token stoken) {
    for (int i = 0; i &lt; 5; ++i) {
      if (stoken.stop_requested()) {
        break;
      }
      cout &lt;&lt; i &lt;&lt; '\n';
      this_thread::sleep_for(100ms);
    }
  }};
  this_thread::sleep_for(180ms);
}

```

这种情况下，新起的线程应该在约 0.18 秒后被请求停止，因此屏幕上多半会输出两个数。

当然，我们也可以主动提前请求线程停止，如下所示：

```cpp
{
  jthread th{[](stop_token stoken) {
    // 同前，略
  }};
  this_thread::sleep_for(80ms);
  th.request_stop();
  this_thread::sleep_for(100ms);
}

```

这样，我们可以在 `th` 超出作用域之前就让线程停止。

显然， `jthread` 具有非常自然的行为，Bjarne Stroustrup 也认为这是 `thread` 本该就有的行为，名字也是叫 `thread` 最合适。但由于政治和历史（“雷死”）的原因，我们多等了九年，它也只能换了名字才进入到 C++20（\[1\] 的 9.4 节）。

## 内容小结

本讲我们又讨论了四个 C++20 引入的重要特性：

- 飞船运算符——让对象的比较变得更简单
- consteval——保证函数在编译期求值
- constinit——保证变量在编译时初始化
- `jthread`——线程对象引入协作式线程停止，析构函数具有自动汇合行为

这些特性虽然没有之前讨论的概念、范围、协程、 `format` 这样的特性“大”，但使用上非常方便，也许比那些大特性更加容易上手。

## 课后思考

本讲内容里我展示了如何对同种类型的对象定义比较操作。请尝试一下利用飞船运算符对异种类型的对象定义比较操作。想一想，使用成员函数和友元函数有区别吗？这跟之前的最佳实践有没有什么区别？

欢迎留言和我分享你的想法和疑问。如果读完这篇文章有所收获，也欢迎分享给你的朋友。

## 参考资料

\[1\] Bjarne Stroustrup, “在纷繁多变的世界里茁壮成长：C++ 2006–2020”（吴咏炜、杨文波、张云潮等译）. [https://github.com/Cpp-Club/Cxx\_HOPL4\_zh](https://github.com/Cpp-Club/Cxx_HOPL4_zh)