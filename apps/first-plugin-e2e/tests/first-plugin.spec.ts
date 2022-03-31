import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('first-plugin e2e', () => {
  it('should create first-plugin', async () => {
    const plugin = uniq('first-plugin');
    ensureNxProject('@workspace-poc/first-plugin', 'dist/libs/first-plugin');
    await runNxCommandAsync(
      `generate @workspace-poc/first-plugin:first-plugin ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('first-plugin');
      ensureNxProject('@workspace-poc/first-plugin', 'dist/libs/first-plugin');
      await runNxCommandAsync(
        `generate @workspace-poc/first-plugin:first-plugin ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('first-plugin');
      ensureNxProject('@workspace-poc/first-plugin', 'dist/libs/first-plugin');
      await runNxCommandAsync(
        `generate @workspace-poc/first-plugin:first-plugin ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
