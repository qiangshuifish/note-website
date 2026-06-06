import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"40丨数据挖掘实战（2）：信用卡诈骗分析","description":"","frontmatter":{},"headers":[{"level":2,"title":"构建逻辑回归分类器","slug":"构建逻辑回归分类器","link":"#构建逻辑回归分类器","children":[]},{"level":2,"title":"模型评估指标","slug":"模型评估指标","link":"#模型评估指标","children":[]},{"level":2,"title":"对信用卡违约率进行分析","slug":"对信用卡违约率进行分析","link":"#对信用卡违约率进行分析","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"数据分析实战45讲/40丨数据挖掘实战（2）：信用卡诈骗分析.md","filePath":"数据分析实战45讲/40丨数据挖掘实战（2）：信用卡诈骗分析.md","lastUpdated":1779820717000}'),l={name:"数据分析实战45讲/40丨数据挖掘实战（2）：信用卡诈骗分析.md"};function i(t,s,c,r,o,E){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_40丨数据挖掘实战-2-信用卡诈骗分析" tabindex="-1">40丨数据挖掘实战（2）：信用卡诈骗分析 <a class="header-anchor" href="#_40丨数据挖掘实战-2-信用卡诈骗分析" aria-label="Permalink to &quot;40丨数据挖掘实战（2）：信用卡诈骗分析&quot;">​</a></h1><p>上一篇文章中，我们用随机森林以及之前讲过的SVM、决策树和KNN分类器对信用卡违约数据进行了分析，这节课我们来研究下信用卡欺诈。</p><p>相比于信用卡违约的比例，信用卡欺诈的比例更小，但是危害极大。如何通过以往的交易数据分析出每笔交易是否正常，是否存在盗刷风险是我们这次项目的目标。</p><p>通过今天的学习，你需要掌握以下几个方面：</p><ol><li><p>了解逻辑回归分类，以及如何在sklearn中使用它；</p></li><li><p>信用卡欺诈属于二分类问题，欺诈交易在所有交易中的比例很小，对于这种数据不平衡的情况，到底采用什么样的模型评估标准会更准确；</p></li><li><p>完成信用卡欺诈分析的实战项目，并通过数据可视化对数据探索和模型结果评估进一步加强了解。</p></li></ol><h2 id="构建逻辑回归分类器" tabindex="-1">构建逻辑回归分类器 <a class="header-anchor" href="#构建逻辑回归分类器" aria-label="Permalink to &quot;构建逻辑回归分类器&quot;">​</a></h2><p>逻辑回归虽然不在我们讲解的十大经典数据挖掘算法里面，但也是常用的数据挖掘算法。</p><p>逻辑回归，也叫作logistic回归。虽然名字中带有“回归”，但它实际上是分类方法，主要解决的是二分类问题，当然它也可以解决多分类问题，只是二分类更常见一些。</p><p>在逻辑回归中使用了Logistic函数，也称为Sigmoid函数。Sigmoid函数是在深度学习中经常用到的函数之一，函数公式为：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/3e7c7cb4d26d1a71f958610f26d20818.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/3e7c7cb4d26d1a71f958610f26d20818.png" alt=""></a></p><p>函数的图形如下所示，类似S状：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/b7a5d39d91fda02b21669137a489743b.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/b7a5d39d91fda02b21669137a489743b.png" alt=""></a></p><p>你能看出g(z)的结果在0-1之间，当z越大的时候，g(z)越大，当z趋近于无穷大的时候，g(z)趋近于1。同样当z趋近于无穷小的时候，g(z)趋近于0。同时，函数值以0.5为中心。</p><p>为什么逻辑回归算法是基于Sigmoid函数实现的呢？你可以这样理解：我们要实现一个二分类任务，0即为不发生，1即为发生。我们给定一些历史数据X和y。其中X代表样本的n个特征，y代表正例和负例，也就是0或1的取值。通过历史样本的学习，我们可以得到一个模型，当给定新的X的时候，可以预测出y。这里我们得到的y是一个预测的概率，通常不是0%和100%，而是中间的取值，那么我们就可以认为概率大于50%的时候，即为发生（正例），概率小于50%的时候，即为不发生（负例）。这样就完成了二分类的预测。</p><p>逻辑回归模型的求解这里不做介绍，我们来看下如何使用sklearn中的逻辑回归工具。在sklearn中，我们使用LogisticRegression()函数构建逻辑回归分类器，函数里有一些常用的构造参数：</p><ol><li><p>penalty：惩罚项，取值为l1或l2，默认为l2。当模型参数满足高斯分布的时候，使用l2，当模型参数满足拉普拉斯分布的时候，使用l1；</p></li><li><p>solver：代表的是逻辑回归损失函数的优化方法。有5个参数可选，分别为liblinear、lbfgs、newton-cg、sag和saga。默认为liblinear，适用于数据量小的数据集，当数据量大的时候可以选用sag或saga方法。</p></li><li><p>max_iter：算法收敛的最大迭代次数，默认为10。</p></li><li><p>n_jobs：拟合和预测的时候CPU的核数，默认是1，也可以是整数，如果是-1则代表CPU的核数。</p></li></ol><p>当我们创建好之后，就可以使用fit函数拟合，使用predict函数预测。</p><h2 id="模型评估指标" tabindex="-1">模型评估指标 <a class="header-anchor" href="#模型评估指标" aria-label="Permalink to &quot;模型评估指标&quot;">​</a></h2><p>我们之前对模型做评估时，通常采用的是准确率(accuracy)，它指的是分类器正确分类的样本数与总体样本数之间的比例。这个指标对大部分的分类情况是有效的，不过当分类结果严重不平衡的时候，准确率很难反应模型的好坏。</p><p>举个例子，对于机场安检中恐怖分子的判断，就不能采用准确率对模型进行评估。我们知道恐怖分子的比例是极低的，因此当我们用准确率做判断时，如果准确率高达99.999%，就说明这个模型一定好么？</p><p>其实正因为现实生活中恐怖分子的比例极低，就算我们不能识别出一个恐怖分子，也会得到非常高的准确率。因为准确率的评判标准是正确分类的样本个数与总样本数之间的比例。因此非恐怖分子的比例会很高，就算我们识别不出来恐怖分子，正确分类的个数占总样本的比例也会很高，也就是准确率高。</p><p>实际上我们应该更关注恐怖分子的识别，这里先介绍下数据预测的四种情况：TP、FP、TN、FN。我们用第二个字母P或N代表预测为正例还是负例，P为正，N为负。第一个字母T或F代表的是预测结果是否正确，T为正确，F为错误。</p><p>所以四种情况分别为：</p><ol><li><p>TP：预测为正，判断正确；</p></li><li><p>FP：预测为正，判断错误；</p></li><li><p>TN：预测为负，判断正确；</p></li><li><p>FN：预测为负，判断错误。</p></li></ol><p>我们知道样本总数=TP+FP+TN+FN，预测正确的样本数为TP+TN，因此准确率Accuracy = (TP+TN)/(TP+TN+FN+FP)。</p><p>实际上，对于分类不平衡的情况，有两个指标非常重要，它们分别是精确度和召回率。</p><p>精确率 P = TP/ (TP+FP)，对应上面恐怖分子这个例子，在所有判断为恐怖分子的人数中，真正是恐怖分子的比例。</p><p>召回率 R = TP/ (TP+FN)，也称为查全率。代表的是恐怖分子被正确识别出来的个数与恐怖分子总数的比例。</p><p>为什么要统计召回率和精确率这两个指标呢？假设我们只统计召回率，当召回率等于100%的时候，模型是否真的好呢？</p><p>举个例子，假设我们把机场所有的人都认为是恐怖分子，恐怖分子都会被正确识别，这个数字与恐怖分子的总数比例等于100%，但是这个结果是没有意义的。如果我们认为机场里所有人都是恐怖分子的话，那么非恐怖分子（极高比例）都会认为是恐怖分子，误判率太高了，所以我们还需要统计精确率作为召回率的补充。</p><p>实际上有一个指标综合了精确率和召回率，可以更好地评估模型的好坏。这个指标叫做F1，用公式表示为：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/b122244eae9a74eded619d14c0bc12ce.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/b122244eae9a74eded619d14c0bc12ce.png" alt=""></a></p><p>F1作为精确率P和召回率R的调和平均，数值越大代表模型的结果越好。</p><h2 id="对信用卡违约率进行分析" tabindex="-1">对信用卡违约率进行分析 <a class="header-anchor" href="#对信用卡违约率进行分析" aria-label="Permalink to &quot;对信用卡违约率进行分析&quot;">​</a></h2><p>我们来看一个信用卡欺诈分析的项目，这个数据集你可以从百度网盘（因为数据集大于100M，所以采用了网盘）中下载：</p><blockquote><p>链接： <a href="https://pan.baidu.com/s/14F8WuX0ZJntdB_r1EC08HA" target="_blank" rel="noreferrer">https://pan.baidu.com/s/14F8WuX0ZJntdB_r1EC08HA</a> 提取码：58gp</p></blockquote><p>数据集包括了2013年9月份两天时间内的信用卡交易数据，284807笔交易中，一共有492笔是欺诈行为。输入数据一共包括了28个特征V1，V2，……V28对应的取值，以及交易时间Time和交易金额Amount。为了保护数据隐私，我们不知道V1到V28这些特征代表的具体含义，只知道这28个特征值是通过PCA变换得到的结果。另外字段Class代表该笔交易的分类，Class=0为正常（非欺诈），Class=1代表欺诈。</p><p>我们的目标是针对这个数据集构建一个信用卡欺诈分析的分类器，采用的是逻辑回归。从数据中你能看到欺诈行为只占到了492/284807=0.172%，数据分类结果的分布是非常不平衡的，因此我们不能使用准确率评估模型的好坏，而是需要统计F1值（综合精确率和召回率）。我们先梳理下整个项目的流程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/929c96584cbc25972f63ef39101c96a5.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/929c96584cbc25972f63ef39101c96a5.jpg" alt=""></a></p><ol><li><p>加载数据；</p></li><li><p>准备阶段：我们需要探索数据，用数据可视化的方式查看分类结果的情况，以及随着时间的变化，欺诈交易和正常交易的分布情况。上面已经提到过，V1-V28的特征值都经过PCA的变换，但是其余的两个字段，Time和Amount还需要进行规范化。Time字段和交易本身是否为欺诈交易无关，因此我们不作为特征选择，只需要对Amount做数据规范化就行了。同时数据集没有专门的测试集，使用train_test_split对数据集进行划分；</p></li><li><p>分类阶段：我们需要创建逻辑回归分类器，然后传入训练集数据进行训练，并传入测试集预测结果，将预测结果与测试集的结果进行比对。这里的模型评估指标用到了精确率、召回率和F1值。同时我们将精确率-召回率进行了可视化呈现。</p></li></ol><p>基于上面的流程，具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># -*- coding:utf-8 -*-</span></span>
<span class="line"><span># 使用逻辑回归对信用卡欺诈进行分类</span></span>
<span class="line"><span>import pandas as pd</span></span>
<span class="line"><span>import numpy as np</span></span>
<span class="line"><span>import seaborn as sns</span></span>
<span class="line"><span>import matplotlib.pyplot as plt</span></span>
<span class="line"><span>import itertools</span></span>
<span class="line"><span>from sklearn.linear_model import LogisticRegression</span></span>
<span class="line"><span>from sklearn.model_selection import train_test_split</span></span>
<span class="line"><span>from sklearn.metrics import confusion_matrix, precision_recall_curve</span></span>
<span class="line"><span>from sklearn.preprocessing import StandardScaler</span></span>
<span class="line"><span>import warnings</span></span>
<span class="line"><span>warnings.filterwarnings(&#39;ignore&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 混淆矩阵可视化</span></span>
<span class="line"><span>def plot_confusion_matrix(cm, classes, normalize = False, title = &#39;Confusion matrix&quot;&#39;, cmap = plt.cm.Blues) :</span></span>
<span class="line"><span>    plt.figure()</span></span>
<span class="line"><span>    plt.imshow(cm, interpolation = &#39;nearest&#39;, cmap = cmap)</span></span>
<span class="line"><span>    plt.title(title)</span></span>
<span class="line"><span>    plt.colorbar()</span></span>
<span class="line"><span>    tick_marks = np.arange(len(classes))</span></span>
<span class="line"><span>    plt.xticks(tick_marks, classes, rotation = 0)</span></span>
<span class="line"><span>    plt.yticks(tick_marks, classes)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    thresh = cm.max() / 2.</span></span>
<span class="line"><span>    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])) :</span></span>
<span class="line"><span>        plt.text(j, i, cm[i, j],</span></span>
<span class="line"><span>                 horizontalalignment = &#39;center&#39;,</span></span>
<span class="line"><span>                 color = &#39;white&#39; if cm[i, j] &gt; thresh else &#39;black&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    plt.tight_layout()</span></span>
<span class="line"><span>    plt.ylabel(&#39;True label&#39;)</span></span>
<span class="line"><span>    plt.xlabel(&#39;Predicted label&#39;)</span></span>
<span class="line"><span>    plt.show()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 显示模型评估结果</span></span>
<span class="line"><span>def show_metrics():</span></span>
<span class="line"><span>    tp = cm[1,1]</span></span>
<span class="line"><span>    fn = cm[1,0]</span></span>
<span class="line"><span>    fp = cm[0,1]</span></span>
<span class="line"><span>    tn = cm[0,0]</span></span>
<span class="line"><span>    print(&#39;精确率: {:.3f}&#39;.format(tp/(tp+fp)))</span></span>
<span class="line"><span>    print(&#39;召回率: {:.3f}&#39;.format(tp/(tp+fn)))</span></span>
<span class="line"><span>    print(&#39;F1值: {:.3f}&#39;.format(2*(((tp/(tp+fp))*(tp/(tp+fn)))/((tp/(tp+fp))+(tp/(tp+fn))))))</span></span>
<span class="line"><span># 绘制精确率-召回率曲线</span></span>
<span class="line"><span>def plot_precision_recall():</span></span>
<span class="line"><span>    plt.step(recall, precision, color = &#39;b&#39;, alpha = 0.2, where = &#39;post&#39;)</span></span>
<span class="line"><span>    plt.fill_between(recall, precision, step =&#39;post&#39;, alpha = 0.2, color = &#39;b&#39;)</span></span>
<span class="line"><span>    plt.plot(recall, precision, linewidth=2)</span></span>
<span class="line"><span>    plt.xlim([0.0,1])</span></span>
<span class="line"><span>    plt.ylim([0.0,1.05])</span></span>
<span class="line"><span>    plt.xlabel(&#39;召回率&#39;)</span></span>
<span class="line"><span>    plt.ylabel(&#39;精确率&#39;)</span></span>
<span class="line"><span>    plt.title(&#39;精确率-召回率 曲线&#39;)</span></span>
<span class="line"><span>    plt.show();</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 数据加载</span></span>
<span class="line"><span>data = pd.read_csv(&#39;./creditcard.csv&#39;)</span></span>
<span class="line"><span># 数据探索</span></span>
<span class="line"><span>print(data.describe())</span></span>
<span class="line"><span># 设置plt正确显示中文</span></span>
<span class="line"><span>plt.rcParams[&#39;font.sans-serif&#39;] = [&#39;SimHei&#39;]</span></span>
<span class="line"><span># 绘制类别分布</span></span>
<span class="line"><span>plt.figure()</span></span>
<span class="line"><span>ax = sns.countplot(x = &#39;Class&#39;, data = data)</span></span>
<span class="line"><span>plt.title(&#39;类别分布&#39;)</span></span>
<span class="line"><span>plt.show()</span></span>
<span class="line"><span># 显示交易笔数，欺诈交易笔数</span></span>
<span class="line"><span>num = len(data)</span></span>
<span class="line"><span>num_fraud = len(data[data[&#39;Class&#39;]==1])</span></span>
<span class="line"><span>print(&#39;总交易笔数: &#39;, num)</span></span>
<span class="line"><span>print(&#39;诈骗交易笔数：&#39;, num_fraud)</span></span>
<span class="line"><span>print(&#39;诈骗交易比例：{:.6f}&#39;.format(num_fraud/num))</span></span>
<span class="line"><span># 欺诈和正常交易可视化</span></span>
<span class="line"><span>f, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(15,8))</span></span>
<span class="line"><span>bins = 50</span></span>
<span class="line"><span>ax1.hist(data.Time[data.Class == 1], bins = bins, color = &#39;deeppink&#39;)</span></span>
<span class="line"><span>ax1.set_title(&#39;诈骗交易&#39;)</span></span>
<span class="line"><span>ax2.hist(data.Time[data.Class == 0], bins = bins, color = &#39;deepskyblue&#39;)</span></span>
<span class="line"><span>ax2.set_title(&#39;正常交易&#39;)</span></span>
<span class="line"><span>plt.xlabel(&#39;时间&#39;)</span></span>
<span class="line"><span>plt.ylabel(&#39;交易次数&#39;)</span></span>
<span class="line"><span>plt.show()</span></span>
<span class="line"><span># 对Amount进行数据规范化</span></span>
<span class="line"><span>data[&#39;Amount_Norm&#39;] = StandardScaler().fit_transform(data[&#39;Amount&#39;].values.reshape(-1,1))</span></span>
<span class="line"><span># 特征选择</span></span>
<span class="line"><span>y = np.array(data.Class.tolist())</span></span>
<span class="line"><span>data = data.drop([&#39;Time&#39;,&#39;Amount&#39;,&#39;Class&#39;],axis=1)</span></span>
<span class="line"><span>X = np.array(data.as_matrix())</span></span>
<span class="line"><span># 准备训练集和测试集</span></span>
<span class="line"><span>train_x, test_x, train_y, test_y = train_test_split (X, y, test_size = 0.1, random_state = 33)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 逻辑回归分类</span></span>
<span class="line"><span>clf = LogisticRegression()</span></span>
<span class="line"><span>clf.fit(train_x, train_y)</span></span>
<span class="line"><span>predict_y = clf.predict(test_x)</span></span>
<span class="line"><span># 预测样本的置信分数</span></span>
<span class="line"><span>score_y = clf.decision_function(test_x)</span></span>
<span class="line"><span># 计算混淆矩阵，并显示</span></span>
<span class="line"><span>cm = confusion_matrix(test_y, predict_y)</span></span>
<span class="line"><span>class_names = [0,1]</span></span>
<span class="line"><span># 显示混淆矩阵</span></span>
<span class="line"><span>plot_confusion_matrix(cm, classes = class_names, title = &#39;逻辑回归 混淆矩阵&#39;)</span></span>
<span class="line"><span># 显示模型评估分数</span></span>
<span class="line"><span>show_metrics()</span></span>
<span class="line"><span># 计算精确率，召回率，阈值用于可视化</span></span>
<span class="line"><span>precision, recall, thresholds = precision_recall_curve(test_y, score_y)</span></span>
<span class="line"><span>plot_precision_recall()</span></span></code></pre></div><p>运行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>                Time            V1      ...               Amount          Class</span></span>
<span class="line"><span>count  284807.000000  2.848070e+05      ...        284807.000000  284807.000000</span></span>
<span class="line"><span>mean    94813.859575  1.165980e-15      ...            88.349619       0.001727</span></span>
<span class="line"><span>std     47488.145955  1.958696e+00      ...           250.120109       0.041527</span></span>
<span class="line"><span>min         0.000000 -5.640751e+01      ...             0.000000       0.000000</span></span>
<span class="line"><span>25%     54201.500000 -9.203734e-01      ...             5.600000       0.000000</span></span>
<span class="line"><span>50%     84692.000000  1.810880e-02      ...            22.000000       0.000000</span></span>
<span class="line"><span>75%    139320.500000  1.315642e+00      ...            77.165000       0.000000</span></span>
<span class="line"><span>max    172792.000000  2.454930e+00      ...         25691.160000       1.000000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[8 rows x 31 columns]</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/5e98974d6c2e87168b40e5f751d00f61.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/5e98974d6c2e87168b40e5f751d00f61.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>总交易笔数:  284807</span></span>
<span class="line"><span>诈骗交易笔数： 492</span></span>
<span class="line"><span>诈骗交易比例：0.001727</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/c8a59cb4f3d94c91eb6648be1b0429d2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/c8a59cb4f3d94c91eb6648be1b0429d2.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/bfe65c34b74de661477d9b59d4db6a39.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/bfe65c34b74de661477d9b59d4db6a39.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>精确率: 0.841</span></span>
<span class="line"><span>召回率: 0.617</span></span>
<span class="line"><span>F1值: 0.712</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/28ccd0f8d609046b2bafb27fb1195269.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/28ccd0f8d609046b2bafb27fb1195269.png" alt=""></a></p><p>你能看出来欺诈交易的笔数为492笔，占所有交易的比例是很低的，即0.001727，我们可以通过数据可视化的方式对欺诈交易和正常交易的分布进行呈现。另外通过可视化，我们也能看出精确率和召回率之间的关系，当精确率高的时候，召回率往往很低，召回率高的时候，精确率会比较低。</p><p>代码有一些模块需要说明下。</p><p>我定义了plot_confusion_matrix函数对混淆矩阵进行可视化。什么是混淆矩阵呢？混淆矩阵也叫误差矩阵，实际上它就是TP、FP、TN、FN这四个数值的矩阵表示，帮助我们判断预测值和实际值相比，对了多少。从这个例子中，你能看出TP=37，FP=7，FN=23。所以精确率P=TP/(TP+FP)=37/(37+7)=0.841，召回率R=TP/(TP+FN)=37/(37+23)=0.617。</p><p>然后使用了sklearn中的precision_recall_curve函数，通过预测值和真实值来计算精确率-召回率曲线。precision_recall_curve函数会计算在不同概率阈值情况下的精确率和召回率。最后定义plot_precision_recall函数，绘制曲线。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我给你讲了逻辑回归的概念和相关工具的使用，另外学习了在数据样本不平衡的情况下，如何评估模型。这里你需要了解精确率，召回率和F1的概念和计算方式。最后在信用卡欺诈分析的项目中，我们使用了逻辑回归工具，并对混淆矩阵进行了计算，同时在模型结果评估中，使用了精确率、召回率和F1值，最后得到精确率-召回率曲线的可视化结果。</p><p>从这个项目中你能看出来，不是所有的分类都是样本平衡的情况，针对正例比例极低的情况，比如信用卡欺诈、某些疾病的识别，或者是恐怖分子的判断等，都需要采用精确率-召回率来进行统计。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/abee1a58b99814f1e0218778b98a6950.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85987/abee1a58b99814f1e0218778b98a6950.png" alt=""></a></p><p>最后留两道思考题吧，今天我们对信用卡欺诈数据集进行了分析，它是一个不平衡数据集，你知道还有哪些数据属于不平衡数据么？另外，请你使用线性SVM（对应sklearn中的LinearSVC）对信用卡欺诈数据集进行分类，并计算精确率、召回率和F1值。</p><p>欢迎你在评论区与我分享你的答案，也欢迎点击“请朋友读”，把这篇文章分享给你的朋友或者同事。</p>`,60)])])}const h=n(l,[["render",i]]);export{b as __pageData,h as default};
