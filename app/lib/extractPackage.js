import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';

export const extractPackage = async (file) => {
    const uz = new Unzip();
    uz.register(AsyncUnzipInflate);
    const files = [];
    uz.onfile = (f) => files.push(f);
    if (!file.stream) {
        // not supported
        return;
    }
    const reader = file.stream().getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            uz.push(new Uint8Array(0), true);
            break;
        }
        for (let i = 0; i < value.length; i += 65536) {
            uz.push(value.subarray(i, i + 65536));
        }
    }

    /* const user = await readFile(files, 'account/user.json');
    console.log(user); */
    return files;
}

const getFile = (files, name) => files.find((file) => file.name === name);

const readFile = (files, name) => {
    return new Promise((resolve) => {
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
};
