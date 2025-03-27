import{_ as s,c as e,o as a,a1 as i}from"./chunks/framework.DSpPDD5H.js";const y=JSON.parse('{"title":"Introduction","description":"","frontmatter":{},"headers":[],"relativePath":"basic.md","filePath":"basic.md","lastUpdated":1743057294000}'),t={name:"basic.md"},n=i(`<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h1><p><code>Logger</code> is a lightweight logging library that allows custom log styles and tags. It provides some predefined log types and supports the dynamic creation of new log types.</p><p><img src="https://img.shields.io/github/v/tag/ShermanTsang/Logger-TypeScript?label=version" alt="GitHub tag (latest by date)"></p><p><img src="https://github.com/ShermanTsang/Logger-TypeScript/actions/workflows/npm-publish.yml/badge.svg" alt="Build Status"></p><p><img src="https://img.shields.io/npm/dt/@shermant/logger" alt="npm"></p><h2 id="features" tabindex="-1">Features <a class="header-anchor" href="#features" aria-label="Permalink to &quot;Features&quot;">​</a></h2><ul><li>Multiple predefined log types (info, warn, error, debug, success, failure, plain)</li><li>Custom log type styles</li><li>Log tags</li><li>Log prepend and append dividers</li><li>Displaying log time</li><li>Dynamic creation of custom log types</li><li>Interactive spinner-based logging with <code>StreamLogger</code></li></ul><h2 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-label="Permalink to &quot;Installation&quot;">​</a></h2><p>Install using any package manager: npm, pnpm, yarn, or bun:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bun</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @shermant/logger</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @shermant/logger</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @shermant/logger</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @shermant/logger</span></span></code></pre></div><h2 id="concept" tabindex="-1">Concept <a class="header-anchor" href="#concept" aria-label="Permalink to &quot;Concept&quot;">​</a></h2><p>The following concepts are used in this package</p><h3 id="log-type" tabindex="-1">Log Type <a class="header-anchor" href="#log-type" aria-label="Permalink to &quot;Log Type&quot;">​</a></h3><p>This lib provides seven predefined log types: <code>info</code>, <code>warn</code>, <code>error</code>, <code>debug</code>, <code>success</code>, <code>failure</code>, and <code>plain</code>.</p><p>You can use them directly to log messages, and every log type has a corresponding style.</p><h3 id="style" tabindex="-1">Style <a class="header-anchor" href="#style" aria-label="Permalink to &quot;Style&quot;">​</a></h3><p>This package uses the chalk package to style log messages. Any style provided by chalk can be used to customize log text styles. Use the style method to customize the log text style. The style method takes an array of two strings: the background color and the text color.</p><p>Therefore, you can use the <code>style</code> method to customize the log text style. The <code>style</code> method takes an array of two strings: the background color and the text color.</p><p>Below is the type definition of the <code>Style</code> type</p><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {ChalkInstance} </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;chalk&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">namespace</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LoggerType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // ignored content...</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Style</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> keyof</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ChalkInstance</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Styles</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // ignored content...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="streamlogger" tabindex="-1">StreamLogger <a class="header-anchor" href="#streamlogger" aria-label="Permalink to &quot;StreamLogger&quot;">​</a></h3><p>The <code>StreamLogger</code> class provides interactive terminal logging with spinners. It&#39;s built on top of the Ora package and allows you to display loading states, success/failure indicators, and detailed progress messages in the terminal.</p><p>Key features of <code>StreamLogger</code>:</p><ul><li>Interactive spinners for indicating in-progress operations</li><li>Support for multiple states: start, stop, succeed, fail</li><li>Custom styling for text, details, and prefix elements</li><li>Ability to set delays between state changes</li><li>Chainable API for fluent configuration</li></ul>`,24),l=[n];function o(p,r,h,d,c,g){return a(),e("div",null,l)}const u=s(t,[["render",o]]);export{y as __pageData,u as default};
