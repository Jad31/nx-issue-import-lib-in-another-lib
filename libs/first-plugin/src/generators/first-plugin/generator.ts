import { formatFiles, getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import { FirstPluginGeneratorSchema } from './schema';
import { secondPluginGenerator } from '@workspace-poc/second-plugin';

interface NormalizedSchema extends FirstPluginGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: FirstPluginGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

export default async function (
  tree: Tree,
  options: FirstPluginGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);

  console.log('log from first-plugin generator');

  secondPluginGenerator.default(tree, normalizedOptions);

  await formatFiles(tree);
}
