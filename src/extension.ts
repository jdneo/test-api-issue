import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	const testController = vscode.tests.createTestController('test', 'Test');

	vscode.workspace.onDidOpenTextDocument((e) => {
		if (path.basename(e.fileName) !== 'test.txt') {
			return;
		}

		let parent;
		let child;
		const lines = e.getText().split('\n');
		for (let lineNo = 0; lineNo < lines.length; lineNo++) {
			const line = lines[lineNo];
			if (line.startsWith('# Parent')) {
				parent = testController.createTestItem('parent', 'parent', e.uri);
				parent.range = new vscode.Range(new vscode.Position(lineNo, 0), new vscode.Position(lineNo, line.length));
				testController?.items.add(parent);
			} else if (line.startsWith('## Child 1')) {
				child = testController.createTestItem('child', 'child', e.uri);
				child.range = new vscode.Range(new vscode.Position(lineNo, 0), new vscode.Position(lineNo, line.length));
				parent?.children.add(child);
			}
		}
	});

	vscode.workspace.onDidChangeTextDocument((e) => {
		if (path.basename(e.document.fileName) !== 'test.txt') {
			return;
		}

		let parent;
		let child;
		const lines = e.document.getText().split('\n');
		for (let lineNo = 0; lineNo < lines.length; lineNo++) {
			const line = lines[lineNo];
			if (line.startsWith('# Parent')) {
				parent = testController.items.get('parent');
				parent!.range = new vscode.Range(new vscode.Position(lineNo, 0), new vscode.Position(lineNo, line.length));
			} else if (line.startsWith('## Child 1')) {
				child = parent?.children.get('child');
				child!.range = new vscode.Range(new vscode.Position(lineNo, 0), new vscode.Position(lineNo, line.length));
			}
		}
	});
	
	let disposable = vscode.commands.registerCommand('test.helloWorld', () => {
		const edit = new vscode.WorkspaceEdit();
		edit.insert(vscode.window.activeTextEditor!.document.uri, new vscode.Position(0, 0), "foo\n\n");
		vscode.workspace.applyEdit(edit);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
