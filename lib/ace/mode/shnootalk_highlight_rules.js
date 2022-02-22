/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/****************************************************************************************
 * IT MIGHT NOT BE PERFECT ...But it's a good start from an existing *.tmlanguage file. *
 * fileTypes                                                                            *
 ****************************************************************************************/

 define(function(require, exports, module) {
    "use strict";
    
    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    
    var ShnooTalkHighlightRules = function() {
        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used
    
        this.$rules = {
            start: [{
                token: "comment.line.number-sign.shnootalk",
                regex: /#[^\n\r]*/,
                comment: "Single line comment"
            }, {
                token: "keyword.control.shnootalk",
                regex: /\b(?:use|as|from|begin|end|if|elif|else|while|do|for|loop|break|continue|return|void)\b/,
                comment: "Keywords"
            }, {
                token: "keyword.operator.shnootalk",
                regex: /\b(?:and|or|not)\b/,
                comment: "Conditional operators"
            }, {
                token: "string.quoted.double.shnootalk",
                regex: /"/,
                push: [{
                    token: "string.quoted.double.shnootalk",
                    regex: /"/,
                    next: "pop"
                }, {
                    token: "constant.character.escape.shnootalk",
                    regex: /\\./
                }, {
                    defaultToken: "string.quoted.double.shnootalk"
                }],
                comment: "String literal"
            }, {
                token: "constant.numeric.integer.hexadecimal.shnootalk",
                regex: /\b0x[a-fA-f0-9]+\b/,
                comment: "Hex literal"
            }, {
                token: "constant.numeric.shnootalk",
                regex: /\b0b[0-1]+\b/,
                comment: "Bin literal"
            }, {
                token: "constant.numeric.shnootalk",
                regex: /\b[0-9]*\.[0-9]+\b/,
                comment: "Float literal"
            }, {
                token: "string.quoted.single.shnootalk",
                regex: /'\\?.'/,
                comment: "Character literal"
            }, {
                token: "constant.numeric.shnootalk",
                regex: /\b[0-9]+\b/,
                comment: "Integer literal"
            }, {
                token: "constant.language.boolean.shnootalk",
                regex: /\b(?:true|false)\b/,
                comment: "Boolean literal"
            }, {
                token: "storage.type.shnootalk",
                regex: /\b(?:var|const|mut)\b/,
                comment: "Declaration type"
            }, {
                token: "storage.type.shnootalk",
                regex: /\b(?:fn|extfn)\b/,
                comment: "'fn' keyword"
            }, {
                token: ["entity.name.function.shnootalk", "text"],
                regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\b(\()/,
                comment: "Function name"
            }, {
                token: [
                    "storage.type.shnootalk",
                    "text",
                    "entity.name.type.shnootalk"
                ],
                regex: /\b(struct|class)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)\b/,
                push: [{
                    token: "text",
                    regex: /[\{\(;]/,
                    next: "pop"
                }],
                comment: "User defined type definition"
            }, {
                token: "keyword.control.shnootalk",
                regex: /generic/,
                comment: "Generic decleration",
                next: "genericdecl",
            }, {
                token: "storage.type.shnootalk",
                regex: /\b(?:enum|def)\b/,
                comment: "Used defined enum and def"
            }, {
                token: [
                    "entity.name.scope-resolution.shnootalk",
                    "text"
                ],
                regex: /([a-zA-Z_][a-zA-Z0-9_]*)(::)/,
                comment: "Module scope"
            }, {
                token: "text",
                regex: /(?:->|\:)/,
                next: "type",
                comment: "Type"
            }, {
                token: ["entity.name.type.shnootalk", "text", "text"],
                regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)(\s*)(\[\]`|\*`|`)/,
                comment: "Cast type"
            }, {
                token: "variable.name.shnootalk",
                regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
                comment: "Symbol or identifier"
            }],
            type: [{
                token: [
                    "entity.name.scope-resolution.shnootalk",
                    "text"
                ],
                regex: /([a-zA-Z_][a-zA-Z0-9_]*)(::)/,
                comment: "Module scope"
            },{
                token: ["entity.name.type.shnootalk", "text"],
                regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(\][^\],])/,
                comment: "Symbol or identifier",
                next: "start"
            },{
                token: ["entity.name.type.shnootalk", "text"],
                regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*([\[,\]])/,
                comment: "Symbol or identifier",
            },{
                token: "entity.name.type.shnootalk",
                regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
                comment: "Symbol or identifier",
                next: "start"
            }],
            genericdecl: [{
                token: ["text", "entity.name.type.shnootalk", "text"],
                regex: /(\b)([a-zA-Z_][a-zA-Z0-9_]*)(\s*,)/,
                comment: "Generic identifier with comma"
            },{
                token: "entity.name.type.shnootalk",
                regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
                comment: "Generic identifier",
                next: "start"
            }]
        }
        
        this.normalizeRules();
    };
    
    ShnooTalkHighlightRules.metaData = {
        "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
        name: "ShnooTalk",
        scopeName: "source.shnootalk"
    }
    
    
    oop.inherits(ShnooTalkHighlightRules, TextHighlightRules);
    
    exports.ShnooTalkHighlightRules = ShnooTalkHighlightRules;
    });