export class FileHelper {
    static async fileTypeFromBuffer(buffer: Buffer) {
        const { fileTypeFromBuffer } = await (eval(
            'import("file-type")',
        ) as Promise<typeof import('file-type')>);
        return fileTypeFromBuffer(buffer);
    }

    static async humanRedableSize(size: number) {
        const prettyBytes = await (eval('import("pretty-bytes")') as Promise<
            typeof import('pretty-bytes')
        >);
        return prettyBytes.default(size);
    }
}
