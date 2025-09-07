export default function loader(source,name) {
    return `export default ${JSON.stringify(source)}`;
}