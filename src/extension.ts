import * as vscode from 'vscode';
import { stringify, parse } from '@ironm00n/nbt-ts'

class SnbtDocumentFormattingEditProvider {
    provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        try {
            // Step1: assume the SNBT file won't be too large
            // Step2: get the whole document into a string
            const documentRange = document.validateRange(new vscode.Range(
                document.lineAt(0).range.start,
                document.lineAt(document.lineCount - 1).range.end
            ))
            let snbt = document.getText(documentRange)
            // Step3: convert SNBT to NBT Tag
            snbt = snbt.replace(/[\t\r\n]/g, "") // workround bugs in nbt-ts lib
            const nbt = parse(snbt)
            // Step4: convert the NBT Tag back to SNBT
            const formattedSnbt = stringify(nbt, {
                pretty: true,
                breakLength: options.tabSize
            })
            return [vscode.TextEdit.replace(documentRange, formattedSnbt)]
        } catch (e: any) {
            vscode.window.showErrorMessage("SNBT formatting error: " + String(e))
        }
        return null
    }
}

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Tnze\'s SNBT vscode extension is activated');

    let sel: vscode.DocumentSelector = { language: 'snbt' };
    vscode.languages.registerDocumentFormattingEditProvider(sel, new SnbtDocumentFormattingEditProvider())
}
