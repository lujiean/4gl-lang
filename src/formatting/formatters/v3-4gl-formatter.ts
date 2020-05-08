import { XmlFormatter } from "../xml-formatter";
import { XmlFormattingOptions } from "../xml-formatting-options";
import { ClassicXmlFormatter } from "./classic-xml-formatter";

const MagicalStringOfWonders = "~::~MAAAGIC~::~";

import data from "./config/v3-keys.json";

/* tslint:disable no-use-before-declare */
export class V34glFormatter implements XmlFormatter {
    formatXml(xml: string, options: XmlFormattingOptions): string {
        // this replaces all "<" brackets inside of comments to a magical string
        // so the following minification steps don't mess with comment formatting

        // console.debug("this is v3 4gl console format");

        // save document to arrray
        const sentence: {
            indentLevel: number,
            content: string,
            sanitizeLine: string
        }[] = [];

        const xarr: string[] = xml.split("\n");
        for (const i in xarr) {
            if (xarr.hasOwnProperty(i)) {
                const element: string = xarr[i];
                sentence.push({ indentLevel: 0, content: element.trim(), sanitizeLine: this._sanitizeLine(element).trim() });
            }
        }

        // line indent handle
        let keyJO = <any>data;

        // round currentLine's checked indentLevel is for next line
        for (let i = 0; i < sentence.length; i++) {
            // check line char
            // let currentLine = this._sanitizeLine(sentence[i].content);
            let currentLine = this._sanitizeLine(sentence[i].sanitizeLine);
            let cIndentLv = sentence[i].indentLevel;
            let nIndentLv = cIndentLv;

            let re = RegExp("\\W+");
            const lineArr = currentLine.split(re);
            for (let j = 0; j < lineArr.length;) {
                
                // key check length
                let k: number = 4;
                if (j + k >= lineArr.length) {
                    k = lineArr.length - j;
                }
                // for (k = 2; k > 0; k--) {
                for (; k > 0; k--) {
                    // determin key
                    let key:string = undefined;
                    let bKeySet = false;
                    for (let index = 0; index < k; index++) {
                        if (index == 0) {
                            key = lineArr[j + index].toUpperCase();
                        } else {
                            key = key + ' ' + lineArr[j + index].toUpperCase();
                        }
                    }

                    if (key != undefined) {

                        if (j == 0) {
                            // handle currentline indent and next line indent
                            let keyCheck = this._hasKey(keyJO.CurrentIndentMap, key);
                            if (keyCheck.hasKey) {
                                cIndentLv = cIndentLv + keyCheck.indent;
                                bKeySet = true;
                            }
                        }

                        let keyCheck = this._hasKey(keyJO.NextIndentMap, key);
                        if (keyCheck.hasKey) {
                            nIndentLv = nIndentLv + keyCheck.indent;
                            bKeySet = true;
                        }

                        if (bKeySet) {
                            break;
                        }
                    }
                }

                if (k <= 0) {
                    j++;
                } else {
                    j = j + k;
                }
            }

            //curline Indent
            sentence[i].indentLevel = cIndentLv;
            //next line indent
            if (i + 1 < sentence.length) {
                sentence[i + 1].indentLevel = nIndentLv
            }
        }
        // console.log(sentence);

        // combine output
        let output: string = undefined;
        for (let index = 0; index < sentence.length; index++) {
            const element = sentence[index];
            if (output == undefined) {
                output = this._getIndent(options, element.indentLevel) + element.content;
            } else {
                output = output + options.newLine + this._getIndent(options, element.indentLevel) + element.content;
            }
        }

        return output;
    }

    // minifyXml(xml: string, options: XmlFormattingOptions): string {
    //     return new ClassicXmlFormatter().minifyXml(xml, options);
    // }

    private _getIndent(options: XmlFormattingOptions, indentLevel: number): string {
        return ((options.editorOptions.insertSpaces) ? " ".repeat(options.editorOptions.tabSize) : "\t").repeat(indentLevel);
    }

    private _sanitizeLine(str: string): string {
        let outStr: string = str;

        let re: RegExp;
        // replace line comment
        re = RegExp("(#|--).*");
        outStr = outStr.replace(re, "");

        // replace "" '' content
        re = RegExp("\".*?[^\\\\]\"", "g");
        outStr = outStr.replace(re, "");
        re = RegExp("'.*?[^\\\\]'", "g");
        outStr = outStr.replace(re, "");
        return outStr;
    }

    private _hasKey(inArry: { key: string, value: number, reflag: boolean }[], inKeyStr: string): { hasKey: boolean, key: string, indent: number } {
        let outHasKey: boolean = false;
        let outKey: string = "";
        let outIndent: number = 0;

        for (let i = 0; i < inArry.length; i++) {
            if (inArry[i].reflag) {
                let re: RegExp = new RegExp(inArry[i].key);
                if (re.test(inKeyStr)) {
                    outHasKey = true;
                    outIndent = inArry[i].value;
                    outKey = inArry[i].key;
                    break;
                }
            } else {
                if (inKeyStr == inArry[i].key) {
                    outHasKey = true;
                    outIndent = inArry[i].value;
                    outKey = inArry[i].key;
                    break;
                }
            }

        }

        return { "hasKey": outHasKey, "key": outKey, "indent": outIndent };
    }

    // private _removeTrailingNonBreakingWhitespace(text: string): string {
    //     return text.replace(/[^\r\n\S]+$/, "");
    // }

    // private _sanitizeComments(xml: string): string {
    //     let output = "";
    //     let inComment = false;

    //     for (let i = 0; i < xml.length; i++) {
    //         const cc = xml[i];
    //         const nc = xml.charAt(i + 1);
    //         const nnc = xml.charAt(i + 2);
    //         const pc = xml.charAt(i - 1);

    //         if (!inComment && cc === "<" && nc === "!" && nnc === "-") {
    //             inComment = true;
    //             output += "<!--";

    //             i += 3;
    //         }

    //         else if (inComment && cc === "<") {
    //             output += MagicalStringOfWonders;
    //         }

    //         else if (inComment && cc === "-" && nc === "-" && nnc === ">") {
    //             inComment = false;
    //             output += "-->";

    //             i += 2;
    //         }

    //         else {
    //             output += cc;
    //         }
    //     }

    //     return output;
    // }

    // private _unsanitizeComments(xml: string): string {
    //     return xml.replace(new RegExp(MagicalStringOfWonders, "g"), "<");
    // }
}