import { Project, ScriptTarget, ModuleKind, ModuleResolutionKind } from "ts-morph";
import fs from "fs";
import path from "path";
import { removeDeprecatedPropertyAccess } from "./update-deprecated";
import prettier from 'prettier';
import { JsxEmit } from "typescript";

const FIXTURE_DIR = path.join(__dirname, "__testfixtures__");

async function runFixtureTest(name: string) {
	
	const inputFileExtension = '.input.tsx';
	if (!name.endsWith(inputFileExtension)) throw Error('Invalid test');
	
	const inputPath = path.join(FIXTURE_DIR, `${name}`);
	const outputPath = path.join(FIXTURE_DIR, `${name.slice(0, name.length - inputFileExtension.length)}.output.tsx`);
	
	const inputCode = fs.readFileSync(inputPath, "utf8").trim();
	const expectedOutput = fs.readFileSync(outputPath, "utf8").trim();
	
	const project = new Project({useInMemoryFileSystem: false, compilerOptions: {
		target: ScriptTarget.ES2020,
		module: ModuleKind.CommonJS,
		moduleResolution: ModuleResolutionKind.NodeNext,
		jsx: JsxEmit.ReactJSX,
		esModuleInterop: true,
		allowSyntheticDefaultImports: true,
		strict: false,
		skipLibCheck: false,
		resolveJsonModule: true,
		lib: ["ES2020", "DOM"],
	},});
	const sourceFile = project.createSourceFile(`${FIXTURE_DIR}/${name}`, inputCode, { overwrite: true });
	
	const { sourceFile: modifiedSourceFile, changed } = removeDeprecatedPropertyAccess(sourceFile);	
	
	if (!changed) console.warn(`Incorrect changed value on test for ${name}`)
	
	const result = modifiedSourceFile.getFullText().trim();
	
	const formattedResult = prettier.format(result, { parser: "typescript" });
	const formattedExpected = prettier.format(expectedOutput, { parser: "typescript" });
	expect(formattedResult).toBe(formattedExpected);
}

describe("All deprecated results are removed", () => {
	it('Updates join & leave', async () => {
		await runFixtureTest('simple-joinroom-leaveroom.input.tsx')
	})
	it('Updates participant map properties', async () => {
		await runFixtureTest('simple-participant-map.input.tsx')
	})
	it('Updates participant object properties', async () => {
		await runFixtureTest('simple-participant-object.input.tsx')
	})
	it('Updates self permissions', async () => {
		await runFixtureTest('simple-self-permissions.input.tsx')
	})
	it('Updates plugin', async () => {
		await runFixtureTest('simple-plugin.input.tsx')
	})
	it ('Tests various import patterns', async () => {
		await runFixtureTest('import-patterns.input.tsx')
	})
	it ('Tests destructuring patterns', async () => {
		await runFixtureTest('destructuring-patterns.input.tsx')
	})
	it ('Tests class components', async () => {
		await runFixtureTest('class-components.input.tsx')
	})
});