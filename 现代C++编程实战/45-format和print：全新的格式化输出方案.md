# 45 | format和print：全新的格式化输出方案
你好，我是吴咏炜。今天，我们一起来聊聊全新的格式化输出方案： `format` 和 `print`。

## 背景：C++20 之前各种输出方案的问题

C++ 从很早开始，就引入了 IO stream 来解决 `printf` 系列函数固有的种种问题。这个方案总体上是成功的，因为 `printf` 本身确实缺点多多：

- 原则上类型不安全。当你格式化字符串里写了某种类型，而实际提供了另一种类型时（如 `printf("%s\n", 42)`），编译器不一定能发现这个问题。某些编译器在当你以常量形式给出格式化字符串时（最常见情况），能检查实际参数类型跟格式化字符串里指定的类型是否匹配，但当你自己的函数需要接受格式化字符串，编译器就没法帮你检查了——除非你使用编译器提供的某些特殊扩展方式。
- 不直接支持固定宽度的整数类型。可以用 `%d` 表示 `int`，用 `%lu` 表示 `unsigned long`，但你应当用什么来格式化 `uint32_t` 呢？标准的解决方式是使用 `PRIu32`（你知道吗？）：如果要把 `"Value: %d\n"` 里的整数类型改成 `uint32_t`，那正确的格式化字符串写法是 `"Value: %" PRIu32 "\n"`。
- 不支持自定义扩展。如果想用格式化字符串输出你自己的自定义类，那，哼哼，没门（所以，要输出时间只能另加了个 `strftime` 函数）。
- 字符串输出使用定长缓冲区。如果你的输出不是直接到文件，而是到字符串，那输出的缓冲区大小需要在调用函数前确定。 `sprintf` 具有缓冲区溢出问题， `snprintf` 及其他“更安全”的版本也要求你提前确定缓冲区大小。
- ……

但是，IO stream 引致的批评也很多。它虽然类型安全，但至少在面对简单类型时，格式化输出并不方便，且存在潜在性能问题。比如，如果你要简单以两位十六进制数形式输出一个字节的内容，用 `printf` 可以这样实现：

```cpp
void printHexByte(unsigned char c)
{
  printf("%02X", c);
}

```

而如果使用 IO stream 就会啰嗦很多：

```cpp
void printHexByte(unsigned char c)
{
  auto old_flags = cout.flags();
  auto old_fill = cout.fill('0');
  cout &lt;&lt; hex &lt;&lt; uppercase
       &lt;&lt; setw(2)
       &lt;&lt; static_cast&lt;unsigned&gt;(c);
  cout.fill(old_fill);
  cout.flags(old_flags);
}

```

这里 **啰嗦** 是因为我们需要额外设置 `cout` 的状态，然后需要恢复它的状态。因为有更多的函数调用，还因为 IO stream 本身实现就比较复杂，这个版本的 **性能** 也不如 `printf` 的版本。此外，因为存在全局的状态变化，这个版本还有 **多线程安全性** 问题：如果没有额外的同步锁的话，上面这个函数是不能在多线程环境下使用的……

这些问题到 C++20 可以基本解决，而到了 C++23，更是从代码简单性、执行性能等方面全面胜出。使用 C++23 的话，你就可以这么写：

```cpp
void printHexByte(unsigned char c)
{
  print("{:02X}", c);
}

```

下面，我们就开始介绍这一系列的新功能。

## 标准库和 fmt 库

在介绍标准库提供的这些新功能之前，我想先简单介绍一下 fmt 库 \[1\]。这个库可以看作是 `std::format`（及 `std::print`）的参考实现，因为其作者就是 C++ 标准里相关功能的提案人。如果你现在使用的 C++ 版本比较老，还不能使用标准库里的 `format`（和 `print`），你也仍然可以通过这个库把本讲里面的很多内容用起来。我们还可以让代码能够适配标准库或 fmt 库，只要提前包含合适的头文件和使用合适的 using 声明即可。代码库里提供的示例文件就是这么做的，会通过检测环境来尽量同时兼容标准库和 fmt 库。这些工程细节就请你直接自己看代码了。

即使你使用较新的编译器和 C++ 标准，使用 fmt 库也有一定的好处。这个库的实现质量非常高，因此，至少在某些情况下，使用 fmt 库可以比使用标准库的相应功能编译更快，产生的二进制文件还更小。

不过，考虑到跟标准库里其他组件的联动问题，一般而言，我还是优先推荐使用标准库里提供的功能。一个具体的例子是 fmt 库对标准库的 chrono 对象的支持较为有限，只对时间点和时长提供了基本支持。

## `format` 简介

`format` 是最基本的格式化工具，可以根据给定的格式化字符串把其他参数格式化成为字符串。还拿刚才使用的 `printHexByte` 做例子，使用 `format` 的写法是：

```cpp
void printHexByte(unsigned char c)
{
  cout &lt;&lt; format("{:02X}", c);
}

```

可以跟使用 `sprintf` 的版本比较一下：

```cpp
void printHexByte(unsigned char c)
{
  char buffer[3];
  sprintf(buffer, "%02X", c);
  cout &lt;&lt; buffer;
}

```

我们可以看到两者具有的明显区别和相似性：

- `format` 返回字符串，而不是使用预先给定的字符缓冲区，使用上更加方便。
- `format` 使用 `{…}` 来表示格式占位符，而 `sprintf` 使用 `%` 来引导格式占位符。
- 两者都使用 `02X` 这样的方式来进行格式化。

这里，一个比较不明显的地方是， `sprintf` 格式化字符串里的 `X` 是必需的，而 `format` 格式化字符串里的 `X` 不是必需的。如果使用字符格式来输出， `sprintf` 里必须写 `%c`，而 `format` 里只需要写 `{}` 即可。这是因为 `format`“知道”参数的类型，你仅在指定特殊的输出格式才需要在花括号里给出额外的格式说明。

有没有奇怪为什么 `02X` 要写在冒号后面？这是因为在格式化说明里，花括号里首先出现的数字表示参数的序号。序号可以全部不写，表示自然的顺序，相当于手写 0、1、2 这样的序列。但你也可以手工使用序号（要写就必须全部都写），这样可以重复使用同一个参数，或者交换参数顺序——这就是 `printf` 系列函数不方便做的事情了。

下面这个例子展示了如何同时输出一个字符的字符内容、十进制 ASCII 码和十六进制 ASCII 码：

```cpp
void printCharDecHex(char c)
{
  cout &lt;&lt; format(
    "'{0}': {0:d} (0x{0:02X})\n",
    c);
}

```

基本类型的格式说明你可以参考 CppReference \[2\]。这里我想着重指出以下几点：

- 对于不同的类型，可以适用的格式说明不同，同样的写法代表的含义也可能不同。如 `.`（后跟精度）只能用于浮点数和字符串，而不能（像 `printf` 一样）用于整数； `d` 对于 `int` 表示可能为负数的十进制输出，而对于 `char` 则表示转为 `unsigned char` 之后的十进制数值输出，不可能为负。
- 对于字符类型之外的整数类型，你不能把有符号类型当作无符号类型来输出，而需要真正把值先转型成为无符号类型。
- 如果需要表示单独的“{”和“}”，可以使用 `{​{` 和 `}​}`。
- 字符的宽度计算使用西方文字规则，可能对中文字符不正确，如 `“` 的宽度被当作为 1，而不是中文习惯的 2。 `format("{:>10}\n", "“你好”")` 的结果是开头有 4 个空格，因为字符串的显示宽度被认为是 6，在指定宽度为 10 且右对齐（ `>`）时，开头就需要插入 4 个空格了。这个问题仅存在于 Unicode 字符集中被认为具有“不明确宽度”（ambiguous width）的字符上，也就是中文和西文共用的一些字符；纯粹的汉字则没有这个问题。

`std::format` 要求格式化字符串是编译期常量，并且会在编译的时候就检查格式化字符串跟参数是否完全匹配。 `fmt::format` 在 C++20 下也能提供该项检查，但在 C++17 下则不行。想要让 fmt 库在 C++17 下也做到编译期检查，需要额外使用 `FMT_STRING` 宏，如 `format(FMT_STRING("{:02X}"), c)`。

一般情况下，使用编译期确定的格式化字符串比较安全和高效。如果你的格式化字符串在编译期确实无法确定，那就需要使用 `vformat` 了。此时，如果格式化字符串跟参数存在不匹配，那你就会在运行时得到异常，而不是在编译时直接失败了。

## 标准库对象的 `format` 支持

在有了标准的 `format` 支持后，标准库里的对象可以针对 `format` 定义特化版本，以实现定制的输出。这是 fmt 库难以做到的地方（目前也只做到了部分支持）。本节下面提到的格式化应该使用标准库提供的 `format`。

在 C++20 跟 `format` 一起出现、并得到格式化支持的是 chrono 库里的对象。事实上，chrono 对象的输出本身就是用 `format` 来定义的。如果有一个日期 `auto dt = 2025y/3/18;`，那当你写下 `cout &lt;&lt; dt` 时，效果实际上相当于 `cout &lt;&lt; format("{:%F}", dt)`。类似地，系统时钟时间点的输出也是如此，如：

```cpp
auto now = system_clock::now();
cout &lt;&lt; now &lt;&lt; '\n';
cout &lt;&lt; format("{:%F %T}\n", now);

```

下面这两行的输出相同，目前是：

> `2025-03-18 09:17:44.813553`
>
> `2025-03-18 09:17:44.813553`

你可以用 `format` 来控制输出的格式：如果只输出日期，你可以用 `"{:%F}"`；如果想输出到分钟为止，那可以使用 `"{:%F %H:%M}"`。但如果你想控制输出的秒的位数（默认按获取到的时间的精度来输出），就不能通过格式化字符串来了。比如，如果想要输出到精度为毫秒，那最方便的方式是用 `floor` 函数模板截断到指定精度再输出，如：

```cpp
auto now = floor&lt;milliseconds&gt;(
  system_clock::now());
cout &lt;&lt; format("{:%F %T %Z}\n",
               now);

```

这样，我现在得到的结果是：

> `2025-03-18 09:18:33.113 UTC`

C++23 进一步添加了对更多标准库对象类型的格式化支持。现在，范围（包含了容器）、容器适配器、 `pair`、 `tuple` 等对象都能直接输出了。下面的代码展示了一些对象的直接输出：

```cpp
map&lt;int, string&gt; mp{{1, "one"},
                    {2, "two"},
                    {3, "three"}};
vector&lt;pair&lt;int, string&gt;&gt;
  v(mp.begin(), mp.end());
auto keys = views::keys(mp);
cout &lt;&lt; format("{}\n", mp);
cout &lt;&lt; format("{}\n", v);
cout &lt;&lt; format("{}\n", keys);

```

结果为：

> `&#123;1: "one", 2: "two", 3: "three"&#125;`
>
> `[(1, "one"), (2, "two"), (3, "three")]`
>
> `[1, 2, 3]`

格式化输出需要 `std::formatter` 对要输出的对象存在特化。标准库里提供的特化可参见 CppReference \[3\]。

## 自定义对象的 `format` 支持

如果希望 `std::format` 能支持自己的对象类型，你也同样可以提供这样的特化。下面我用一些例子来说明一下如何对自定义对象类型进行格式化。

为了给出一个更接近真实的场景，我把一个示例 `Point` 的定义放在了自己的名空间 `my` 里：

```cpp
namespace my {

struct Point {
  double x;
  double y;
};

} // namespace my

```

我们知道，在需要支持 IO stream 时，可以直接在 `my` 名空间里重载 `operator&lt;&lt;`。以常见的仅支持窄字符流的情况为例，实现非常简单：

```cpp
namespace my {
…
std::ostream&
operator&lt;&lt;(std::ostream& os,
           const Point& pt)
{
  os &lt;&lt; '(' &lt;&lt; pt.x &lt;&lt; ", " &lt;&lt; pt.y
     &lt;&lt; ')';
  return os;
}

} // namespace my

```

如果要支持 `format`，我们需要在 `std` 名空间里写出对 `my::Point` 的特化。从 C++11 开始，可以在全局名空间里一次性完成这项工作：

```cpp
namespace my {
…
} // namespace my

template &lt;&gt;
struct std::formatter&lt;my::Point&gt; {
  constexpr auto
  parse(format_parse_context& ctx)
  {
    return ctx.begin();
  }

  auto
  format(const my::Point& pt,
         format_context& ctx) const
  {
    return format_to(ctx.out(),
                     "({}, {})",
                     pt.x, pt.y);
  }
};

```

在这里，我写出了 `std::formatter` 对 `my::Point` 的特化，在里面需要实现两个成员函数： `parse` 负责解析格式化说明（它是 `constexpr` 函数，因为对格式化说明的检查需要能在编译时完成）； `format` 负责真正完成格式化工作。目前，我在 `parse` 里直接返回“格式化解析上下文”的开头位置，即不进行任何格式化说明的解析，从而也不允许使用格式化说明；在 `format` 函数里则按照通常“一对”数的格式来输出，使用 `format_to` 完成实际的工作。它比 `format` 多一个输出迭代器参数，表示输出的位置；而 `format_context` 的 `out()` 成员函数提供了这个真正用来输出的迭代器。

现在，下面的代码就可以实际工作了：

```cpp
my::Point pt{1.0, 2.0};
cout &lt;&lt; format("{}\n", pt);

```

输出结果是：

> `(1, 2)`

为自己的类扩展 `format` 支持看起来还是要比扩展 `operator&lt;&lt;` 支持复杂点，但我们消除了一个明显的多线程问题（虽然理论上来讲还存在输出交错的风险，但实际上基本不会——除非你使用了 `std::ios::sync_with_stdio(false)`）。如果希望定制输出的精度或格式，我们可以进一步修改 `parse` 成员函数，并把需定制的信息保存下来。不过，要是仅需定制精度和格式的话，最简单的方式是直接利用 `formatter` 对已有类型的支持。改造后的 `formatter` 特化如下所示：

```cpp
template &lt;&gt;
struct std::formatter&lt;my::Point&gt; {
  constexpr auto
  parse(format_parse_context& ctx)
  {
    return dbl_fmt_.parse(ctx);
  }

  auto
  format(const my::Point& pt,
         format_context& ctx) const
  {
    auto out = format_to(ctx.out(), "(");
    out = dbl_fmt_.format(pt.x, ctx);
    out = format_to(out, ", ");
    out = dbl_fmt_.format(pt.y, ctx);
    return format_to(out, ")");
  }

private:
  std::formatter&lt;double&gt; dbl_fmt_;
};

```

在这里， `dbl_fmt_` 是 `formatter&lt;double>` 类型的对象，它可以解析格式化说明，并格式化一个浮点数。解析部分就完全交给它了。在格式化部分，则需要自己生成浮点数以外的部分（用 `format_to` 向 `ctx.out()` 返回的迭代器里写），而把浮点数的格式化交给它（使用 `dbl_fmt_` 的 `format` 成员函数）。我们也可以看到，这里的 `format` 成员函数和 `dbl_fmt_` 的 `format` 成员函数，都是接受一个对象和一个格式化上下文，并返回一个迭代器，可以供后续操作继续使用。

不过，当你在格式化说明里指定了宽度时，这个版本的结果有点不符合直觉：现在宽度变成了每个浮点数的宽度，而不是整个输出的宽度。要修正这个问题，我们需要自己解析格式化说明、检查错误、并存储其中的信息，这就比较繁琐了。事实上，我最后的实现代码达到了 200 行（不是按这里的窄行长），这就不适合贴出来详细讲解了。在这里，我们就看一下最核心部分的逻辑：

```cpp
template &lt;&gt;
struct std::formatter&lt;my::Point&gt; {
  constexpr auto
  parse(format_parse_context& ctx)
  {
    auto it = ctx.begin();
    auto end = ctx.end();

    parse_alignment(it, end);
    parse_sign(it, end);
    parse_hash(it, end);
    parse_width(it, end);
    parse_precision(it, end);
    parse_type(it, end);

    if (it != end && *it != '}') {
      throw format_error(
        "invalid format specifier");
    }

    return it;
  }

  auto
  format(const my::Point& p,
         format_context& ctx) const
  {
    auto fmt_str =
      build_format_string();
    auto x_str =
      format_element(fmt_str, p.x);
    auto y_str =
      format_element(fmt_str, p.y);

    if (width_ &gt; 0) {
      auto result = std::format(
        "({}, {})", x_str, y_str);

      if (alignment_ != '\0') {
        string fmt = "{:";
        if (fill_ != ' ') {
          fmt += fill_;
        }
        fmt += alignment_;
        fmt += to_string(width_);
        fmt += "}";

        return vformat_to(
          ctx.out(), fmt,
          make_format_args(result));
      } else {
        return format_to(
          ctx.out(), "{:{}}",
          result, width_);
      }
    }

    return format_to(ctx.out(),
                     "({}, {})",
                     x_str, y_str);
  }

  // 实现细节略
};

```

在 `parse` 成员函数里，我们需要正确处理对齐、符号、替换展示、宽度等各种格式说明。在 `format` 里，我们需要把对齐和宽度以外的格式化说明应用到每个坐标元素上。然后，如果没有规定宽度，那就简单直接输出（最后的 `format_to`）。如果有宽度，则需要更复杂的处理过程。在生成了基本的字符串结果后：

- 如果没有对齐，我们可以利用 `format` 系列接口允许在格式化说明里使用 `{}` 占位符来传递宽度（或精度，仅此两者）这一特性，把宽度传递给 `format_to` 来产生指定宽度的结果。
- 如果有对齐，那我们只能动态地构造格式化说明，然后使用 `vformat_to` 函数来使用这个动态构造的格式化说明（ `format` 和 `format_to` 都要求格式化说明在编译时可确定，通常是首选）。

基本思路仍然是类似的：需要实现 `parse` 来解析格式化说明，并实现 `format` 来真正进行格式化。虽然实现有点复杂，但在功能、性能和多线程安全性上，这相比 IO stream 都有了巨大的进步。

## 用 `print` 简化输出

既然 `format` 已经像 `printf` 一样把要输出的东西组合到了一起，现在再使用 `&lt;&lt;` 运算符就显得有点无聊。因此，基于易用性和性能等多方面的考虑，C++23 对 `print` 系列函数也进行了标准化。现在，下面这些语句具有基本相同的效果：

```cpp
cout &lt;&lt; "The answer is " &lt;&lt; 42  &lt;&lt; ".\n";
cout &lt;&lt; format("The answer is {}.\n", 42);
print("The answer is {}.\n", 42);
println("The answer is {}.", 42);
print(stdout, "The answer is {}.\n", 42);
println(cout, "The answer is {}.", 42);

```

输出时往往是直接一次一行，因此除了 `print` 之外，还有方便的 `println`（如果用 fmt 库，注意需要更新到 10.0 或更新版本；如 Ubuntu Linux 24.04 LTS 里自带的 libfmt-dev 就太老，不支持 `println`）。 `print`（及 `println`）函数模板的第一个参数可以指定输出的目标——既可以是 `ostream&`，也可以是 `FILE*`。如果不指定输出目标，则目标默认为 `stdout`。

在 Windows 上， `print` 还有一个额外的好处，就是它和 Windows 的终端代码页 \[4\] 特性匹配较好，能自动实现从 UTF-8 向终端代码页的转码。对于下面的代码：

```cpp
auto msg = "你好，世界！";
print("{}\n", msg);
cout &lt;&lt; msg &lt;&lt; '\n';

```

假设源文件按一般的跨平台惯例使用 UTF-8 编码存储，MSVC 编译时使用了 `/utf-8` 命令行选项，那程序的输出可能是这个样子：

> `你好，世界！`
>
> `浣犲ソ锛屼笘鐣岋紒`

也可能是这个样子（或其他的乱码形式）：

> `你好，世界！`
>
> `Σ╜áσÑ╜∩╝îΣ╕ûτòî∩╝ü`

换句话说， `print` 不管终端使用什么代码页，都能正确输出，而 `cout &lt;&lt;` 一般不行——除非你手工把代码页设为 65001。Windows 不管是中文版本还是英文版本，默认的代码页都不是它。

## 区域设置

大部分人写 C++ 时不需要关心区域设置（locale），但如果你在关心区域设置的少数人之中，也没有问题：出于性能和简单性的考虑， `format` 和 `print` 默认忽略区域设置，但它们都可以使用区域设置。其中， `format` 接口最为灵活，可以使用全局的区域设置，也可以使用特定的区域设置；而 `print` 只能选择使用全局区域设置或不用。

下面的代码展示了基本用法，请特别注意代码里 `locale` 对象和表示区域的 `L` 格式化说明符的使用：

```cpp
// 名字仅适用于 Unix；Windows 下使用请看完整代码
constexpr auto en_loc_name = "en_US.UTF-8";
constexpr auto de_loc_name = "de_DE.UTF-8";
constexpr auto zh_loc_name = "zh_CN.UTF-8";

auto en_loc = locale{en_loc_name};
auto de_loc = locale{de_loc_name};
locale::global(locale{zh_loc_name});

cout &lt;&lt; format(
  "In C locale:       {:.3f}\n",
  12345.67);
cout &lt;&lt; format(
  "In global locale:  {:.3Lf}\n",
  12345.67);
cout &lt;&lt; format(
  en_loc,
  "In USA locale:     {:.3Lf}\n",
  12345.67);
cout &lt;&lt; format(
  de_loc,
  "In Germany locale: {:.3Lf}\n",
  12345.67);

println("In C locale:       {:%x}",
        system_clock::now());
println("In global locale:  {:L%x}",
        system_clock::now());

```

三个 `locale` 的名字分别代表美国英语、德国德语和中国（大陆）汉语。某 Linux 环境下我得到的输出结果是：

> `In C locale:       12345.670`
>
> `In global locale:  12,345.670`
>
> `In USA locale:     12,345.670`
>
> `In Germany locale: 12.345,670`
>
> `In C locale:       03/24/25`
>
> `In global locale:  2025年03月24日`

上面可以观察到千位分隔符、小数点和日期输出上的差异（注意“全局”的区域设置设成了中国）。但是，很遗憾，这样的代码在不同的平台上并不能得到一致的结果，这也是区域设置功能的限制所在了——只在某些特定的平台/环境下较为有用……

代码库里有完整的代码，包括 Windows 支持和错误处理。如果你使用区域设置，对此类代码应该已经很熟悉，我就不详加讲解了。

## 性能观察

如果你关注性能，请注意目前在所有的平台上， `fmt::print` 的性能都高于 `std::print`，但一般差距不大。你可能会猜测，使用 `fmt::print`（配合 `FILE*`）可获得最好的性能。使用最新版本的 fmt 测试数据确实大致如此（一些旧版的 fmt 上我测到 `fmt::print` 配合 `ostream&` 反而更快），但这里至少有一个明显的例外：Windows/MSVC 下先 `format` 后输出到 `cout`，相比 `print` 到 `stdout` 或 `cout` 要更快——自动编码转换还是有一定开销的。但你一般不需要关注这个问题，因为输出到文件时通常没有问题，除非你的使用场景同时满足下面的条件：有大量输出，需要高性能；使用 `/utf-8`；使用 `std::print`。此时，你可能会希望改用 `format`，或者使用 fmt 库。

macOS 下的结果比较符合想象，使用 `fmt::print`（配合 `FILE*`）即可获得最好的性能。有趣的是，虽然 libc++ 库官方版实现的 `std::print` 目前性能不佳（Clang 18 和 19 都是如此），跟 fmt 库差距比较大，但某些 Apple 版（我用的是 Apple clang version 16.0.0）又没有这个问题。这实际是个意外 \[5\]。希望能在不久之后就 [得到修复](https://github.com/llvm/llvm-project/issues/70142) 吧。

如果你在产品项目里有大量输出（如每秒几万行）、需要极致性能，那可能 `fmt::print` 是个好选择。对于不那么关心性能的大部分人，直接用标准库会更加方便灵活。尤其需要注意，从功能上说，MSVC 的标准库和 libc++ 是目前唯二支持范围格式化并允许使用对齐和宽度的实现——比如，如果 `v` 是个 `vector`，你可以写出 `format("{:>40}\n", v)` 这样的表达式。libstdc++ 目前不支持范围的格式化，而 fmt 库不支持对范围格式化使用对齐和宽度。

无论在什么平台上，使用 `format`/ `print` 的最高性能都可以超过 `printf`。而且，如果使用的是 fmt 库的话，甚至在编译时间和生成的二进制文件大小上都没什么劣势。

## 内容小结

本讲我们讨论了当代 C++ 里的格式化输出解决方案。我们从最古老的 `printf` 系列函数开始，然后探讨 IO stream 的优缺点，并详细展示 C++20 引入的 `format` 和 C++23 引入的 `print`。这些新功能充分展示了 C++ 作为一门活跃的语言仍在不停地发展，并不断积极解决开发者遇到的常见痛点问题。

如果你可以使用 C++20 或更新的标准，那现在 `format` 应该是你的默认输出方案。如果你还只能使用更老的 C++ 版本，那也至少是时候考虑一下 fmt 库了。

## 课后思考

留两个小问题供你考虑一下：

- 为什么 `format` 和 `print` 能做到高性能，在很多情况下比 `printf` 还要快？
- 为什么 `format` 和 `print` 没有更早被发明出来？

欢迎留言和我分享你的想法和疑问。如果读完这篇文章有所收获，也欢迎分享给你的朋友。

## 参考资料

\[1\] Victor Zverovich, {fmt}. [https://github.com/fmtlib/fmt](https://github.com/fmtlib/fmt)

\[2\] cppreference.com, “Standard format specification”. [https://en.cppreference.com/w/cpp/utility/format/spec](https://en.cppreference.com/w/cpp/utility/format/spec)

\[2a\] cppreference.com, “标准格式说明”. [https://zh.cppreference.com/w/cpp/utility/format/spec](https://zh.cppreference.com/w/cpp/utility/format/spec)

\[3\] cppreference.com, “std::formatter”. [https://en.cppreference.com/w/cpp/utility/format/formatter](https://en.cppreference.com/w/cpp/utility/format/formatter)

\[3a\] cppreference.com, “std::formatter”. [https://zh.cppreference.com/w/cpp/utility/format/formatter](https://zh.cppreference.com/w/cpp/utility/format/formatter)

\[4\] Wikipedia, “Windows code page”. [https://en.wikipedia.org/wiki/Windows\_code\_page](https://en.wikipedia.org/wiki/Windows_code_page)

\[5\] 吴咏炜, “深入分析：std::print 与 fmt::print 的性能问题及原因”. [https://zhuanlan.zhihu.com/p/32653721351](https://zhuanlan.zhihu.com/p/32653721351)