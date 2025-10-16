import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';
import { requiredFiles } from './constants';

export const extractPackage = async (file) => {
  const uz = new Unzip();
  uz.register(AsyncUnzipInflate);
  let files = [];
  uz.onfile = (f) => {
    // uncapitalize folder names in new package versions
    if (f.name.includes(`/`)) {
      f.name = f.name.charAt(0).toLowerCase() + f.name.slice(1);
    }
    files.push(f);
  };
  if (!file.stream) {
    // not supported
    return false;
  }
  const reader = file.stream().getReader();
  // eslint-disable-next-line no-constant-condition -- we need to read the entire stream
  while (true) {
    // eslint-disable-next-line no-await-in-loop -- we need to await the read for the next iteration
    const { done, value } = await reader.read();
    if (done) {
      uz.push(new Uint8Array(0), true);
      break;
    }
    for (let i = 0; i < value.length; i += 65536) {
      uz.push(value.subarray(i, i + 65536));
    }
  }

  // rename top-level folders (in case of translated names)
  files = renameFolders(files);

  // check for required files
  let requiredFilesMissing = [];
  requiredFiles.forEach((requiredFile) => {
    if (!files.some((f) => f.name.match(requiredFile.value))) {
      requiredFilesMissing.push(requiredFile.name);
    }
  });

  if (requiredFilesMissing.length > 0) {
    throw new Error(`Package is missing required file(s): ${requiredFilesMissing.join(`, `)}`);
  }

  return files;
};

const getFile = (files, name) => files.find((file) => file.name === name);

// eslint-disable-next-line consistent-return -- this will always return
export const readFile = (files, name) => new Promise((resolve) => {
  const file = getFile(files, name);
  if (!file) return resolve(null);
  const fileContent = [];
  const decoder = new DecodeUTF8();
  file.ondata = (err, data, final) => {
    decoder.push(data, final);
  };
  decoder.ondata = (str, final) => {
    fileContent.push(str);
    if (final) resolve(fileContent.join(''));
  };
  file.start();
});

export const renameFolders = (files) => {
  // check for English names - return if activity/ is found
  // if that folder is generally missing, the package will be rejected later anyway
  if (files.some((f) => f.name.startsWith(`activity/`))) {
    return files;
  }

  // determine current folder names
  const activityFolder = files.find((f) => f.name.includes(`/tns/`))?.name?.split(`/`)?.[0];
  const accountFolder = files.find((f) => f.name.endsWith(`user.json`))?.name?.split(`/`)?.[0];
  const messagesFolder = files.find((f) => f.name.endsWith(`messages.json`))?.name?.split(`/`)?.[0];
  const serversFolder = files.find((f) => f.name.endsWith(`guild.json`))?.name?.split(`/`)?.[0];

  // replace current folder names with expected English translations
  for (const file of files) {
    if (activityFolder) file.name = file.name.replace(activityFolder, `activity`);
    if (accountFolder) file.name = file.name.replace(accountFolder, `account`);
    if (messagesFolder) file.name = file.name.replace(messagesFolder, `messages`);
    if (serversFolder) file.name = file.name.replace(serversFolder, `servers`);
  }

  return files;
}
