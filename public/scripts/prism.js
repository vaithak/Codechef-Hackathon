
/* PrismJS 1.15.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+c+bash+cpp+coffeescript+ruby+markup-templating+go+haskell+java+json+julia+lua+php+python+typescript+swift&plugins=line-numbers+toolbar+jsonp-highlight+highlight-keywords+show-language+copy-to-clipboard */
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
    Prism = function() {
        var e = /\blang(?:uage)?-([\w-]+)\b/i,
            t = 0,
            n = _self.Prism = {
                manual: _self.Prism && _self.Prism.manual,
                disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
                util: {
                    encode: function(e) {
                        return e instanceof r ? new r(e.type, n.util.encode(e.content), e.alias) : "Array" === n.util.type(e) ? e.map(n.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
                    },
                    type: function(e) {
                        return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]
                    },
                    objId: function(e) {
                        return e.__id || Object.defineProperty(e, "__id", {
                            value: ++t
                        }), e.__id
                    },
                    clone: function(e, t) {
                        var r = n.util.type(e);
                        switch (t = t || {}, r) {
                            case "Object":
                                if (t[n.util.objId(e)]) return t[n.util.objId(e)];
                                var a = {};
                                t[n.util.objId(e)] = a;
                                for (var l in e) e.hasOwnProperty(l) && (a[l] = n.util.clone(e[l], t));
                                return a;
                            case "Array":
                                if (t[n.util.objId(e)]) return t[n.util.objId(e)];
                                var a = [];
                                return t[n.util.objId(e)] = a, e.forEach(function(e, r) {
                                    a[r] = n.util.clone(e, t)
                                }), a
                        }
                        return e
                    }
                },
                languages: {
                    extend: function(e, t) {
                        var r = n.util.clone(n.languages[e]);
                        for (var a in t) r[a] = t[a];
                        return r
                    },
                    insertBefore: function(e, t, r, a) {
                        a = a || n.languages;
                        var l = a[e];
                        if (2 == arguments.length) {
                            r = arguments[1];
                            for (var i in r) r.hasOwnProperty(i) && (l[i] = r[i]);
                            return l
                        }
                        var o = {};
                        for (var s in l)
                            if (l.hasOwnProperty(s)) {
                                if (s == t)
                                    for (var i in r) r.hasOwnProperty(i) && (o[i] = r[i]);
                                o[s] = l[s]
                            } var u = a[e];
                        return a[e] = o, n.languages.DFS(n.languages, function(t, n) {
                            n === u && t != e && (this[t] = o)
                        }), o
                    },
                    DFS: function(e, t, r, a) {
                        a = a || {};
                        for (var l in e) e.hasOwnProperty(l) && (t.call(e, l, e[l], r || l), "Object" !== n.util.type(e[l]) || a[n.util.objId(e[l])] ? "Array" !== n.util.type(e[l]) || a[n.util.objId(e[l])] || (a[n.util.objId(e[l])] = !0, n.languages.DFS(e[l], t, l, a)) : (a[n.util.objId(e[l])] = !0, n.languages.DFS(e[l], t, null, a)))
                    }
                },
                plugins: {},
                highlightAll: function(e, t) {
                    n.highlightAllUnder(document, e, t)
                },
                highlightAllUnder: function(e, t, r) {
                    var a = {
                        callback: r,
                        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
                    };
                    n.hooks.run("before-highlightall", a);
                    for (var l, i = a.elements || e.querySelectorAll(a.selector), o = 0; l = i[o++];) n.highlightElement(l, t === !0, a.callback)
                },
                highlightElement: function(t, r, a) {
                    for (var l, i, o = t; o && !e.test(o.className);) o = o.parentNode;
                    o && (l = (o.className.match(e) || [, ""])[1].toLowerCase(), i = n.languages[l]), t.className = t.className.replace(e, "").replace(/\s+/g, " ") + " language-" + l, t.parentNode && (o = t.parentNode, /pre/i.test(o.nodeName) && (o.className = o.className.replace(e, "").replace(/\s+/g, " ") + " language-" + l));
                    var s = t.textContent,
                        u = {
                            element: t,
                            language: l,
                            grammar: i,
                            code: s
                        };
                    if (n.hooks.run("before-sanity-check", u), !u.code || !u.grammar) return u.code && (n.hooks.run("before-highlight", u), u.element.textContent = u.code, n.hooks.run("after-highlight", u)), n.hooks.run("complete", u), void 0;
                    if (n.hooks.run("before-highlight", u), r && _self.Worker) {
                        var g = new Worker(n.filename);
                        g.onmessage = function(e) {
                            u.highlightedCode = e.data, n.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, a && a.call(u.element), n.hooks.run("after-highlight", u), n.hooks.run("complete", u)
                        }, g.postMessage(JSON.stringify({
                            language: u.language,
                            code: u.code,
                            immediateClose: !0
                        }))
                    } else u.highlightedCode = n.highlight(u.code, u.grammar, u.language), n.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, a && a.call(t), n.hooks.run("after-highlight", u), n.hooks.run("complete", u)
                },
                highlight: function(e, t, a) {
                    var l = {
                        code: e,
                        grammar: t,
                        language: a
                    };
                    return n.hooks.run("before-tokenize", l), l.tokens = n.tokenize(l.code, l.grammar), n.hooks.run("after-tokenize", l), r.stringify(n.util.encode(l.tokens), l.language)
                },
                matchGrammar: function(e, t, r, a, l, i, o) {
                    var s = n.Token;
                    for (var u in r)
                        if (r.hasOwnProperty(u) && r[u]) {
                            if (u == o) return;
                            var g = r[u];
                            g = "Array" === n.util.type(g) ? g : [g];
                            for (var c = 0; c < g.length; ++c) {
                                var h = g[c],
                                    f = h.inside,
                                    d = !!h.lookbehind,
                                    m = !!h.greedy,
                                    p = 0,
                                    y = h.alias;
                                if (m && !h.pattern.global) {
                                    var v = h.pattern.toString().match(/[imuy]*$/)[0];
                                    h.pattern = RegExp(h.pattern.source, v + "g")
                                }
                                h = h.pattern || h;
                                for (var b = a, k = l; b < t.length; k += t[b].length, ++b) {
                                    var w = t[b];
                                    if (t.length > e.length) return;
                                    if (!(w instanceof s)) {
                                        if (m && b != t.length - 1) {
                                            h.lastIndex = k;
                                            var _ = h.exec(e);
                                            if (!_) break;
                                            for (var j = _.index + (d ? _[1].length : 0), P = _.index + _[0].length, A = b, x = k, O = t.length; O > A && (P > x || !t[A].type && !t[A - 1].greedy); ++A) x += t[A].length, j >= x && (++b, k = x);
                                            if (t[b] instanceof s) continue;
                                            I = A - b, w = e.slice(k, x), _.index -= k
                                        } else {
                                            h.lastIndex = 0;
                                            var _ = h.exec(w),
                                                I = 1
                                        }
                                        if (_) {
                                            d && (p = _[1] ? _[1].length : 0);
                                            var j = _.index + p,
                                                _ = _[0].slice(p),
                                                P = j + _.length,
                                                N = w.slice(0, j),
                                                S = w.slice(P),
                                                C = [b, I];
                                            N && (++b, k += N.length, C.push(N));
                                            var E = new s(u, f ? n.tokenize(_, f) : _, y, _, m);
                                            if (C.push(E), S && C.push(S), Array.prototype.splice.apply(t, C), 1 != I && n.matchGrammar(e, t, r, b, k, !0, u), i) break
                                        } else if (i) break
                                    }
                                }
                            }
                        }
                },
                tokenize: function(e, t) {
                    var r = [e],
                        a = t.rest;
                    if (a) {
                        for (var l in a) t[l] = a[l];
                        delete t.rest
                    }
                    return n.matchGrammar(e, r, t, 0, 0, !1), r
                },
                hooks: {
                    all: {},
                    add: function(e, t) {
                        var r = n.hooks.all;
                        r[e] = r[e] || [], r[e].push(t)
                    },
                    run: function(e, t) {
                        var r = n.hooks.all[e];
                        if (r && r.length)
                            for (var a, l = 0; a = r[l++];) a(t)
                    }
                }
            },
            r = n.Token = function(e, t, n, r, a) {
                this.type = e, this.content = t, this.alias = n, this.length = 0 | (r || "").length, this.greedy = !!a
            };
        if (r.stringify = function(e, t, a) {
                if ("string" == typeof e) return e;
                if ("Array" === n.util.type(e)) return e.map(function(n) {
                    return r.stringify(n, t, e)
                }).join("");
                var l = {
                    type: e.type,
                    content: r.stringify(e.content, t, a),
                    tag: "span",
                    classes: ["token", e.type],
                    attributes: {},
                    language: t,
                    parent: a
                };
                if (e.alias) {
                    var i = "Array" === n.util.type(e.alias) ? e.alias : [e.alias];
                    Array.prototype.push.apply(l.classes, i)
                }
                n.hooks.run("wrap", l);
                var o = Object.keys(l.attributes).map(function(e) {
                    return e + '="' + (l.attributes[e] || "").replace(/"/g, "&quot;") + '"'
                }).join(" ");
                return "<" + l.tag + ' class="' + l.classes.join(" ") + '"' + (o ? " " + o : "") + ">" + l.content + "</" + l.tag + ">"
            }, !_self.document) return _self.addEventListener ? (n.disableWorkerMessageHandler || _self.addEventListener("message", function(e) {
            var t = JSON.parse(e.data),
                r = t.language,
                a = t.code,
                l = t.immediateClose;
            _self.postMessage(n.highlight(a, n.languages[r], r)), l && _self.close()
        }, !1), _self.Prism) : _self.Prism;
        var a = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
        return a && (n.filename = a.src, n.manual || a.hasAttribute("data-manual") || ("loading" !== document.readyState ? window.requestAnimationFrame ? window.requestAnimationFrame(n.highlightAll) : window.setTimeout(n.highlightAll, 16) : document.addEventListener("DOMContentLoaded", n.highlightAll))), _self.Prism
    }();
"undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism);
Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: /<!DOCTYPE[\s\S]+?>/i,
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        greedy: !0,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/i,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            "attr-value": {
                pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
                inside: {
                    punctuation: [/^=/, {
                        pattern: /(^|[^\\])["']/,
                        lookbehind: !0
                    }]
                }
            },
            punctuation: /\/?>/,
            "attr-name": {
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/
                }
            }
        }
    },
    entity: /&#?[\da-z]{1,8};/i
}, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.hooks.add("wrap", function(a) {
    "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"))
}), Prism.languages.xml = Prism.languages.markup, Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup;
Prism.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
        pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
        inside: {
            rule: /@[\w-]+/
        }
    },
    url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
    selector: /[^{}\s][^{};]*?(?=\s*\{)/,
    string: {
        pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /\B!important\b/i,
    "function": /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:]/
}, Prism.languages.css.atrule.inside.rest = Prism.languages.css, Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", {
    style: {
        pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
        lookbehind: !0,
        inside: Prism.languages.css,
        alias: "language-css",
        greedy: !0
    }
}), Prism.languages.insertBefore("inside", "attr-value", {
    "style-attr": {
        pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
        inside: {
            "attr-name": {
                pattern: /^\s*style/i,
                inside: Prism.languages.markup.tag.inside
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": {
                pattern: /.+/i,
                inside: Prism.languages.css
            }
        },
        alias: "language-css"
    }
}, Prism.languages.markup.tag));
Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
    }],
    string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "class-name": {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /[.\\]/
        }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    "boolean": /\b(?:true|false)\b/,
    "function": /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [Prism.languages.clike["class-name"], {
        pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: !0
    }],
    keyword: [{
        pattern: /((?:^|})\s*)(?:catch|finally)\b/,
        lookbehind: !0
    }, /\b(?:as|async|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/],
    number: /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
    "function": /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\(|\.(?:apply|bind|call)\()/,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
}), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
        lookbehind: !0,
        greedy: !0
    },
    "function-variable": {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
        alias: "function"
    },
    constant: /\b[A-Z][A-Z\d_]*\b/
}), Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /\${[^}]+}/,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\${|}$/,
                        alias: "punctuation"
                    },
                    rest: Prism.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    }
}), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
    script: {
        pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
        alias: "language-javascript",
        greedy: !0
    }
}), Prism.languages.js = Prism.languages.javascript;
Prism.languages.c = Prism.languages.extend("clike", {
    keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*\/%&|^!=<>]=?/,
    number: /(?:\b0x[\da-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ful]*/i
}), Prism.languages.insertBefore("c", "string", {
    macro: {
        pattern: /(^\s*)#\s*[a-z]+(?:[^\r\n\\]|\\(?:\r\n|[\s\S]))*/im,
        lookbehind: !0,
        alias: "property",
        inside: {
            string: {
                pattern: /(#\s*include\s*)(?:<.+?>|("|')(?:\\?.)+?\2)/,
                lookbehind: !0
            },
            directive: {
                pattern: /(#\s*)\b(?:define|defined|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/,
                lookbehind: !0,
                alias: "keyword"
            }
        }
    },
    constant: /\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/
}), delete Prism.languages.c["class-name"], delete Prism.languages.c["boolean"];
! function(e) {
    var t = {
        variable: [{
            pattern: /\$?\(\([\s\S]+?\)\)/,
            inside: {
                variable: [{
                    pattern: /(^\$\(\([\s\S]+)\)\)/,
                    lookbehind: !0
                }, /^\$\(\(/],
                number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
                operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
                punctuation: /\(\(?|\)\)?|,|;/
            }
        }, {
            pattern: /\$\([^)]+\)|`[^`]+`/,
            greedy: !0,
            inside: {
                variable: /^\$\(|^`|\)$|`$/
            }
        }, /\$(?:[\w#?*!@]+|\{[^}]+\})/i]
    };
    e.languages.bash = {
        shebang: {
            pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
            alias: "important"
        },
        comment: {
            pattern: /(^|[^"{\\])#.*/,
            lookbehind: !0
        },
        string: [{
            pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/,
            lookbehind: !0,
            greedy: !0,
            inside: t
        }, {
            pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/,
            greedy: !0,
            inside: t
        }],
        variable: t.variable,
        "function": {
            pattern: /(^|[\s;|&])(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|[\s;|&])/,
            lookbehind: !0
        },
        keyword: {
            pattern: /(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/,
            lookbehind: !0
        },
        "boolean": {
            pattern: /(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/,
            lookbehind: !0
        },
        operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
    };
    var a = t.variable[1].inside;
    a.string = e.languages.bash.string, a["function"] = e.languages.bash["function"], a.keyword = e.languages.bash.keyword, a["boolean"] = e.languages.bash["boolean"], a.operator = e.languages.bash.operator, a.punctuation = e.languages.bash.punctuation, e.languages.shell = e.languages.bash
}(Prism);
Prism.languages.cpp = Prism.languages.extend("c", {
    keyword: /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
    "boolean": /\b(?:true|false)\b/,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*\/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
}), Prism.languages.insertBefore("cpp", "keyword", {
    "class-name": {
        pattern: /(class\s+)\w+/i,
        lookbehind: !0
    }
}), Prism.languages.insertBefore("cpp", "string", {
    "raw-string": {
        pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
        alias: "string",
        greedy: !0
    }
});
! function(e) {
    var t = /#(?!\{).+/,
        n = {
            pattern: /#\{[^}]+\}/,
            alias: "variable"
        };
    e.languages.coffeescript = e.languages.extend("javascript", {
        comment: t,
        string: [{
            pattern: /'(?:\\[\s\S]|[^\\'])*'/,
            greedy: !0
        }, {
            pattern: /"(?:\\[\s\S]|[^\\"])*"/,
            greedy: !0,
            inside: {
                interpolation: n
            }
        }],
        keyword: /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
        "class-member": {
            pattern: /@(?!\d)\w+/,
            alias: "variable"
        }
    }), e.languages.insertBefore("coffeescript", "comment", {
        "multiline-comment": {
            pattern: /###[\s\S]+?###/,
            alias: "comment"
        },
        "block-regex": {
            pattern: /\/{3}[\s\S]*?\/{3}/,
            alias: "regex",
            inside: {
                comment: t,
                interpolation: n
            }
        }
    }), e.languages.insertBefore("coffeescript", "string", {
        "inline-javascript": {
            pattern: /`(?:\\[\s\S]|[^\\`])*`/,
            inside: {
                delimiter: {
                    pattern: /^`|`$/,
                    alias: "punctuation"
                },
                rest: e.languages.javascript
            }
        },
        "multiline-string": [{
            pattern: /'''[\s\S]*?'''/,
            greedy: !0,
            alias: "string"
        }, {
            pattern: /"""[\s\S]*?"""/,
            greedy: !0,
            alias: "string",
            inside: {
                interpolation: n
            }
        }]
    }), e.languages.insertBefore("coffeescript", "keyword", {
        property: /(?!\d)\w+(?=\s*:(?!:))/
    }), delete e.languages.coffeescript["template-string"]
}(Prism);
! function(e) {
    e.languages.ruby = e.languages.extend("clike", {
        comment: [/#.*/, {
            pattern: /^=begin(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?=end/m,
            greedy: !0
        }],
        keyword: /\b(?:alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|protected|private|public|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/
    });
    var n = {
        pattern: /#\{[^}]+\}/,
        inside: {
            delimiter: {
                pattern: /^#\{|\}$/,
                alias: "tag"
            },
            rest: e.languages.ruby
        }
    };
    e.languages.insertBefore("ruby", "keyword", {
        regex: [{
            pattern: /%r([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1[gim]{0,3}/,
            greedy: !0,
            inside: {
                interpolation: n
            }
        }, {
            pattern: /%r\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/,
            greedy: !0,
            inside: {
                interpolation: n
            }
        }, {
            pattern: /%r\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/,
            greedy: !0,
            inside: {
                interpolation: n
            }
        }, {
            pattern: /%r\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/,
            greedy: !0,
            inside: {
                interpolation: n
            }
        }, {
            pattern: /%r<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/,
            greedy: !0,
            inside: {
                interpolation: n
            }
        }, {
            pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/,
            lookbehind: !0,
            greedy: !0
        }],
        variable: /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
        symbol: {
            pattern: /(^|[^:]):[a-zA-Z_]\w*(?:[?!]|\b)/,
            lookbehind: !0
        }
    }), e.languages.insertBefore("ruby", "number", {
        builtin: /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
        constant: /\b[A-Z]\w*(?:[?!]|\b)/
    }), e.languages.ruby.string = [{
        pattern: /%[qQiIwWxs]?([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/,
        greedy: !0,
        inside: {
            interpolation: n
        }
    }, {
        pattern: /%[qQiIwWxs]?\((?:[^()\\]|\\[\s\S])*\)/,
        greedy: !0,
        inside: {
            interpolation: n
        }
    }, {
        pattern: /%[qQiIwWxs]?\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/,
        greedy: !0,
        inside: {
            interpolation: n
        }
    }, {
        pattern: /%[qQiIwWxs]?\[(?:[^\[\]\\]|\\[\s\S])*\]/,
        greedy: !0,
        inside: {
            interpolation: n
        }
    }, {
        pattern: /%[qQiIwWxs]?<(?:[^<>\\]|\\[\s\S])*>/,
        greedy: !0,
        inside: {
            interpolation: n
        }
    }, {
        pattern: /("|')(?:#\{[^}]+\}|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0,
        inside: {
            interpolation: n
        }
    }]
}(Prism);
Prism.languages["markup-templating"] = {}, Object.defineProperties(Prism.languages["markup-templating"], {
    buildPlaceholders: {
        value: function(e, t, n, a) {
            e.language === t && (e.tokenStack = [], e.code = e.code.replace(n, function(n) {
                if ("function" == typeof a && !a(n)) return n;
                for (var r = e.tokenStack.length; - 1 !== e.code.indexOf("___" + t.toUpperCase() + r + "___");) ++r;
                return e.tokenStack[r] = n, "___" + t.toUpperCase() + r + "___"
            }), e.grammar = Prism.languages.markup)
        }
    },
    tokenizePlaceholders: {
        value: function(e, t) {
            if (e.language === t && e.tokenStack) {
                e.grammar = Prism.languages[t];
                var n = 0,
                    a = Object.keys(e.tokenStack),
                    r = function(o) {
                        if (!(n >= a.length))
                            for (var i = 0; i < o.length; i++) {
                                var g = o[i];
                                if ("string" == typeof g || g.content && "string" == typeof g.content) {
                                    var c = a[n],
                                        s = e.tokenStack[c],
                                        l = "string" == typeof g ? g : g.content,
                                        p = l.indexOf("___" + t.toUpperCase() + c + "___");
                                    if (p > -1) {
                                        ++n;
                                        var f, u = l.substring(0, p),
                                            _ = new Prism.Token(t, Prism.tokenize(s, e.grammar, t), "language-" + t, s),
                                            k = l.substring(p + ("___" + t.toUpperCase() + c + "___").length);
                                        if (u || k ? (f = [u, _, k].filter(function(e) {
                                                return !!e
                                            }), r(f)) : f = _, "string" == typeof g ? Array.prototype.splice.apply(o, [i, 1].concat(f)) : g.content = f, n >= a.length) break
                                    }
                                } else g.content && "string" != typeof g.content && r(g.content)
                            }
                    };
                r(e.tokens)
            }
        }
    }
});
Prism.languages.go = Prism.languages.extend("clike", {
    keyword: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
    builtin: /\b(?:bool|byte|complex(?:64|128)|error|float(?:32|64)|rune|string|u?int(?:8|16|32|64)?|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(?:ln)?|real|recover)\b/,
    "boolean": /\b(?:_|iota|nil|true|false)\b/,
    operator: /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
    number: /(?:\b0x[a-f\d]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[-+]?\d+)?)i?/i,
    string: {
        pattern: /(["'`])(\\[\s\S]|(?!\1)[^\\])*\1/,
        greedy: !0
    }
}), delete Prism.languages.go["class-name"];
Prism.languages.haskell = {
    comment: {
        pattern: /(^|[^-!#$%*+=?&@|~.:<>^\\\/])(?:--[^-!#$%*+=?&@|~.:<>^\\\/].*|{-[\s\S]*?-})/m,
        lookbehind: !0
    },
    "char": /'(?:[^\\']|\\(?:[abfnrtv\\"'&]|\^[A-Z@[\]^_]|NUL|SOH|STX|ETX|EOT|ENQ|ACK|BEL|BS|HT|LF|VT|FF|CR|SO|SI|DLE|DC1|DC2|DC3|DC4|NAK|SYN|ETB|CAN|EM|SUB|ESC|FS|GS|RS|US|SP|DEL|\d+|o[0-7]+|x[0-9a-fA-F]+))'/,
    string: {
        pattern: /"(?:[^\\"]|\\(?:[abfnrtv\\"'&]|\^[A-Z@[\]^_]|NUL|SOH|STX|ETX|EOT|ENQ|ACK|BEL|BS|HT|LF|VT|FF|CR|SO|SI|DLE|DC1|DC2|DC3|DC4|NAK|SYN|ETB|CAN|EM|SUB|ESC|FS|GS|RS|US|SP|DEL|\d+|o[0-7]+|x[0-9a-fA-F]+)|\\\s+\\)*"/,
        greedy: !0
    },
    keyword: /\b(?:case|class|data|deriving|do|else|if|in|infixl|infixr|instance|let|module|newtype|of|primitive|then|type|where)\b/,
    import_statement: {
        pattern: /((?:\r?\n|\r|^)\s*)import\s+(?:qualified\s+)?(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*(?:\s+as\s+(?:[A-Z][_a-zA-Z0-9']*)(?:\.[A-Z][\w']*)*)?(?:\s+hiding\b)?/m,
        lookbehind: !0,
        inside: {
            keyword: /\b(?:import|qualified|as|hiding)\b/
        }
    },
    builtin: /\b(?:abs|acos|acosh|all|and|any|appendFile|approxRational|asTypeOf|asin|asinh|atan|atan2|atanh|basicIORun|break|catch|ceiling|chr|compare|concat|concatMap|const|cos|cosh|curry|cycle|decodeFloat|denominator|digitToInt|div|divMod|drop|dropWhile|either|elem|encodeFloat|enumFrom|enumFromThen|enumFromThenTo|enumFromTo|error|even|exp|exponent|fail|filter|flip|floatDigits|floatRadix|floatRange|floor|fmap|foldl|foldl1|foldr|foldr1|fromDouble|fromEnum|fromInt|fromInteger|fromIntegral|fromRational|fst|gcd|getChar|getContents|getLine|group|head|id|inRange|index|init|intToDigit|interact|ioError|isAlpha|isAlphaNum|isAscii|isControl|isDenormalized|isDigit|isHexDigit|isIEEE|isInfinite|isLower|isNaN|isNegativeZero|isOctDigit|isPrint|isSpace|isUpper|iterate|last|lcm|length|lex|lexDigits|lexLitChar|lines|log|logBase|lookup|map|mapM|mapM_|max|maxBound|maximum|maybe|min|minBound|minimum|mod|negate|not|notElem|null|numerator|odd|or|ord|otherwise|pack|pi|pred|primExitWith|print|product|properFraction|putChar|putStr|putStrLn|quot|quotRem|range|rangeSize|read|readDec|readFile|readFloat|readHex|readIO|readInt|readList|readLitChar|readLn|readOct|readParen|readSigned|reads|readsPrec|realToFrac|recip|rem|repeat|replicate|return|reverse|round|scaleFloat|scanl|scanl1|scanr|scanr1|seq|sequence|sequence_|show|showChar|showInt|showList|showLitChar|showParen|showSigned|showString|shows|showsPrec|significand|signum|sin|sinh|snd|sort|span|splitAt|sqrt|subtract|succ|sum|tail|take|takeWhile|tan|tanh|threadToIOResult|toEnum|toInt|toInteger|toLower|toRational|toUpper|truncate|uncurry|undefined|unlines|until|unwords|unzip|unzip3|userError|words|writeFile|zip|zip3|zipWith|zipWith3)\b/,
    number: /\b(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?|0o[0-7]+|0x[0-9a-f]+)\b/i,
    operator: /\s\.\s|[-!#$%*+=?&@|~.:<>^\\\/]*\.[-!#$%*+=?&@|~.:<>^\\\/]+|[-!#$%*+=?&@|~.:<>^\\\/]+\.[-!#$%*+=?&@|~.:<>^\\\/]*|[-!#$%*+=?&@|~:<>^\\\/]+|`([A-Z][\w']*\.)*[_a-z][\w']*`/,
    hvariable: /\b(?:[A-Z][\w']*\.)*[_a-z][\w']*\b/,
    constant: /\b(?:[A-Z][\w']*\.)*[A-Z][\w']*\b/,
    punctuation: /[{}[\];(),.:]/
};
Prism.languages.java = Prism.languages.extend("clike", {
    keyword: /\b(?:var|abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,
    number: /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp-]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?[df]?/i,
    operator: {
        pattern: /(^|[^.])(?:<<=?|>>>?=?|->|([-+&|])\2|[?:~]|[-+*\/%&|^!=<>]=?)/m,
        lookbehind: !0
    }
}), Prism.languages.insertBefore("java", "function", {
    annotation: {
        alias: "punctuation",
        pattern: /(^|[^.])@\w+/,
        lookbehind: !0
    }
}), Prism.languages.insertBefore("java", "class-name", {
    generics: {
        pattern: /<\s*\w+(?:\.\w+)?(?:\s*,\s*\w+(?:\.\w+)?)*>/i,
        alias: "function",
        inside: {
            keyword: Prism.languages.java.keyword,
            punctuation: /[<>(),.:]/
        }
    }
});
Prism.languages.json = {
    property: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
    string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        greedy: !0
    },
    number: /-?\d+\.?\d*([Ee][+-]?\d+)?/,
    punctuation: /[{}[\],]/,
    operator: /:/g,
    "boolean": /\b(?:true|false)\b/i,
    "null": /\bnull\b/i
}, Prism.languages.jsonp = Prism.languages.json;
Prism.languages.julia = {
    comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: !0
    },
    string: /("""|''')[\s\S]+?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2/,
    keyword: /\b(?:abstract|baremodule|begin|bitstype|break|catch|ccall|const|continue|do|else|elseif|end|export|finally|for|function|global|if|immutable|import|importall|let|local|macro|module|print|println|quote|return|try|type|typealias|using|while)\b/,
    "boolean": /\b(?:true|false)\b/,
    number: /(?:\b(?=\d)|\B(?=\.))(?:0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:[efp][+-]?\d+)?j?/i,
    operator: /[-+*^%÷&$\\]=?|\/[\/=]?|!=?=?|\|[=>]?|<(?:<=?|[=:])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥]/,
    punctuation: /[{}[\];(),.:]/
};
Prism.languages.lua = {
    comment: /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
    string: {
        pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[\s\S]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
        greedy: !0
    },
    number: /\b0x[a-f\d]+\.?[a-f\d]*(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|\.?\d*(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
    keyword: /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
    "function": /(?!\d)\w+(?=\s*(?:[({]))/,
    operator: [/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/, {
        pattern: /(^|[^.])\.\.(?!\.)/,
        lookbehind: !0
    }],
    punctuation: /[\[\](){},;]|\.+|:+/
};
! function(e) {
    e.languages.php = e.languages.extend("clike", {
        keyword: /\b(?:and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
        constant: /\b[A-Z0-9_]{2,}\b/,
        comment: {
            pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
            lookbehind: !0
        }
    }), e.languages.insertBefore("php", "string", {
        "shell-comment": {
            pattern: /(^|[^\\])#.*/,
            lookbehind: !0,
            alias: "comment"
        }
    }), e.languages.insertBefore("php", "keyword", {
        delimiter: {
            pattern: /\?>|<\?(?:php|=)?/i,
            alias: "important"
        },
        variable: /\$+(?:\w+\b|(?={))/i,
        "package": {
            pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        }
    }), e.languages.insertBefore("php", "operator", {
        property: {
            pattern: /(->)[\w]+/,
            lookbehind: !0
        }
    });
    var n = {
        pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
        lookbehind: !0,
        inside: {
            rest: e.languages.php
        }
    };
    e.languages.insertBefore("php", "string", {
        "nowdoc-string": {
            pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
            greedy: !0,
            alias: "string",
            inside: {
                delimiter: {
                    pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
                    alias: "symbol",
                    inside: {
                        punctuation: /^<<<'?|[';]$/
                    }
                }
            }
        },
        "heredoc-string": {
            pattern: /<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
            greedy: !0,
            alias: "string",
            inside: {
                delimiter: {
                    pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
                    alias: "symbol",
                    inside: {
                        punctuation: /^<<<"?|[";]$/
                    }
                },
                interpolation: n
            }
        },
        "single-quoted-string": {
            pattern: /'(?:\\[\s\S]|[^\\'])*'/,
            greedy: !0,
            alias: "string"
        },
        "double-quoted-string": {
            pattern: /"(?:\\[\s\S]|[^\\"])*"/,
            greedy: !0,
            alias: "string",
            inside: {
                interpolation: n
            }
        }
    }), delete e.languages.php.string, e.hooks.add("before-tokenize", function(n) {
        if (/(?:<\?php|<\?)/gi.test(n.code)) {
            var t = /(?:<\?php|<\?)[\s\S]*?(?:\?>|$)/gi;
            e.languages["markup-templating"].buildPlaceholders(n, "php", t)
        }
    }), e.hooks.add("after-tokenize", function(n) {
        e.languages["markup-templating"].tokenizePlaceholders(n, "php")
    })
}(Prism);
Prism.languages.python = {
    comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: !0
    },
    "triple-quoted-string": {
        pattern: /("""|''')[\s\S]+?\1/,
        greedy: !0,
        alias: "string"
    },
    string: {
        pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "function": {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
        lookbehind: !0
    },
    "class-name": {
        pattern: /(\bclass\s+)\w+/i,
        lookbehind: !0
    },
    keyword: /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|pass|print|raise|return|try|while|with|yield)\b/,
    builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    "boolean": /\b(?:True|False|None)\b/,
    number: /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
    operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
    punctuation: /[{}[\];(),.:]/
};
Prism.languages.typescript = Prism.languages.extend("javascript", {
    keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|module|declare|constructor|namespace|abstract|require|type)\b/,
    builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console)\b/
}), Prism.languages.ts = Prism.languages.typescript;
Prism.languages.swift = Prism.languages.extend("clike", {
    string: {
        pattern: /("|')(\\(?:\((?:[^()]|\([^)]+\))+\)|\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /\\\((?:[^()]|\([^)]+\))+\)/,
                inside: {
                    delimiter: {
                        pattern: /^\\\(|\)$/,
                        alias: "variable"
                    }
                }
            }
        }
    },
    keyword: /\b(?:as|associativity|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic(?:Type)?|else|enum|extension|fallthrough|final|for|func|get|guard|if|import|in|infix|init|inout|internal|is|lazy|left|let|mutating|new|none|nonmutating|operator|optional|override|postfix|precedence|prefix|private|protocol|public|repeat|required|rethrows|return|right|safe|self|Self|set|static|struct|subscript|super|switch|throws?|try|Type|typealias|unowned|unsafe|var|weak|where|while|willSet|__(?:COLUMN__|FILE__|FUNCTION__|LINE__))\b/,
    number: /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f0-9_]+(?:\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
    constant: /\b(?:nil|[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
    atrule: /@\b(?:IB(?:Outlet|Designable|Action|Inspectable)|class_protocol|exported|noreturn|NS(?:Copying|Managed)|objc|UIApplicationMain|auto_closure)\b/,
    builtin: /\b(?:[A-Z]\S+|abs|advance|alignof(?:Value)?|assert|contains|count(?:Elements)?|debugPrint(?:ln)?|distance|drop(?:First|Last)|dump|enumerate|equal|filter|find|first|getVaList|indices|isEmpty|join|last|lexicographicalCompare|map|max(?:Element)?|min(?:Element)?|numericCast|overlaps|partition|print(?:ln)?|reduce|reflect|reverse|sizeof(?:Value)?|sort(?:ed)?|split|startsWith|stride(?:of(?:Value)?)?|suffix|swap|toDebugString|toString|transcode|underestimateCount|unsafeBitCast|with(?:ExtendedLifetime|Unsafe(?:MutablePointers?|Pointers?)|VaList))\b/
}), Prism.languages.swift.string.inside.interpolation.inside.rest = Prism.languages.swift;
! function() {
    if ("undefined" != typeof self && self.Prism && self.document) {
        var e = "line-numbers",
            t = /\n(?!$)/g,
            n = function(e) {
                var n = r(e),
                    s = n["white-space"];
                if ("pre-wrap" === s || "pre-line" === s) {
                    var l = e.querySelector("code"),
                        i = e.querySelector(".line-numbers-rows"),
                        a = e.querySelector(".line-numbers-sizer"),
                        o = l.textContent.split(t);
                    a || (a = document.createElement("span"), a.className = "line-numbers-sizer", l.appendChild(a)), a.style.display = "block", o.forEach(function(e, t) {
                        a.textContent = e || "\n";
                        var n = a.getBoundingClientRect().height;
                        i.children[t].style.height = n + "px"
                    }), a.textContent = "", a.style.display = "none"
                }
            },
            r = function(e) {
                return e ? window.getComputedStyle ? getComputedStyle(e) : e.currentStyle || null : null
            };
        window.addEventListener("resize", function() {
            Array.prototype.forEach.call(document.querySelectorAll("pre." + e), n)
        }), Prism.hooks.add("complete", function(e) {
            if (e.code) {
                var r = e.element.parentNode,
                    s = /\s*\bline-numbers\b\s*/;
                if (r && /pre/i.test(r.nodeName) && (s.test(r.className) || s.test(e.element.className)) && !e.element.querySelector(".line-numbers-rows")) {
                    s.test(e.element.className) && (e.element.className = e.element.className.replace(s, " ")), s.test(r.className) || (r.className += " line-numbers");
                    var l, i = e.code.match(t),
                        a = i ? i.length + 1 : 1,
                        o = new Array(a + 1);
                    o = o.join("<span></span>"), l = document.createElement("span"), l.setAttribute("aria-hidden", "true"), l.className = "line-numbers-rows", l.innerHTML = o, r.hasAttribute("data-start") && (r.style.counterReset = "linenumber " + (parseInt(r.getAttribute("data-start"), 10) - 1)), e.element.appendChild(l), n(r), Prism.hooks.run("line-numbers", e)
                }
            }
        }), Prism.hooks.add("line-numbers", function(e) {
            e.plugins = e.plugins || {}, e.plugins.lineNumbers = !0
        }), Prism.plugins.lineNumbers = {
            getLine: function(t, n) {
                if ("PRE" === t.tagName && t.classList.contains(e)) {
                    var r = t.querySelector(".line-numbers-rows"),
                        s = parseInt(t.getAttribute("data-start"), 10) || 1,
                        l = s + (r.children.length - 1);
                    s > n && (n = s), n > l && (n = l);
                    var i = n - s;
                    return r.children[i]
                }
            }
        }
    }
}();
! function() {
    if ("undefined" != typeof self && self.Prism && self.document) {
        var t = [],
            e = {},
            n = function() {};
        Prism.plugins.toolbar = {};
        var a = Prism.plugins.toolbar.registerButton = function(n, a) {
                var o;
                o = "function" == typeof a ? a : function(t) {
                    var e;
                    return "function" == typeof a.onClick ? (e = document.createElement("button"), e.type = "button", e.addEventListener("click", function() {
                        a.onClick.call(this, t)
                    })) : "string" == typeof a.url ? (e = document.createElement("a"), e.href = a.url) : e = document.createElement("span"), e.textContent = a.text, e
                }, t.push(e[n] = o)
            },
            o = Prism.plugins.toolbar.hook = function(a) {
                var o = a.element.parentNode;
                if (o && /pre/i.test(o.nodeName) && !o.parentNode.classList.contains("code-toolbar")) {
                    var r = document.createElement("div");
                    r.classList.add("code-toolbar"), o.parentNode.insertBefore(r, o), r.appendChild(o);
                    var i = document.createElement("div");
                    i.classList.add("toolbar"), document.body.hasAttribute("data-toolbar-order") && (t = document.body.getAttribute("data-toolbar-order").split(",").map(function(t) {
                        return e[t] || n
                    })), t.forEach(function(t) {
                        var e = t(a);
                        if (e) {
                            var n = document.createElement("div");
                            n.classList.add("toolbar-item"), n.appendChild(e), i.appendChild(n)
                        }
                    }), r.appendChild(i)
                }
            };
        a("label", function(t) {
            var e = t.element.parentNode;
            if (e && /pre/i.test(e.nodeName) && e.hasAttribute("data-label")) {
                var n, a, o = e.getAttribute("data-label");
                try {
                    a = document.querySelector("template#" + o)
                } catch (r) {}
                return a ? n = a.content : (e.hasAttribute("data-url") ? (n = document.createElement("a"), n.href = e.getAttribute("data-url")) : n = document.createElement("span"), n.textContent = o), n
            }
        }), Prism.hooks.add("complete", o)
    }
}();
! function() {
    function t(t) {
        "function" != typeof t || e(t) || r.push(t)
    }

    function e(t) {
        return "function" == typeof t ? r.filter(function(e) {
            return e.valueOf() === t.valueOf()
        })[0] : "string" == typeof t && t.length > 0 ? r.filter(function(e) {
            return e.name === t
        })[0] : null
    }

    function n(t) {
        if ("string" == typeof t && (t = e(t)), "function" == typeof t) {
            var n = r.indexOf(t);
            n >= 0 && r.splice(n, 1)
        }
    }

    function a() {
        Array.prototype.slice.call(document.querySelectorAll("pre[data-jsonp]")).forEach(function(t) {
            t.textContent = "";
            var e = document.createElement("code");
            e.textContent = i, t.appendChild(e);
            var n = t.getAttribute("data-adapter"),
                a = null;
            if (n) {
                if ("function" != typeof window[n]) return e.textContent = "JSONP adapter function '" + n + "' doesn't exist", void 0;
                a = window[n]
            }
            var u = "prismjsonp" + o++,
                f = document.createElement("a"),
                l = f.href = t.getAttribute("data-jsonp");
            f.href += (f.search ? "&" : "?") + (t.getAttribute("data-callback") || "callback") + "=" + u;
            var s = setTimeout(function() {
                    e.textContent === i && (e.textContent = "Timeout loading '" + l + "'")
                }, 5e3),
                d = document.createElement("script");
            d.src = f.href, window[u] = function(n) {
                document.head.removeChild(d), clearTimeout(s), delete window[u];
                var o = "";
                if (a) o = a(n, t);
                else
                    for (var i in r)
                        if (o = r[i](n, t), null !== o) break;
                null === o ? e.textContent = "Cannot parse response (perhaps you need an adapter function?)" : (e.textContent = o, Prism.highlightElement(e))
            }, document.head.appendChild(d)
        })
    }
    if (self.Prism && self.document && document.querySelectorAll && [].filter) {
        var r = [];
        Prism.plugins.jsonphighlight = {
            registerAdapter: t,
            removeAdapter: n,
            highlight: a
        }, t(function(t) {
            if (t && t.meta && t.data) {
                if (t.meta.status && t.meta.status >= 400) return "Error: " + (t.data.message || t.meta.status);
                if ("string" == typeof t.data.content) return "function" == typeof atob ? atob(t.data.content.replace(/\s/g, "")) : "Your browser cannot decode base64"
            }
            return null
        }), t(function(t, e) {
            if (t && t.meta && t.data && t.data.files) {
                if (t.meta.status && t.meta.status >= 400) return "Error: " + (t.data.message || t.meta.status);
                var n = e.getAttribute("data-filename");
                if (null == n)
                    for (var a in t.data.files)
                        if (t.data.files.hasOwnProperty(a)) {
                            n = a;
                            break
                        } return void 0 !== t.data.files[n] ? t.data.files[n].content : "Error: unknown or missing gist file " + n
            }
            return null
        }), t(function(t) {
            return t && t.node && "string" == typeof t.data ? t.data : null
        });
        var o = 0,
            i = "Loading…";
        a()
    }
}();
! function() {
    "undefined" != typeof self && !self.Prism || "undefined" != typeof global && !global.Prism || Prism.hooks.add("wrap", function(e) {
        "keyword" === e.type && e.classes.push("keyword-" + e.content)
    })
}();
! function() {
    if ("undefined" != typeof self && self.Prism && self.document) {
        if (!Prism.plugins.toolbar) return console.warn("Show Languages plugin loaded before Toolbar plugin."), void 0;
        var e = {
            html: "HTML",
            xml: "XML",
            svg: "SVG",
            mathml: "MathML",
            css: "CSS",
            clike: "C-like",
            javascript: "JavaScript",
            abap: "ABAP",
            actionscript: "ActionScript",
            apacheconf: "Apache Configuration",
            apl: "APL",
            applescript: "AppleScript",
            arff: "ARFF",
            asciidoc: "AsciiDoc",
            asm6502: "6502 Assembly",
            aspnet: "ASP.NET (C#)",
            autohotkey: "AutoHotkey",
            autoit: "AutoIt",
            shell: "Shell",
            basic: "BASIC",
            csharp: "C#",
            cpp: "C++",
            coffeescript: "CoffeeScript",
            csp: "Content-Security-Policy",
            "css-extras": "CSS Extras",
            django: "Django/Jinja2",
            erb: "ERB",
            fsharp: "F#",
            gedcom: "GEDCOM",
            glsl: "GLSL",
            gml: "GameMaker Language",
            graphql: "GraphQL",
            http: "HTTP",
            hpkp: "HTTP Public-Key-Pins",
            hsts: "HTTP Strict-Transport-Security",
            ichigojam: "IchigoJam",
            inform7: "Inform 7",
            json: "JSON",
            jsonp: "JSONP",
            latex: "LaTeX",
            livescript: "LiveScript",
            lolcode: "LOLCODE",
            "markup-templating": "Markup templating",
            matlab: "MATLAB",
            mel: "MEL",
            n4js: "N4JS",
            nasm: "NASM",
            nginx: "nginx",
            nsis: "NSIS",
            objectivec: "Objective-C",
            ocaml: "OCaml",
            opencl: "OpenCL",
            parigp: "PARI/GP",
            objectpascal: "Object Pascal",
            php: "PHP",
            "php-extras": "PHP Extras",
            plsql: "PL/SQL",
            powershell: "PowerShell",
            properties: ".properties",
            protobuf: "Protocol Buffers",
            q: "Q (kdb+ database)",
            jsx: "React JSX",
            tsx: "React TSX",
            renpy: "Ren'py",
            rest: "reST (reStructuredText)",
            sas: "SAS",
            sass: "Sass (Sass)",
            scss: "Sass (Scss)",
            sql: "SQL",
            soy: "Soy (Closure Template)",
            tap: "TAP",
            tt2: "Template Toolkit 2",
            typescript: "TypeScript",
            vbnet: "VB.Net",
            vhdl: "VHDL",
            vim: "vim",
            "visual-basic": "Visual Basic",
            wasm: "WebAssembly",
            wiki: "Wiki markup",
            xeoracube: "XeoraCube",
            xojo: "Xojo (REALbasic)",
            xquery: "XQuery",
            yaml: "YAML"
        };
        Prism.plugins.toolbar.registerButton("show-language", function(a) {
            var t = a.element.parentNode;
            if (t && /pre/i.test(t.nodeName)) {
                var s = t.getAttribute("data-language") || e[a.language] || a.language && a.language.substring(0, 1).toUpperCase() + a.language.substring(1);
                if (s) {
                    var r = document.createElement("span");
                    return r.textContent = s, r
                }
            }
        })
    }
}();
! function() {
    if ("undefined" != typeof self && self.Prism && self.document) {
        if (!Prism.plugins.toolbar) return console.warn("Copy to Clipboard plugin loaded before Toolbar plugin."), void 0;
        var o = window.ClipboardJS || void 0;
        o || "function" != typeof require || (o = require("clipboard"));
        var e = [];
        if (!o) {
            var t = document.createElement("script"),
                n = document.querySelector("head");
            t.onload = function() {
                if (o = window.ClipboardJS)
                    for (; e.length;) e.pop()()
            }, t.src = "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js", n.appendChild(t)
        }
        Prism.plugins.toolbar.registerButton("copy-to-clipboard", function(t) {
            function n() {
                var e = new o(i, {
                    text: function() {
                        return t.code
                    }
                });
                e.on("success", function() {
                    i.textContent = "Copied!", r()
                }), e.on("error", function() {
                    i.textContent = "Press Ctrl+C to copy", r()
                })
            }

            function r() {
                setTimeout(function() {
                    i.textContent = "Copy"
                }, 5e3)
            }
            var i = document.createElement("a");
            return i.textContent = "Copy", o ? n() : e.push(n), i
        })
    }
}();
