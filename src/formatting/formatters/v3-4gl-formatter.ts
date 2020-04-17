import { XmlFormatter } from "../xml-formatter";
import { XmlFormattingOptions } from "../xml-formatting-options";
import { ClassicXmlFormatter } from "./classic-xml-formatter";

const MagicalStringOfWonders = "~::~MAAAGIC~::~";

/* tslint:disable no-use-before-declare */
export class V34glFormatter implements XmlFormatter {
    formatXml(xml: string, options: XmlFormattingOptions): string {
        // this replaces all "<" brackets inside of comments to a magical string
        // so the following minification steps don't mess with comment formatting

        console.debug("this is v3 4gl console format");

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

        //cur line indent level handle
        let CurrentIndentMap = new Map();
        CurrentIndentMap.set("END MAIN", -1);
        CurrentIndentMap.set("END FUNCTION", -1);
        // CurrentIndentMap.set("IF", 0);
        CurrentIndentMap.set("ELSE", -1);
        CurrentIndentMap.set("END IF", -1);
        CurrentIndentMap.set("END FOREACH", -1);

        //next line indent level handle
        let NextIndentMap = new Map();
        NextIndentMap.set("MAIN", 1);
        NextIndentMap.set("END MAIN", -1);
        NextIndentMap.set("FUNCTION", 1);
        NextIndentMap.set("END FUNCTION", -1);
        NextIndentMap.set("IF", 1);
        // NextIndentMap.set("ELSE", 0);
        NextIndentMap.set("END IF", -1);
        NextIndentMap.set("FOREACH", 1);
        NextIndentMap.set("END FOREACH", -1);

        //round currentLine's checked indentLevel is for next line
        // var key;
        var re: RegExp;
        // var curIndentLevel: number;
        var cIndentLv: number;
        var nIndentLv: number;
        var currentLine: string;
        for (let i = 0; i < sentence.length; i++) {
            currentLine = sentence[i].content;

            //replace line comment
            re = RegExp("(#|--).*");
            currentLine = currentLine.replace(re, "");

            //replace "" '' content
            re = RegExp("\".*?[^\\\\]\"", "g");
            currentLine = currentLine.replace(re, "");
            re = RegExp("'.*?[^\\\\]'", "g");
            currentLine = currentLine.replace(re, "");

            //check line char
            cIndentLv = sentence[i].indentLevel;
            nIndentLv = cIndentLv;
            re = RegExp("\\W+");
            const lineArr = currentLine.split(re);
            for (let j = 0; j < lineArr.length;) {

                var k: number;
                for (k = 2; k > 0; k--) {
                    //determin key
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
                            //handle currentline indent and next line indent
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

    private _defineIndentLvl(key: String, indentLevel: number): number {
        return 0;
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

// const FKArr

// enum Location {
//     Attribute,
//     AttributeValue,
//     CData,
//     Comment,
//     EndTag,
//     SpecialTag,
//     StartTag,
//     StartTagName,
//     Text
// }
