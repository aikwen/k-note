export const MOCK_HTML = String.raw`
<h1 id="heading">一级标题</h1>
<p>正文</p>
<h1 id="heading-1">一级标题</h1>
<h2 id="heading-2">二级标题</h2>
<p>正文</p>
<h3 id="heading-3">三级标题</h3>
<p>正文</p>
<h3 id="-frac12">三级标题 <span class="math inline">\(\frac{1}{2}\)</span></h3>
<h4 id="heading-4">四级标题</h4>
<p>正文</p>
<h4 id="-code">四级标题 <code>code</code></h4>
<h5 id="heading-5">五级标题</h5>
<p>正文</p>
<h6 id="heading-6">六级标题</h6>
<p>正文</p>
<p>正文 <strong>加粗</strong> ==高亮== 公式 <span class="math inline">\(\frac{1}{2}\)</span> <del>这是删除线</del><code>行内代码</code><br />
正文 <strong>加粗</strong> ==高亮== 公式 <span class="math inline">\(\frac{1}{2}\)</span> <del>这是删除线</del><code>行内代码</code></p>
<ul>
<li>正文 <strong>加粗</strong>  公式 <span class="math inline">\(\frac{1}{2}\)</span> <del>这是删除线</del><code>行内代码</code></li>
<li>正文 <strong>加粗</strong>  公式 <span class="math inline">\(\frac{1}{2}\)</span> <del>这是删除线</del><code>行内代码</code>
<ul>
<li>正文 <strong>加粗</strong>  公式 <span class="math inline">\(\frac{1}{2}\)</span> <del>这是删除线</del><code>行内代码</code></li>
<li>正文 <strong>加粗</strong>  公式 <span class="math inline">\(\frac{1}{2}\)</span> <del>这是删除线</del><code>行内代码</code></li>
</ul>
</li>
</ul>
<ol>
<li>
<ul>
<li>正文 <strong>加粗</strong> ==高亮== 公式 <span class="math inline">\(\frac{1}{2}\)</span></li>
</ul>
</li>
<li>
<ul>
<li>正文 <strong>加粗</strong> ==高亮== 公式 <span class="math inline">\(\frac{1}{2}\)</span></li>
</ul>
</li>
</ol>
<p><code>行内代码</code><br />
<code>行内代码</code></p>
<pre class="chroma"><code><span class="line"><span class="ln">1</span><span class="cl"><span class="nb">print</span><span class="p">(</span><span class="mi">123</span><span class="p">)</span>
</span></span><span class="line"><span class="ln">2</span><span class="cl"><span class="nb">print</span><span class="p">(</span><span class="mi">123</span><span class="p">)</span>
</span></span><span class="line"><span class="ln">3</span><span class="cl"><span class="nb">print</span><span class="p">(</span><span class="mi">123</span><span class="p">)</span>
</span></span><span class="line"><span class="ln">4</span><span class="cl"><span class="nb">print</span><span class="p">(</span><span class="mi">123</span><span class="p">)</span>
</span></span><span class="line"><span class="ln">5</span><span class="cl"><span class="nb">print</span><span class="p">(</span><span class="mi">123</span><span class="p">)</span>
</span></span><span class="line"><span class="ln">6</span><span class="cl"><span class="k">for</span> <span class="n">i</span> <span class="ow">in</span> <span class="nb">range</span><span class="p">(</span><span class="mi">10</span><span class="p">):</span>
</span></span><span class="line"><span class="ln">7</span><span class="cl">    <span class="nb">print</span><span class="p">(</span><span class="n">i</span><span class="p">)</span>
</span></span></code></pre><p><span class="math display">\[\frac{1}{2}
\]</span></p>
<blockquote>
<p>引用<br />
正文 <strong>加粗</strong> ==高亮== 公式 <span class="math inline">\(\frac{1}{2}\)</span> <del>这是删除线</del><code>行内代码</code><br />
正文 <strong>加粗</strong> ==高亮== 公式 <span class="math inline">\(\frac{1}{2}\)</span> <del>这是删除线</del><code>行内代码</code></p>
</blockquote>
<pre><code class="language-mermaid">sequenceDiagram
    Alice-&gt;&gt;John: Hello John, how are you?
    John--&gt;&gt;Alice: Great!
    Alice-)John: See you later!

</code></pre>

`
