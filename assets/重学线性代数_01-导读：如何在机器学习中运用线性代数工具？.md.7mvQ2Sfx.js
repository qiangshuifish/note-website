import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"01 | 导读：如何在机器学习中运用线性代数工具？","description":"","frontmatter":{},"headers":[{"level":2,"title":"从机器学习到线性代数","slug":"从机器学习到线性代数","link":"#从机器学习到线性代数","children":[]},{"level":2,"title":"鸢尾花分类问题中的线性代数","slug":"鸢尾花分类问题中的线性代数","link":"#鸢尾花分类问题中的线性代数","children":[{"level":3,"title":"1.数据集的收集、加载和分析","slug":"_1-数据集的收集、加载和分析","link":"#_1-数据集的收集、加载和分析","children":[]},{"level":3,"title":"2.数据集的准备","slug":"_2-数据集的准备","link":"#_2-数据集的准备","children":[]},{"level":3,"title":"3.训练模型","slug":"_3-训练模型","link":"#_3-训练模型","children":[]},{"level":3,"title":"4.模型测试","slug":"_4-模型测试","link":"#_4-模型测试","children":[]}]},{"level":2,"title":"本节小结","slug":"本节小结","link":"#本节小结","children":[]}],"relativePath":"重学线性代数/01-导读：如何在机器学习中运用线性代数工具？.md","filePath":"重学线性代数/01-导读：如何在机器学习中运用线性代数工具？.md","lastUpdated":1779822691000}'),i={name:"重学线性代数/01-导读：如何在机器学习中运用线性代数工具？.md"};function t(l,s,c,r,o,h){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_01-导读-如何在机器学习中运用线性代数工具" tabindex="-1">01 | 导读：如何在机器学习中运用线性代数工具？ <a class="header-anchor" href="#_01-导读-如何在机器学习中运用线性代数工具" aria-label="Permalink to &quot;01 | 导读：如何在机器学习中运用线性代数工具？&quot;">​</a></h1><p>你好，我是朱维刚。欢迎你跟我一起重学线性代数！</p><p>在开篇词中，我和你大致讲过我自己的经历，从2006年开始到现在14年的时间里，我都专注于机器学习领域。对于 <strong>线性代数</strong> 在机器学习中的应用，我非常了解。而这也是线性代数最主要的应用场景之一。因此，今天第一节课，我想先和你聊一聊，如何在机器学习中运用线性代数工具，在我们开始自下而上的学习之前，先从上层来看一看。</p><p>我们都知道，“数据”是机器学习的前提，机器学习的第一步就是要进行 <strong>数据</strong> 的收集、预处理和特征提取；而 <strong>模型</strong> 就是通过数据来学习的算法； <strong>学习</strong> 则是一个循环过程，一个自动在数据中寻找模式，并不停调优模型参数的过程。那我们就从机器学习的三个核心概念：数据、模型和学习说起。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/3a2a7433d5d13b676abe05041a1bcd32.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/3a2a7433d5d13b676abe05041a1bcd32.png" alt=""></a></p><p>你看，不论是模型，还是学习，都涉及数据，而数据加上模型和学习，就是数学的一般过程了，也就是：观察、实验、推理和抽象。所以，我认为学好数学，不仅有利于理解复杂的机器学习系统，还能调优算法参数，甚至能帮助你创建新的机器学习解决方案。</p><h2 id="从机器学习到线性代数" tabindex="-1">从机器学习到线性代数 <a class="header-anchor" href="#从机器学习到线性代数" aria-label="Permalink to &quot;从机器学习到线性代数&quot;">​</a></h2><p>那机器学习和线性代数之间到底有着怎样的关系呢？我想，用一个实际的机器学习算法的例子来解释，你可能更容易搞清楚。接下来，我使用KNN（K-Nearest Neighbor，K最近邻分类算法）来让你简单了解一下机器学习，以及它和线性代数之间的关系。</p><p>之所以选KNN分类算法，因为它是一个理论上比较成熟的方法，也是最简单的机器学习算法之一。这个方法的思路是：如果一个样本在特征空间中的K个最相似（即特征空间中最邻近）的样本中的大多数属于某一个类别，则该样本也属于这个类别。</p><p>这里有个前提，KNN算法中，所选择的“邻居”都是已经正确分类的对象。KNN分类算法在分类决策上只依据最邻近的一个或者几个样本的类别，来决定待分样本所属的类别。我们通过图来理解的话或许更容易一些。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/439cefee464eb01ed110e70515f94eaa.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/439cefee464eb01ed110e70515f94eaa.png" alt=""></a></p><p>假设图片中那个绿色圆就要是我们要决策的对象，那么根据KNN算法它属于哪一类？是红色三角形还是蓝色四方形？</p><p>如果K=3（实线圆），也就是包含离绿色圆最近的3个，由于红色三角形所占比例为2/3，绿色圆就属于红色三角形那个类。但如果K=5（虚线圆），就是包含离绿色圆最近的5个，由于蓝色四方形比例为3/5，绿色圆就属于蓝色四方形那个类。</p><h2 id="鸢尾花分类问题中的线性代数" tabindex="-1">鸢尾花分类问题中的线性代数 <a class="header-anchor" href="#鸢尾花分类问题中的线性代数" aria-label="Permalink to &quot;鸢尾花分类问题中的线性代数&quot;">​</a></h2><p>通过前面这个小例子，你应该已经理解了KNN算法的概念。那么接下来，我们就试着使用KNN在给定鸢尾花特征值的情况下，给鸢尾花做花种分类，带你来实际看一下线性代数在这里起到的作用。</p><p>特别说明一下， <strong>鸢尾花分类问题</strong> 是一个国际上通用的案例，一般都被作为机器学习入门来使用，所以它的数据集也是公开的。</p><h3 id="_1-数据集的收集、加载和分析" tabindex="-1">1.数据集的收集、加载和分析 <a class="header-anchor" href="#_1-数据集的收集、加载和分析" aria-label="Permalink to &quot;1.数据集的收集、加载和分析&quot;">​</a></h3><p>首先，我们要做的是数据集的收集、加载和分析，你也可以点击 <a href="https://www.kaggle.com/notlir/iriscsv" target="_blank" rel="noreferrer">这里</a> 下载原始数据集，来看看原始数据长什么样，下面是获取和加载数据的代码，sklearn数据集已经包含了样本数据，你可以直接用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import pandas as pd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from sklearn import datasets</span></span>
<span class="line"><span>iris = datasets.load_iris()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>species = [iris.target_names[x] for x in iris.target]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris = pd.DataFrame(iris[&#39;data&#39;], columns = [&#39;Sepal_Length&#39;, &#39;Sepal_Width&#39;, &#39;Petal_Length&#39;, &#39;Petal_Width&#39;])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris[&#39;Species&#39;] = species</span></span></code></pre></div><p>从显示的结果，我们能够看出鸢尾花有四个特征：花萼的长、宽和花瓣的长、宽。我们来看下这四个特征的数据类型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>iris.dtypes</span></span>
<span class="line"><span>Sepal_Length    float64</span></span>
<span class="line"><span>Sepal_Width     float64</span></span>
<span class="line"><span>Petal_Length    float64</span></span>
<span class="line"><span>Petal_Width     float64</span></span>
<span class="line"><span>Species          object</span></span>
<span class="line"><span>dtype: object</span></span></code></pre></div><p>这些特征都是数值型，而且标签Species表示的是花种，是一个字符串类型的变量。我们继续看一下鸢尾花的分类统计：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>iris[&#39;count&#39;] = 1</span></span>
<span class="line"><span>iris[[&#39;Species&#39;, &#39;count&#39;]].groupby(&#39;Species&#39;).count()</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/a7ff740c15de327cfd8c1c9a4b681cce.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/a7ff740c15de327cfd8c1c9a4b681cce.png" alt=""></a></p><p>这里我们直接能够看到，鸢尾花有三个花种，每个种类有50个实例，或者说50条数据，我们再用图来更直观地显示这三种鸢尾花。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%matplotlib inline</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def plot_iris(iris, col1, col2):</span></span>
<span class="line"><span>    import seaborn as sns</span></span>
<span class="line"><span>    import matplotlib.pyplot as plt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sns.lmplot(x = col1, y = col2,</span></span>
<span class="line"><span>               data = iris,</span></span>
<span class="line"><span>               hue = &quot;Species&quot;,</span></span>
<span class="line"><span>               fit_reg = False)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    plt.xlabel(col1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    plt.ylabel(col2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    plt.title(&#39;Iris species shown by color&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    plt.show()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>plot_iris(iris, &#39;Petal_Width&#39;, &#39;Sepal_Length&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>plot_iris(iris, &#39;Sepal_Width&#39;, &#39;Sepal_Length&#39;)</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/c216f676f59e00cae4b52481fdf88293.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/c216f676f59e00cae4b52481fdf88293.png" alt=""></a><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/a8337b9d13c23ef18e3bd8a4dbb91b0a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/a8337b9d13c23ef18e3bd8a4dbb91b0a.png" alt=""></a></p><p>蓝、黄、绿，这三种颜色分别代表了三种鸢尾花，显示还是很清楚的。</p><h3 id="_2-数据集的准备" tabindex="-1">2.数据集的准备 <a class="header-anchor" href="#_2-数据集的准备" aria-label="Permalink to &quot;2.数据集的准备&quot;">​</a></h3><p>接下来的第二步就是数据集的准备了。在训练任何机器学习模型前，数据准备都相当重要，这里也要涉及两步准备。</p><p>第一步，特征数值标准化。如果我们不做标准化，后果就是大数值特征会主宰模型训练，这会导致更有意义的小数值特征被忽略。这里我们用Z Score标准化，使每一类特征平均值为0，方差为1.0，我们可以通过代码实现来看下效果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from sklearn.preprocessing import scale</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import pandas as pd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>num_cols = [&#39;Sepal_Length&#39;, &#39;Sepal_Width&#39;, &#39;Petal_Length&#39;, &#39;Petal_Width&#39;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_scaled = scale(iris[num_cols])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_scaled = pd.DataFrame(iris_scaled, columns = num_cols)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(iris_scaled.describe().round(3))</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/1f7bbea1c93dcdbbcd9c1ba4e32178da.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/1f7bbea1c93dcdbbcd9c1ba4e32178da.png" alt=""></a></p><p>你可以看到，每一列平均值为0，标准差大约是1.0。为了分类需要，我们用字典把花种从字符串类型转换成数字表示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>levels = {&#39;setosa&#39;:0, &#39;versicolor&#39;:1, &#39;virginica&#39;:2}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_scaled[&#39;Species&#39;] = [levels[x] for x in iris[&#39;Species&#39;]]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_scaled.head()</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/bc14b245ab9076d3a8911dyy2da8895e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/bc14b245ab9076d3a8911dyy2da8895e.png" alt=""></a></p><p>第二步，把数据集随机分割成样本训练集和评估数据集，训练集用来训练KNN模型，评估集用来测试和评估KNN的分类结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from sklearn.model_selection import train_test_split</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import numpy as np</span></span>
<span class="line"><span></span></span>
<span class="line"><span>np.random.seed(3456)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_split = train_test_split(np.asmatrix(iris_scaled), test_size = 75)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_train_features = iris_split[0][:, :4]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_train_labels = np.ravel(iris_split[0][:, 4])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_test_features = iris_split[1][:, :4]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_test_labels = np.ravel(iris_split[1][:, 4])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(iris_train_features.shape)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(iris_train_labels.shape)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(iris_test_features.shape)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(iris_test_labels.shape)</span></span></code></pre></div><p>通过代码，我们得到了下面这样的结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(75, 4)</span></span>
<span class="line"><span>(75,)</span></span>
<span class="line"><span>(75, 4)</span></span>
<span class="line"><span>(75,)</span></span></code></pre></div><h3 id="_3-训练模型" tabindex="-1">3.训练模型 <a class="header-anchor" href="#_3-训练模型" aria-label="Permalink to &quot;3.训练模型&quot;">​</a></h3><p>数据准备好后，就是第三步训练模型了。这里我们使用K=3来训练KNN模型，当然你也可以调整这个参数来进行观察和调优。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from sklearn.neighbors import KNeighborsClassifier</span></span>
<span class="line"><span></span></span>
<span class="line"><span>KNN_mod = KNeighborsClassifier(n_neighbors = 3)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>KNN_mod.fit(iris_train_features, iris_train_labels)</span></span></code></pre></div><h3 id="_4-模型测试" tabindex="-1">4.模型测试 <a class="header-anchor" href="#_4-模型测试" aria-label="Permalink to &quot;4.模型测试&quot;">​</a></h3><p>执行KNN训练后，我们来到了最后一步，模型测试，这里我们使用测试集来测试模型。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>iris_test = pd.DataFrame(iris_test_features, columns = num_cols)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_test[&#39;predicted&#39;] = KNN_mod.predict(iris_test_features)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_test[&#39;correct&#39;] = [1 if x == z else 0 for x, z in zip(iris_test[&#39;predicted&#39;], iris_test_labels)]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>accuracy = 100.0 * float(sum(iris_test[&#39;correct&#39;])) / float(iris_test.shape[0])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(accuracy)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>96.0</span></span></code></pre></div><p>最终，我们得到的准确率是96.0，说明了KNN的训练模型不错，适用这类场景。我们通过代码把其中的两个分类setosa和versicolor打印出来看看。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>levels = {0:&#39;setosa&#39;, 1:&#39;versicolor&#39;, 2:&#39;virginica&#39;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iris_test[&#39;Species&#39;] = [levels[x] for x in iris_test[&#39;predicted&#39;]]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>markers = {1:&#39;^&#39;, 0:&#39;o&#39;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>colors = {&#39;setosa&#39;:&#39;blue&#39;, &#39;versicolor&#39;:&#39;green&#39;,}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def plot_shapes(df, col1,col2,  markers, colors):</span></span>
<span class="line"><span>    import matplotlib.pyplot as plt</span></span>
<span class="line"><span>    import seaborn as sns</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ax = plt.figure(figsize=(6, 6)).gca() # define plot axis</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for m in markers: # iterate over marker dictioary keys</span></span>
<span class="line"><span>        for c in colors: # iterate over color dictionary keys</span></span>
<span class="line"><span>            df_temp = df[(df[&#39;correct&#39;] == m)  &amp; (df[&#39;Species&#39;] == c)]</span></span>
<span class="line"><span>            sns.regplot(x = col1, y = col2,</span></span>
<span class="line"><span>                        data = df_temp,</span></span>
<span class="line"><span>                        fit_reg = False,</span></span>
<span class="line"><span>                        scatter_kws={&#39;color&#39;: colors[c]},</span></span>
<span class="line"><span>                        marker = markers[m],</span></span>
<span class="line"><span>                        ax = ax)</span></span>
<span class="line"><span>    plt.xlabel(col1)</span></span>
<span class="line"><span>    plt.ylabel(col2)</span></span>
<span class="line"><span>    plt.title(&#39;Iris species by color&#39;)</span></span>
<span class="line"><span>    return &#39;Done&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>plot_shapes(iris_test, &#39;Petal_Width&#39;, &#39;Sepal_Length&#39;, markers, colors)</span></span>
<span class="line"><span>plot_shapes(iris_test, &#39;Sepal_Width&#39;, &#39;Sepal_Length&#39;, markers, colors)</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/9e2c398552558a970ff1644905f6347f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/9e2c398552558a970ff1644905f6347f.png" alt=""></a><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/1057ba92123f1b3faa7d98b3162a4c47.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%87%8D%E5%AD%A6%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/images/265757/1057ba92123f1b3faa7d98b3162a4c47.png" alt=""></a></p><p>从显示的效果来说，分类还是挺明显的，熟悉了最基础的机器学习过程后，你可能会问，讲了半天，线性代数到底在哪里呢？关键就在KNeighborsClassifier模块上，这个模型算法的实现背后，其实用到了线性代数的核心原理。</p><p>首先，因为每种鸢尾花都有四个特征：花萼的长、宽和花瓣的长、宽，所以每条数据都是四维向量。</p><p>接着，量化样本之间的相似度，也就是计算向量之间的距离。而向量之间距离的运算有很多方式，比如：曼哈顿距离、欧式距离、切比雪夫距离、闵可夫斯基距离等等。其中，欧式距离你应该很熟悉了，因为我们初中都学过，在二维平面上计算两点之间的距离公式：</p><p>$$d=\\sqrt{\\left(x_{1}-x_{2}\\right)^{2}+\\left(y_{1}-y_{2}\\right)^{2}​}$$</p><p>扩展到我们实例中的四维向量，也是同样的算法。</p><p>你看，这就是线性代数在机器学习中的一种应用场景。KNN是一种监督学习算法，因为在样本集中有分类信息，通过计算距离来衡量样本之间相似度，算法简单，易于理解和实现。还有另一种机器学习算法是无监督学习，底层的数学原理其实也是差不多的，总的思想就是“物以类聚”。</p><p>现在，你是不是有一种豁然开朗的感觉？终于看到了线性代数原来那么有意义，而且再简单的公式也是美的。</p><h2 id="本节小结" tabindex="-1">本节小结 <a class="header-anchor" href="#本节小结" aria-label="Permalink to &quot;本节小结&quot;">​</a></h2><p>好了，到这里导读这一讲就结束了，最后我再总结一下前面讲解的内容。</p><p>这一讲我使用机器学习的监督学习算法KNN，在给定鸢尾花特征值的情况下，给鸢尾花做花种分类，让你了解机器学习最基本的过程外，能够真正了解其背后的线性代数真相，为你进入后面课程的学习提供一个感性的认知。</p><p>机器学习中用到的线性代数知识点比比皆是，而且往往软件架构上看上去复杂的事情，在数学上反而很简单，希望你在学习了这门课程后，能够多从数学角度出发去构思解决问题的方案。</p><p>同时，欢迎你在留言区说说自己对机器学习的理解，也可以分享一下自己的线性代数学习经历，如果你有所收获，也欢迎你把这篇文章分享给你的朋友。</p>`,62)])])}const b=a(i,[["render",t]]);export{g as __pageData,b as default};
