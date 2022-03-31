import { formatFiles, getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import { SecondPluginGeneratorSchema } from './schema';

interface NormalizedSchema extends SecondPluginGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: SecondPluginGeneratorSchema
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
  options: SecondPluginGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);

  console.log('log from second-plugin generator');

  await formatFiles(tree);
}
