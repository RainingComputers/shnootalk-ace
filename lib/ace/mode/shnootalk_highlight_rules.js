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

 define(function (require, exports, module) {
    "use strict"

    var oop = require("../lib/oop")
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules

    var ShnooTalkHighlightRules = function () {
        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used

        this.$rules = {
            start: [
                {
                    token: "comment.line.number-sign.shnootalk",
                    regex: /#[^\n\r]*/,
                    comment: "Single line comment",
                },
                {
                    include: "#keywords",
                },
                {
                    token: [
                        "entity.name.function.shnootalk",
                        "text",
                        "punctuation.bracket.parenthesis.shnootalk",
                    ],
                    regex: /\b(make)(\s*)(\()/,
                    push: [
                        {
                            token: "punctuation.comma.shnootalk",
                            regex: /,/,
                            next: "pop",
                        },
                        {
                            token: "punctuation.bracket.parenthesis.shnootalk",
                            regex: /\)/,
                            next: "pop",
                        },
                        {
                            include: "#type",
                        },
                    ],
                    comment: "make builtin",
                },
                {
                    token: [
                        "entity.name.function.shnootalk",
                        "text",
                        "punctuation.bracket.parenthesis.shnootalk",
                    ],
                    regex: /\b(sizeof)(\s*)(\()/,
                    push: [
                        {
                            token: "punctuation.bracket.parenthesis.shnootalk",
                            regex: /\)/,
                            next: "pop",
                        },
                        {
                            include: "#type",
                        },
                    ],
                    comment: "sizeof builtin",
                },
                {
                    token: [
                        "entity.name.function.shnootalk",
                        "text",
                        "punctuation.bracket.parenthesis.shnootalk",
                    ],
                    regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)(\s*)(\()/,
                    comment: "Function declaration or function call",
                },
                {
                    token: [
                        "entity.name.function.shnootalk",
                        "text",
                        "punctuation.bracket.square.shnootalk",
                        "text",
                    ],
                    regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)(\s*)(\[)(\s*)/,
                    push: [
                        {
                            token: "punctuation.bracket.square.shnootalk",
                            regex: /\]/,
                            next: "pop",
                        },
                        {
                            token: "entity.name.type.shnootalk",
                            regex: /\b(byte|ubyte|short|ushort|int|uint|long|ulong|float|double|autoInt|autoFloat|struct|void)\b/,
                        },
                        {
                            include: "#namespace",
                        },
                        {
                            token: "variable.name.shnootalk",
                            regex: /(\b[a-z][a-zA-Z0-9_]*\b)/,
                        },
                        {
                            include: "#type",
                        },
                    ],
                    comment: "Generic function call or subscript expression",
                },
                {
                    token: ["storage.type.shnootalk", "text", "entity.name.type.shnootalk"],
                    regex: /\b(struct|class)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)\b/,
                    push: [
                        {
                            token: "punctuation.bracket.curly.shnootalk",
                            regex: /[\{;]/,
                            next: "pop",
                        },
                    ],
                    comment: "User defined type definition",
                },
                {
                    token: ["storage.type.generic.shnootalk"],
                    regex: /\b(generic)\b/,
                    push: [
                        {
                            token: "entity.name.type.shnootalk",
                            regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b(?!,)/,
                            next: "pop",
                        },
                        {
                            include: "#type",
                        },
                    ],
                    comment: "Generic module declaration",
                },
                {
                    include: "#namespace",
                },
                {
                    token: ["punctuation.type.shnootalk"],
                    regex: /(:)(?!=)/,
                    push: [
                        {
                            include: "#type",
                        },
                    ],
                    comment: "Local type or parameter type or function return type",
                },
                {
                    token: ["storage.type.return.shnootalk"],
                    regex: /(->)/,
                    push: [
                        {
                            include: "#type",
                        },
                    ],
                    comment: "Local type or parameter type or function return type",
                },
                {
                    token: [
                        "entity.name.type.shnootalk",
                        "punctuation.bracket.square.shnootalk",
                        "punctuation.bracket.square.shnootalk",
                        "keyword.operator.cast",
                    ],
                    regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(\[)(\])(\`)/,
                    comment: "Type casting",
                },
                {
                    token: [
                        "entity.name.type.shnootalk",
                        "keyword.operator.cast",
                        "keyword.operator.cast",
                    ],
                    regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(\*)(`)/,
                    comment: "Type casting",
                },
                {
                    token: ["entity.name.type.shnootalk", "keyword.operator.cast"],
                    regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(`)/,
                    comment: "Type casting",
                },
                {
                    include: "#operators",
                },
                {
                    include: "#storage",
                },
                {
                    include: "#literals",
                },
                {
                    include: "#punctuators",
                },
                {
                    token: "variable.name.shnootalk",
                    regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
                    comment: "Symbol or identifier",
                },
            ],
            "#literals": [
                {
                    token: "string.quoted.double.shnootalk",
                    regex: /"|'/,
                    push: [
                        {
                            token: "string.quoted.double.shnootalk",
                            regex: /"|'/,
                            next: "pop",
                        },
                        {
                            token: "constant.character.escape.shnootalk",
                            regex: /\\./,
                        },
                        {
                            defaultToken: "string.quoted.double.shnootalk",
                        },
                    ],
                    comment: "String literal",
                },
                {
                    token: "constant.numeric.integer.hexadecimal.shnootalk",
                    regex: /\b0x[a-fA-f0-9]+\b/,
                    comment: "Hex literal",
                },
                {
                    token: "constant.numeric.shnootalk",
                    regex: /\b0b[0-1]+\b/,
                    comment: "Bin literal",
                },
                {
                    token: "constant.numeric.shnootalk",
                    regex: /\b[0-9]*\.[0-9]+\b/,
                    comment: "Float literal",
                },
                {
                    token: "constant.numeric.shnootalk",
                    regex: /\b[0-9]+\b/,
                    comment: "Integer literal",
                },
                {
                    token: "constant.language.boolean.shnootalk",
                    regex: /\b(?:true|false)\b/,
                    comment: "Boolean literal",
                },
            ],
            "#keywords": [
                {
                    token: "keyword.control.flow.shnootalk",
                    regex: /\b(?:if|elif|else|while|do|for|loop|break|continue|return|void)\b/,
                    comment: "Flow keywords",
                },
                {
                    token: "keyword.control.import.shnootalk",
                    regex: /\b(?:use|as|from)\b/,
                    comment: "Import keywords",
                },
            ],
            "#storage": [
                {
                    token: "storage.type.shnootalk",
                    regex: /\b(?:var|const|mut)\b/,
                    comment: "Local or param or struct field declaration type",
                },
                {
                    token: "storage.type.function.shnootalk",
                    regex: /\b(?:fn|extfn|externC)\b/,
                    comment: "Function declaration keywords",
                },
                {
                    token: "storage.type.class.shnootalk",
                    regex: /\b(?:struct|class)\b/,
                    comment: "Used defined class",
                },
                {
                    token: "storage.type.enum.shnootalk",
                    regex: /\benum\b/,
                    comment: "Used defined enum",
                },
                {
                    token: "storage.type.def.shnootalk",
                    regex: /\bdef\b/,
                    comment: "Used defined def",
                },
                {
                    token: "storage.type.generic.shnootalk",
                    regex: /\bgeneric\b/,
                    comment: "Generic module",
                },
            ],
            "#punctuators": [
                {
                    token: "punctuation.type.shnootalk",
                    regex: /:/,
                },
                {
                    token: "punctuation.period.shnootalk",
                    regex: /\./,
                },
                {
                    token: "punctuation.namespace.shnootalk",
                    regex: /::/,
                },
                {
                    token: "punctuation.bracket.curly.shnootalk",
                    regex: /\{|\}/,
                },
                {
                    token: "punctuation.bracket.parenthesis.shnootalk",
                    regex: /\(|\)/,
                },
                {
                    token: "punctuation.bracket.square.shnootalk",
                    regex: /\[|\]/,
                },
                {
                    token: "storage.type.return.shnootalk",
                    regex: /->/,
                },
                {
                    token: "punctuation.terminator.statement.shnootalk",
                    regex: /;/,
                },
                {
                    token: "punctuation.comma.shnootalk",
                    regex: /,/,
                },
                {
                    token: "storage.modifier.pointer.shnootalk",
                    regex: /\*/,
                    comment: "Pointer star",
                },
            ],
            "#operators": [
                {
                    token: "keyword.operator.assignment.compound.arithmetic.shnootalk",
                    regex: /\+\=|\-\=|\/\=|\*\=|%\=/,
                    comment: "Arithmetic compound assignment operators",
                },
                {
                    token: "keyword.operator.arithmetic.shnootalk",
                    regex: /\+|\-|\/|\*|%/,
                    comment: "Arithmetic operators",
                },
                {
                    token: "keyword.operator.assignment.compound.bitwise.shnootalk",
                    regex: /\|\=|&\=|\^\=|~\=/,
                    comment: "Bitwise compound assignment operators",
                },
                {
                    token: "keyword.operator.bitwise.shnootalk",
                    regex: /\||&|\^|~/,
                    comment: "Bitwise operators",
                },
                {
                    token: "keyword.operator.bitwise.shift.shnootalk",
                    regex: />>|<</,
                    comment: "Bitwise shift operators",
                },
                {
                    token: "keyword.operator.comparison.shnootalk",
                    regex: />\=|<\=|>|<|!\=|\=\=/,
                    comment: "Comparison operators",
                },
                {
                    token: "keyword.operator.logical.shnootalk",
                    regex: /and|or|not|!/,
                    comment: "Logical operators",
                },
                {
                    token: "keyword.operator.assignment",
                    regex: /\=|:\=|<-/,
                    comment: "Assignment operators",
                },
                {
                    token: "keyword.operator.cast",
                    regex: /`/,
                    comment: "Cast operator",
                },
            ],
            "#namespace": [
                {
                    token: [
                        "entity.name.namespace.shnootalk",
                        "text",
                        "punctuation.namespace.shnootalk",
                    ],
                    regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)(\s*)(::)/,
                },
            ],
            "#type": [
                {
                    token: [
                        "punctuation.bracket.square.shnootalk",
                        "text",
                        "punctuation.bracket.parenthesis.shnootalk",
                    ],
                    regex: /(\])(\s*)(\()/,
                    next: "pop",
                },
                {
                    token: ["punctuation.bracket.curly.shnootalk"],
                    regex: /\{/,
                    next: "pop",
                },
                {
                    token: ["punctuation.bracket.square.shnootalk"],
                    regex: /((?:\])(?=[^\],]))/,
                    next: "pop",
                },
                {
                    token: ["storage.modifier.pointer.shnootalk"],
                    regex: /((?:\*)(?=[^\],]))/,
                    next: "pop",
                },
                {
                    token: ["variable.name.shnootalk"],
                    regex: /(\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*:[^:])|\))/,
                    next: "pop",
                },
                {
                    include: "#namespace",
                },
                {
                    include: "#literals",
                },
                {
                    include: "#keywords",
                },
                {
                    include: "#storage",
                },
                {
                    include: "#punctuators",
                },
                {
                    token: ["entity.name.type.shnootalk"],
                    regex: /(\b[a-zA-Z_][a-zA-Z0-9_]*\b(?=[^:,\*\[\]]))/,
                    next: "pop",
                },
                {
                    token: "entity.name.type.shnootalk",
                    regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
                },
            ],
        }

        this.normalizeRules()
    }

    ShnooTalkHighlightRules.metaData = {
        $schema: "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
        name: "ShnooTalk",
        scopeName: "source.shnootalk",
    }

    oop.inherits(ShnooTalkHighlightRules, TextHighlightRules)

    exports.ShnooTalkHighlightRules = ShnooTalkHighlightRules
})
