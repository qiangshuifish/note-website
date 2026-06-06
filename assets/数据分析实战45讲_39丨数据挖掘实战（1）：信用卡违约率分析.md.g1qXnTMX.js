import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"39丨数据挖掘实战（1）：信用卡违约率分析","description":"","frontmatter":{},"headers":[{"level":2,"title":"构建随机森林分类器","slug":"构建随机森林分类器","link":"#构建随机森林分类器","children":[]},{"level":2,"title":"使用GridSearchCV工具对模型参数进行调优","slug":"使用gridsearchcv工具对模型参数进行调优","link":"#使用gridsearchcv工具对模型参数进行调优","children":[]},{"level":2,"title":"使用Pipeline管道机制进行流水线作业","slug":"使用pipeline管道机制进行流水线作业","link":"#使用pipeline管道机制进行流水线作业","children":[]},{"level":2,"title":"对信用卡违约率进行分析","slug":"对信用卡违约率进行分析","link":"#对信用卡违约率进行分析","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"数据分析实战45讲/39丨数据挖掘实战（1）：信用卡违约率分析.md","filePath":"数据分析实战45讲/39丨数据挖掘实战（1）：信用卡违约率分析.md","lastUpdated":1779820717000}'),i={name:"数据分析实战45讲/39丨数据挖掘实战（1）：信用卡违约率分析.md"};function l(t,s,r,c,o,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_39丨数据挖掘实战-1-信用卡违约率分析" tabindex="-1">39丨数据挖掘实战（1）：信用卡违约率分析 <a class="header-anchor" href="#_39丨数据挖掘实战-1-信用卡违约率分析" aria-label="Permalink to &quot;39丨数据挖掘实战（1）：信用卡违约率分析&quot;">​</a></h1><p>今天我来带你做一个数据挖掘的项目。在数据挖掘的过程中，我们经常会遇到一些问题，比如：如何选择各种分类器，到底选择哪个分类算法，是SVM，决策树，还是KNN？如何优化分类器的参数，以便得到更好的分类准确率？</p><p>这两个问题，是数据挖掘核心的问题。当然对于一个新的项目，我们还有其他的问题需要了解，比如掌握数据探索和数据可视化的方式，还需要对数据的完整性和质量做评估。这些内容我在之前的课程中都有讲到过。</p><p>今天的学习主要围绕下面的三个目标，并通过它们完成信用卡违约率项目的实战，这三个目标分别是：</p><ol><li><p>创建各种分类器，包括已经掌握的SVM、决策树、KNN分类器，以及随机森林分类器；</p></li><li><p>掌握GridSearchCV工具，优化算法模型的参数；</p></li><li><p>使用Pipeline管道机制进行流水线作业。因为在做分类之前，我们还需要一些准备过程，比如数据规范化，或者数据降维等。</p></li></ol><h2 id="构建随机森林分类器" tabindex="-1">构建随机森林分类器 <a class="header-anchor" href="#构建随机森林分类器" aria-label="Permalink to &quot;构建随机森林分类器&quot;">​</a></h2><p>在算法篇中，我主要讲了数据挖掘十大经典算法。实际工作中，你也可能会用到随机森林。</p><p>随机森林的英文是Random Forest，英文简写是RF。它实际上是一个包含多个决策树的分类器，每一个子分类器都是一棵CART分类回归树。所以随机森林既可以做分类，又可以做回归。当它做分类的时候，输出结果是每个子分类器的分类结果中最多的那个。你可以理解是每个分类器都做投票，取投票最多的那个结果。当它做回归的时候，输出结果是每棵CART树的回归结果的平均值。</p><p>在sklearn中，我们使用RandomForestClassifier()构造随机森林模型，函数里有一些常用的构造参数：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/352035fe3e92d412d652fd55c77f23f9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/352035fe3e92d412d652fd55c77f23f9.png" alt=""></a></p><p>当我们创建好之后，就可以使用fit函数拟合，使用predict函数预测。</p><h2 id="使用gridsearchcv工具对模型参数进行调优" tabindex="-1">使用GridSearchCV工具对模型参数进行调优 <a class="header-anchor" href="#使用gridsearchcv工具对模型参数进行调优" aria-label="Permalink to &quot;使用GridSearchCV工具对模型参数进行调优&quot;">​</a></h2><p>在做分类算法的时候，我们需要经常调节网络参数（对应上面的构造参数），目的是得到更好的分类结果。实际上一个分类算法有很多参数，取值范围也比较广，那么该如何调优呢？</p><p>Python给我们提供了一个很好用的工具GridSearchCV，它是Python的参数自动搜索模块。我们只要告诉它想要调优的参数有哪些以及参数的取值范围，它就会把所有的情况都跑一遍，然后告诉我们哪个参数是最优的，结果如何。</p><p>使用GridSearchCV模块需要先引用工具包，方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from sklearn.model_selection import GridSearchCV</span></span></code></pre></div><p>然后我们使用GridSearchCV(estimator, param_grid, cv=None, scoring=None)构造参数的自动搜索模块，这里有一些主要的参数需要说明下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/7042cb450e5dcac9306d0178265642fd.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/7042cb450e5dcac9306d0178265642fd.png" alt=""></a></p><p>构造完GridSearchCV之后，我们就可以使用fit函数拟合训练，使用predict函数预测，这时预测采用的是最优参数情况下的分类器。</p><p>这里举一个简单的例子，我们用sklearn自带的IRIS数据集，采用随机森林对IRIS数据分类。假设我们想知道n_estimators在1-10的范围内取哪个值的分类结果最好，可以编写代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># -*- coding: utf-8 -*-</span></span>
<span class="line"><span># 使用RandomForest对IRIS数据集进行分类</span></span>
<span class="line"><span># 利用GridSearchCV寻找最优参数</span></span>
<span class="line"><span>from sklearn.ensemble import RandomForestClassifier</span></span>
<span class="line"><span>from sklearn.model_selection import GridSearchCV</span></span>
<span class="line"><span>from sklearn.datasets import load_iris</span></span>
<span class="line"><span>rf = RandomForestClassifier()</span></span>
<span class="line"><span>parameters = {&quot;n_estimators&quot;: range(1,11)}</span></span>
<span class="line"><span>iris = load_iris()</span></span>
<span class="line"><span># 使用GridSearchCV进行参数调优</span></span>
<span class="line"><span>clf = GridSearchCV(estimator=rf, param_grid=parameters)</span></span>
<span class="line"><span># 对iris数据集进行分类</span></span>
<span class="line"><span>clf.fit(iris.data, iris.target)</span></span>
<span class="line"><span>print(&quot;最优分数： %.4lf&quot; %clf.best_score_)</span></span>
<span class="line"><span>print(&quot;最优参数：&quot;, clf.best_params_)</span></span>
<span class="line"><span>运行结果如下：</span></span>
<span class="line"><span>最优分数： 0.9667</span></span>
<span class="line"><span>最优参数： {&#39;n_estimators&#39;: 6}</span></span></code></pre></div><p>你能看到当我们采用随机森林作为分类器的时候，最优准确率是0.9667，当n_estimators=6的时候，是最优参数，也就是随机森林一共有6个子决策树。</p><h2 id="使用pipeline管道机制进行流水线作业" tabindex="-1">使用Pipeline管道机制进行流水线作业 <a class="header-anchor" href="#使用pipeline管道机制进行流水线作业" aria-label="Permalink to &quot;使用Pipeline管道机制进行流水线作业&quot;">​</a></h2><p>做分类的时候往往都是有步骤的，比如先对数据进行规范化处理，你也可以用PCA方法（一种常用的降维方法）对数据降维，最后使用分类器分类。</p><p>Python有一种Pipeline管道机制。管道机制就是让我们把每一步都按顺序列下来，从而创建Pipeline流水线作业。每一步都采用(‘名称’, 步骤)的方式来表示。</p><p>我们需要先采用StandardScaler方法对数据规范化，即采用数据规范化为均值为0，方差为1的正态分布，然后采用PCA方法对数据进行降维，最后采用随机森林进行分类。</p><p>具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from sklearn.model_selection import GridSearchCV</span></span>
<span class="line"><span>pipeline = Pipeline([</span></span>
<span class="line"><span>        (&#39;scaler&#39;, StandardScaler()),</span></span>
<span class="line"><span>        (&#39;pca&#39;, PCA()),</span></span>
<span class="line"><span>        (&#39;randomforestclassifier&#39;, RandomForestClassifier())</span></span>
<span class="line"><span>])</span></span></code></pre></div><p>那么我们现在采用Pipeline管道机制，用随机森林对IRIS数据集做一下分类。先用StandardScaler方法对数据规范化，然后再用随机森林分类，编写代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># -*- coding: utf-8 -*-</span></span>
<span class="line"><span># 使用RandomForest对IRIS数据集进行分类</span></span>
<span class="line"><span># 利用GridSearchCV寻找最优参数,使用Pipeline进行流水作业</span></span>
<span class="line"><span>from sklearn.ensemble import RandomForestClassifier</span></span>
<span class="line"><span>from sklearn.model_selection import GridSearchCV</span></span>
<span class="line"><span>from sklearn.datasets import load_iris</span></span>
<span class="line"><span>from sklearn.preprocessing import StandardScaler</span></span>
<span class="line"><span>from sklearn.pipeline import Pipeline</span></span>
<span class="line"><span>rf = RandomForestClassifier()</span></span>
<span class="line"><span>parameters = {&quot;randomforestclassifier__n_estimators&quot;: range(1,11)}</span></span>
<span class="line"><span>iris = load_iris()</span></span>
<span class="line"><span>pipeline = Pipeline([</span></span>
<span class="line"><span>        (&#39;scaler&#39;, StandardScaler()),</span></span>
<span class="line"><span>        (&#39;randomforestclassifier&#39;, rf)</span></span>
<span class="line"><span>])</span></span>
<span class="line"><span># 使用GridSearchCV进行参数调优</span></span>
<span class="line"><span>clf = GridSearchCV(estimator=pipeline, param_grid=parameters)</span></span>
<span class="line"><span># 对iris数据集进行分类</span></span>
<span class="line"><span>clf.fit(iris.data, iris.target)</span></span>
<span class="line"><span>print(&quot;最优分数： %.4lf&quot; %clf.best_score_)</span></span>
<span class="line"><span>print(&quot;最优参数：&quot;, clf.best_params_)</span></span>
<span class="line"><span>运行结果：</span></span>
<span class="line"><span>最优分数： 0.9667</span></span>
<span class="line"><span>最优参数： {&#39;randomforestclassifier__n_estimators&#39;: 9}</span></span></code></pre></div><p>你能看到是否采用数据规范化对结果还是有一些影响的，有了GridSearchCV和Pipeline这两个工具之后，我们在使用分类器的时候就会方便很多。</p><h2 id="对信用卡违约率进行分析" tabindex="-1">对信用卡违约率进行分析 <a class="header-anchor" href="#对信用卡违约率进行分析" aria-label="Permalink to &quot;对信用卡违约率进行分析&quot;">​</a></h2><p>我们现在来做一个信用卡违约率的项目，这个数据集你可以从GitHub上下载： <a href="https://github.com/cystanford/credit_default" target="_blank" rel="noreferrer">https://github.com/cystanford/credit_default</a>。</p><p>这个数据集是台湾某银行2005年4月到9月的信用卡数据，数据集一共包括25个字段，具体含义如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/1730fb3a809c99950739e7f50e1a6988.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/1730fb3a809c99950739e7f50e1a6988.jpg" alt=""></a></p><p>现在我们的目标是要针对这个数据集构建一个分析信用卡违约率的分类器。具体选择哪个分类器，以及分类器的参数如何优化，我们可以用GridSearchCV这个工具跑一遍。</p><p>先梳理下整个项目的流程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/929c96584cbc25972f63ef39101c96a5.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/929c96584cbc25972f63ef39101c96a5.jpg" alt=""></a></p><ol><li><p>加载数据；</p></li><li><p>准备阶段：探索数据，采用数据可视化方式可以让我们对数据有更直观的了解，比如我们想要了解信用卡违约率和不违约率的人数。因为数据集没有专门的测试集，我们还需要使用train_test_split划分数据集。</p></li><li><p>分类阶段：之所以把数据规范化放到这个阶段，是因为我们可以使用Pipeline管道机制，将数据规范化设置为第一步，分类为第二步。因为我们不知道采用哪个分类器效果好，所以我们需要多用几个分类器，比如SVM、决策树、随机森林和KNN。然后通过GridSearchCV工具，找到每个分类器的最优参数和最优分数，最终找到最适合这个项目的分类器和该分类器的参数。</p></li></ol><p>基于上面的流程，具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># -*- coding: utf-8 -*-</span></span>
<span class="line"><span># 信用卡违约率分析</span></span>
<span class="line"><span>import pandas as pd</span></span>
<span class="line"><span>from sklearn.model_selection import learning_curve, train_test_split,GridSearchCV</span></span>
<span class="line"><span>from sklearn.preprocessing import StandardScaler</span></span>
<span class="line"><span>from sklearn.pipeline import Pipeline</span></span>
<span class="line"><span>from sklearn.metrics import accuracy_score</span></span>
<span class="line"><span>from sklearn.svm import SVC</span></span>
<span class="line"><span>from sklearn.tree import DecisionTreeClassifier</span></span>
<span class="line"><span>from sklearn.ensemble import RandomForestClassifier</span></span>
<span class="line"><span>from sklearn.neighbors import KNeighborsClassifier</span></span>
<span class="line"><span>from matplotlib import pyplot as plt</span></span>
<span class="line"><span>import seaborn as sns</span></span>
<span class="line"><span># 数据加载</span></span>
<span class="line"><span>data = data = pd.read_csv(&#39;./UCI_Credit_Card.csv&#39;)</span></span>
<span class="line"><span># 数据探索</span></span>
<span class="line"><span>print(data.shape) # 查看数据集大小</span></span>
<span class="line"><span>print(data.describe()) # 数据集概览</span></span>
<span class="line"><span># 查看下一个月违约率的情况</span></span>
<span class="line"><span>next_month = data[&#39;default.payment.next.month&#39;].value_counts()</span></span>
<span class="line"><span>print(next_month)</span></span>
<span class="line"><span>df = pd.DataFrame({&#39;default.payment.next.month&#39;: next_month.index,&#39;values&#39;: next_month.values})</span></span>
<span class="line"><span>plt.rcParams[&#39;font.sans-serif&#39;]=[&#39;SimHei&#39;] #用来正常显示中文标签</span></span>
<span class="line"><span>plt.figure(figsize = (6,6))</span></span>
<span class="line"><span>plt.title(&#39;信用卡违约率客户\\n (违约：1，守约：0)&#39;)</span></span>
<span class="line"><span>sns.set_color_codes(&quot;pastel&quot;)</span></span>
<span class="line"><span>sns.barplot(x = &#39;default.payment.next.month&#39;, y=&quot;values&quot;, data=df)</span></span>
<span class="line"><span>locs, labels = plt.xticks()</span></span>
<span class="line"><span>plt.show()</span></span>
<span class="line"><span># 特征选择，去掉ID字段、最后一个结果字段即可</span></span>
<span class="line"><span>data.drop([&#39;ID&#39;], inplace=True, axis =1) #ID这个字段没有用</span></span>
<span class="line"><span>target = data[&#39;default.payment.next.month&#39;].values</span></span>
<span class="line"><span>columns = data.columns.tolist()</span></span>
<span class="line"><span>columns.remove(&#39;default.payment.next.month&#39;)</span></span>
<span class="line"><span>features = data[columns].values</span></span>
<span class="line"><span># 30%作为测试集，其余作为训练集</span></span>
<span class="line"><span>train_x, test_x, train_y, test_y = train_test_split(features, target, test_size=0.30, stratify = target, random_state = 1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 构造各种分类器</span></span>
<span class="line"><span>classifiers = [</span></span>
<span class="line"><span>    SVC(random_state = 1, kernel = &#39;rbf&#39;),</span></span>
<span class="line"><span>    DecisionTreeClassifier(random_state = 1, criterion = &#39;gini&#39;),</span></span>
<span class="line"><span>    RandomForestClassifier(random_state = 1, criterion = &#39;gini&#39;),</span></span>
<span class="line"><span>    KNeighborsClassifier(metric = &#39;minkowski&#39;),</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span># 分类器名称</span></span>
<span class="line"><span>classifier_names = [</span></span>
<span class="line"><span>            &#39;svc&#39;,</span></span>
<span class="line"><span>            &#39;decisiontreeclassifier&#39;,</span></span>
<span class="line"><span>            &#39;randomforestclassifier&#39;,</span></span>
<span class="line"><span>            &#39;kneighborsclassifier&#39;,</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span># 分类器参数</span></span>
<span class="line"><span>classifier_param_grid = [</span></span>
<span class="line"><span>            {&#39;svc__C&#39;:[1], &#39;svc__gamma&#39;:[0.01]},</span></span>
<span class="line"><span>            {&#39;decisiontreeclassifier__max_depth&#39;:[6,9,11]},</span></span>
<span class="line"><span>            {&#39;randomforestclassifier__n_estimators&#39;:[3,5,6]} ,</span></span>
<span class="line"><span>            {&#39;kneighborsclassifier__n_neighbors&#39;:[4,6,8]},</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 对具体的分类器进行GridSearchCV参数调优</span></span>
<span class="line"><span>def GridSearchCV_work(pipeline, train_x, train_y, test_x, test_y, param_grid, score = &#39;accuracy&#39;):</span></span>
<span class="line"><span>    response = {}</span></span>
<span class="line"><span>    gridsearch = GridSearchCV(estimator = pipeline, param_grid = param_grid, scoring = score)</span></span>
<span class="line"><span>    # 寻找最优的参数 和最优的准确率分数</span></span>
<span class="line"><span>    search = gridsearch.fit(train_x, train_y)</span></span>
<span class="line"><span>    print(&quot;GridSearch最优参数：&quot;, search.best_params_)</span></span>
<span class="line"><span>    print(&quot;GridSearch最优分数： %0.4lf&quot; %search.best_score_)</span></span>
<span class="line"><span>	predict_y = gridsearch.predict(test_x)</span></span>
<span class="line"><span>    print(&quot;准确率 %0.4lf&quot; %accuracy_score(test_y, predict_y))</span></span>
<span class="line"><span>    response[&#39;predict_y&#39;] = predict_y</span></span>
<span class="line"><span>    response[&#39;accuracy_score&#39;] = accuracy_score(test_y,predict_y)</span></span>
<span class="line"><span>    return response</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for model, model_name, model_param_grid in zip(classifiers, classifier_names, classifier_param_grid):</span></span>
<span class="line"><span>    pipeline = Pipeline([</span></span>
<span class="line"><span>            (&#39;scaler&#39;, StandardScaler()),</span></span>
<span class="line"><span>            (model_name, model)</span></span>
<span class="line"><span>    ])</span></span>
<span class="line"><span>    result = GridSearchCV_work(pipeline, train_x, train_y, test_x, test_y, model_param_grid , score = &#39;accuracy&#39;)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>运行结果：</span></span>
<span class="line"><span>(30000, 25)</span></span>
<span class="line"><span>                 ID             ...              default.payment.next.month</span></span>
<span class="line"><span>count  30000.000000             ...                            30000.000000</span></span>
<span class="line"><span>mean   15000.500000             ...                                0.221200</span></span>
<span class="line"><span>std     8660.398374             ...                                0.415062</span></span>
<span class="line"><span>min        1.000000             ...                                0.000000</span></span>
<span class="line"><span>25%     7500.750000             ...                                0.000000</span></span>
<span class="line"><span>50%    15000.500000             ...                                0.000000</span></span>
<span class="line"><span>75%    22500.250000             ...                                0.000000</span></span>
<span class="line"><span>max    30000.000000             ...                                1.000000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[8 rows x 25 columns]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GridSearch最优参数： {&#39;svc__C&#39;: 1, &#39;svc__gamma&#39;: 0.01}</span></span>
<span class="line"><span>GridSearch最优分数： 0.8174</span></span>
<span class="line"><span>准确率 0.8172</span></span>
<span class="line"><span>GridSearch最优参数： {&#39;decisiontreeclassifier__max_depth&#39;: 6}</span></span>
<span class="line"><span>GridSearch最优分数： 0.8186</span></span>
<span class="line"><span>准确率 0.8113</span></span>
<span class="line"><span>GridSearch最优参数： {&#39;randomforestclassifier__n_estimators&#39;: 6}</span></span>
<span class="line"><span>GridSearch最优分数： 0.7998</span></span>
<span class="line"><span>准确率 0.7994</span></span>
<span class="line"><span>GridSearch最优参数： {&#39;kneighborsclassifier__n_neighbors&#39;: 8}</span></span>
<span class="line"><span>GridSearch最优分数： 0.8040</span></span>
<span class="line"><span>准确率 0.8036</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/187d0233d4fb5f07a9653e5ae4754372.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/187d0233d4fb5f07a9653e5ae4754372.png" alt=""></a></p><p>从结果中，我们能看到SVM分类器的准确率最高，测试准确率为0.8172。</p><p>在决策树分类中，我设置了3种最大深度，当最大深度=6时结果最优，测试准确率为0.8113；在随机森林分类中，我设置了3个决策树个数的取值，取值为6时结果最优，测试准确率为0.7994；在KNN分类中，我设置了3个n的取值，取值为8时结果最优，测试准确率为0.8036。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我给你讲了随机森林的概念及工具的使用，另外针对数据挖掘算法中经常采用的参数调优，也介绍了GridSearchCV工具这个利器。并将这两者结合起来，在信用卡违约分析这个项目中进行了使用。</p><p>很多时候，我们不知道该采用哪种分类算法更适合。即便是对于一种分类算法，也有很多参数可以调优，每个参数都有一定的取值范围。我们可以把想要采用的分类器，以及这些参数的取值范围都设置到数组里，然后使用GridSearchCV工具进行调优。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/14f9cddc17d6cceb0b8cbc4381c65216.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85577/14f9cddc17d6cceb0b8cbc4381c65216.png" alt=""></a></p><p>今天我们讲了如何使用GridSearchCV做参数调优，你可以说说你的理解，如果有使用的经验也可以分享下。</p><p>另外针对信用卡违约率分析这个项目，我们使用了SVM、决策树、随机森林和KNN分类器，你能不能编写代码使用AdaBoost分类器做分类呢？其中n_estimators的取值有10、50、100三种可能，你可以使用GridSearchCV运行看看最优参数是多少，测试准确率是多少？</p><p>欢迎你在评论区与我分享你的答案，如果有问题也可以写在评论区。如果你觉得这篇文章有价值，欢迎把它分享给你的朋友或者同事。</p>`,52)])])}const _=a(i,[["render",l]]);export{h as __pageData,_ as default};
