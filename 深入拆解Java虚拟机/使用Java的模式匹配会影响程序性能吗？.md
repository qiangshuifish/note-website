# 使用Java的模式匹配会影响程序性能吗？
你好，我是郑雨迪。

自 JDK 14 起，Java 不断引入与模式匹配相关的语法糖，极大提升了代码的简洁性与可读性。

例如，instanceof 模式匹配最早在 JDK 14 中通过 JEP 305 [\[1\]](https://openjdk.org/jeps/305) 作为预览功能亮相，随后在 JEP 394 [\[2\]](https://openjdk.org/jeps/488) 中正式引入；Record 类型和 switch 模式匹配则分别在 JDK 21 中通过 JEP 440 [\[3\]](https://openjdk.org/jeps/440) 与 JEP 441 [\[4\]](https://openjdk.org/jeps/441) 正式发布；占位符语义于 JDK 22 中通过 JEP 456 [\[5\]](https://openjdk.org/jeps/456) 成为标准特性；而基本类型的模式匹配也在不断演进，目前已在 JDK 24 的 JEP 488 [\[6\]](https://openjdk.org/jeps/488) 中进入第二轮预览阶段。

模式匹配带来的最大优势之一，便是让 Java 代码更加简洁。以最基础的 instanceof 模式匹配为例，原本需要额外的一行代码进行的强制类型转换，现在可以直接在 instanceof 语句中完成，大幅减少冗余代码。

```
if (obj instanceof String) {
    String s = (String) obj;
    ...
}
// is equivalent to
if (obj instanceof String s) {
    ...
}

```

其次，得益于 javac 编译器的类型检查，模式匹配还能有效避免因手动强制类型转换而引发的 ClassCastException。

以下面代码中的 foo 方法为例：尽管我们在 if 条件语句中已经穷尽列举了所有已知的子类，但最后的强制类型转换仍有可能在运行时抛出 ClassCastException。

原因在于：（1）A 类本身仍可被实例化；（2）foo 方法的调用者可能会传入新定义的 A 类子类的实例。由于编译器无法判断该运行时异常是否为开发者有意为之，因此无法在编译阶段发出警告，导致潜在的类型安全问题。

```
public class A {}
public class B extends A {}
public class C extends A {}

void foo(A a) {
    if (a instanceof B)
        B b = (B) a;
    else
        C c = (C) a;
}

void bar(A a) {
    switch (a) {
        case B b -> System.out.println(b);
        case C c -> System.out.println(c);
        // option 1:
        // default -> throw new IllegalStateException("Unexpected value: " + a);
    }
}

// option 2：
// public sealed abstract class A permits B, C {}
// public final class B extends A {}
// public final class C extends A {}

```

而通过使用 switch 模式匹配（如 bar 方法所示），javac 编译器则能够进行更严格的穷尽性检查。若存在未覆盖的类型，编译器会报错提示开发者补全分支。这时我们可以选择添加 default 分支来处理其他可能的类型，或者使用 sealed、permits、abstract、final 等关键字，明确限定 A 类的具体实现类型为 B 或 C，从而确保类型完整覆盖。

再次，switch 模式匹配还支持 when 条件判断等高级特性，使代码表达更加简洁灵活。例如，在下面的示例中，第二个 case Integer 会匹配所有未满足第一个 case Integer 中 when 条件的 Integer 对象，实现了更细粒度的模式控制。

```
public static void print(Number n) {
    switch (n) {
        case Integer i when i >= 0 -> System.out.println("positive number " + i);
        case Integer i -> System.out.println("negative number " + i);
        default -> System.out.println("Other " + n);
    }
}

```

以上种种例子都充分展示了 Java 模式匹配在表达能力上的显著提升。那么，这种更强的表达力是否会带来性能损耗？接下来我们将深入探讨这些语法糖背后的实现机制。

## instanceof 测试的实现

我们先来回顾一下即时编译器中 instanceof 测试的实现机制。instanceof 测试经由即时编译器编译生成的实际执行策略依赖于目标类的信息以及是否已经收集到相应的类型分布数据。

以 final 类为例，因为其不可被继承，所以只要测试对象的实际类型与目标类型一致，即可判定为 true。这种情况下，instanceof 测试仅需一次内存访问：读取对象头中的类元信息，并与目标类进行比较。

而对于非 final 类来说，情况则更复杂。我们不能简单通过对象类型的直接对比来完成判断，而是需要递归地查找其父类链或接口。为了加快这一步骤，JVM 会在类的元信息中维护一个固定长度（通常为8）的“首要超类”（primary super）数组，用于快速判断常见的继承路径。

哪些类会被纳入首要超类数组，是在类加载阶段根据其继承自 java/lang/Object 的路径的深度来决定的：深度小于 8 的普通类会被纳入，而深度大于等于 8 的类和所有接口类则被视为“次要超类”（secondary super），不能存放在该数组中。

在进行 instanceof 测试时，如果目标类属于首要超类，即时编译器就可以利用目标类的继承深度作为索引，在测试对象类的元信息中的首要超类数组中快速定位对应深度的超类并比较对应，从而只需两次内存访问就能完成测试。

对于次要超类的情况，JVM 会为每个类维护一张链表结构，用于保存这些次要超类的信息。当进行 instanceof 测试时，JVM 需要遍历这张链表并逐一比较目标类。

可以预见，如果测试结果为 false，那么我们必将完整遍历链表。为了避免每次都从头遍历，JVM 在类元信息中维护了一个“上次匹配成功的次要超类”缓存字段，若目标类与该缓存相符，可以直接命中。不过这项优化仅适用于测试结果为 true 的场景。

在 JDK 23 中引入的选项 UseSecondarySupersTable（默认开启）进一步优化了次要超类的访问路径，允许使用哈希表加快查找速度。但即便如此，相较于首要超类，次要超类的 instanceof 测试性能在失败路径上仍然较差。

上述是即时编译器在缺乏类型分布信息的情况下的通用实现逻辑。而一旦 HotSpot 收集到了对象类型的运行时分布数据，即时编译器便能生成更具针对性的优化代码。

例如，如果在 instanceof String 的代码路径中，类型分布数据显示所有测试对象都是 Integer，那么即时编译器可以直接生成判断“对象类型是否为 Integer”的代码——若是，则返回 instanceof String的结果 false；否则说明类型分布数据不再准确，触发去优化流程并重新收集类型信息。

## instanceof 模式匹配

接下来，我们来观察一下 instanceof 模式匹配在 Java 中所生成的字节码。为了便于对比分析，我将原始版本与模式匹配版本分别放在两个不同的方法中进行展示：

```
$ cat Instanceof.java
public class Instanceof {
    static String staticField;

    static void foo(Object o) {
        if (o instanceof String) {
            String s = (String) o;
            staticField = s;
        }
    }

    static void bar(Object o) {
        if (o instanceof String s) {
            staticField = s;
        }
    }
}

$ javac Instanceof.java
$ javap -c -p Instaceof.class
...
  static void foo(java.lang.Object);
    Code:
         0: aload_0
         1: instanceof    #7                  // class java/lang/String
         4: ifeq          16
         7: aload_0
         8: checkcast     #7                  // class java/lang/String
        11: astore_1
        12: aload_1
        13: putstatic     #9                  // Field staticField:Ljava/lang/String;
        16: return

  static void bar(java.lang.Object);
    Code:
         0: aload_0
         1: instanceof    #7                  // class java/lang/String
         4: ifeq          16
         7: aload_0
         8: checkcast     #7                  // class java/lang/String
        11: astore_1
        12: aload_1
        13: putstatic     #9                  // Field staticField:Ljava/lang/String;
        16: return
}

```

可以看到，无论是原始写法还是使用模式匹配的版本，它们在字节码层面完全一致，都是由一个 instanceof 指令和一个 checkcast 指令组成。换句话说，模式匹配本身并没有省去额外的 checkcast 操作。

需要指出的是，即时编译器在处理 instanceof 字节码和 checkcast 字节码时，二者生成的中间表达形式是相同的，区别仅在于： **instanceof 测试失败时返回 false，而 checkcast 转换失败则会进入异常控制流，抛出 ClassCastException；instanceof 测试 null 会返回 false，而 checkcast 转换 null 则会成功。**

在上述示例中，checkcast 所处的控制流是被前面的 instanceof 测试所支配的。也就是说，执行到 checkcast 的路径一定是已经通过了类型检查。因此，即时编译器会识别这一冗余操作，并对 checkcast 进行优化消除，从而避免重复的类型检查开销。

下面是一段基于 JMH 的基准测试代码，用于评估原始写法与模式匹配版本在 instanceof 判断成功与失败时的性能表现。

```
$ cat InstanceOfBenchmark.java
package org.sample;

import org.openjdk.jmh.annotations.*;
import java.util.concurrent.TimeUnit;

@Warmup(iterations = 2, time = 1)
@Measurement(iterations = 5, time = 1)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@Fork(1)
public class InstanceOfBenchmark {
    @State(Scope.Thread)
    public static class BenchmarkState {
        Object obj = new Object();
        Object str = "Hello World";
        String result;
    }

    @Benchmark
    public void instanceOfFailOld(BenchmarkState state) {
        if (state.obj instanceof String) {
            state.result = (String) state.obj;
        }
    }

    @Benchmark
    public void instanceOfFailNew(BenchmarkState state) {
        if (state.obj instanceof String str) {
            state.result = str;
        }
    }

    @Benchmark
    public void instanceOfSuccOld(BenchmarkState state) {
        if (state.str instanceof String) {
            state.result = (String) state.str;
        }
    }

    @Benchmark
    public void instanceOfSuccNew(BenchmarkState state) {
        if (state.str instanceof String str) {
            state.result = str;
        }
    }
}

$ java -jar benchmarks.jar
...

Benchmark                               Mode  Cnt  Score   Error   Units
InstanceOfBenchmark.instanceOfFailNew  thrpt    5  2.435 ± 0.013  ops/ns
InstanceOfBenchmark.instanceOfFailOld  thrpt    5  2.430 ± 0.014  ops/ns
InstanceOfBenchmark.instanceOfSuccNew  thrpt    5  1.855 ± 0.062  ops/ns
InstanceOfBenchmark.instanceOfSuccOld  thrpt    5  1.848 ± 0.076  ops/ns

```

从测试结果来看，无论是在类型匹配成功还是失败的情况下，两种写法的性能差异都在 1% 以内，可以认为几乎没有区别，属于正常波动范围。值得注意的是，在判断成功的场景中，由于代码中还包含了额外的内存写操作，整体性能相较于失败场景略低。

如果你对进一步探索感兴趣，可以尝试扩展测试范围，引入次要超类参与 JMH 测评。此时需要注意使用多种不同类型的对象，以填充足够的类型分布信息，从而更真实地模拟实际运行时的行为。

## switch 模式匹配

相比之下，switch 模式匹配在经过 javac 编译后生成的字节码要复杂得多。为了更直观地讲解，下文我将展示由 IntelliJ IDEA 反编译器生成的对应 Java 源码，便于理解底层逻辑的展开。

```
$ cat Switch.java
public class Switch {
    static int staticInt;
    static long staticLong;

    static void foo(Number n) {
        switch (n) {
            case Integer i -> staticInt = i;
            case Long l    -> staticLong = l;
            default -> {}
        }
    }
}

$ cat disassember_output
static void foo(Number var0) {
    Objects.requireNonNull(var0);
    byte var2 = 0;
    //$FF: var2->value
    //0->java/lang/Integer
    //1->java/lang/Long
    switch (var0.typeSwitch<invokedynamic>(var0, var2)) {
        case 0:
            Integer var3 = (Integer)var0;
            staticInt = var3;
            break;
        case 1:
            Long var4 = (Long)var0;
            staticLong = var4;
    }
}

```

观察上述反编译代码可以看出，首先 switch 模式匹配对传入的对象有一个非空性要求 —— 这里我们调用了 java/util/Objects.requireNonNull，当传入参数为 null 时会抛出 NullPointerException。

接着，我们会执行一条 invokedynamic 指令，用于动态生成包含类型匹配逻辑的方法。这个方法接收两个参数：一个是 switch 模式匹配的测试对象，另一个是整数，在 typeSwitch 方法中用于跳过部分类型测试，这里暂且不表。typeSwitch 方法会根据对象的实际类型返回一个整数。

之后，22 行中的 lookupswitch 指令会根据 typeSwitch 方法返回的整数，将控制流跳转到原始代码 switch 分支中相应的代码段（8 - 10 行）。在进入具体分支前，还会执行一次强制类型转换，将测试对象转换为匹配分支中所声明的类型，这一点与 instanceof 模式匹配的行为一致。不过需要注意的是， **这里并不支持手动进行类型转换，转换是自动且由 javac 插入的。**

至于 invokedynamic 指令所依赖的引导方法，它对应的是 java/lang/runtime/SwitchBootstraps.typeSwitch。该方法内部会调用 generateTypeSwitch，动态构造一个包含类型分派逻辑的类，并以字节数组形式返回。若能截获这一数组，就可以直接查看生成类的具体实现，如下所示：

```
public static final int typeSwitch(Object var0, int var1) {
    Objects.checkIndex(var1, 3);
    if (var0 == null) {
        return -1;
    } else {
        switch (var1) {
            case 0:
                if (var0 instanceof Integer) {
                    return 0;
                }
            case 1:
                if (var0 instanceof Long) {
                    return 1;
                }
            default:
                return 2;
        }
    }
}

```

首先，生成的代码会先检查第二个类型为 int 的参数是否小于原始代码中 switch 分支的数量。前面提过，这个参数的作用是与 when 条件配合使用，用于跳过某些类型判断逻辑。

接下来，代码会判断 switch 的目标对象是否为 null，如果是，则直接返回 -1。不过由于在原始代码中已经通过 requireNonNull 做过非空检查，这一分支在实际执行中是不会被走到的，因此属于“死代码”，会被即时编译器消除。

最后，代码使用一个 tableswitch 指令来根据第二个参数的值选择性地跳过若干 instanceof 判断。由于示例代码中始终传入的是 0，而且 switch 分支之间并没有 break，所以当 instanceof Integer 判断失败后，会继续尝试接下来的 instanceof Long，依此类推。

综合这些行为，这段代码在经过即时编译器优化后，其最终执行逻辑大致可以简化为如下形式：

```
public static final int typeSwitch(Object var0, int var1) {
    // After inlining, var0 != null && var1 == 0 always holds
    if (var0 instanceof Integer) {
        return 0;
    }
    if (var0 instanceof Long) {
        return 1;
    }
    return 2;
}

```

而原代码在内联之后也会被优化为：

```
static void foo(Number var0) {
    Objects.requireNonNull(var0);
    if (var0 instanceof Integer) {
        Integer var3 = (Integer)var0;
        staticInt = var3;
    } else if (var0 instanceof Long) {
        Long var4 = (Long)var0;
        staticLong = var4;
    }
}

```

换句话说，在不使用 when 条件的情况下，switch 模式匹配本质上等同于按顺序执行的一系列 instanceof 判断，即一个典型的 if-else 类型链。

结合我们前面对 instanceof 性能的分析，优化的关键在于合理安排 case 分支的顺序：将出现频率更高的类型放在前面，以便尽早命中；而像接口这样的次要类型，则应尽量放在后面，避免频繁触发性能较差的判断路径。

下面是一段 JMH 基准测试代码，用于评估当目标对象的类型出现在 switch 分支最前与最后两种情况时的性能差异：

```
$ cat SwitchBenchmark.java
package org.sample;

import org.openjdk.jmh.annotations.*;

import java.util.concurrent.TimeUnit;

@Warmup(iterations = 5, time = 1)
@Measurement(iterations = 5, time = 1)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@Fork(1)
public class SwitchBenchmark {

    @State(Scope.Thread)
    public static class BenchmarkState {
        Object number = Integer.valueOf(0);
        int result = 0;
    }

    @Benchmark
    public void switchFirstHit(BenchmarkState state) {
        switch (state.number) {
            case Integer i -> state.result = 0;
            case Boolean b -> state.result = 1;
            case Byte b -> state.result = 2;
            case Short s -> state.result = 3;
            case Character c -> state.result = 4;
            case Long l -> state.result = 5;
            case Float f -> state.result = 6;
            case Double d -> state.result = 7;
            default -> state.result = -1;
        }
    }

    @Benchmark
    public void switchLastHit(BenchmarkState state) {
        switch (state.number) {
            case Boolean b -> state.result = 1;
            case Byte b -> state.result = 2;
            case Short s -> state.result = 3;
            case Character c -> state.result = 4;
            case Long l -> state.result = 5;
            case Float f -> state.result = 6;
            case Double d -> state.result = 7;
            case Integer i -> state.result = 0;
            default -> state.result = -1;
        }
    }
}

$ java -jar benchmarks.jar
...
Benchmark                        Mode  Cnt  Score   Error   Units
SwitchBenchmark.switchFirstHit  thrpt    5  2.091 ± 0.123  ops/ns
SwitchBenchmark.switchLastHit   thrpt    5  2.047 ± 0.015  ops/ns

```

不过，从测试结果来看，前后两种情况的性能差异其实并不明显。造成这一现象的主要原因在于：该基准测试只涉及单一类型，即 Integer，因此在 switchLastHit 中动态生成的 typeSwitch 方法里，所有的 instanceof 判断最终都观测到一致的类型分布信息。

基于这些信息，即时编译器会将所有的 instanceof 操作统一替换为对 Integer 类型的判断。由于这些判断是串联执行的，彼此之间存在控制流支配关系，编译器可以进一步优化，最终只保留一个有效的 instanceof Integer 判断。

为获得更具区分度的性能对比，下面是一个改进后的 JMH 基准测试程序，引入多种不同类型以增强测试对象的多样性：

```
$ cat SwitchBenchmark.java
package org.sample;

import org.openjdk.jmh.annotations.*;

import java.util.concurrent.TimeUnit;

@Warmup(iterations = 5, time = 1)
@Measurement(iterations = 5, time = 1)
@OutputTimeUnit(TimeUnit.MICROSECONDS)
@Fork(1)
public class SwitchBenchmark {

    @State(Scope.Thread)
    public static class BenchmarkState {
        Object[] numbers = new Object[100];
        int result = 0;

        {
            numbers[0] = new Object();
            numbers[1] = Boolean.FALSE;
            numbers[2] = Byte.MIN_VALUE;
            numbers[3] = Short.MIN_VALUE;
            numbers[4] = Character.MIN_VALUE;
            numbers[5] = Long.MIN_VALUE;
            numbers[6] = Float.MIN_VALUE;
            numbers[7] = Double.MIN_VALUE;
            for (int i = 8; i < numbers.length; i++) {
                numbers[i] = Integer.valueOf(i);
            }
        }
    }

    @Benchmark
    public void switchFirstHit(BenchmarkState state) {
        for (Object number : state.numbers) {
            switch (number) {
                case Integer i -> state.result = 0;
                case Boolean b -> state.result = 1;
                case Byte b -> state.result = 2;
                case Short s -> state.result = 3;
                case Character c -> state.result = 4;
                case Long l -> state.result = 5;
                case Float f -> state.result = 6;
                case Double d -> state.result = 7;
                default -> state.result = -1;
            }
        }
    }

    @Benchmark
    public void switchLastHit(BenchmarkState state) {
        for (Object number : state.numbers) {
            switch (number) {
                case Boolean b -> state.result = 1;
                case Byte b -> state.result = 2;
                case Short s -> state.result = 3;
                case Character c -> state.result = 4;
                case Long l -> state.result = 5;
                case Float f -> state.result = 6;
                case Double d -> state.result = 7;
                case Integer i -> state.result = 0;
                default -> state.result = -1;
            }
        }
    }
}

$ java -jar benchmarks.jar
...
Benchmark                        Mode  Cnt   Score   Error   Units
SwitchBenchmark.switchFirstHit  thrpt    5  25.521 ± 1.068  ops/us
SwitchBenchmark.switchLastHit   thrpt    5   5.426 ± 0.034  ops/us

```

需要注意的是，这里的时间单位与前面的测试不同。在 instanceof 字节码的类型分布信息被多类型“污染”后，测试结果清晰地反映出性能差异：switchLastHit 的表现明显下降，只有 switchFirstHit 性能的五分之一左右。这与我们预期的结论一致 —— **频繁命中的类型应尽可能放在前面，以最大程度发挥 switch 模式匹配的性能优势。**

## when 条件判定

当在 switch 模式匹配中引入 when 条件时，javac 编译器所生成的字节码结构与不带条件的情况有明显不同。

```
$ cat Switch.java
public class Switch {
    static int staticInt;
    static long staticLong;

    static void foo(Number n) {
        switch (n) {
            case Integer i when i >= 0 -> staticInt = i;
            case Integer i -> staticInt = -i;
            case Long l -> staticLong = l;
            default -> {
            }
        }
    }
}

$ cat disassember_output
// This is handcrafted. Intellij disassembler reproduces
// the switch pattern matching with when keyword
static void foo(Number var0) {
    Objects.requireNonNull(var0);
    byte var1 = 0;
    outer: while (true) {
        switch (typeSwitch(var0, var1)) {
            case 0:
                Integer var2 = (Integer)var0;
                if (var2 < 0) {
                    var1 = 1;
                    break;
                }
                staticInt = var2;
                break outer;
            case 1:
                Integer var3 = (Integer)var0;
                staticInt = -var3;
                break outer;
            case 2:
                Long var4 = (Long)var0;
                staticLong = var4;
                break outer;
        }
    }
}

public static final int typeSwitch(Object var0, int var1) {
    Objects.checkIndex(var1, 4);
    if (var0 == null) {
        return -1;
    } else {
        switch (var1) {
            case 0:
                if (var0 instanceof Integer) {
                    return 0;
                }
                break;
            case 1:
                if (var0 instanceof Integer) {
                    return 1;
                }
            case 2:
                break;
            default:
                return 3;
        }

        if (var0 instanceof Long) {
            return 2;
        } else {
            return 3;
        }
    }
}

```

首先，typeSwitch 方法仍然会为原始代码中每个 case 分支生成对应的 instanceof 判断。例如，原始代码中第一个分支是带有 when 条件的 case Integer，第二个分支是不带条件的 case Integer，那么 typeSwitch 方法中将包含两个相同的 instanceof Integer 检查。

针对这种情况，javac 会进行一个小范围的优化：如果这两个 case 紧邻，第一个 case 分支会插入一个 break，避免重复执行相同的 instanceof 判断。但如果这两个分支不相邻，那么动态生成的 typeSwitch 方法仍可能包含冗余的 instanceof 操作。好在这些重复判断会被即时编译器识别并合并，不会真正执行多次。

其次，switch 本体的逻辑会被编译为一个循环结构：当首个分支中的 when 条件判定失败时，控制流会跳回 switch 开始处，重新调用 typeSwitch。这时候，typeSwitch 的第二个参数就派上用场了——通过传入 1，跳过第一个 case 分支的匹配逻辑。当然，由于即时编译器会优化消除重复的 instanceof，这个“跳过”并没有带来实际的性能节省。它主要是为了防止无限执行第一个分支。

引入循环后，即时编译器的优化空间也变得更加有限。原本情况下，第二个参数始终为常量 0，使得 typeSwitch 方法在内联后可以完全消除 switch 指令；而现在，由于参数可能为 0 或 1，这种常量折叠优化无法生效，影响了整体性能。

下面是一段 JMH 基准测试代码，比较两种写法的性能表现：一种是使用 when 条件判断的 switchWhen，另一种则是将条件逻辑提前到 switch 外部手动处理的 switchNoWhen。

```
$ cat SwitchWhenBenchmark.java
package org.sample;

import org.openjdk.jmh.annotations.*;

import java.util.concurrent.TimeUnit;

@Warmup(iterations = 5, time = 1)
@Measurement(iterations = 5, time = 1)
@OutputTimeUnit(TimeUnit.MICROSECONDS)
@Fork(1)
public class SwitchWhenBenchmark {

    @State(Scope.Thread)
    public static class BenchmarkState {
        Object[] numbers = new Object[100];
        int result = 0;

        {
            for (int i = 0; i < numbers.length; i += 4) {
                numbers[i + 0] = Integer.MIN_VALUE;
                numbers[i + 1] = Integer.MAX_VALUE;
                numbers[i + 2] = Long.MIN_VALUE;
                numbers[i + 3] = Long.MAX_VALUE;
            }
        }
    }

    @Benchmark
    public void switchWhen(BenchmarkState state) {
        for (Object number : state.numbers) {
            switch (number) {
                case Integer i when i >= 0 -> state.result = 0;
                case Integer i -> state.result = 1;
                case Long l -> state.result = 2;
                default -> state.result = -1;
            }
        }
    }

    @Benchmark
    public void switchNoWhen(BenchmarkState state) {
        for (Object number : state.numbers) {
            Objects.requireNonNull(number);
            if (number instanceof Integer i && i >= 0)
                state.result = 0;
            else
                switch (number) {
                    case Integer i -> state.result = 1;
                    case Long l -> state.result = 2;
                    default -> state.result = -1;
                }
        }
    }
}

$ graalvm/bin/java -jar benchmarks.jar
...
Benchmark                          Mode  Cnt   Score   Error   Units
SwitchWhenBenchmark.switchNoWhen  thrpt    5  19.865 ± 0.556  ops/us
SwitchWhenBenchmark.switchWhen    thrpt    5   9.080 ± 0.052  ops/us

```

为了更直观地展示效果，上述基准测试是在 GraalVM 上运行的。结果显示，将 when 条件手动提前到 switch 语句之前，可以带来超过一倍的性能提升。

当然，情况也并非一成不变。如果即时编译器能够识别并成功对生成的循环结构进行循环剥离优化，那么最终性能表现可能会大不相同。例如，回到我们之前分析过的 Switch.foo 方法的反编译代码，一旦编译器对其进行了循环剥离（loop peeling）处理，所生成的逻辑将大致如下所示：

```
static void foo(Number var0) {
    Objects.requireNonNull(var0);
    byte var1 = 0;
    // loop iter 1
    switch (typeSwitch(var0, var1)) {
        case 0:
            Integer var2 = (Integer)var0;
            if (var2 < 0) {
                var1 = 1;
                break;
            }
            staticInt = var2;
            return;
        case 1:
            Integer var3 = (Integer)var0;
            staticInt = -var3;
            return;
        case 2:
            Long var4 = (Long)var0;
            staticLong = var4;
            return;
    }
    // At this point, var0 instanceof Integer && var1 == 1 always holds
    outer: while (true) {
        switch (typeSwitch(var0, var1)) {
            case 0:
                Integer var2 = (Integer)var0;
                if (var2 < 0) {
                    var1 = 1;
                    break;
                }
                staticInt = var2;
                break outer;
            case 1:
                Integer var3 = (Integer)var0;
                staticInt = -var3;
                break outer;
            case 2:
                Long var4 = (Long)var0;
                staticLong = var4;
                break outer;
        }
    }
}

```

由于其他分支在进入循环前已经完成返回，我们可以确定此时传入的测试对象 var0 恒为 Integer 类型，而第二个参数 var1 也始终为 1。因此，在 typeSwitch 方法内联之后，其返回值也始终是常量 1。

在这种前提下，经过即时编译器的常量传播与折叠优化，整个逻辑最终可以被简化为如下形式：

```
static void foo(Number var0) {
    Objects.requireNonNull(var0);
    byte var1 = 0;
    switch (typeSwitch(var0, var1)) {
        case 0:
            Integer var2 = (Integer)var0;
            if (var2 < 0) {
                break;
            }
            staticInt = var2;
            return;
        case 1:
            Integer var3 = (Integer)var0;
            staticInt = -var3;
            return;
        case 2:
            Long var4 = (Long)var0;
            staticLong = var4;
            return;
    }

    Integer var3 = (Integer)var0;
    staticInt = -var3;
}

```

不过，现实中是否会发生这种优化，还得取决于即时编译器是否选择对该循环结构进行循环剥离。这通常依赖于一些关键因素，比如循环是否为热点、是否具有明显的计数特征、首轮循环的参数是否与后续不同等。

在之前的 JMH 基准测试中，GraalVM 默认并未对这段代码执行循环剥离。不过，我们可以通过启用调试参数 -Dgraal.PeelALot=true 来强制启用循环剥离。

```
$ graalvm/bin/java -Djdk.graal.PeelALot=true -jar benchmarks.jar
...
Benchmark                          Mode  Cnt   Score   Error   Units
SwitchWhenBenchmark.switchNoWhen  thrpt    5  19.600 ± 0.152  ops/us
SwitchWhenBenchmark.switchWhen    thrpt    5  19.574 ± 0.237  ops/us

```

启用该优化后，switchWhen 的性能有了显著提升，达到了与手动条件判断版本 switchNoWhen 几乎相同的表现。

## 基本类型模式匹配

JDK 23 引入了对基本类型的模式匹配支持，使得我们可以使用类似于引用类型 switch 的语法来处理 int、long、float 等原始类型。例如，下列代码：

```
public class SwitchPrimitive {
    static int staticInt;
    static long staticLong;

    static void foo(float f) {
        switch (f) {
            case int i -> staticInt = i;
            case long l -> staticLong = l;
            default -> {
            }
        }
    }
}

```

表示的含义是：如果一个 float 数值能够被无损地转换为 int 或 long，则匹配成功。这种无损转换通常通过两次强制类型转换来判断，例如：f == (float)(int)f。不过，这样的判断仍需要排除一些边界情况，如 -0.0f，具体细节可以参考 java/lang/runtime/ExactConversionsSupport。

这段代码在编译后生成的字节码与引用类型的 switch 非常相似，同样借助 invokedynamic 指令来构造匹配逻辑。

```
static void foo(float f) {
    byte var2 = 0;
    //$FF: var2->value
    switch (f.typeSwitch<invokedynamic>(f, var2)) {
        case 0:
            int i = (int)f;
            staticInt = i;
            break;
        case 1:
            long l = (long)f;
            staticLong = l;
    }
}

public static final int typeSwitch(Object var0, int var1) {
    Objects.checkIndex(var1, 3);
    if (var0 == null) {
        return -1;
    } else {
        switch (var1) {
            case 0:
                if (var0 instanceof Number && ExactConversionsSupport.isFloatToIntExact(((Number)var0).floatValue())) {
                    return 0;
                }
            case 1:
                if (var0 instanceof Number && ExactConversionsSupport.isFloatToLongExact(((Number)var0).floatValue())) {
                    return 1;
                }
            default:
                return 2;
        }
    }
}

```

值得注意的是，尽管在字节码中，调用动态生成的 typeSwitch 方法传入的是 float 类型，但它实际接受的是 Object 类型。因此 JVM 会隐式地进行一次装箱操作。这也造成了 typeSwitch 方法中明显冗余的 instanceof Number 测试。我猜测这是从引用类型 switch 的生成逻辑中“复用”来的。

不过，即时编译器在对 typeSwitch 进行内联优化时，会识别并消除这些不必要的操作，如装箱和 instanceof 检查。最终，生成的机器码会被简化为更高效的形式，其伪代码大致如下：

```
static void foo(float f) {
    if (ExactConversionsSupport.isFloatToIntExact(f)) {
        int i = (int)f;
        staticInt = i;
    } else if (ExactConversionsSupport.isFloatToLongExact(f)) {
        long l = (long)f;
        staticLong = l;
    }
}

```

鉴于基本类型的模式匹配在生成代码上与引用类型的模式匹配高度相似，这里就不再单独给出对应的 JMH 基准测试程序了。

## 总结

自 JDK 14 引入模式匹配以来，代码的简洁性得到了显著提升。然而，即时编译器并不能自动将性能优化到最佳水平。

针对没有 when 条件判断的 switch 模式匹配，我建议将常见的匹配类型放在前面，而将接口类等次要类型放在后面。对于带有 when 条件判断的 switch 模式匹配，在即时编译器尚未提供更好支持的情况下，建议尽量避免在热点代码中使用。