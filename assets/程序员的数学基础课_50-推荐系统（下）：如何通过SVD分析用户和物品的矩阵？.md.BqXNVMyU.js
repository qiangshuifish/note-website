import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"50 | 推荐系统（下）：如何通过SVD分析用户和物品的矩阵？","description":"","frontmatter":{},"headers":[{"level":2,"title":"SVD回顾以及在推荐中的应用","slug":"svd回顾以及在推荐中的应用","link":"#svd回顾以及在推荐中的应用","children":[]},{"level":2,"title":"Python中的SVD实现和结果分析","slug":"python中的svd实现和结果分析","link":"#python中的svd实现和结果分析","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"程序员的数学基础课/50-推荐系统（下）：如何通过SVD分析用户和物品的矩阵？.md","filePath":"程序员的数学基础课/50-推荐系统（下）：如何通过SVD分析用户和物品的矩阵？.md","lastUpdated":1779821489000}'),i={name:"程序员的数学基础课/50-推荐系统（下）：如何通过SVD分析用户和物品的矩阵？.md"};function t(l,s,o,c,r,$){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_50-推荐系统-下-如何通过svd分析用户和物品的矩阵" tabindex="-1">50 | 推荐系统（下）：如何通过SVD分析用户和物品的矩阵？ <a class="header-anchor" href="#_50-推荐系统-下-如何通过svd分析用户和物品的矩阵" aria-label="Permalink to &quot;50 | 推荐系统（下）：如何通过SVD分析用户和物品的矩阵？&quot;">​</a></h1><p>你好，我是黄申。</p><p>上一节，我们讲了如何使用矩阵操作，实现基于用户或者物品的协同过滤。实际上，推荐系统是个很大的课题，你可以尝试不同的想法。比如，对于用户给电影评分的案例，是不是可以使用SVD奇异值的分解，来分解用户评分的矩阵，并找到“潜在”的电影主题呢？如果在一定程度上实现这个目标，那么我们可以通过用户和主题，以及电影和主题之间的关系来进行推荐。今天，我们继续使用MovieLens中的一个数据集，尝试Python代码中的SVD分解，并分析一些结果所代表的含义。</p><h2 id="svd回顾以及在推荐中的应用" tabindex="-1">SVD回顾以及在推荐中的应用 <a class="header-anchor" href="#svd回顾以及在推荐中的应用" aria-label="Permalink to &quot;SVD回顾以及在推荐中的应用&quot;">​</a></h2><p>在实现SVD分解之前，我们先来回顾一下SVD的主要概念和步骤。如果矩阵$X$是对称的方阵，那么我们可以求得这个矩阵的特征值和特征向量，并把矩阵$X$分解为特征值和特征向量的乘积。</p><p>假设我们求出了矩阵$X$的$n$个特征值$λ_1，λ_2，…，λ_n$，以及这$n$个特征值所对应的特征向量$v_1，v_2，…，v_n$，那么矩阵$X$可以表示为：</p><p>$X=VΣV^{-1}$</p><p>其中，$V$是这$n$个特征向量所组成的$n×n$维矩阵，而$Σ$是这$n$个特征值为主对角线的$n×n$维矩阵。这个过程就是特征分解（Eigendecomposition）。</p><p>如果我们会把$V$的这$n$个特征向量进行标准化处理，那么对于每个特征向量$V_i$，就有$||V_{i}||_{2}=1$，而这表示$V’_iV_i=1$，此时$V$的$n$个特征向量为标准正交基，满足$V’V=I$， 也就是说，$V$为酉矩阵，有$V’=V^{-1}$ 。这样一来，我们就可以把特征分解表达式写作：</p><p>$X=VΣV&#39;$</p><p>可是，如果矩阵$X$不是对称的方阵，那么我们不一定能得到有实数解的特征分解。但是，SVD分解可以避免这个问题。</p><p>我们可以把$X$的转置$X’$和$X$做矩阵乘法，得到一个$n×n$维的对称方阵$X’X$，并对这个对称方阵进行特征分解。分解的时候，我们得到了矩阵$X’X$的$n$个特征值和对应的$n$个特征向量$v$，其中所有的特征向量叫作$X$的右奇异向量。通过所有右奇异向量我们可以构造一个$n×n$维的矩阵$V$。</p><p>类似地，如果我们把$X$和$X’$做矩阵乘法，那么会得到一个$m×m$维的对称方阵$XX’$。由于$XX’$也是方阵，因此我们同样可以对它进行特征分解，并得到矩阵$XX’$的$m$个特征值和对应的$m$个特征向量$u$，其中所有的特征向量向叫作$X$的左奇异向量。通过所有左奇异向量我们可以构造一个$m×m$的矩阵$U$。</p><p>现在，包含左右奇异向量的$U$和$V$都求解出来了，只剩下奇异值矩阵$Σ$了。$Σ$除了对角线上是奇异值之外，其他位置的元素都是0，所以我们只需要求出每个奇异值$σ$就可以了。之前我们已经推导过，$σ$可以通过两种方式获得。第一种方式是计算下面这个式子：</p><p>$σ_i=\\frac{X_{v_{i}​}​}{u_{i}​}$</p><p>其中$v_i$和$u_i$都是列向量。一旦我们求出了每个奇异值$σ$，那么就能得到奇异值矩阵$Σ$。</p><p>第二种方式是通过$X’X$矩阵或者$XX’$矩阵的特征值之平方根，来求奇异值。计算出每个奇异值$σ$，那么就能得到奇异值矩阵$Σ$了。</p><p>通过上述几个步骤，我们就能把一个$mxn$维的实数矩阵，分解成$X=UΣV’$的形式。那么这种分解对于推荐系统来说，又有怎样的意义呢？</p><p>之前我讲过，在潜在语义分析LSA的应用场景下，分解之后所得到的奇异值$σ$，对应一个语义上的“概念”，而$σ$值的大小表示这个概念在整个文档集合中的重要程度。$U$中的左奇异向量表示了每个文档和这些语义“概念”的关系强弱，$V$中的右奇异向量表示每个词条和这些语义“概念”的关系强弱。</p><p>最终，SVD分解把原来的“词条-文档”关系，转换成了“词条-语义概念-文档”的关系。而在推荐系统的应用场景下，对用户评分矩阵的SVD分解，能够帮助我们找到电影中潜在的“主题”，比如科幻类、动作类、浪漫类、传记类等等。</p><p>分解之后所得到的奇异值$σ$对应了一个“主题”，$σ$值的大小表示这个主题在整个电影集合中的重要程度。$U$中的左奇异向量表示了每位用户对这些“主题”的喜好程度，$V$中的右奇异向量表示每部电影和这些“主题”的关系强弱。</p><p>最终，SVD分解把原来的“用户-电影”关系，转换成了“用户-主题-电影”的关系。有了这种新的关系，即使我们没有人工标注的电影类型，同样可以使用更多基于电影主题的推荐方法，比如通过用户对电影主题的评分矩阵，进行基于用户或者电影的协同过滤。</p><p>接下来，我会使用同样一个MovieLens的数据集，一步步展示如何通过Python语言，对用户评分的矩阵进行SVD分解，并分析一些结果的示例。</p><h2 id="python中的svd实现和结果分析" tabindex="-1">Python中的SVD实现和结果分析 <a class="header-anchor" href="#python中的svd实现和结果分析" aria-label="Permalink to &quot;Python中的SVD实现和结果分析&quot;">​</a></h2><p>和上节的代码类似，首先我们需要加载用户对电影的评分。不过，由于非并行SVD分解的时间复杂度是3次方数量级，而空间复杂度是2次方数量级，所以对硬件资源要求很高。这里为了节省测试的时间，我增加了一些语句，只取大约十分之一的数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import pandas as pd</span></span>
<span class="line"><span>from numpy import *</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 加载用户对电影的评分数据</span></span>
<span class="line"><span>df_ratings = pd.read_csv(&quot;/Users/shenhuang/Data/ml-latest-small/ratings.csv&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 获取用户的数量和电影的数量，这里我们只取前1/10来减小数据规模</span></span>
<span class="line"><span>user_num = int(df_ratings[&quot;userId&quot;].max() / 10)</span></span>
<span class="line"><span>movie_num = int(df_ratings[&quot;movieId&quot;].max() / 10)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 构造用户对电影的二元关系矩阵</span></span>
<span class="line"><span>user_rating = [[0.0] * movie_num for i in range(user_num)]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>i = 0</span></span>
<span class="line"><span>for index, row in df_ratings.iterrows():   # 获取每行的index、row</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 由于用户和电影的ID都是从1开始，为了和Python的索引一致，减去1</span></span>
<span class="line"><span>  userId = int(row[&quot;userId&quot;]) - 1</span></span>
<span class="line"><span>  movieId = int(row[&quot;movieId&quot;]) - 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 我们只取前1/10来减小数据规模</span></span>
<span class="line"><span>  if (userId &amp;gt;= user_num) or (movieId &amp;gt;= movie_num):</span></span>
<span class="line"><span>    continue</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 设置用户对电影的评分</span></span>
<span class="line"><span>  user_rating[userId][movieId] = row[&quot;rati</span></span></code></pre></div><p>之后，二维数组转为矩阵，以及标准化矩阵的代码和之前是一致的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 把二维数组转化为矩阵</span></span>
<span class="line"><span>x = mat(user_rating)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 标准化每位用户的评分数据</span></span>
<span class="line"><span>from sklearn.preprocessing import scale</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 对每一行的数据，进行标准化</span></span>
<span class="line"><span>x_s = scale(x, with_mean=True, with_std=True, axis=1)</span></span>
<span class="line"><span>print(&quot;标准化后的矩阵：&quot;, x_s</span></span></code></pre></div><p>Python的numpy库，已经实现了一种SVD分解，我们只调用一个函数就行了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 进行SVD分解</span></span>
<span class="line"><span>from numpy import linalg as LA</span></span>
<span class="line"><span></span></span>
<span class="line"><span>u,sigma,vt = LA.svd(x_s, full_matrices=False, compute_uv=True)</span></span>
<span class="line"><span>print(&quot;U矩阵：&quot;, u)</span></span>
<span class="line"><span>print(&quot;Sigma奇异值：&quot;, sigma)</span></span>
<span class="line"><span>print(&quot;V矩阵：&quot;, vt)</span></span></code></pre></div><p>最后输出的Sigma奇异值大概是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sigma奇异值： [416.56942602 285.42546812 202.25724866 ... 79.26188177  76.35167406 74.96719708]</span></span></code></pre></div><p>最后几个奇异值不是0，说明我们没有办法完全忽略它们，不过它们相比最大的几个奇异值还是很小的，我们可以去掉这些值来求得近似的解。</p><p>为了验证一下SVD的效果，我们还可以加载电影的元信息，包括电影的标题和类型等等。我在这里使用了一个基于哈希的Python字典结构来存储电影ID到标题和类型的映射。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 加载电影元信息</span></span>
<span class="line"><span>df_movies = pd.read_csv(&quot;/Users/shenhuang/Data/ml-latest-small/movies.csv&quot;)</span></span>
<span class="line"><span>dict_movies = {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for index, row in df_movies.iterrows():   # 获取每行的index、row</span></span>
<span class="line"><span>  dict_movies[row[&quot;movieId&quot;]] = &quot;{0},{1}&quot;.format(row[&quot;title&quot;], row[&quot;genres&quot;])</span></span>
<span class="line"><span>print(dict_movies)</span></span></code></pre></div><p>我刚刚提到，分解之后所得到的奇异值$σ$对应了一个“主题”，$σ$值的大小表示这个主题在整个电影集合中的重要程度，而V中的右奇异向量表示每部电影和这些“主题”的关系强弱。所以，我们可以对分解后的每个奇异值，通过$V$中的向量，找找看哪些电影和这个奇异值所对应的主题更相关，然后看看SVD分解所求得的电影主题是不是合理。比如，我们可以使用下面的代码，来查看和向量$Vt1$,相关的电影主要有哪些。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 输出和某个奇异值高度相关的电影，这些电影代表了一个主题</span></span>
<span class="line"><span>print(max(vt[1,:]))</span></span>
<span class="line"><span>for i in range(movie_num):</span></span>
<span class="line"><span>    if (vt[1][i] &amp;gt; 0.1):</span></span>
<span class="line"><span>        print(i + 1, vt[1][i], dict_movies[i + 1])</span></span></code></pre></div><p>需要注意的是，向量中的电影ID和原始的电影ID差1，所以在读取dict_movies时需要使用(i + 1)。这个向量中最大的分值大约是0.173，所以我把阈值设置为0.1，并输出了所有分值大于0.1的电影，电影列表如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0.17316444479201024</span></span>
<span class="line"><span>260 0.14287410901699643 Star Wars: Episode IV - A New Hope (1977),Action|Adventure|Sci-Fi</span></span>
<span class="line"><span>1196 0.1147295905497075 Star Wars: Episode V - The Empire Strikes Back (1980),Action|Adventure|Sci-Fi</span></span>
<span class="line"><span>1198 0.15453176747222075 Raiders of the Lost Ark (Indiana Jones and the Raiders of the Lost Ark) (1981),Action|Adventure</span></span>
<span class="line"><span>1210 0.10411193224648774 Star Wars: Episode VI - Return of the Jedi (1983),Action|Adventure|Sci-Fi</span></span>
<span class="line"><span>2571 0.17316444479201024 Matrix, The (1999),Action|Sci-Fi|Thriller</span></span>
<span class="line"><span>3578 0.1268370902126096 Gladiator (2000),Action|Adventure|Drama</span></span>
<span class="line"><span>4993 0.12445203514448012 Lord of the Rings: The Fellowship of the Ring, The (2001),Adventure|Fantasy</span></span>
<span class="line"><span>5952 0.12535012292041953 Lord of the Rings: The Two Towers, The (2002),Adventure|Fantasy</span></span>
<span class="line"><span>7153 0.10972312192709989 Lord of the Rings: The Return of the King, The (2003),Action|Adventure|Drama|Fantasy</span></span></code></pre></div><p>从这个列表可以看出，这个主题是关于科幻或者奇幻类的动作冒险题材。</p><p>使用类似的代码和同样的阈值0.1，我们来看看和向量$Vt5$,相关的电影主要有哪些。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 输出和某个奇异值高度相关的电影，这些电影代表了一个主题</span></span>
<span class="line"><span>print(max(vt[5,:]))</span></span>
<span class="line"><span>for i in range(movie_num):</span></span>
<span class="line"><span>    if (vt[5][i] &amp;gt; 0.1):</span></span>
<span class="line"><span>        print(i + 1, vt[5][i], dict_movies[i + 1])</span></span></code></pre></div><p>电影列表如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0.13594520920117012</span></span>
<span class="line"><span>21 0.13557812349701226 Get Shorty (1995),Comedy|Crime|Thriller</span></span>
<span class="line"><span>50 0.11870851441884082 Usual Suspects, The (1995),Crime|Mystery|Thriller</span></span>
<span class="line"><span>62 0.11407971751480048 Mr. Holland&#39;s Opus (1995),Drama</span></span>
<span class="line"><span>168 0.10295400456394468 First Knight (1995),Action|Drama|Romance</span></span>
<span class="line"><span>222 0.12587492482374366 Circle of Friends (1995),Drama|Romance</span></span>
<span class="line"><span>261 0.13594520920117012 Little Women (1994),Drama</span></span>
<span class="line"><span>339 0.10815473505804706 While You Were Sleeping (1995),Comedy|Romance</span></span>
<span class="line"><span>357 0.11108191756350501 Four Weddings and a Funeral (1994),Comedy|Romance</span></span>
<span class="line"><span>527 0.1305895737838763 Schindler&#39;s List (1993),Drama|War</span></span>
<span class="line"><span>595 0.11155774544755555 Beauty and the Beast (1991),Animation|Children|Fantasy|Musical|Romance|IMAX</span></span></code></pre></div><p>从这个列表可以看出，这个主题更多的是关于剧情类题材。就目前所看的两个向量来说，SVD在一定程度上区分了不同的电影主题，你也可以使用类似的方式查看更多的向量，以及对应的电影名称和类型。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在今天的内容中，我们回顾了SVD奇异值分解的核心思想，解释了如何通过$XX’$和$X’X$这两个对称矩阵的特征分解，求得分解后的$U$矩阵、$V$矩阵和$Σ$矩阵。另外，我们也解释了在用户对电影评分的应用场景下，SVD分解后的$U$矩阵、$V$矩阵和$Σ$矩阵各自代表的意义，其中$Σ$矩阵中的奇异值表示了SVD挖掘出来的电影主题，$U$矩阵中的奇异向量表示用户对这些电影主题的评分，而$V$矩阵中的奇异向量表示了电影和这些主题的相关程度。</p><p>我们还通过Python代码，实践了这种思想在推荐算法中的运用。从结果的奇异值和奇异向量可以看出，SVD分解找到了一些MovieLens数据集上的电影主题。这样我们就可以把用户针对电影的评分转化为用户针对主题的评分。由于主题通常远远小于电影，所以SVD的分解也帮助我们实现了降低特征维度的目的。</p><p>SVD分解能够找到一些“潜在的”因素，例如语义上的概念、电影的主题等等。虽然这样操作可以降低特征维度，去掉一些噪音信息，但是由于SVD分解本身的计算量也很大，所以从单次的执行效率来看，SVD往往无法起到优化的作用。在这种情况下，我们可以考虑把它和一些监督式的学习相结合，使用一次分解的结果构建分类器，提升日后的执行效率。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>刚才SVD分解实验中得到的$U$矩阵，是用户对不同电影主题的评分矩阵。请你使用这个$U$矩阵，进行基于用户或者基于主题（物品）的协同过滤。</p><p>欢迎留言和我分享，也欢迎你在留言区写下今天的学习笔记。你可以点击“请朋友读”，把今天的内容分享给你的好友，和他一起精进。</p>`,52)])])}const h=n(i,[["render",t]]);export{u as __pageData,h as default};
