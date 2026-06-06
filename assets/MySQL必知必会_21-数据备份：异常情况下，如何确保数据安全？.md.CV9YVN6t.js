import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const r=JSON.parse('{"title":"21 | 数据备份：异常情况下，如何确保数据安全？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何进行数据备份？","slug":"如何进行数据备份","link":"#如何进行数据备份","children":[{"level":3,"title":"如何备份数据库中的表？","slug":"如何备份数据库中的表","link":"#如何备份数据库中的表","children":[]},{"level":3,"title":"如何备份数据库？","slug":"如何备份数据库","link":"#如何备份数据库","children":[]},{"level":3,"title":"如何备份整个数据库服务器？","slug":"如何备份整个数据库服务器","link":"#如何备份整个数据库服务器","children":[]}]},{"level":2,"title":"如何进行数据恢复？","slug":"如何进行数据恢复","link":"#如何进行数据恢复","children":[]},{"level":2,"title":"如何导出和导入表里的数据？","slug":"如何导出和导入表里的数据","link":"#如何导出和导入表里的数据","children":[{"level":3,"title":"SELECT语句导出数据","slug":"select语句导出数据","link":"#select语句导出数据","children":[]},{"level":3,"title":"使用“LOAD DATA”语句导入数据","slug":"使用-load-data-语句导入数据","link":"#使用-load-data-语句导入数据","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"MySQL必知必会/21-数据备份：异常情况下，如何确保数据安全？.md","filePath":"MySQL必知必会/21-数据备份：异常情况下，如何确保数据安全？.md","lastUpdated":1779816051000}'),l={name:"MySQL必知必会/21-数据备份：异常情况下，如何确保数据安全？.md"};function i(t,s,c,E,o,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_21-数据备份-异常情况下-如何确保数据安全" tabindex="-1">21 | 数据备份：异常情况下，如何确保数据安全？ <a class="header-anchor" href="#_21-数据备份-异常情况下-如何确保数据安全" aria-label="Permalink to &quot;21 | 数据备份：异常情况下，如何确保数据安全？&quot;">​</a></h1><p>你好，我是朱晓峰。今天，我来和你聊一聊数据备份。</p><p>数据备份，对咱们技术人员来说十分重要。当成千上万的用户，每天使用我们开发的应用做着他们的日常工作的时候，数据的安全性就不光是你一个人的事了。要是有一天，突然发生了某种意想不到的情况，导致数据库服务器上的数据全部丢失，所有使用这个应用的人都会受到严重影响。</p><p>所以，我们必须“未雨绸缪”，及时把数据备份到安全的地方。这样，当突发的异常来临时，我们就能把数据及时恢复回来，就不会造成太大损失。</p><p>MySQL的数据备份有2种，一种是物理备份，通过把数据文件复制出来，达到备份的目的；另外一种是逻辑备份，通过把描述数据库结构和内容的信息保存起来，达到备份的目的。逻辑备份这种方式是免费的，广泛得到使用；而物理备份的方式需要收费，用得比较少。所以，这节课我重点和你聊聊逻辑备份。</p><p>我还会给你介绍一下MySQL中的数据备份工具mysqldump、数据恢复的命令行客户端工具mysql，以及数据表中数据导出到文件和从文件导入的SQL语句，帮助你提高你所开发的应用中的数据安全性。</p><h2 id="如何进行数据备份" tabindex="-1">如何进行数据备份？ <a class="header-anchor" href="#如何进行数据备份" aria-label="Permalink to &quot;如何进行数据备份？&quot;">​</a></h2><p>首先，我们来学习下用于数据备份的工具mysqldump。它总共有三种模式：</p><ol><li>备份数据库中的表；</li><li>备份整个数据库；</li><li>备份整个数据库服务器。</li></ol><p>接下来，我就来介绍下这3种备份的具体方法。</p><h3 id="如何备份数据库中的表" tabindex="-1">如何备份数据库中的表？ <a class="header-anchor" href="#如何备份数据库中的表" aria-label="Permalink to &quot;如何备份数据库中的表？&quot;">​</a></h3><p>mysqldump备份数据库中的表的语法结构是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysqldump -h 服务器 -u 用户 -p 密码 数据库名称 [表名称 … ] &amp;gt; 备份文件名称</span></span></code></pre></div><p>我简单解释一下这里的核心内容。</p><ul><li>“-h”后面跟的服务器名称，如果省略，默认是本机“localhost”。</li><li>“-u”后面跟的是用户名。</li><li>“-p”后面跟的是密码，如果省略，执行的时候系统会提示录入密码。</li></ul><p>我举个小例子，带你看看怎么使用这个工具。</p><p>假设数据库demo中有2个表，分别是商品信息表（demo.goodsmaster）和会员表（demo.membermaster）。</p><p>商品信息表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/366307/9cd746385988ee32d8813ffbb12ed645.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/366307/9cd746385988ee32d8813ffbb12ed645.jpeg" alt=""></a></p><p>会员表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/366307/bd0e205b0893773944275861ae9b6e87.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/366307/bd0e205b0893773944275861ae9b6e87.jpeg" alt=""></a></p><p>现在，我需要把数据库demo备份到文件中，就可以用下面的代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>H:\\&amp;gt;mysqldump -u root -p demo goodsmaster membermaster &amp;gt; test.sql</span></span>
<span class="line"><span>Enter password: *****</span></span></code></pre></div><p>这个指令的意思，就是备份本机数据库服务器上demo数据库中的商品信息表和会员信息表的所有信息。</p><p><strong>备份文件是以文本格式保存的</strong>，我们可以用记事本打开，看一下备份的内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13 Distrib 8.0.23, for Win64 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost Database: demo -- 表示从本地进行备份，数据库是demo</span></span>
<span class="line"><span>-- ------------------------------------------------------</span></span>
<span class="line"><span>-- Server version 8.0.23</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*!40101 SET &amp;#64;OLD_CHARACTER_SET_CLIENT=&amp;#64;&amp;#64;CHARACTER_SET_CLIENT */;</span></span>
<span class="line"><span>/*!40101 SET &amp;#64;OLD_CHARACTER_SET_RESULTS=&amp;#64;&amp;#64;CHARACTER_SET_RESULTS */;</span></span>
<span class="line"><span>/*!40101 SET &amp;#64;OLD_COLLATION_CONNECTION=&amp;#64;&amp;#64;COLLATION_CONNECTION */;</span></span>
<span class="line"><span>/*!50503 SET NAMES utf8mb4 */;</span></span>
<span class="line"><span>/*!40103 SET &amp;#64;OLD_TIME_ZONE=&amp;#64;&amp;#64;TIME_ZONE */;</span></span>
<span class="line"><span>/*!40103 SET TIME_ZONE=&#39;+00:00&#39; */;</span></span>
<span class="line"><span>/*!40014 SET &amp;#64;OLD_UNIQUE_CHECKS=&amp;#64;&amp;#64;UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;</span></span>
<span class="line"><span>/*!40014 SET &amp;#64;OLD_FOREIGN_KEY_CHECKS=&amp;#64;&amp;#64;FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;</span></span>
<span class="line"><span>/*!40101 SET &amp;#64;OLD_SQL_MODE=&amp;#64;&amp;#64;SQL_MODE, SQL_MODE=&#39;NO_AUTO_VALUE_ON_ZERO&#39; */;</span></span>
<span class="line"><span>/*!40111 SET &amp;#64;OLD_SQL_NOTES=&amp;#64;&amp;#64;SQL_NOTES, SQL_NOTES=0 */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`goodsmaster\` -- 商品信息表的结构</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`goodsmaster\`;</span></span>
<span class="line"><span>/*!40101 SET &amp;#64;saved_cs_client = &amp;#64;&amp;#64;character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`goodsmaster\` (</span></span>
<span class="line"><span>\`itemnumber\` int NOT NULL,</span></span>
<span class="line"><span>\`barcode\` text,</span></span>
<span class="line"><span>\`goodsname\` text,</span></span>
<span class="line"><span>\`specification\` text,</span></span>
<span class="line"><span>\`unit\` text,</span></span>
<span class="line"><span>\`salesprice\` decimal(10,2) DEFAULT NULL,</span></span>
<span class="line"><span>PRIMARY KEY (\`itemnumber\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = &amp;#64;saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`goodsmaster\` -- 商品信息表的内容</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`goodsmaster\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`goodsmaster\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`goodsmaster\` VALUES (1,&#39;0001&#39;,&#39;书&#39;,&#39;16开&#39;,&#39;本&#39;,89.00),(2,&#39;0002&#39;,&#39;笔&#39;,&#39;10支装&#39;,&#39;包&#39;,5.00),(3,&#39;0003&#39;,&#39;橡皮&#39;,NULL,&#39;个&#39;,3.00);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`goodsmaster\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`membermaster\` -- 会员表的结构</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`membermaster\`;</span></span>
<span class="line"><span>/*!40101 SET &amp;#64;saved_cs_client = &amp;#64;&amp;#64;character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`membermaster\` (</span></span>
<span class="line"><span>\`id\` int NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>\`cardno\` char(8) NOT NULL,</span></span>
<span class="line"><span>\`membername\` text,</span></span>
<span class="line"><span>\`memberphone\` text,</span></span>
<span class="line"><span>\`memberpid\` text,</span></span>
<span class="line"><span>\`memberaddress\` text,</span></span>
<span class="line"><span>\`sex\` text,</span></span>
<span class="line"><span>\`birthday\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = &amp;#64;saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`membermaster\` -- 会员表的内容</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`membermaster\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`membermaster\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`membermaster\` VALUES (&#39;10000001&#39;,&#39;张三&#39;,&#39;13812345678&#39;,&#39;110123200001017890&#39;,&#39;北京&#39;,&#39;男&#39;,&#39;2000-01-01 00:00:00&#39;,1),(&#39;10000002&#39;,&#39;李四&#39;,&#39;13512345678&#39;,&#39;123123199001012356&#39;,&#39;上海&#39;,&#39;女&#39;,&#39;1990-01-01 00:00:00&#39;,2);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`membermaster\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span>/*!40103 SET TIME_ZONE=&amp;#64;OLD_TIME_ZONE */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*!40101 SET SQL_MODE=&amp;#64;OLD_SQL_MODE */;</span></span>
<span class="line"><span>/*!40014 SET FOREIGN_KEY_CHECKS=&amp;#64;OLD_FOREIGN_KEY_CHECKS */;</span></span>
<span class="line"><span>/*!40014 SET UNIQUE_CHECKS=&amp;#64;OLD_UNIQUE_CHECKS */;</span></span>
<span class="line"><span>/*!40101 SET CHARACTER_SET_CLIENT=&amp;#64;OLD_CHARACTER_SET_CLIENT */;</span></span>
<span class="line"><span>/*!40101 SET CHARACTER_SET_RESULTS=&amp;#64;OLD_CHARACTER_SET_RESULTS */;</span></span>
<span class="line"><span>/*!40101 SET COLLATION_CONNECTION=&amp;#64;OLD_COLLATION_CONNECTION */;</span></span>
<span class="line"><span>/*!40111 SET SQL_NOTES=&amp;#64;OLD_SQL_NOTES */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- Dump completed on 2021-04-11 10:43:04</span></span></code></pre></div><p>从这个文件中，我们可以看到，它相当于一个SQL执行脚本，里面包括了创建商品信息表和会员表的SQL语句，以及把表里的数据插入到这两个表中的SQL语句。这样一来，商品信息表和会员信息表的结构信息和全部数据信息就都备份出来了。</p><p>下面我来介绍一下备份整个数据库的方法。</p><h3 id="如何备份数据库" tabindex="-1">如何备份数据库？ <a class="header-anchor" href="#如何备份数据库" aria-label="Permalink to &quot;如何备份数据库？&quot;">​</a></h3><p>mysqldump备份数据库的语法结构是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysqldump -h 服务器 -u 用户 -p 密码 --databases 数据库名称 … &amp;gt; 备份文件名</span></span></code></pre></div><p>举个小例子，假设我现在需要对本机的数据库服务器中的2个数据库demo和demo1进行备份，就可以用下面的指令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>H:\\&amp;gt;mysqldump -u root -p --databases demo demo1 &amp;gt; test1.sql</span></span>
<span class="line"><span>Enter password: *****</span></span></code></pre></div><p>现在，我们来查看一下备份文件的内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13 Distrib 8.0.23, for Win64 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost Database: demo</span></span>
<span class="line"><span>-- ------------------------------------------------------</span></span>
<span class="line"><span>-- Server version 8.0.23</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*!40101 SET &amp;#64;OLD_CHARACTER_SET_CLIENT=&amp;#64;&amp;#64;CHARACTER_SET_CLIENT */;</span></span>
<span class="line"><span>/*!40101 SET &amp;#64;OLD_CHARACTER_SET_RESULTS=&amp;#64;&amp;#64;CHARACTER_SET_RESULTS */;</span></span>
<span class="line"><span>/*!40101 SET &amp;#64;OLD_COLLATION_CONNECTION=&amp;#64;&amp;#64;COLLATION_CONNECTION */;</span></span>
<span class="line"><span>/*!50503 SET NAMES utf8mb4 */;</span></span>
<span class="line"><span>/*!40103 SET &amp;#64;OLD_TIME_ZONE=&amp;#64;&amp;#64;TIME_ZONE */;</span></span>
<span class="line"><span>/*!40103 SET TIME_ZONE=&#39;+00:00&#39; */;</span></span>
<span class="line"><span>/*!40014 SET &amp;#64;OLD_UNIQUE_CHECKS=&amp;#64;&amp;#64;UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;</span></span>
<span class="line"><span>/*!40014 SET &amp;#64;OLD_FOREIGN_KEY_CHECKS=&amp;#64;&amp;#64;FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;</span></span>
<span class="line"><span>/*!40101 SET &amp;#64;OLD_SQL_MODE=&amp;#64;&amp;#64;SQL_MODE, SQL_MODE=&#39;NO_AUTO_VALUE_ON_ZERO&#39; */;</span></span>
<span class="line"><span>/*!40111 SET &amp;#64;OLD_SQL_NOTES=&amp;#64;&amp;#64;SQL_NOTES, SQL_NOTES=0 */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Current Database: \`demo\` -- 备份数据库demo</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CREATE DATABASE /*!32312 IF NOT EXISTS*/ \`demo\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION=&#39;N&#39; */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>USE \`demo\`; -- 备份数据库中的表</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`dailystatistics\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`dailystatistics\`;</span></span>
<span class="line"><span>/*!40101 SET &amp;#64;saved_cs_client = &amp;#64;&amp;#64;character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`dailystatistics\` (</span></span>
<span class="line"><span>\`id\` int NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>\`itemnumber\` int DEFAULT NULL,</span></span>
<span class="line"><span>\`quantity\` decimal(10,3) DEFAULT NULL,</span></span>
<span class="line"><span>\`actualvalue\` decimal(10,2) DEFAULT NULL,</span></span>
<span class="line"><span>\`cost\` decimal(10,2) DEFAULT NULL,</span></span>
<span class="line"><span>\`profit\` decimal(10,2) DEFAULT NULL,</span></span>
<span class="line"><span>\`profitratio\` decimal(10,4) DEFAULT NULL,</span></span>
<span class="line"><span>\`salesdate\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>PRIMARY KEY (\`id\`),</span></span>
<span class="line"><span>KEY \`index_dailystatistic_salesdate\` (\`salesdate\`),</span></span>
<span class="line"><span>KEY \`index_dailystatistic_itemnumber\` (\`itemnumber\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = &amp;#64;saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`dailystatistics\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`dailystatistics\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`dailystatistics\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`dailystatistics\` VALUES (15,1,3.000,267.00,100.50,166.50,0.6236,&#39;2020-12-01 00:00:00&#39;),(16,2,2.000,10.00,7.00,3.00,0.3000,&#39;2020-12-01 00:00:00&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`dailystatistics\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- 这里省略了其他表的备份语句</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Current Database: \`demo1\` -- 备份数据库demo1</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CREATE DATABASE /*!32312 IF NOT EXISTS*/ \`demo1\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION=&#39;N&#39; */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>USE \`demo1\`;</span></span>
<span class="line"><span>/*!40103 SET TIME_ZONE=&amp;#64;OLD_TIME_ZONE */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*!40101 SET SQL_MODE=&amp;#64;OLD_SQL_MODE */;</span></span>
<span class="line"><span>/*!40014 SET FOREIGN_KEY_CHECKS=&amp;#64;OLD_FOREIGN_KEY_CHECKS */;</span></span>
<span class="line"><span>/*!40014 SET UNIQUE_CHECKS=&amp;#64;OLD_UNIQUE_CHECKS */;</span></span>
<span class="line"><span>/*!40101 SET CHARACTER_SET_CLIENT=&amp;#64;OLD_CHARACTER_SET_CLIENT */;</span></span>
<span class="line"><span>/*!40101 SET CHARACTER_SET_RESULTS=&amp;#64;OLD_CHARACTER_SET_RESULTS */;</span></span>
<span class="line"><span>/*!40101 SET COLLATION_CONNECTION=&amp;#64;OLD_COLLATION_CONNECTION */;</span></span>
<span class="line"><span>/*!40111 SET SQL_NOTES=&amp;#64;OLD_SQL_NOTES */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- Dump completed on 2021-04-11 11:02:09</span></span></code></pre></div><p>可以看到，这个文件里面包含了创建数据库demo和demo1的SQL语句，以及创建数据库中所有表、插入所有表中原有数据的SQL语句。</p><h3 id="如何备份整个数据库服务器" tabindex="-1">如何备份整个数据库服务器？ <a class="header-anchor" href="#如何备份整个数据库服务器" aria-label="Permalink to &quot;如何备份整个数据库服务器？&quot;">​</a></h3><p>mysqldump备份整个数据库服务器的语法结构是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysqldump -h 服务器 -u 用户 -p 密码 --all-databases &amp;gt; 备份文件名</span></span></code></pre></div><p>举个小例子，假设我要把本机上整个MySQL服务器备份下来，可以用下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>H:\\&amp;gt;mysqldump -u root -p --all-databases &amp;gt; test2.sql</span></span>
<span class="line"><span>Enter password: *****</span></span></code></pre></div><p>这个指令表示，备份本机上运行的MySQL数据库服务器的全部内容，包含系统数据库和用户创建的数据库中的库结构信息、表结构信息和表里的数据。这种备份方式会把系统数据库也全部备份出来，而且消耗的资源也比较多，一般来说没有必要，我就不展开细说了。</p><p>备份文件有了，如何用它进行数据恢复呢？下面我就来给你介绍下具体的方法。</p><h2 id="如何进行数据恢复" tabindex="-1">如何进行数据恢复？ <a class="header-anchor" href="#如何进行数据恢复" aria-label="Permalink to &quot;如何进行数据恢复？&quot;">​</a></h2><p>mysqldump的备份文件包含了创建数据库、数据表，以及插入数据表里原有数据的SQL语句，我们可以直接运行这些SQL语句，来进行数据恢复。</p><p>数据恢复的方法主要有2种：</p><ul><li>使用“mysql”命令行客户端工具进行数据恢复；</li><li>使用“SOURCE”语句进行数据恢复。</li></ul><p>使用“mysql”命令行客户端工具，进行数据恢复的命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>H:\\&amp;gt;mysql -u root -p demo &amp;lt; test.sql</span></span>
<span class="line"><span>Enter password: *****</span></span></code></pre></div><p>我来简单介绍下这个数据恢复命令。</p><ul><li>mysql是一个命令行客户端工具，可以与MySQL服务器之间进行连接，执行SQL语句。</li><li>“-u”后面跟的是用户。</li><li>“-p”后面跟的是密码。</li></ul><p>在这个命令里面，我指定了数据库，因为备份文件test.sql里面只有数据表的备份信息，需要指定恢复到哪个数据库中。如果使用的备份文件备份的是数据库的信息（比如test1.sql），或者是整个MySQL数据库服务器的信息（比如test2.sql），则不需要指定数据库。</p><p>第二种数据恢复的方法是，使用“SOURCE”语句恢复数据，语法结构如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SOURCE 备份文件名</span></span></code></pre></div><p>举个小例子，刚才我们对商品信息表和会员信息表进行了备份，现在想用备份的文件进行恢复，就可以用下面的语句：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; USE demo;</span></span>
<span class="line"><span>Database changed</span></span>
<span class="line"><span>mysql&amp;gt; SOURCE H:\\\\test.sql</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.00 sec)</span></span></code></pre></div><p>注意，这里需要先用“USE”语句把当前的数据库变更为demo，这样商品信息表和会员表才能恢复到正确的数据库里面。否则，可能会恢复错误。</p><p>除此之外，你还可以通过这种方式，用整个数据库的备份文件把数据库恢复回来，甚至是用整个数据库服务器的备份文件，恢复整个MySQL服务器。</p><p>到这里，我们就掌握了备份和恢复整个数据库服务器、数据库和数据库中的表的方法。不过，有的时候，我们只关心表里的数据本身，希望能够把表里的数据，按照一定的格式保存下来。这个时候，mysqldump就不够用了。所以，接下来我再给你介绍下MySQL数据导出和导入的方法。</p><h2 id="如何导出和导入表里的数据" tabindex="-1">如何导出和导入表里的数据？ <a class="header-anchor" href="#如何导出和导入表里的数据" aria-label="Permalink to &quot;如何导出和导入表里的数据？&quot;">​</a></h2><p>先来学习下怎么把一个表的数据按照一定的格式，导出成一个文件。</p><h3 id="select语句导出数据" tabindex="-1">SELECT语句导出数据 <a class="header-anchor" href="#select语句导出数据" aria-label="Permalink to &quot;SELECT语句导出数据&quot;">​</a></h3><p>使用“SELECT … INTO OUTFILE”语句导出数据表的语法结构是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT 字段列表 INTO OUTFILE 文件名称</span></span>
<span class="line"><span>FIELDS TERMINATED BY 字符</span></span>
<span class="line"><span>LINES TERMINATED BY 字符</span></span>
<span class="line"><span>FROM 表名;</span></span></code></pre></div><p>我来解释下这段代码。</p><ul><li>INTO OUTFILE 文件名称，表示查询的结果保存到文件名称指定的文件中；</li><li>FIELDS TERMINATED BY 字符，表示列之间的分隔符是“字符”；</li><li>LINES TERMINATED BY 字符，表示行之间的分隔符是“字符”。</li></ul><p>举个小例子，假设我们要把商品信息表导出到文件H:\\goodsmaster.txt中，该如何实现呢？按照我刚刚介绍的语法结构来尝试一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT * INTO OUTFILE &#39;H:\\goodsmaster.txt&#39;</span></span>
<span class="line"><span>-&amp;gt; FIELDS TERMINATED BY &#39;,&#39;</span></span>
<span class="line"><span>-&amp;gt; LINES TERMINATED BY &#39;\\n&#39;</span></span>
<span class="line"><span>-&amp;gt; FROM demo.goodsmaster;</span></span>
<span class="line"><span>ERROR 1290 (HY000): The MySQL server is running with the --secure-file-priv option so it cannot execute this statement</span></span></code></pre></div><p>结果，系统提示错误。其实，这是因为 <strong>服务器的“secure-file-priv”参数选项，不允许把文件写入到H:\\goodsmaster.txt中</strong>。那怎么解决这个问题呢？</p><p>这个时候，我们可以通过MySQL的配置文件my.ini，来查看一下“secure-file-priv”参数的设定，并且按照这个参数设定的要求准备导入文件。</p><p>打开C:\\ProgramData\\MySQL\\MySQL Server 8.0\\my.ini，找到“secure-file-priv”参数设定，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Secure File Priv.</span></span>
<span class="line"><span>secure-file-priv=&quot;C:/ProgramData/MySQL/MySQL Server 8.0/Uploads&quot;</span></span></code></pre></div><p>这个意思是说，只能把数据导出到“C:/ProgramData/MySQL/MySQL Server 8.0/Uploads”这个文件夹中，所以，如果我们把数据导出到H:\\goodsmaster.txt中，就违反了系统参数的设定，导致发生错误。</p><p>现在，我们来修改一下数据导出的SQL语句，把导出文件的路径改到系统要求的文件目录，看看结果如何：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT * INTO OUTFILE &#39;C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/goodsmaster.txt&#39;</span></span>
<span class="line"><span>-&amp;gt; FIELDS TERMINATED BY &#39;,&#39;</span></span>
<span class="line"><span>-&amp;gt; LINES TERMINATED BY &#39;\\n&#39;</span></span>
<span class="line"><span>-&amp;gt; FROM demo.goodsmaster;</span></span>
<span class="line"><span>Query OK, 3 rows affected (0.00 sec)</span></span></code></pre></div><p>结果显示，执行成功了。下面我们来看一下结果文件的内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1,0001,书,16开,本,89.00</span></span>
<span class="line"><span>2,0002,笔,10支装,包,5.00</span></span>
<span class="line"><span>3,0003,橡皮,\\N,个,3.00</span></span></code></pre></div><p>很显然，这很符合我们希望的导出格式：行与行之间用回车“\\n”分隔，列与列之间用逗号“,”分隔。</p><p>到这里，我们就知道怎么把数据表中的数据按照一定的格式导出到文件了。那在实际工作中，我们还经常需要把一定格式的数据从文件中导入到数据表中。</p><p>“LOAD DATA”语句，就是MySQL提供的一种快速数据读入的方法，在实际工作中常用于大量数据的导入，效率极高。</p><h3 id="使用-load-data-语句导入数据" tabindex="-1">使用“LOAD DATA”语句导入数据 <a class="header-anchor" href="#使用-load-data-语句导入数据" aria-label="Permalink to &quot;使用“LOAD DATA”语句导入数据&quot;">​</a></h3><p>“LOAD DATA”是与“SELECT … INTO OUTFILE”相对应的数据导入语句。语句结构是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LOAD DATA INFILE 文件名</span></span>
<span class="line"><span>INTO TABLE 表名</span></span>
<span class="line"><span>FIELDS TERMINATED BY 字符</span></span>
<span class="line"><span>LINES TERMINATED BY 字符;</span></span></code></pre></div><p>我举个小例子来演示一下“LOAD DATA”语句是如何工作的。</p><p>还是以我们刚才导出的那个文件goodsmaster.txt为例，现在我们把这个文件内的数据导入到商品信息表（demo.goodsmaster）中去。</p><p>为了演示方便，我会先把demo.goodsmaster中的数据先删除，然后使用“LOAD DATA”语句，把刚才的导出文件goodsmaster.txt的内容导入进来，再与删除之前的数据进行对比，来验证“LOAD DATA”语句的执行效果。</p><p>首先，我们把商品信息表中的数据删除：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; DELETE FROM demo.goodsmaster</span></span>
<span class="line"><span>-&amp;gt; WHERE itemnumber&amp;gt;0;</span></span>
<span class="line"><span>Query OK, 3 rows affected (0.03 sec)</span></span></code></pre></div><p>然后，我们尝试把文件goodsmaster.txt中的数据导入进来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; LOAD DATA INFILE &#39;C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/goodsmaster.txt&#39;</span></span>
<span class="line"><span>-&amp;gt; INTO TABLE demo.goodsmaster</span></span>
<span class="line"><span>-&amp;gt; FIELDS TERMINATED BY &#39;,&#39;</span></span>
<span class="line"><span>-&amp;gt; LINES TERMINATED BY &#39;\\n&#39;;</span></span>
<span class="line"><span>Query OK, 3 rows affected (0.02 sec)</span></span>
<span class="line"><span>Records: 3 Deleted: 0 Skipped: 0 Warnings: 0</span></span></code></pre></div><p>结果显示，导入成功了。我们再查看一下数据表中的内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT * FROM demo.goodsmaster;</span></span>
<span class="line"><span>+------------+---------+-----------+---------------+------+------------+</span></span>
<span class="line"><span>| itemnumber | barcode | goodsname | specification | unit | salesprice |</span></span>
<span class="line"><span>+------------+---------+-----------+---------------+------+------------+</span></span>
<span class="line"><span>| 1 | 0001 | 书 | 16开 | 本 | 89.00 |</span></span>
<span class="line"><span>| 2 | 0002 | 笔 | 10支装 | 包 | 5.00 |</span></span>
<span class="line"><span>| 3 | 0003 | 橡皮 | NULL | 个 | 3.00 |</span></span>
<span class="line"><span>+------------+---------+-----------+---------------+------+------------+</span></span>
<span class="line"><span>3 rows in set (0.00 sec)</span></span></code></pre></div><p>结果显示，与我们删除之前的数据完全一致。这说明，“LOAD DATA”语句成功导入了数据文件goodsmaster.txt中的数据。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我们重点学习了数据备份，包括数据备份的工具mysqldump，以及用命令行客户端工具“mysql”和SQL语句“SOURCE”进行数据恢复的方法。同时，我还给你介绍了用于导出数据表中数据的语句“SELECT … INTO OUTFILE”和导入的语句“LOAD DATA”。这些都是你在备份数据时必不可少的，对确保数据的安全性至关重要。</p><p>最后提醒你一点，“LOAD DATA”是很好用的工具，因为它的数据导入速度是非常惊人的。一个400万条数据的文件，用“LOAD DATA”语句，只需要几分钟就可以完成，而其他的方法，比如使用Workbench来导入数据，就需要花费好几个小时。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>这节课，我介绍了数据导出语句“SELECT … INTO OUTFILE”，并且在第一次数据导出时遇到了一个系统参数“secure-file-priv”设定的目录与导出文件目录不一致，从而导致导出失败的问题。最后，我通过修改导出文件的文件夹，解决了这个问题。</p><p>我想请你思考一下，如果还是想把导出文件保存到H:\\目录下，有没有办法实现呢？</p><p>欢迎在留言区写下你的思考和答案，我们一起交流讨论。如果你觉得今天的内容对你有所帮助，也欢迎你分享给你的朋友或同事，我们下节课见。</p>`,100)])])}const T=a(l,[["render",i]]);export{r as __pageData,T as default};
