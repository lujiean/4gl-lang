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
            content: string
        }[] = [];

        const xarr: string[] = xml.split("\n");
        for (const i in xarr) {
            if (xarr.hasOwnProperty(i)) {
                const element: string = xarr[i];
                sentence.push({ indentLevel: 0, content: element.trim() });
            }
        }

        // line indent handle
        let keyJO = <any>data;
        // console.debug(keyJO);

        // cur line indent level handle
        let CurrentIndentMap = new Map<String, number>();
        for (let i = 0; i < keyJO.CurrentIndentMap.length; i++) {
            CurrentIndentMap.set(keyJO.CurrentIndentMap[i].key, keyJO.CurrentIndentMap[i].value)
        }

        // next line indent level handle
        let NextIndentMap = new Map<String, number>();
        for (let i = 0; i < keyJO.NextIndentMap.length; i++) {
            NextIndentMap.set(keyJO.NextIndentMap[i].key, keyJO.NextIndentMap[i].value)
        }

        // round currentLine's checked indentLevel is for next line
        for (let i = 0; i < sentence.length; i++) {
            // check line char
            let currentLine = this._sanitizeLine(sentence[i].content);
            let cIndentLv = sentence[i].indentLevel;
            let nIndentLv = cIndentLv;

            let re = RegExp("\\W+");
            const lineArr = currentLine.split(re);
            for (let j = 0; j < lineArr.length;) {

                let k: number;
                for (k = 2; k > 0; k--) {
                    // determin key
                    let key = undefined;
                    let bKeySet = false;
                    switch (k) {
                        // check if double key
                        case 2:
                            if (j + 1 < lineArr.length) {
                                key = lineArr[j].toUpperCase() + " " + lineArr[j + 1].toUpperCase();
                            }
                            break;
                        // check if single key
                        case 1:
                            key = lineArr[j].toUpperCase();
                            break;
                        default:
                            break;
                    }

                    if (key != undefined) {

                        if (j == 0) {
                            // handle currentline indent and next line indent
                            if (CurrentIndentMap.has(key)) {
                                cIndentLv = cIndentLv + CurrentIndentMap.get(key);
                                // j = j + k;
                                // break;
                                bKeySet = true;
                            }
                        }

                        if (NextIndentMap.has(key)) {
                            nIndentLv = nIndentLv + NextIndentMap.get(key);
                            // j = j + k;
                            // break;
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
        // console.debug(sentence);

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