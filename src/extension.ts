// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "blocky" is now active!');

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    isWholeLine: true,
    overviewRulerColor: 'rgba(255, 215, 0, 0.2)',
    overviewRulerLane: vscode.OverviewRulerLane.Center,
  });

  function updateDecorations() {
    if (!editor) {
      return;
    }

    const doc = editor.document;
    const text = doc.getText();

    const regex = /\/\/\s*------\s*(.*?)\s*------/g;
    let match;
    let ranges: vscode.DecorationOptions[] = [];

    while ((match = regex.exec(text))) {
      const start = doc.positionAt(match.index);
      let end = start;

      while ((match = regex.exec(text))) {
        end = doc.positionAt(match.index);
        break;
      }

      ranges.push({ range: new vscode.Range(start, end) });
    }

    console.log('matches', ranges);

    editor.setDecorations(decorationType, ranges);
  }

  vscode.workspace.onDidChangeTextDocument(updateDecorations);
  vscode.window.onDidChangeActiveTextEditor(updateDecorations);
  updateDecorations();
}

// This method is called when your extension is deactivated
export function deactivate() {}
