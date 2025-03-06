import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  function getUserSettings(): { keyword: string; color: string }[] {
    return vscode.workspace
      .getConfiguration()
      .get('sectionHighlighter.rules', []);
  }

  let decorationTypes: { [key: string]: vscode.TextEditorDecorationType } = {};

  function updateDecorations() {
    if (!vscode.window.activeTextEditor) return;
    const editor = vscode.window.activeTextEditor;
    const doc = editor.document;
    const text = doc.getText();
    const settings = getUserSettings();

    // Clear existing decorations
    Object.values(decorationTypes).forEach((decorationType) => {
      editor.setDecorations(decorationType, []);
    });

    let decorations: { [key: string]: vscode.DecorationOptions[] } = {};

    // Create and reuse decoration types
    settings.forEach(({ keyword, color }) => {
      if (!decorationTypes[keyword]) {
        decorationTypes[keyword] = vscode.window.createTextEditorDecorationType(
          {
            backgroundColor: color,
            isWholeLine: true,
          }
        );
      }
      decorations[keyword] = [];
    });

    const regex = /\/\/\s*------\s*(.*?)\s*------/g;
    let match;
    while ((match = regex.exec(text))) {
      const matchedKeyword = match[1].trim();
      const start = doc.positionAt(match.index);
      let end = start;

      while ((match = regex.exec(text))) {
        end = doc.positionAt(match.index);
        break;
      }

      if (decorations[matchedKeyword]) {
        decorations[matchedKeyword].push({
          range: new vscode.Range(start, end),
        });
      }
    }

    // Apply decorations
    Object.entries(decorationTypes).forEach(([keyword, decorationType]) => {
      editor.setDecorations(decorationType, decorations[keyword] || []);
    });
  }

  vscode.workspace.onDidChangeTextDocument(updateDecorations);
  vscode.window.onDidChangeActiveTextEditor(updateDecorations);
  vscode.workspace.onDidChangeConfiguration(updateDecorations);
  updateDecorations();
}

export function deactivate() {}
